import { NextResponse } from 'next/server'
import { z } from 'zod'
import { ADMIN_COOKIE_NAME, createAdminSessionToken, isAdminSession } from '@/lib/server-auth'

const loginSchema = z.object({
  password: z.string().min(1),
})

function expectedPassword(): string {
  return process.env.ADMIN_PASSWORD || ''
}

export async function GET(request: Request) {
  return NextResponse.json({ isAdmin: await isAdminSession(request.headers) })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Datos inválidos' }, { status: 400 })

  const expected = expectedPassword()
  if (!expected) return NextResponse.json({ error: 'ADMIN_PASSWORD no configurado' }, { status: 503 })
  if (parsed.data.password !== expected) return NextResponse.json({ error: 'Credenciales inválidas' }, { status: 401 })

  const token = await createAdminSessionToken()
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 12,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(ADMIN_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return res
}
