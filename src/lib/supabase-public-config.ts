import { getPublicSupabaseEnv, type PublicSupabaseEnv } from '@/lib/supabase/env'

/**
 * Misma señal que getPublicSupabaseEnv; nunca lanza.
 * (Nombre histórico "Required" – conservado para imports existentes.)
 */
export function getRequiredSupabasePublicConfig(): PublicSupabaseEnv {
  return getPublicSupabaseEnv()
}
