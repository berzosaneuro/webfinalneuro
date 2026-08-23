const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim() ?? ''
const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim() ?? ''
const service = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim() ?? ''

if (process.env.NODE_ENV === 'development') {
  // Temporal: comprobar carga de .env.local; quitar al estabilizar local.
  console.log('ENV CHECK:', {
    url: process.env.NEXT_PUBLIC_SUPABASE_URL,
    anon: Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY),
  })
}

if (!rawUrl || !anon) {
  throw new Error('Missing Supabase public env')
}

/** Último segmento: solo `https://<ref>.supabase.co` (sin /rest, sin barra final). */
function normalizeProjectUrl(u: string): string {
  let parsed: URL
  try {
    parsed = new URL(u)
  } catch {
    throw new Error(
      'NEXT_PUBLIC_SUPABASE_URL debe ser una URL válida (p. ej. https://ABCDE123.supabase.co)',
    )
  }
  if (parsed.protocol !== 'https:') {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL debe usar https://')
  }
  return `${parsed.origin}`.replace(/\/$/, '')
}

/** Misma instancia pública (URL + anon) en cliente, servidor, middleware. */
export const SUPABASE_URL = normalizeProjectUrl(rawUrl)
export const SUPABASE_ANON = anon
/** Solo servidor: en bundle cliente suele quedar vacío; no leer en client components. */
export const SUPABASE_SERVICE = service

export const isSupabaseConfigured = true

export type PublicSupabaseEnv = {
  supabaseUrl: string
  supabaseAnonKey: string
  isConfigured: true
}

export function getPublicSupabaseEnv(): PublicSupabaseEnv {
  return { supabaseUrl: SUPABASE_URL, supabaseAnonKey: SUPABASE_ANON, isConfigured: true }
}

export function getSupabaseServiceRoleKeyOrThrow(): string {
  if (!service) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY')
  }
  return service
}
