import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { SUPABASE_URL, SUPABASE_ANON } from './env'

/**
 * Misma URL/anon que el browser; cookies getAll/setAll (@supabase/ssr + Next 14+).
 */
export async function createServerSupabase() {
  const cookieStore = await cookies()
  return createServerClient(SUPABASE_URL, SUPABASE_ANON, {
    cookies: {
      getAll() {
        return cookieStore.getAll()
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options),
          )
        } catch (e) {
          console.error('[createServerSupabase] cookie setAll failed', e)
        }
      },
    },
  })
}
