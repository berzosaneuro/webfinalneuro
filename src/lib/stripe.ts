import Stripe from 'stripe'

let _stripe: Stripe | null = null

/** Cliente Stripe servidor; null si falta STRIPE_SECRET_KEY */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY
  if (!key) return null
  if (!_stripe) {
    _stripe = new Stripe(key, { typescript: true })
  }
  return _stripe
}
