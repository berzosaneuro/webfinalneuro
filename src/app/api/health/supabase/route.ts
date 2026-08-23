import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

/**
 * Diagnóstico seguro (sin secretos): comprueba env y si el servidor puede alcanzar Auth de Supabase.
 * Abre en el navegador: /api/health/supabase
 */
export async function GET() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()
  const hasService = Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())

  if (!url || !anon) {
    return NextResponse.json(
      {
        ok: false,
        step: 'vercel_env',
        hasUrl: Boolean(url),
        hasAnon: Boolean(anon),
        hasService,
        message:
          'Faltan NEXT_PUBLIC_SUPABASE_URL o NEXT_PUBLIC_SUPABASE_ANON_KEY en Vercel (Production). Cópialas de Supabase → Project Settings → API. Guarda y Redeploy.',
      },
      { status: 503 },
    )
  }

  const base = url.replace(/\/$/, '')
  let status = 0
  try {
    const r = await fetch(`${base}/auth/v1/health`, {
      method: 'GET',
      signal: AbortSignal.timeout(10_000),
    })
    status = r.status
  } catch {
    return NextResponse.json(
      {
        ok: false,
        step: 'network',
        hasUrl: true,
        hasAnon: true,
        hasService,
        supabaseHost: (() => {
          try {
            return new URL(url).host
          } catch {
            return 'invalid'
          }
        })(),
        message:
          'El despliegue no puede conectar con Supabase (red/DNS/URL). Revisa la URL en Vercel; en Supabase que el proyecto no esté pausado.',
      },
      { status: 503 },
    )
  }

  const reachable = status >= 200 && status < 500
  return NextResponse.json({
    ok: reachable,
    step: 'complete',
    hasUrl: true,
    hasAnon: true,
    hasService,
    supabaseAuthHealthStatus: status,
    message: reachable
      ? 'El servidor alcanza Supabase Auth. Si el login falla, revisa Site URL y Redirect URLs en Supabase → Authentication, y cookies en un dominio distinto a www (usa una sola canónica).'
      : 'Supabase respondió con un error HTTP; revisa el proyecto y la URL.',
  })
}
