import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { getStripe, getPriceIdForProduct, isStripeProduct } from '@/lib/stripe'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'
import { getUserSubscriptionStatusByEmail } from '@/lib/subscription-status'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const bodySchema = z.object({
  product: z.enum(['premium', 'mentoria']).default('premium'),
})

export async function POST(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  let raw: unknown = {}
  try {
    raw = await request.json()
  } catch {
    // body opcional; por compatibilidad con llamadas sin JSON (solo email) se asume premium.
  }
  const parsed = bodySchema.safeParse(raw)
  const product = isStripeProduct(parsed.data?.product) ? parsed.data.product : 'premium'

  const stripe = getStripe()
  const priceId = getPriceIdForProduct(product)
  if (!stripe || !priceId) {
    return NextResponse.json({ error: 'Pagos no configurados para este producto' }, { status: 503 })
  }

  const emailNorm = auth.email
  const subscription = await getUserSubscriptionStatusByEmail(emailNorm)
  if (product === 'premium' && subscription?.isPremium) {
    return NextResponse.json({ error: 'Ya tienes una suscripción premium activa.' }, { status: 400 })
  }
  if (product === 'mentoria' && subscription?.isMentoria) {
    return NextResponse.json({ error: 'Ya tienes una suscripción de mentoría activa.' }, { status: 400 })
  }

  const origin = getCanonicalAppBaseUrl() ?? ''

  if (!origin) {
    return NextResponse.json(
      { error: 'Configura NEXT_PUBLIC_APP_URL en producción (URL canónica con https)' },
      { status: 500 }
    )
  }

  // Reutilizar el mismo Stripe Customer si ya existe (Premium + Mentoría deben
  // quedar bajo un único customer para que el Billing Portal los gestione juntos).
  let existingCustomerId: string | null = null
  const supabase = getSupabaseServiceRole()
  if (supabase) {
    const { data } = await supabase
      .from('users')
      .select('stripe_customer_id')
      .ilike('email', emailNorm)
      .maybeSingle()
    existingCustomerId = data?.stripe_customer_id || null
  }

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      ...(existingCustomerId ? { customer: existingCustomerId } : { customer_email: emailNorm }),
      metadata: { app_user_email: emailNorm, product },
      subscription_data: {
        metadata: { app_user_email: emailNorm, product },
      },
      success_url: `${origin}/planes?checkout=success&product=${product}`,
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
