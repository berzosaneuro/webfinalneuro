import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { SUPABASE_URL, SUPABASE_ANON } from './env'

/**
 * Equivalente a `createClient(SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY)`:
 * `SUPABASE_URL` y `SUPABASE_ANON` vienen de `env.ts` (variables públicas de Supabase).
 *
 * Llamadas a Auth (signIn/signUp) sin capa @supabase/ssr/cookies; luego la sesión se copia
 * a cookies con `createServerSupabase().auth.setSession`.
 */
export function createAuthApiSupabase(): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
      detectSessionInUrl: false,
    },
    global: { headers: { 'X-Client-Info': 'neuro-server-auth' } },
  })
}
