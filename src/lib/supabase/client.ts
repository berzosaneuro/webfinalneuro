import { createBrowserClient } from '@supabase/ssr'
import { SUPABASE_URL, SUPABASE_ANON } from './env'

/**
 * Un solo origen: env.ts (NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY).
 */
export const supabase = createBrowserClient(SUPABASE_URL, SUPABASE_ANON)

export function createBrowserSupabase() {
  return supabase
}
