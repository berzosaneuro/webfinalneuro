import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabase-server'
import { createAuthApiSupabase } from '@/lib/supabase/auth-route-client'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { emailExistsInAuthUsers } from '@/lib/auth-user-lookup'
import { logAuthError, logLoginResult, supabaseErrorFields } from '@/lib/auth-logging'
import { authResponseIfSupabaseNotConfigured } from '@/lib/supabase/auth-public-env-guard'
import { getAuthUser, getAuthUserFromUser } from '@/lib/server-auth'
export { dynamic } from '@/lib/api-route-dynamic'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
})

/**
 * GET — Identidad: `getAuthUser()` = supabase.auth.getUser() (JWT en cookies) →
 * rol en `public.users` con service role (select `role` por email; sin fugas de claves en respuesta).
 */
const sessionCacheHeaders = {
  'Cache-Control': 'private, no-store, no-cache, must-revalidate',
}

export async function GET() {
  const blocked = authResponseIfSupabaseNotConfigured()
  if (blocked) return blocked
  const user = await getAuthUser()
  console.log('[auth/session GET]', { ok: Boolean(user), hasEmail: Boolean(user?.email) })
  if (!user) {
    return NextResponse.json(
      {
        ok: false,
        user: null,
        error: 'No hay sesión activa',
        code: 'NO_SESSION',
      },
      { status: 401, headers: sessionCacheHeaders },
    )
  }
  return NextResponse.json(
    {
      ok: true,
      user: { email: user.email, nombre: user.nombre, role: user.role },
    },
    { headers: sessionCacheHeaders },
  )
}

export async function POST(request: Request) {
  const blocked = authResponseIfSupabaseNotConfigured()
  if (blocked) return blocked
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false, error: 'Cuerpo inválido', code: 'INVALID_BODY' }, { status: 400 })
  }

  const parsed = loginSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: 'Email y contraseña requeridos (mín. 6 caracteres)', code: 'VALIDATION_ERROR' },
      { status: 400 },
    )
  }

  const email = parsed.data.email.trim().toLowerCase()
  const password = parsed.data.password

  const authApi = createAuthApiSupabase()
  const { data, error } = await authApi.auth.signInWithPassword({ email, password })
  logLoginResult(email, data, error)
  console.log('LOGIN RESPONSE:', { data, error })

  if (error) {
    logAuthError('session POST signInWithPassword', error)
    const sfe = supabaseErrorFields(error)
    const errMsg = error.message
    const errCode = (error as { code?: string }).code ?? null
    const errLower = errMsg.toLowerCase()
    const unconfirmed =
      errCode === 'email_not_confirmed' ||
      errLower.includes('email not confirmed') ||
      errLower.includes('confirm your email')
    if (unconfirmed) {
      return NextResponse.json(
        {
          ok: false,
          error: errMsg,
          code: 'EMAIL_NOT_CONFIRMED',
          ...sfe,
        },
        { status: 401 },
      )
    }

    if (errMsg.includes('Invalid login credentials')) {
      const serviceRole = getSupabaseServiceRole()
      if (serviceRole) {
        const { data: publicUser } = await serviceRole
          .from('users')
          .select('id')
          .ilike('email', email)
          .maybeSingle()
        if (publicUser?.id) {
          return NextResponse.json(
            {
              ok: false,
              error: errMsg,
              code: 'PASSWORD_RESET_REQUIRED',
              ...sfe,
            },
            { status: 401 },
          )
        }
        const inAuth = await emailExistsInAuthUsers(serviceRole, email)
        if (inAuth === false) {
          return NextResponse.json(
            { ok: false, error: errMsg, code: 'USER_NOT_FOUND', ...sfe },
            { status: 401 },
          )
        }
        if (inAuth === true) {
          return NextResponse.json(
            { ok: false, error: errMsg, code: 'INVALID_PASSWORD', ...sfe },
            { status: 401 },
          )
        }
      }
      return NextResponse.json(
        { ok: false, error: errMsg, code: errCode, ...sfe },
        { status: 401 },
      )
    }
    const isNetwork =
      /failed to fetch|network|fetch failed|load failed/i.test(errMsg) ||
      (error as { name?: string }).name === 'AuthRetryableFetchError'
    if (isNetwork) {
      logAuthError('session POST signInWithPassword network', error)
      return NextResponse.json(
        {
          ok: false,
          error: errMsg,
          code: 'SUPABASE_UNREACHABLE',
          ...sfe,
        },
        { status: 503 },
      )
    }
    return NextResponse.json(
      { ok: false, error: errMsg, code: errCode, ...sfe },
      { status: 401 },
    )
  }

  if (!data.user?.email) {
    return NextResponse.json(
      {
        ok: false,
        error: 'Respuesta de autenticación incompleta (sin usuario)',
        code: 'AUTH_MISSING_USER',
        supabaseError: null,
        supabaseCode: null,
      },
      { status: 500 },
    )
  }

  let setSessionOk = false
  if (data.session) {
    try {
      const s = await createServerSupabase()
      await s.auth.setSession({
        access_token: data.session.access_token,
        refresh_token: data.session.refresh_token,
      })
      const { data: chk } = await s.auth.getSession()
      setSessionOk = Boolean(chk.session)
      if (!setSessionOk) {
        console.error('[session POST] setSession no dejó sesión visible en esta petición — posible problema de cookies.')
      }
    } catch (e) {
      logAuthError('session POST setSession / cookies', e)
    }
  }

  let u = await getAuthUser()
  if (!u) {
    const sClient = await createServerSupabase()
    const { data: sess } = await sClient.auth.getSession()
    logAuthError(
      'session POST getAuthUser after signIn',
      new Error(
        `getAuthUser null; hasSessionInCookieStore=${Boolean(sess?.session)}`,
      ),
    )
    u = data.user ? await getAuthUserFromUser(data.user) : null
  }
  if (!u) {
    return NextResponse.json(
      {
        ok: false,
        error:
          'No se pudo leer la sesión tras el acceso. Reintenta o revisa la configuración del servidor (cookies, dominio, Supabase URL).',
        code: setSessionOk ? 'GET_AUTH_USER_FAILED' : 'SESSION_COOKIE_MISMATCH',
        supabaseError: 'getAuthUser_null_after_signIn',
        supabaseCode: null,
      },
      { status: 500 },
    )
  }

  console.log('[auth/session POST] login ok', { email: u.email, role: u.role })

  return NextResponse.json({
    ok: true,
    user: { email: u.email, nombre: u.nombre, role: u.role },
  })
}

export async function DELETE() {
  const blocked = authResponseIfSupabaseNotConfigured()
  if (blocked) return blocked
  try {
    const supabase = await createServerSupabase()
    await supabase.auth.signOut()
  } catch (e) {
    if (e instanceof Error && e.message === 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY in production') {
      return NextResponse.json({ ok: false, error: e.message, code: 'CONFIG' }, { status: 500 })
    }
    logAuthError('session DELETE signOut', e)
    return NextResponse.json(
      { ok: false, error: 'No se pudo cerrar sesión. Revisa la configuración de Supabase (env en Vercel).', code: 'SIGN_OUT_FAILED' },
      { status: 500 },
    )
  }
  console.log('[auth/session DELETE] sesión cerrada')
  return NextResponse.json({ ok: true })
}
