import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { requireUserOr401 } from '@/lib/api-auth'
import { getUserSubscriptionStatusByEmail } from '@/lib/subscription-status'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

/** URL pública para success/cancel Stripe (Vercel: prioriza dominio canónico). */
function resolvePublicOrigin(request: Request): string {
  const trimSlash = (s: string) => s.replace(/\/$/, '')

  const fromEnv = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (fromEnv) return trimSlash(fromEnv)

  const fromOrigin = request.headers.get('origin')?.trim()
  if (fromOrigin) return trimSlash(fromOrigin)

  const fwdHost = request.headers.get('x-forwarded-host')?.trim()
  const fwdProto = (request.headers.get('x-forwarded-proto') || 'https').split(',')[0]?.trim() || 'https'
  if (fwdHost) return trimSlash(`${fwdProto}://${fwdHost}`)

  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) return trimSlash(`https://${vercel.replace(/^https?:\/\//, '')}`)

  const host = request.headers.get('host')?.trim()
  if (host) return trimSlash(`https://${host}`)

  return ''
}

export async function POST(request: Request) {
  const auth = await requireUserOr401(request)
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

  const origin = resolvePublicOrigin(request)

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
