'use client'

import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_KEY, isCookieDecisionStored, type CookieConsentValue } from '@/lib/cookie-consent'

/**
 * Consentimiento RGPD. No afecta cookies técnicas (sesión Supabase / Next).
 * Futuro: cargar scripts no esenciales solo si `accepted` (ver hasAnalyticsCookieConsent).
 */
export default function CookieBanner() {
  const [visible, setVisible] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    try {
      const v = localStorage.getItem(COOKIE_CONSENT_KEY)
      setVisible(!isCookieDecisionStored(v))
    } catch {
      setVisible(true)
    } finally {
      setReady(true)
    }
  }, [])

  const setConsent = (value: CookieConsentValue) => {
    try {
      localStorage.setItem(COOKIE_CONSENT_KEY, value)
    } catch {}
    setVisible(false)
  }

  if (!ready || !visible) return null

  return (
    <div
      className="fixed z-[100] left-0 right-0 bottom-16 md:bottom-0 pointer-events-auto px-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] pt-0"
      role="dialog"
      aria-label="Cookies"
    >
      <div className="max-w-4xl mx-auto rounded-2xl border border-dark-border bg-dark-surface/95 backdrop-blur-md shadow-2xl px-4 py-3 sm:px-5 sm:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <p className="text-text-secondary text-xs sm:text-sm text-center sm:text-left leading-relaxed">
          Usamos cookies para mejorar la experiencia
        </p>
        <div className="flex flex-wrap items-center justify-center sm:justify-end gap-2 shrink-0">
          <button
            type="button"
            onClick={() => setConsent('rejected')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-text-secondary border border-dark-border hover:bg-dark-primary/80 transition-colors"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => setConsent('accepted')}
            className="px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-white bg-accent-blue hover:bg-accent-blue-hover transition-colors"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
