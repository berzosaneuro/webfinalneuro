import { NextResponse } from 'next/server'
import { requireUserOr401 } from '@/lib/api-auth'
import { getUserSubscriptionStatusByEmail } from '@/lib/subscription-status'
export { dynamic } from '@/lib/api-route-dynamic'

/** Lectura de premium desde BD vía getUserSubscriptionStatusByEmail (service role en servidor). */
export async function GET(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error
  const status = await getUserSubscriptionStatusByEmail(auth.email)
  return NextResponse.json({
    is_premium: status?.isPremium === true,
    subscription_status: status?.subscriptionStatus ?? null,
    is_mentoria: status?.isMentoria === true,
    mentoria_status: status?.mentoriaStatus ?? null,
    user_id: status?.userId ?? null,
  })
}
