import { getSupabaseServiceRole } from '@/lib/supabase'

export type UserSubscriptionStatus = {
  userId: string
  isPremium: boolean
  subscriptionStatus: string | null
}

/**
 * Single source of truth de suscripción premium.
 * Solo servidor: lee estado real desde users por userId.
 */
export async function getUserSubscriptionStatus(userId: string): Promise<UserSubscriptionStatus | null> {
  const id = userId.trim()
  if (!id) return null

  const supabase = getSupabaseServiceRole()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .select('id, is_premium, subscription_status')
    .eq('id', id)
    .maybeSingle()

  if (error || !data?.id) return null

  return {
    userId: data.id as string,
    isPremium: Boolean(data.is_premium),
    subscriptionStatus: (data.subscription_status as string | null) ?? null,
  }
}

/**
 * Helper server para flujos que todavía identifican sesión por email.
 */
export async function getUserSubscriptionStatusByEmail(email: string): Promise<UserSubscriptionStatus | null> {
  const normalized = email.trim().toLowerCase()
  if (!normalized) return null

  const supabase = getSupabaseServiceRole()
  if (!supabase) return null

  const { data, error } = await supabase
    .from('users')
    .select('id')
    .eq('email', normalized)
    .maybeSingle()

  if (error || !data?.id) return null

  return getUserSubscriptionStatus(String(data.id))
}
