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

export type StripeProduct = 'premium' | 'mentoria'

/** Price ID por producto; nunca hardcodeado. null si falta la env var correspondiente. */
export function getPriceIdForProduct(product: StripeProduct): string | null {
  const key = product === 'mentoria' ? process.env.STRIPE_MENTORIA_PRICE_ID : process.env.STRIPE_PREMIUM_PRICE_ID
  return key?.trim() || null
}

export function isStripeProduct(value: unknown): value is StripeProduct {
  return value === 'premium' || value === 'mentoria'
}
