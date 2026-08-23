import { NextResponse } from 'next/server'
import { isSupabaseConfigured } from '@/lib/supabase/env'

/**
 * Importar `env` asegura fail-fast. Si se llega aquí, URL/anon públicas están presentes.
 */
export function authResponseIfSupabaseNotConfigured(): NextResponse | null {
  if (!isSupabaseConfigured) {
    return NextResponse.json(
      { ok: false, error: 'Supabase ENV not configured', code: 'SUPABASE_ENV_MISSING' },
      { status: 500 },
    )
  }
  return null
}
