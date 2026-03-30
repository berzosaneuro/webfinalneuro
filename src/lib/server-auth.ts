import { z } from 'zod'

export const USER_COOKIE_NAME = 'bn_user_session'
export const ADMIN_COOKIE_NAME = 'bn_admin_session'

const userPayloadSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(1).max(120),
  exp: z.number().int().positive(),
})

const adminPayloadSchema = z.object({
  role: z.literal('admin'),
  exp: z.number().int().positive(),
})

type UserPayload = z.infer<typeof userPayloadSchema>
type AdminPayload = z.infer<typeof adminPayloadSchema>

function getSecret(): string {
  return (
    process.env.APP_SESSION_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.STRIPE_WEBHOOK_SECRET ||
    ''
  )
}

function toBase64Url(input: string): string {
  return Buffer.from(input, 'utf8')
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

function fromBase64Url(input: string): string {
  const normalized = input.replace(/-/g, '+').replace(/_/g, '/')
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4)
  return Buffer.from(padded, 'base64').toString('utf8')
}

async function signPart(part: string, secret: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(part))
  return Buffer.from(new Uint8Array(sig))
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/g, '')
}

async function encodeToken(payload: Record<string, unknown>, secret: string): Promise<string> {
  const part = toBase64Url(JSON.stringify(payload))
  const sig = await signPart(part, secret)
  return `${part}.${sig}`
}

async function decodeToken(token: string, secret: string): Promise<Record<string, unknown> | null> {
  const [part, sig] = token.split('.')
  if (!part || !sig) return null
  const expected = await signPart(part, secret)
  if (expected !== sig) return null
  try {
    return JSON.parse(fromBase64Url(part)) as Record<string, unknown>
  } catch {
    return null
  }
}

function parseCookie(headers: Headers, cookieName: string): string {
  const raw = headers.get('cookie') || ''
  const segments = raw.split(';').map((s) => s.trim())
  const match = segments.find((s) => s.startsWith(`${cookieName}=`))
  return match ? decodeURIComponent(match.slice(cookieName.length + 1)) : ''
}

export async function createUserSessionToken(email: string, nombre: string): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('Falta APP_SESSION_SECRET/NEXTAUTH_SECRET')
  const payload: UserPayload = {
    email: email.trim().toLowerCase(),
    nombre: nombre.trim() || email.trim().toLowerCase().split('@')[0] || 'Usuario',
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 14,
  }
  return encodeToken(payload, secret)
}

export async function getUserSessionFromHeaders(headers: Headers): Promise<UserPayload | null> {
  const secret = getSecret()
  if (!secret) return null
  const token = parseCookie(headers, USER_COOKIE_NAME)
  if (!token) return null
  const raw = await decodeToken(token, secret)
  const parsed = userPayloadSchema.safeParse(raw)
  if (!parsed.success) return null
  if (parsed.data.exp <= Math.floor(Date.now() / 1000)) return null
  return parsed.data
}

export async function createAdminSessionToken(): Promise<string> {
  const secret = getSecret()
  if (!secret) throw new Error('Falta APP_SESSION_SECRET/NEXTAUTH_SECRET')
  const payload: AdminPayload = {
    role: 'admin',
    exp: Math.floor(Date.now() / 1000) + 60 * 60 * 12,
  }
  return encodeToken(payload, secret)
}

export async function isAdminSession(headers: Headers): Promise<boolean> {
  const secret = getSecret()
  if (!secret) return false
  const token = parseCookie(headers, ADMIN_COOKIE_NAME)
  if (!token) return false
  const raw = await decodeToken(token, secret)
  const parsed = adminPayloadSchema.safeParse(raw)
  if (!parsed.success) return false
  return parsed.data.exp > Math.floor(Date.now() / 1000)
}
