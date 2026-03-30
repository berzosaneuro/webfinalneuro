import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe } from '@/lib/stripe'
import { getSupabaseServiceRole } from '@/lib/supabase'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

function normalizeEmail(v: string | null | undefined): string {
  return (v || '').trim().toLowerCase()
}

function isPremiumFromStripeStatus(status: Stripe.Subscription.Status): boolean {
  return status === 'active' || status === 'trialing'
}

async function alreadyProcessedEvent(eventId: string, eventType: string): Promise<boolean> {
  const supabase = getSupabaseServiceRole()
  if (!supabase) return false
  const { data } = await supabase
    .from('stripe_events')
    .select('id')
    .eq('stripe_event_id', eventId)
    .maybeSingle()
  if (data?.id) return true
  const { error } = await supabase.from('stripe_events').insert({
    stripe_event_id: eventId,
    event_type: eventType,
  })
  if (error && !error.message.toLowerCase().includes('duplicate')) {
    console.error('[stripe webhook] stripe_events insert', error.message)
  }
  return false
}

async function upsertSubscriptionRecord(input: {
  email: string
  customerId: string
  subscriptionId: string
  status: string
  currentPeriodStart?: number | null
  currentPeriodEnd?: number | null
  cancelAtPeriodEnd?: boolean
}) {
  const supabase = getSupabaseServiceRole()
  if (!supabase) return
  await supabase.from('subscriptions').upsert(
    {
      user_email: input.email,
      stripe_customer_id: input.customerId,
      stripe_subscription_id: input.subscriptionId,
      status: input.status,
      current_period_start: input.currentPeriodStart ? new Date(input.currentPeriodStart * 1000).toISOString() : null,
      current_period_end: input.currentPeriodEnd ? new Date(input.currentPeriodEnd * 1000).toISOString() : null,
      cancel_at_period_end: Boolean(input.cancelAtPeriodEnd),
      updated_at: new Date().toISOString(),
    },
    { onConflict: 'stripe_subscription_id' }
  )
}

async function insertPaymentFromInvoice(invoice: Stripe.Invoice) {
  const supabase = getSupabaseServiceRole()
  if (!supabase) return
  const customerId = typeof invoice.customer === 'string' ? invoice.customer : invoice.customer?.id
  if (!customerId || !invoice.id) return

  const emailNorm = normalizeEmail(
    (invoice.customer_email as string | null | undefined) ||
      (invoice.customer && typeof invoice.customer === 'object' && 'email' in invoice.customer
        ? (invoice.customer.email as string | null)
        : null) ||
      ((invoice.metadata?.app_user_email as string | undefined) ?? '')
  )
  if (!emailNorm) return

  const invoiceSub = (invoice as unknown as { subscription?: string | { id?: string } | null }).subscription
  const subscriptionId = typeof invoiceSub === 'string' ? invoiceSub : invoiceSub?.id || ''
  const paidAt = invoice.status_transitions?.paid_at ? new Date(invoice.status_transitions.paid_at * 1000).toISOString() : null
  await supabase.from('payments').upsert(
    {
      user_email: emailNorm,
      stripe_customer_id: customerId,
      stripe_subscription_id: subscriptionId,
      stripe_invoice_id: invoice.id,
      amount_paid: invoice.amount_paid || 0,
      currency: (invoice.currency || 'eur').toLowerCase(),
      status: invoice.status || 'paid',
      paid_at: paidAt,
    },
    { onConflict: 'stripe_invoice_id' }
  )
}

async function upsertUserByStripeIdentity(input: {
  email?: string
  customerId: string
  subscriptionStatus: string
  isPremium: boolean
}) {
  const supabase = getSupabaseServiceRole()
  if (!supabase) return { ok: false as const, error: 'Servicio no configurado' }

  const emailNorm = normalizeEmail(input.email)
  const nombre = emailNorm.split('@')[0] || 'Usuario'

  if (emailNorm) {
    const { data: updatedByEmail, error: upErrEmail } = await supabase
      .from('users')
      .update({
        stripe_customer_id: input.customerId,
        subscription_status: input.subscriptionStatus,
        is_premium: input.isPremium,
      })
      .ilike('email', emailNorm)
      .select('id')
    if (upErrEmail) return { ok: false as const, error: upErrEmail.message }
    if (updatedByEmail?.length) return { ok: true as const }

    const { error: insErr } = await supabase.from('users').insert({
      email: emailNorm,
      nombre,
      stripe_customer_id: input.customerId,
      subscription_status: input.subscriptionStatus,
      is_premium: input.isPremium,
    })
    if (insErr) return { ok: false as const, error: insErr.message }
    return { ok: true as const }
  }

  const { data: updatedByCustomer, error: upErrCustomer } = await supabase
    .from('users')
    .update({
      subscription_status: input.subscriptionStatus,
      is_premium: input.isPremium,
    })
    .eq('stripe_customer_id', input.customerId)
    .select('id')
  if (upErrCustomer) return { ok: false as const, error: upErrCustomer.message }
  if (!updatedByCustomer?.length) {
    return { ok: false as const, error: 'No se encontró usuario por stripe_customer_id' }
  }
  return { ok: true as const }
}

async function activatePremiumForCheckoutSession(session: Stripe.Checkout.Session) {
  if (session.mode !== 'subscription') return NextResponse.json({ received: true })

  const emailNorm = normalizeEmail(
    session.metadata?.app_user_email || session.customer_details?.email || session.customer_email
  )
  const customerId = typeof session.customer === 'string' ? session.customer : session.customer?.id
  if (!customerId) {
    console.warn('[stripe webhook] checkout.session.completed sin customer id')
    return NextResponse.json({ received: true })
  }
  if (!emailNorm) {
    console.warn('[stripe webhook] checkout.session.completed sin email')
    return NextResponse.json({ received: true })
  }

  const result = await upsertUserByStripeIdentity({
    email: emailNorm,
    customerId,
    subscriptionStatus: 'active',
    isPremium: true,
  })
  if (!result.ok) {
    console.error('[stripe webhook] activate checkout', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  if (session.subscription) {
    const subscriptionId = typeof session.subscription === 'string' ? session.subscription : session.subscription.id
    if (subscriptionId) {
      await upsertSubscriptionRecord({
        email: emailNorm,
        customerId,
        subscriptionId,
        status: 'active',
      })
    }
  }

  return NextResponse.json({ received: true })
}

async function deactivatePremiumForSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
  if (!customerId) {
    return NextResponse.json({ received: true })
  }

  const result = await upsertUserByStripeIdentity({
    customerId,
    subscriptionStatus: 'canceled',
    isPremium: false,
  })
  if (!result.ok) {
    console.error('[stripe webhook] subscription deleted', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }

  const subEmail = normalizeEmail(sub.metadata?.app_user_email as string | undefined)
  if (sub.id && subEmail) {
    await upsertSubscriptionRecord({
      email: subEmail,
      customerId,
      subscriptionId: sub.id,
      status: 'canceled',
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    })
  }

  return NextResponse.json({ received: true })
}

async function syncPremiumForSubscription(sub: Stripe.Subscription) {
  const customerId = typeof sub.customer === 'string' ? sub.customer : sub.customer?.id
  if (!customerId) return NextResponse.json({ received: true })

  const emailNorm = normalizeEmail(
    (sub.metadata?.app_user_email as string | undefined) ||
      (typeof sub.customer === 'object' && 'email' in sub.customer ? (sub.customer.email as string | null) : null)
  )
  const status = sub.status
  const result = await upsertUserByStripeIdentity({
    email: emailNorm || undefined,
    customerId,
    subscriptionStatus: status,
    isPremium: isPremiumFromStripeStatus(status),
  })
  if (!result.ok) {
    console.error('[stripe webhook] subscription updated', result.error)
    return NextResponse.json({ error: result.error }, { status: 500 })
  }
  if (sub.id && emailNorm) {
    await upsertSubscriptionRecord({
      email: emailNorm,
      customerId,
      subscriptionId: sub.id,
      status,
      cancelAtPeriodEnd: sub.cancel_at_period_end,
    })
  }
  return NextResponse.json({ received: true })
}

export async function POST(request: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  if (!stripe || !secret) {
    return NextResponse.json({ error: 'Webhook no configurado' }, { status: 503 })
  }

  const body = await request.text()
  const sig = request.headers.get('stripe-signature')
  if (!sig) {
    return NextResponse.json({ error: 'Sin firma' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, secret)
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Firma inválida'
    return NextResponse.json({ error: msg }, { status: 400 })
  }

  try {
    if (await alreadyProcessedEvent(event.id, event.type)) {
      return NextResponse.json({ received: true, duplicate: true })
    }
    switch (event.type) {
      case 'checkout.session.completed':
        return await activatePremiumForCheckoutSession(event.data.object as Stripe.Checkout.Session)
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        return await syncPremiumForSubscription(event.data.object as Stripe.Subscription)
      case 'customer.subscription.deleted':
        return await deactivatePremiumForSubscription(event.data.object as Stripe.Subscription)
      case 'invoice.paid':
      case 'invoice.payment_succeeded':
        await insertPaymentFromInvoice(event.data.object as Stripe.Invoice)
        return NextResponse.json({ received: true })
      default:
        return NextResponse.json({ received: true })
    }
  } catch (e) {
    console.error('[stripe webhook]', e)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}
