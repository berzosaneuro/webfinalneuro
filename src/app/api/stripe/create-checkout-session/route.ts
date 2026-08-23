import { NextResponse } from 'next/server'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { getStripe } from '@/lib/stripe'
import { requireUserOr401 } from '@/lib/api-auth'
import { getUserSubscriptionStatusByEmail } from '@/lib/subscription-status'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  const stripe = getStripe()
  const priceId = process.env.STRIPE_PRICE_ID
  if (!stripe || !priceId) {
    return NextResponse.json({ error: 'Pagos no configurados' }, { status: 503 })
  }

  const emailNorm = auth.email
  const subscription = await getUserSubscriptionStatusByEmail(emailNorm)
  if (subscription?.isPremium) {
    return NextResponse.json(
      { error: 'Ya tienes una suscripción premium activa.' },
      { status: 400 }
    )
  }

  const origin = getCanonicalAppBaseUrl() ?? ''

  if (!origin) {
    return NextResponse.json(
      { error: 'Configura NEXT_PUBLIC_APP_URL en producción (URL canónica con https)' },
      { status: 500 }
    )
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: emailNorm,
      metadata: { app_user_email: emailNorm },
      subscription_data: {
        metadata: { app_user_email: emailNorm },
      },
      success_url: `${origin}/planes?checkout=success`,
      cancel_url: `${origin}/planes?checkout=cancel`,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Sin URL de checkout' }, { status: 500 })
    }

    return NextResponse.json({ url: session.url })
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Error de Stripe'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
