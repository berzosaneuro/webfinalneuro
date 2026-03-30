import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''

let _supabase: SupabaseClient | null = null
let _supabaseService: SupabaseClient | null = null

/** Devuelve el cliente Supabase o null si no está configurado (ej. en Vercel sin vars) */
export function getSupabase(): SupabaseClient | null {
  // En servidor priorizamos service role para no depender de políticas abiertas por accidente.
  if (typeof window === 'undefined' && serviceRoleKey) {
    return getSupabaseServiceRole()
  }
  if (!supabaseUrl || !supabaseAnonKey) return null
  if (!_supabase) {
    _supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return _supabase
}

const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

/** Solo para webhooks Stripe u operaciones de servidor que requieren bypass RLS. */
export function getSupabaseServiceRole(): SupabaseClient | null {
  if (!supabaseUrl || !serviceRoleKey) return null
  if (!_supabaseService) {
    _supabaseService = createClient(supabaseUrl, serviceRoleKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    })
  }
  return _supabaseService
}
