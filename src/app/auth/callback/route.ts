import { NextResponse, type NextRequest } from 'next/server'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { createServerSupabase } from '@/lib/supabase-server'
import { logAuthError } from '@/lib/auth-logging'

/** Search params → must not be prerendered at build time. */
export const dynamic = 'force-dynamic'

function safeRedirect(origin: string, path: string): NextResponse {
  return NextResponse.redirect(`${origin}${path}`)
}

/**
 * GET /auth/callback?code=XXXX&type=recovery
 *
 * Handles the PKCE code exchange after Supabase email actions
 * (password recovery, email confirmation, magic link).
 * Wrapped entirely in try/catch so the user always gets a redirect,
 * never a crash page.
 */
export async function GET(request: NextRequest) {
  const origin = getCanonicalAppBaseUrl()
  if (!origin) {
    return new NextResponse(
      'Falta NEXT_PUBLIC_APP_URL en Vercel (URL canónica con https, p. ej. https://berzosaneuro.com).',
      { status: 503, headers: { 'Content-Type': 'text/plain; charset=utf-8' } },
    )
  }

  try {
    const { searchParams } = request.nextUrl
    const code = searchParams.get('code')
    const type = searchParams.get('type')

    if (!code) {
      console.warn('[auth/callback] missing code param')
      return safeRedirect(origin, '/acceder?error=missing_code')
    }

    let supabase
    try {
      supabase = await createServerSupabase()
    } catch (e) {
      logAuthError('callback createServerSupabase', e)
      return safeRedirect(origin, '/acceder?error=config')
    }
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (error) {
      logAuthError('callback exchangeCodeForSession', error)
      console.error('[auth/callback] exchangeCodeForSession:', error.message, (error as { code?: string }).code)
      return safeRedirect(origin, '/acceder?error=invalid_or_expired_link')
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    console.log('[auth/callback]', { type, hasUser: Boolean(user), email: user?.email ?? null })

    if (type === 'recovery') {
      return safeRedirect(origin, '/nueva-contrasena')
    }

    return safeRedirect(origin, '/')
  } catch (err) {
    logAuthError('callback unhandled', err)
    return safeRedirect(origin, '/acceder?error=invalid_or_expired_link')
  }
}
