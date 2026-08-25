import { NextResponse, type NextRequest } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
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
    const tokenHash = searchParams.get('token_hash')
    const type = searchParams.get('type')

    if (!code && !tokenHash) {
      console.warn('[auth/callback] missing code/token_hash param')
      return safeRedirect(origin, '/acceder?error=missing_code')
    }

    let supabase
    try {
      supabase = await createServerSupabase()
    } catch (e) {
      logAuthError('callback createServerSupabase', e)
      return safeRedirect(origin, '/acceder?error=config')
    }

    // Confirmacion de email / magic link / recovery pueden llegar de dos formas
    // segun el flujo: como `code` (PKCE, exchangeCodeForSession) o como
    // `token_hash` + `type` (OTP, verifyOtp). El signUp() de esta app se hace
    // desde un cliente servidor sin persistSession, asi que no hay code_verifier
    // guardado en ningun sitio recuperable para el intercambio PKCE: por eso
    // probamos primero token_hash (no depende de nada guardado localmente) y
    // caemos a exchangeCodeForSession solo si no hay token_hash.
    const { error } = tokenHash
      ? await supabase.auth.verifyOtp({ token_hash: tokenHash, type: (type as EmailOtpType) || 'email' })
      : await supabase.auth.exchangeCodeForSession(code as string)

    if (error) {
      logAuthError('callback verifyOtp/exchangeCodeForSession', error)
      console.error('[auth/callback] verify failed:', error.message, (error as { code?: string }).code, { hadTokenHash: Boolean(tokenHash), hadCode: Boolean(code) })
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
