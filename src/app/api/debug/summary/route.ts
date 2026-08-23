import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/server-auth'
import { logAuthError } from '@/lib/auth-logging'
import { getPublicSupabaseEnv } from '@/lib/supabase/env'
export { dynamic } from '@/lib/api-route-dynamic'

/**
 * Resumen de diagnóstico (sin secretos). Activar con ENABLE_DEBUG_PANEL=true en Vercel.
 * Desactiva el panel en producción estable cuando no lo necesites.
 */
export async function GET() {
  const enabled = process.env.ENABLE_DEBUG_PANEL === '1' || process.env.ENABLE_DEBUG_PANEL === 'true'
  if (!enabled) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }

  const publicEnv = getPublicSupabaseEnv()
  const server = {
    supabaseProjectUrl: publicEnv.supabaseUrl,
    hasNextPublicAnon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()),
    hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()),
    hasAppUrl: Boolean(process.env.NEXT_PUBLIC_APP_URL?.trim()),
  }

  try {
    const user = await getAuthUser()
    return NextResponse.json({
      server,
      session: user
        ? { email: user.email, role: user.role, nombre: user.nombre }
        : null,
    })
  } catch (e) {
    logAuthError('debug/summary getAuthUser', e)
    return NextResponse.json({
      server,
      session: null,
      sessionError: 'No se pudo leer sesión (revisa NEXT_PUBLIC_* en Vercel).',
    })
  }
}
