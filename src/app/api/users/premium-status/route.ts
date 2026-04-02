import { NextResponse } from 'next/server'
import { requireUserOr401 } from '@/lib/api-auth'
import { getUserSubscriptionStatusByEmail } from '@/lib/subscription-status'

/** Lectura de premium desde BD vía getUserSubscriptionStatusByEmail (service role en servidor). */
export async function GET(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  const status = await getUserSubscriptionStatusByEmail(auth.email)
  return NextResponse.json({
    is_premium: status?.isPremium === true,
    subscription_status: status?.subscriptionStatus ?? null,
    user_id: status?.userId ?? null,
  })
}
