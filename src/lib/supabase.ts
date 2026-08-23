import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { getSupabaseServiceRoleKeyOrThrow, SUPABASE_URL } from '@/lib/supabase/env'

let _supabaseService: SupabaseClient | null = null
let _serviceEnvMissingLogged = false

/**
 * Service role — misma `SUPABASE_URL` que el resto; clave vía `SUPABASE_SERVICE_ROLE_KEY`.
 */
export function getSupabaseServiceRole(): SupabaseClient | null {
  let key: string
  try {
    key = getSupabaseServiceRoleKeyOrThrow()
  } catch {
    if (!_serviceEnvMissingLogged) {
      _serviceEnvMissingLogged = true
      console.error('❌ Supabase: SUPABASE_SERVICE_ROLE_KEY faltante')
    }
    return null
  }
  if (!_supabaseService) {
    _supabaseService = createClient(SUPABASE_URL, key, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _supabaseService
}
