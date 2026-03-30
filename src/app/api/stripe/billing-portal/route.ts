import { NextResponse } from 'next/server'
import { getStripe } from '@/lib/stripe'
import { getSupabase } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function resolvePublicOrigin(request: Request): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL?.trim() ||
    request.headers.get('origin')?.trim() ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL.replace(/^https?:\/\//, '')}` : '')
  )?.replace(/\/$/, '') || ''
}

export async function POST(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error

  const stripe = getStripe()
  const supabase = getSupabase()
  if (!stripe || !supabase) return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })

  const { data, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .ilike('email', auth.email)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.stripe_customer_id) return NextResponse.json({ error: 'No hay cliente Stripe asociado' }, { status: 400 })

  const origin = resolvePublicOrigin(request)
  if (!origin) return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL no configurado' }, { status: 500 })

  try {
    const session = await stripe.billingPortal.sessions.create({
      customer: data.stripe_customer_id,
      return_url: `${origin}/planes`,
    })
    return NextResponse.json({ url: session.url })
  } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : 'Error Stripe' }, { status: 500 })
  }
}
