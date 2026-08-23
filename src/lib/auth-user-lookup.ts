import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Comprueba si existe un usuario en `auth.users` con ese email (API admin, service role).
 * Si `listUsers` falla, devuelve `null` (no forzar NOT_FOUND/INVALID a ciegas).
 * Nota: primeras `perPage` entradas; sitios con >N usuarios pueden requerir paginación.
 */
export async function emailExistsInAuthUsers(
  service: SupabaseClient,
  email: string,
  perPage = 1000,
): Promise<boolean | null> {
  const e = email.trim().toLowerCase()
  const { data, error } = await service.auth.admin.listUsers({ page: 1, perPage })
  if (error) {
    console.error('[auth] admin.listUsers (email check):', error.message)
    return null
  }
  const users = data?.users ?? []
  return users.some((u) => (u.email ?? '').toLowerCase() === e)
}
