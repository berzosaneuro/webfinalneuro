'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Check, X, Crown, Sparkles, Brain, Star, Clock, Loader2 } from 'lucide-react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { useUser } from '@/context/UserContext'
import { useSubscription } from '@/hooks/useSubscription'

const tiers = [
  {
    name: 'Gratis',
    price: '0',
    period: '/siempre',
    description: 'Entrada al método, sin tarjeta',
    icon: Brain,
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    soon: false,
    features: [
      { name: 'Test de ruido mental: tu línea base en minutos', included: true },
      { name: 'Método N.E.U.R.O. completo, en texto claro', included: true },
      { name: '10 meditaciones para cortar el piloto automático', included: true },
      { name: 'Temporizador y SOS respiración', included: true },
      { name: 'Biblioteca de lecturas breves', included: true },
      { name: 'NeuroScore y diario en versión base', included: true },
      { name: 'Catálogo completo de meditaciones profundas', included: false },
      { name: 'Programa 21 días guiado día a día', included: false },
      { name: 'Retos semanales en la app', included: false },
      { name: 'Masterclass en vídeo', included: false },
      { name: 'NeuroPodcast y sonidos extra', included: false },
      { name: 'IA Coach', included: false },
      { name: 'Círculos y comunidad avanzada', included: false },
      { name: 'Sesiones grupales en vivo', included: false },
    ],
  },
  {
    name: 'Premium',
    price: '4,99',
    period: '/mes',
    description: 'Hábito sostenido, contenido completo',
    icon: Crown,
    color: 'text-[#0066FF]',
    bgColor: 'bg-[#0066FF]/10',
    popular: true,
    soon: false,
    features: [
      { name: 'Todo el plan Gratis', included: true },
      { name: 'Meditaciones ampliadas para profundizar', included: true },
      { name: 'Programa 21 días: un paso cada día, sin saltos', included: true },
      { name: 'Retos semanales integrados', included: true },
      { name: 'Masterclass en vídeo', included: true },
      { name: 'NeuroPodcast', included: true },
      { name: 'IA Coach', included: true },
      { name: 'Círculos de práctica', included: true },
      { name: 'NeuroScore y registro de constancia', included: true },
      { name: 'Diario con resumen asistido (IA)', included: true },
      { name: 'Sonidos y recursos extra', included: true },
      { name: 'App sin anuncios', included: true },
      { name: 'Llamadas grupales en vivo', included: false },
      { name: 'Sesión individual mensual con Berzosa', included: false },
    ],
  },
  {
    name: 'Mentoría',
    price: '49,99',
    period: '/mes',
    description: 'Acompañamiento directo',
    icon: Star,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    soon: true,
    features: [
      { name: 'Todo Premium incluido', included: true },
      { name: 'Seguimiento del programa 21 días', included: true },
      { name: 'Cuatro encuentros grupales al mes en vivo', included: true },
      { name: 'Una sesión individual al mes con Berzosa', included: true },
      { name: 'IA Coach con contexto de tu progreso', included: true },
      { name: 'Grupo privado entre sesiones', included: true },
      { name: 'Lectura de diario con mirada de mentor', included: true },
      { name: 'Prácticas adaptadas a tu ritmo', included: true },
      { name: 'Certificación a mitad de precio', included: true },
      { name: 'Acceso anticipado a novedades de la app', included: true },
      { name: 'Insignia Mentoría en la comunidad', included: true },
      { name: 'Material extra mensual para el grupo', included: true },
      { name: 'Prioridad en Círculos', included: true },
      { name: 'Canal de respuesta prioritaria', included: true },
    ],
  },
]

export default function PlanesPage() {
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [verifyingPayment, setVerifyingPayment] = useState(false)
  const [portalLoading, setPortalLoading] = useState(false)
  const { user } = useUser()
  const { isPremium, refreshSubscription, syncing, subscriptionStatus } = useSubscription()

  useEffect(() => {
    if (typeof window === 'undefined') return
    const p = new URLSearchParams(window.location.search)
    if (p.get('checkout') === 'success') {
      setVerifyingPayment(true)
      let cancelled = false
      const retries = [0, 1000, 1000, 1000, 1000]

      const run = async () => {
        for (const waitMs of retries) {
          if (waitMs > 0) {
            await new Promise((resolve) => setTimeout(resolve, waitMs))
          }
          const premium = await refreshSubscription()
          if (cancelled) return
          if (premium) break
        }
        if (!cancelled) {
          setVerifyingPayment(false)
          window.history.replaceState({}, '', '/planes')
        }
      }

      void run()
      return () => {
        cancelled = true
      }
    }
  }, [refreshSubscription])

  const startPremiumCheckout = async () => {
    if (!user?.email?.trim()) {
      window.location.href = '/acceder'
      return
    }
    setCheckoutLoading(true)
    try {
      const res = await fetch('/api/stripe/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email.trim() }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
        return
      }
      window.alert(data.error || 'No se pudo iniciar el pago. Revisa la configuración.')
    } catch {
      window.alert('Error de conexión. Inténtalo de nuevo.')
    } finally {
      setCheckoutLoading(false)
    }
  }

  const openBillingPortal = async () => {
    setPortalLoading(true)
    try {
      const res = await fetch('/api/stripe/billing-portal', { method: 'POST' })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
        return
      }
      window.alert(data.error || 'No se pudo abrir la gestión de suscripción.')
    } catch {
      window.alert('Error de conexión al abrir facturación.')
    } finally {
      setPortalLoading(false)
    }
  }

  return (
    <div className="bg-dark-primary py-12 md:py-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent-blue top-20 left-1/2 -translate-x-1/2" />

      <Container>
        <div className="text-center mb-12 md:mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <span className="text-accent-blue text-sm font-medium">Elige tu nivel de acompañamiento</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Menos <span className="gradient-text">ruido</span>, más método
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            Gratis para empezar. Premium para el hábito completo. Mentoría cuando quieres cercanía directa.
          </p>

          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)' }}>
            <Clock className="w-4 h-4 text-amber-400" />
            <span className="text-amber-200/90">Mentoría: lista de espera — Premium disponible con suscripción mensual</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
          {tiers.map((tier) => (
            <FadeInSection key={tier.name}>
              <div className={`relative rounded-3xl p-6 md:p-8 border transition-all h-full flex flex-col overflow-visible ${
                tier.popular
                  ? 'border-[#0066FF]/40 bg-dark-surface ring-1 ring-[#0066FF]/20'
                  : 'border-dark-border bg-dark-surface/50 hover:border-white/10'
              } ${(tier.popular || tier.soon || (tier.name === 'Premium' && !tier.soon && !isPremium)) ? 'pt-12 md:pt-14' : ''}`}>
                {tier.popular && (
                  <div className="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-full z-20 whitespace-nowrap">
                    Más popular
                  </div>
                )}
                {tier.soon && (
                  <div className="absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 z-20 whitespace-nowrap max-w-[calc(100%-1.5rem)]" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                    <Clock className="w-3 h-3" /> Próximamente
                  </div>
                )}
                {tier.name === 'Premium' && !tier.soon && !isPremium && (
                  <div className="absolute top-10 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 z-20 whitespace-nowrap max-w-[calc(100%-1.5rem)]">
                    Suscripción mensual
                  </div>
                )}

                <div className="flex items-center gap-3 mb-4 mt-1">
                  <div className={`w-12 h-12 rounded-xl ${tier.bgColor} flex items-center justify-center`}>
                    <tier.icon className={`w-6 h-6 ${tier.color}`} />
                  </div>
                  <div>
                    <h2 className="font-heading text-xl font-bold text-white">{tier.name}</h2>
                    <p className="text-text-secondary text-xs">{tier.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">{tier.price} &euro;</span>
                  <span className="text-text-secondary ml-1 text-sm">{tier.period}</span>
                </div>

                <ul className="space-y-2.5 mb-8 flex-1">
                  {tier.features.map((f) => (
                    <li key={f.name} className="flex items-start gap-2.5">
                      {f.included ? (
                        <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      ) : (
                        <X className="w-4 h-4 text-white/10 mt-0.5 shrink-0" />
                      )}
                      <span className={`text-sm ${f.included ? 'text-text-primary' : 'text-white/20'}`}>{f.name}</span>
                    </li>
                  ))}
                </ul>

                {!tier.soon && tier.name === 'Gratis' ? (
                  <div className="w-full py-3 rounded-xl bg-accent-blue/15 text-accent-blue font-bold text-center text-sm">
                    Plan actual
                  </div>
                ) : !tier.soon && tier.name === 'Premium' ? (
                  isPremium ? (
                    <div className="w-full py-3 rounded-xl bg-emerald-500/15 text-emerald-400 font-bold text-center text-sm border border-emerald-500/20">
                      Ya eres Premium
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => void startPremiumCheckout()}
                      disabled={checkoutLoading || syncing || verifyingPayment}
                      className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform bg-[#0066FF] text-white disabled:opacity-60"
                    >
                      {checkoutLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <Crown className="w-4 h-4" />
                          Pasar a Premium
                        </>
                      )}
                    </button>
                  )
                ) : (
                  <button
                    type="button"
                    disabled
                    className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#94A3B8' }}
                  >
                    <Clock className="w-4 h-4" />
                    Próximamente
                  </button>
                )}
                {!tier.soon && tier.name === 'Premium' && !isPremium && !user?.email && (
                  <p className="text-center text-text-muted text-xs mt-2">
                    <Link href="/acceder" className="text-accent-blue hover:underline">
                      Accede con tu email
                    </Link>{' '}
                    para suscribirte.
                  </p>
                )}
              </div>
            </FadeInSection>
          ))}
        </div>

        <p className="text-center text-text-muted text-xs mt-8 max-w-lg mx-auto">
          Pago seguro con Stripe. La suscripción se renueva cada mes hasta que la canceles en Stripe.
        </p>
        {isPremium && (
          <div className="mt-4 flex justify-center">
            <button
              type="button"
              onClick={() => void openBillingPortal()}
              disabled={portalLoading}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-white/5 border border-white/10 text-text-secondary hover:text-white disabled:opacity-60"
            >
              {portalLoading ? 'Abriendo facturación...' : 'Gestionar suscripción / facturación'}
            </button>
          </div>
        )}
        {(verifyingPayment || syncing) && (
          <p className="text-center text-amber-300 text-xs mt-3">
            Confirmando tu suscripción ({subscriptionStatus || 'pendiente'})... si tarda unos segundos es normal.
          </p>
        )}
      </Container>
    </div>
  )
}
