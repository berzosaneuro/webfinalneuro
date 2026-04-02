import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createUserSessionToken, getUserSessionFromHeaders, USER_COOKIE_NAME } from '@/lib/server-auth'
import { getSupabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(1).max(120).optional(),
  password: z.string().min(1).optional(),
})

function masterEnvConfigured(): boolean {
  return !!process.env.MASTER_EMAIL && !!process.env.MASTER_PASSWORD
}

export async function GET(request: Request) {
  const session = await getUserSessionFromHeaders(request.headers)
  if (!session) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user: { email: session.email, nombre: session.nombre, role: session.role } })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    console.warn('[auth/session] cuerpo JSON inválido')
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Datos de sesión inválidos' }, { status: 400 })

  if (!masterEnvConfigured()) {
    console.error('[auth/session] MASTER ENV NOT CONFIGURED')
  }

  const inputEmail = parsed.data.email
  const emailNorm = inputEmail.trim().toLowerCase()
  const passwordNorm = (parsed.data.password ?? '').trim()
  const masterEmail = process.env.MASTER_EMAIL?.trim().toLowerCase() ?? ''
  const masterPassword = process.env.MASTER_PASSWORD?.trim() ?? ''

  const isMaster = emailNorm === masterEmail && passwordNorm === masterPassword

  const email = emailNorm
  const nombre = (parsed.data.nombre || email.split('@')[0] || 'Usuario').trim()
  const role = isMaster ? 'master' : 'user'

  // Master: sesión elevada vía entorno; no exigir fila en `users` (puede no existir aún).
  if (role !== 'master') {
    const supabase = getSupabase()
    if (supabase) {
      const { data, error: lookupErr } = await supabase
        .from('users')
        .select('id')
        .eq('email', email)
        .maybeSingle()
      if (lookupErr) {
        console.error('[auth/session] error buscando usuario por email', lookupErr.message)
        return NextResponse.json({ error: 'Error al verificar usuario' }, { status: 500 })
      }
      if (!data?.id) {
        console.warn('[auth/session] usuario no encontrado')
        return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
      }
    }
  }

  let token: string
  try {
    token = await createUserSessionToken(email, nombre, role)
  } catch (e) {
    console.error('[auth/session] error creando token', e instanceof Error ? e.message : e)
    return NextResponse.json({ error: 'Sesión no disponible' }, { status: 503 })
  }
  const res = NextResponse.json({ ok: true, user: { email, nombre, role } })
  res.cookies.set(USER_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24 * 14,
  })
  return res
}

export async function DELETE() {
  const res = NextResponse.json({ ok: true })
  res.cookies.set(USER_COOKIE_NAME, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })
  return res
}
