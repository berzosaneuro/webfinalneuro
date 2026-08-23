export const COOKIE_CONSENT_KEY = 'cookie_consent' as const

export type CookieConsentValue = 'accepted' | 'rejected'

export function isCookieDecisionStored(v: string | null): v is CookieConsentValue {
  return v === 'accepted' || v === 'rejected'
}

/** Analytics / marketing: solo si el usuario aceptó (Supabase auth no depende de esto). */
export function hasAnalyticsCookieConsent(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(COOKIE_CONSENT_KEY) === 'accepted'
  } catch {
    return false
  }
}
