import { NextResponse } from 'next/server'
import { z } from 'zod'
import { createServerSupabase } from '@/lib/supabase-server'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { logAuthError } from '@/lib/auth-logging'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { authResponseIfSupabaseNotConfigured } from '@/lib/supabase/auth-public-env-guard'
export { dynamic } from '@/lib/api-route-dynamic'

const resetSchema = z.object({
  email: z.string().email(),
})

/**
 * POST — send password reset email.
 * Also handles existing users who never had a Supabase Auth account:
 * creates the auth entry first, then sends the reset email.
 */
export async function POST(request: Request) {
  const blocked = authResponseIfSupabaseNotConfigured()
  if (blocked) return blocked
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = resetSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const email = parsed.data.email.trim().toLowerCase()

  const serviceRole = getSupabaseServiceRole()
  if (serviceRole) {
    const { data: publicUser } = await serviceRole
      .from('users')
      .select('id')
      .ilike('email', email)
      .maybeSingle()

    if (publicUser?.id) {
      try {
        const tempPassword = crypto.randomUUID() + crypto.randomUUID()
        const { error: createErr } = await serviceRole.auth.admin.createUser({
          email,
          password: tempPassword,
          email_confirm: true,
          user_metadata: { nombre: email.split('@')[0] || 'Usuario' },
        })
        if (createErr && !createErr.message?.includes('already')) {
          console.warn('[reset-password] createUser failed:', createErr.message)
        }
      } catch (err) {
        console.warn('[reset-password] createUser error:', err)
      }
    }
  }

  let supabase
  try {
    supabase = await createServerSupabase()
  } catch (e) {
    logAuthError('reset-password createServerSupabase', e)
    return NextResponse.json(
      { error: 'Servidor no configurado: variables Supabase (NEXT_PUBLIC_*) faltantes en Vercel.' },
      { status: 503 },
    )
  }

  const base = getCanonicalAppBaseUrl()
  if (!base) {
    return NextResponse.json(
      { error: 'NEXT_PUBLIC_APP_URL not configured' },
      { status: 500 },
    )
  }

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${base}/auth/callback?type=recovery`,
  })

  if (error) {
    logAuthError('reset-password resetPasswordForEmail', error)
  }

  return NextResponse.json({
    ok: true,
    message: 'Si el email existe, recibirás un enlace para establecer tu contraseña.',
  })
}
