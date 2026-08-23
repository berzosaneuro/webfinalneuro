import { NextResponse } from 'next/server'
import { getCanonicalAppBaseUrl } from '@/lib/app-url'
import { getStripe } from '@/lib/stripe'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  const stripe = getStripe()
  const supabase = getSupabaseServiceRole()
  if (!stripe || !supabase) return NextResponse.json({ error: 'Servicio no configurado' }, { status: 503 })

  const emailNorm = auth.email.trim().toLowerCase()
  const { data, error } = await supabase
    .from('users')
    .select('stripe_customer_id')
    .ilike('email', emailNorm)
    .maybeSingle()
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data?.stripe_customer_id) return NextResponse.json({ error: 'No hay cliente Stripe asociado' }, { status: 400 })

  const origin = getCanonicalAppBaseUrl() ?? ''
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
