'use client'

import { useState } from 'react'
import { Check, X, Crown, Sparkles, Brain, Star, Clock, Mail, ArrowRight, Loader2 } from 'lucide-react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'

const tiers = [
  {
    name: 'Gratis',
    price: '0',
    period: '/siempre',
    description: 'Para empezar tu camino',
    icon: Brain,
    color: 'text-accent-blue',
    bgColor: 'bg-accent-blue/10',
    soon: false,
    features: [
      { name: 'Test de ruido mental', included: true },
      { name: 'Método N.E.U.R.O. completo', included: true },
      { name: '10 meditaciones gratuitas', included: true },
      { name: 'Timer de presencia', included: true },
      { name: 'Modo SOS básico', included: true },
      { name: 'Biblioteca (2 artículos)', included: true },
      { name: '15 meditaciones premium', included: false },
      { name: 'Programa 21 Días', included: false },
      { name: 'Retos semanales', included: false },
      { name: 'Masterclasses en video', included: false },
      { name: 'NeuroPodcast completo', included: false },
      { name: 'IA Coach ilimitado', included: false },
      { name: 'Círculos de consciencia', included: false },
      { name: 'Llamadas grupales', included: false },
    ],
  },
  {
    name: 'Premium',
    price: '4,99',
    period: '/mes',
    description: 'Acceso completo a todo',
    icon: Crown,
    color: 'text-[#0066FF]',
    bgColor: 'bg-[#0066FF]/10',
    popular: true,
    soon: true,
    features: [
      { name: 'Todo lo de Gratis', included: true },
      { name: '15 meditaciones premium', included: true },
      { name: 'Programa 21 Días completo', included: true },
      { name: 'Retos semanales', included: true },
      { name: 'Masterclasses en video', included: true },
      { name: 'NeuroPodcast completo', included: true },
      { name: 'IA Coach ilimitado', included: true },
      { name: 'Círculos de consciencia', included: true },
      { name: 'Ranking y logros', included: true },
      { name: 'Diario con análisis IA', included: true },
      { name: 'Sonidos ambientales premium', included: true },
      { name: 'Sin publicidad', included: true },
      { name: 'Llamadas grupales en vivo', included: false },
      { name: 'Sesión 1-a-1 mensual con Berzosa', included: false },
    ],
  },
  {
    name: 'Mentoría',
    price: '49,99',
    period: '/mes',
    description: 'Acceso directo a Berzosa',
    icon: Star,
    color: 'text-rose-400',
    bgColor: 'bg-rose-500/10',
    soon: true,
    features: [
      { name: 'Todo lo de Premium', included: true },
      { name: 'Programa 21 días con seguimiento', included: true },
      { name: 'Llamadas grupales en vivo (4/mes)', included: true },
      { name: 'Sesión 1-a-1 mensual con Berzosa', included: true },
      { name: 'IA Coach con memoria de sesión', included: true },
      { name: 'Grupo privado de WhatsApp', included: true },
      { name: 'Revisión personalizada del diario', included: true },
      { name: 'Plan de meditación a medida', included: true },
      { name: 'Descuento 50% en certificación', included: true },
      { name: 'Acceso anticipado a nuevas funciones', included: true },
      { name: 'Insignia exclusiva de Mentoría', included: true },
      { name: 'Contenido exclusivo mensual', included: true },
      { name: 'Prioridad en Círculos', included: true },
      { name: 'Soporte prioritario 24h', included: true },
    ],
  },
]

function WaitlistModal({ tier, onClose }: { tier: typeof tiers[0]; onClose: () => void }) {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, fuente: `waitlist-${tier.name.toLowerCase()}` }),
      })
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
    } catch {}
    setSent(true)
    setLoading(false)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-3xl p-6 animate-scale-in"
        style={{ background: '#0F1423', border: '1px solid rgba(255,255,255,0.08)' }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-center mb-5">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'rgba(0,102,255,0.12)' }}>
            <Clock className="w-8 h-8 text-[#0066FF]" />
          </div>
          <h2 className="font-heading font-black text-white text-xl mb-1">Próximamente</h2>
          <p className="text-text-secondary text-sm">
            El plan <strong className="text-white">{tier.name}</strong> se lanza muy pronto.<br />
            Apúntate y sé el primero en acceder.
          </p>
        </div>

        {sent ? (
          <div className="text-center py-4">
            <div className="w-12 h-12 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-green-400" />
            </div>
            <p className="text-white font-semibold mb-1">¡Anotado!</p>
            <p className="text-text-secondary text-sm">Te avisamos en cuanto esté disponible.</p>
            <button onClick={onClose} className="mt-4 text-text-muted text-sm underline">Cerrar</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-3">
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Tu email"
                className="w-full pl-10 pr-4 py-3 rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-blue transition-colors"
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
              />
            </div>
            <button
              type="submit"
              disabled={!email.trim() || loading}
              className="w-full py-3 rounded-xl bg-[#0066FF] text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-50"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Unirme a la lista <ArrowRight className="w-4 h-4" /></>}
            </button>
            <button type="button" onClick={onClose} className="text-text-muted text-xs text-center">
              Cancelar
            </button>
          </form>
        )}
      </div>
    </div>
  )
}

export default function PlanesPage() {
  const [waitlistTier, setWaitlistTier] = useState<typeof tiers[0] | null>(null)

  return (
    <div className="bg-dark-primary py-12 md:py-20 relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent-blue top-20 left-1/2 -translate-x-1/2" />

      {waitlistTier && <WaitlistModal tier={waitlistTier} onClose={() => setWaitlistTier(null)} />}

      <Container>
        <div className="text-center mb-12 md:mb-16 relative">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-accent-blue" />
            <span className="text-accent-blue text-sm font-medium">Elige tu camino</span>
          </div>
          <h1 className="font-heading text-4xl sm:text-5xl font-bold text-white mb-4">
            Invierte en tu <span className="gradient-text">mente</span>
          </h1>
          <p className="text-text-secondary max-w-xl mx-auto text-lg">
            Desde gratis hasta mentoría directa. Tú decides cuánto quieres profundizar.
          </p>

          {/* Coming soon banner */}
          <div className="inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-full text-sm font-medium" style={{ background: 'rgba(0,102,255,0.1)', border: '1px solid rgba(0,102,255,0.2)' }}>
            <Clock className="w-4 h-4 text-[#0066FF]" />
            <span className="text-[#0066FF]">Los planes de pago se abren muy pronto — apúntate a la lista</span>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto relative">
          {tiers.map((tier) => (
            <FadeInSection key={tier.name}>
              <div className={`relative rounded-3xl p-6 md:p-8 border transition-all h-full flex flex-col ${
                tier.popular
                  ? 'border-[#0066FF]/40 bg-dark-surface ring-1 ring-[#0066FF]/20'
                  : 'border-dark-border bg-dark-surface/50 hover:border-white/10'
              }`}>
                {tier.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-full">
                    Más popular
                  </div>
                )}
                {tier.soon && (
                  <div className="absolute -top-3 right-4 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1" style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', color: '#F59E0B' }}>
                    <Clock className="w-3 h-3" /> Próximamente
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

                {!tier.soon ? (
                  <div className="w-full py-3 rounded-xl bg-accent-blue/15 text-accent-blue font-bold text-center text-sm">
                    Plan actual
                  </div>
                ) : (
                  <button
                    onClick={() => setWaitlistTier(tier)}
                    className="w-full py-3.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-transform"
                    style={{ background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.25)', color: '#60a5fa' }}
                  >
                    <Clock className="w-4 h-4" />
                    Avisarme cuando esté disponible
                  </button>
                )}
              </div>
            </FadeInSection>
          ))}
        </div>

        <p className="text-center text-text-muted text-xs mt-8 max-w-lg mx-auto">
          Mientras tanto, disfruta de todas las funciones gratuitas. Los planes de pago se activarán en breve.
        </p>
      </Container>
    </div>
  )
}
