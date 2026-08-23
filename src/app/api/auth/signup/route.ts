import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabase-server'
import { createAuthApiSupabase } from '@/lib/supabase/auth-route-client'
import { PRIVILEGED_MASTER_EMAIL } from '@/lib/auth-constants'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { logAuthError, logSignupResult, supabaseErrorFields } from '@/lib/auth-logging'
import { authResponseIfSupabaseNotConfigured } from '@/lib/supabase/auth-public-env-guard'
export { dynamic } from '@/lib/api-route-dynamic'

const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nombre: z.string().min(1).max(120),
})

export async function POST(request: Request) {
  const blocked = authResponseIfSupabaseNotConfigured()
  if (blocked) return blocked
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido', code: 'INVALID_BODY' }, { status: 400 })
  }

  const parsed = signupSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Nombre, email y contraseña (mín. 6 caracteres) requeridos',
        code: 'VALIDATION_ERROR',
      },
      { status: 400 },
    )
  }

  const email = parsed.data.email.trim().toLowerCase()
  const nombre = parsed.data.nombre.trim()
  const password = parsed.data.password

  const appBase = getCanonicalAppBaseUrl()
  const authApi = createAuthApiSupabase()
  const { data, error } = await authApi.auth.signUp({
    email,
    password,
    options: {
      data: { nombre },
      ...(appBase ? { emailRedirectTo: `${appBase}/auth/callback` } : {}),
    },
  })
  logSignupResult(email, data, error)
  console.log('SIGNUP RESPONSE:', { data, error })

  if (error) {
    logAuthError('signup signUp', error)
    const sfe = supabaseErrorFields(error)
    const errMsg = error.message
    const errCode = (error as { code?: string }).code ?? null

    if (errMsg.includes('already registered') || errMsg.includes('already exists')) {
      return NextResponse.json(
        { ok: false, error: errMsg, code: 'EMAIL_ALREADY_REGISTERED', ...sfe },
        { status: 409 },
      )
    }
    const isNetwork =
      /failed to fetch|network|fetch failed|load failed/i.test(errMsg) ||
      (error as { name?: string }).name === 'AuthRetryableFetchError'
    if (isNetwork) {
      return NextResponse.json(
        { ok: false, error: errMsg, code: 'SUPABASE_UNREACHABLE', ...sfe },
        { status: 503 },
      )
    }
    // Fallo de BD al crear el usuario (p. ej. trigger `handle_new_user` con
    // conflicto no resuelto, o cualquier error de Postgres al insertar en
    // auth.users). No es un dato inválido del usuario: no mostrar el mensaje
    // crudo de Postgres/GoTrue en el 400 genérico; devolver un código propio
    // para que el frontend distinga "reintenta" de "revisa tus datos", y dejar
    // el detalle real solo en logs de servidor (ya cubierto por logAuthError).
    const isDbError =
      /database error|unexpected_failure|internal error/i.test(errMsg) ||
      (error as { status?: number }).status === 500
    if (isDbError) {
      return NextResponse.json(
        {
          ok: false,
          error: 'No se pudo crear la cuenta por un problema temporal del servidor. Inténtalo de nuevo en unos minutos.',
          code: 'SIGNUP_DB_ERROR',
          ...sfe,
        },
        { status: 500 },
      )
    }
    return NextResponse.json(
      { ok: false, error: errMsg, code: errCode ?? 'SIGNUP_FAILED', ...sfe },
      { status: 400 },
    )
  }

  if (!data.user) {
    return NextResponse.json(
      { ok: false, error: 'Error creando usuario (sin fila en Auth)', code: 'SIGNUP_NO_USER' },
      { status: 500 },
    )
  }

  if (data.session) {
    try {
      const s = await createServerSupabase()
      await s.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
    } catch (e) {
      logAuthError('signup setSession / cookies', e)
    }
  }

  const needsConfirmation = !data.session
  const role = email === PRIVILEGED_MASTER_EMAIL ? ('master' as const) : ('user' as const)

  return NextResponse.json({
    ok: true,
    needsConfirmation,
    user: { email, nombre, role },
  })
}
