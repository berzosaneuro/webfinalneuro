import type { User } from '@supabase/supabase-js'
import { createServerSupabase } from '@/lib/supabase-server'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { PRIVILEGED_MASTER_EMAIL } from '@/lib/auth-constants'

export type UserRole = 'user' | 'admin' | 'master'

export type AuthUser = {
  id: string
  email: string
  nombre: string
  role: UserRole
}

function displayNombre(user: User, email: string): string {
  return (
    (user.user_metadata?.nombre as string | undefined)?.trim() ||
    (user.user_metadata?.name as string | undefined)?.trim() ||
    email.split('@')[0] ||
    'Usuario'
  )
}

/**
 * Fallback único: si no existe fila en public.users (legacy o fallo atípico), inserta.
 * El inventario normal lo garantiza el trigger `handle_new_user` en auth.users.
 * No sustituye la BD: sin service role no puede insertar; si el trigger ya corrió, solo hace SELECT.
 */
export async function ensurePublicUserProfile(user: User): Promise<{
  ok: boolean
  backfilled: boolean
  error?: string
}> {
  if (!user.id || !user.email) {
    return { ok: false, backfilled: false, error: 'Usuario sin id o email' }
  }

  const email = user.email.trim().toLowerCase()
  const nombre = displayNombre(user, email)
  const isPrivileged = email === PRIVILEGED_MASTER_EMAIL

  const serviceRole = getSupabaseServiceRole()
  if (!serviceRole) {
    console.warn(
      '[ensurePublicUserProfile] Sin SUPABASE_SERVICE_ROLE_KEY: no se puede comprobar/backfillear public.users; se asume trigger en BD.',
    )
    return { ok: true, backfilled: false }
  }

  const { data: existing, error: readErr } = await serviceRole
    .from('users')
    .select('id')
    .eq('id', user.id)
    .maybeSingle()

  if (readErr) {
    console.error('[ensurePublicUserProfile] read failed:', readErr.message)
    return { ok: false, backfilled: false, error: readErr.message }
  }

  if (existing?.id) {
    if (isPrivileged) {
      const { error: upErr } = await serviceRole
        .from('users')
        .update({ role: 'master', nombre })
        .eq('id', user.id)
      if (upErr) {
        console.error('[ensurePublicUserProfile] privileged update failed:', upErr.message)
      }
    }
    return { ok: true, backfilled: false }
  }

  const { error: insertErr } = await serviceRole.from('users').insert({
    id: user.id,
    email,
    nombre,
    role: isPrivileged ? 'master' : 'user',
    last_login_at: new Date().toISOString(),
  })

  if (insertErr) {
    if (insertErr.code === '23505') {
      // Conflicto de id (trigger concurrente, ya resuelto) o de email (fila
      // histórica/huérfana previa a esta cuenta Auth — p. ej. captación de
      // leads o webhook de Stripe antes del registro). Si es lo segundo,
      // reconciliamos adoptando la fila existente para este id, igual que
      // hace el trigger `handle_new_user` en BD (defensa en profundidad por
      // si esa migración aún no está desplegada en el proyecto remoto).
      const { data: byEmail, error: byEmailErr } = await serviceRole
        .from('users')
        .select('id')
        .ilike('email', email)
        .maybeSingle()

      if (!byEmailErr && byEmail?.id && byEmail.id !== user.id) {
        const { error: reconcileErr } = await serviceRole
          .from('users')
          .update({ id: user.id, role: isPrivileged ? 'master' : undefined, nombre })
          .eq('id', byEmail.id)
        if (reconcileErr) {
          console.error('[ensurePublicUserProfile] reconcile update failed:', reconcileErr.message)
          return { ok: false, backfilled: false, error: reconcileErr.message }
        }
        console.warn('[AUTH WARNING] public.users reconciled (fila histórica adoptada)', {
          oldId: byEmail.id,
          newId: user.id,
        })
        return { ok: true, backfilled: true }
      }

      console.warn(
        '[AUTH WARNING] public.users insert conflict (fila ya existía, p. ej. trigger concurrente)',
        user.id,
      )
      return { ok: true, backfilled: false }
    }
    console.error('[ensurePublicUserProfile] backfill insert failed:', insertErr.message, insertErr.code)
    return { ok: false, backfilled: false, error: insertErr.message }
  }

  console.warn('[AUTH WARNING] Missing public.users row, backfilled', user.id)
  console.warn('[AUTH WARNING] PROFILE_BACKFILLED')

  return { ok: true, backfilled: true }
}

/** Normaliza el valor almacenado en BD; nunca devuelve null. */
export function mapDbRoleToUserRole(r: string | null | undefined): UserRole {
  const x = String(r ?? '')
    .trim()
    .toLowerCase()
  if (x === 'master' || x === 'admin') return x
  return 'user'
}

/**
 * Identidad desde JWT; rol desde public.users.
 * `ensurePublicUserProfile`: backfill si falta fila; actualización mínima si email maestro.
 */
export async function getAuthUserFromUser(user: User): Promise<AuthUser | null> {
  if (!user?.id || !user.email) return null

  const email = user.email.trim().toLowerCase()
  const nombre = displayNombre(user, email)

  const ensured = await ensurePublicUserProfile(user)
  if (!ensured.ok && ensured.error) {
    console.error('[auth] getAuthUserFromUser ensurePublicUserProfile:', ensured.error)
  }

  const serviceRole = getSupabaseServiceRole()
  if (!serviceRole) {
    console.error(
      '[auth] getAuthUserFromUser: SUPABASE_SERVICE_ROLE_KEY o URL faltan; el rol en respuesta queda por heurística.',
    )
    return {
      id: user.id,
      email,
      nombre,
      role: email === PRIVILEGED_MASTER_EMAIL ? 'master' : 'user',
    }
  }

  if (email === PRIVILEGED_MASTER_EMAIL) {
    return { id: user.id, email, nombre, role: 'master' }
  }

  let role: UserRole = 'user'
  const { data: row, error: roleError } = await serviceRole
    .from('users')
    .select('role')
    .eq('id', user.id)
    .maybeSingle()

  if (roleError) {
    console.error('[auth] getAuthUserFromUser role read failed:', roleError.message)
  } else if (row) {
    role = mapDbRoleToUserRole(row.role)
  }

  return { id: user.id, email, nombre, role }
}

/**
 * Identidad: JWT/ sesión (cookies) → getUser() → getAuthUserFromUser.
 */
export async function getAuthUser(): Promise<AuthUser | null> {
  const supabase = await createServerSupabase()
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()
  if (authError || !user?.id || !user.email) return null
  return getAuthUserFromUser(user)
}
