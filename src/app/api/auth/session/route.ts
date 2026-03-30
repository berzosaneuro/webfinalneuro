import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createUserSessionToken, getUserSessionFromHeaders, USER_COOKIE_NAME } from '@/lib/server-auth'
import { getSupabase } from '@/lib/supabase'

const loginSchema = z.object({
  email: z.string().email(),
  nombre: z.string().min(1).max(120).optional(),
})

export async function GET(request: Request) {
  const session = await getUserSessionFromHeaders(request.headers)
  if (!session) return NextResponse.json({ user: null }, { status: 401 })
  return NextResponse.json({ user: { email: session.email, nombre: session.nombre } })
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: 'Datos de sesión inválidos' }, { status: 400 })

  const email = parsed.data.email.trim().toLowerCase()
  const nombre = (parsed.data.nombre || email.split('@')[0] || 'Usuario').trim()

  const supabase = getSupabase()
  if (supabase) {
    const { data } = await supabase
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle()
    if (!data?.id) {
      return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 401 })
    }
  }

  const token = await createUserSessionToken(email, nombre)
  const res = NextResponse.json({ ok: true, user: { email, nombre } })
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
