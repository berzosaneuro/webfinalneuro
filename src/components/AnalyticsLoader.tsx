'use client'

import Script from 'next/script'
import { useEffect, useState } from 'react'
import { COOKIE_CONSENT_KEY, hasAnalyticsCookieConsent } from '@/lib/cookie-consent'

/**
 * Carga GA4 solo tras consentimiento `accepted` en localStorage.
 * Si el usuario elige "rechazar", no se cargan scripts (polling se detiene).
 * Sin `NEXT_PUBLIC_GA_ID` no se inyecta nada (evita peticiones a G-XXXX).
 */
export default function AnalyticsLoader() {
  const [consented, setConsented] = useState(false)
  const gaId = process.env.NEXT_PUBLIC_GA_ID?.trim()

  useEffect(() => {
    const decide = (): 'done' | 'wait' => {
      try {
        const v = localStorage.getItem(COOKIE_CONSENT_KEY)
        if (v === 'rejected') return 'done'
        if (v === 'accepted' || hasAnalyticsCookieConsent()) {
          setConsented(true)
          return 'done'
        }
      } catch {
        return 'done'
      }
      return 'wait'
    }

    if (decide() === 'done') return
    const id = window.setInterval(() => {
      if (decide() === 'done') clearInterval(id)
    }, 400)
    return () => clearInterval(id)
  }, [])

  if (!consented || !gaId) return null

  return (
    <>
      <Script
        id="ga4-src"
        src={`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaId)}`}
        strategy="afterInteractive"
      />
      <Script id="ga4-config" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', ${JSON.stringify(gaId)});
        `}
      </Script>
    </>
  )
}
