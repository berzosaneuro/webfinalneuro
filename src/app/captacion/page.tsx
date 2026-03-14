'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import {
  Sparkles, Brain, Target, Users, ChevronRight, Star, Shield, Zap,
  ArrowRight, Check, Gift, Crown, TrendingUp, Heart, Eye, Loader2
} from 'lucide-react'
import Link from 'next/link'

const TESTIMONIOS = [
  { nombre: 'Elena R.', texto: 'En 3 semanas dejé de vivir en piloto automático. Ahora estoy presente.', stars: 5 },
  { nombre: 'Marcos T.', texto: 'La app me ayudó a entender mis patrones mentales. Cambió todo.', stars: 5 },
  { nombre: 'Sofía L.', texto: 'Nunca pensé que la neurociencia pudiera ser tan accesible y práctica.', stars: 5 },
  { nombre: 'Javier M.', texto: 'Mi ansiedad bajó un 70% en el primer mes. Datos reales, no promesas.', stars: 5 },
]

export default function CaptacionPage() {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [enviado, setEnviado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [testimonioIdx, setTestimonioIdx] = useState(0)

  const handleSubmit = async () => {
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name: nombre, source: 'captacion' }),
      })
    } catch {
      // Still show success
    }
    setEnviado(true)
    setLoading(false)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-purple-600 top-0 -right-32" />
      <div className="orb w-80 h-80 bg-accent-blue top-[600px] -left-40" />
      <div className="orb w-64 h-64 bg-cyan-600 top-[1200px] right-0" />

      {/* Hero */}
      <section className="pt-8 md:pt-20 pb-8">
        <Container>
          <FadeInSection>
            <div className="text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-500/10 text-purple-400 text-xs font-medium mb-6">
                <Sparkles className="w-3.5 h-3.5" />
                Método científico · Resultados medibles
              </div>
              <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 leading-tight">
                Despierta tu
                <span className="block bg-gradient-to-r from-accent-blue via-purple-400 to-cyan-400 bg-clip-text text-transparent">
                  supraconsciencia
                </span>
              </h1>
              <p className="text-text-secondary text-lg md:text-xl mb-8 leading-relaxed">
                El primer programa que combina neurociencia aplicada, meditación guiada y
                métricas de consciencia para transformar tu mente en 21 días.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  href="/planes"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-accent-blue rounded-2xl text-white font-semibold text-base glow-blue active:scale-95 transition-transform"
                >
                  Empezar gratis <ArrowRight className="w-5 h-5" />
                </Link>
                <Link
                  href="/test"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 glass rounded-2xl text-white font-medium text-base active:scale-95 transition-transform"
                >
                  <Brain className="w-5 h-5" /> Test de ruido mental
                </Link>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Social proof bar */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-2xl p-4 flex items-center justify-around">
              {[
                { value: '2.400+', label: 'Usuarios activos' },
                { value: '94%', label: 'Reducen ansiedad' },
                { value: '21', label: 'Días para resultados' },
                { value: '4.9', label: 'Valoración media' },
              ].map((s) => (
                <div key={s.label} className="text-center">
                  <p className="font-heading text-xl md:text-2xl font-bold text-white">{s.value}</p>
                  <p className="text-text-muted text-[10px] md:text-xs">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* What makes it unique */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-2">
              ¿Por qué Berzosa Neuro es diferente?
            </h2>
            <p className="text-text-secondary text-center mb-8 max-w-lg mx-auto">
              Basado en neurociencia aplicada, neuroplasticidad y metacognición.
            </p>
            <div className="grid md:grid-cols-3 gap-3">
              {[
                {
                  icon: Brain, color: 'text-purple-400', bg: 'bg-purple-500/10',
                  titulo: 'Neurociencia real',
                  desc: 'No meditación genérica. Cada ejercicio está basado en neuroplasticidad, con protocolos que reconectan tu cerebro.',
                },
                {
                  icon: Target, color: 'text-accent-blue', bg: 'bg-accent-blue/10',
                  titulo: 'Métricas de consciencia',
                  desc: 'NeuroScore mide tu progreso real. Sabes exactamente cuánto avanzas cada día con datos, no con sensaciones.',
                },
                {
                  icon: Eye, color: 'text-cyan-400', bg: 'bg-cyan-500/10',
                  titulo: 'Supraconsciencia práctica',
                  desc: 'Técnicas de observador consciente, disolución del ego y despertar vital aplicadas al día a día.',
                },
              ].map((item) => (
                <div key={item.titulo} className="glass rounded-2xl p-5 card-hover">
                  <div className={`w-12 h-12 rounded-xl ${item.bg} flex items-center justify-center mb-4`}>
                    <item.icon className={`w-6 h-6 ${item.color}`} />
                  </div>
                  <h3 className="font-heading text-white font-semibold mb-2">{item.titulo}</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* The method */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-8">
              El método en 4 pilares
            </h2>
            <div className="space-y-3">
              {[
                {
                  num: '01', titulo: 'Observar sin juzgar', icon: Eye, color: 'text-purple-400',
                  desc: 'Aprende a ver tus pensamientos como nubes. La técnica del observador consciente del Método N.E.U.R.O. aplicada con guía paso a paso.',
                },
                {
                  num: '02', titulo: 'Reconexión neuronal', icon: Zap, color: 'text-accent-blue',
                  desc: 'Ejercicios de neuroplasticidad que crean nuevos patrones. 10 minutos al día durante 21 días generan cambios medibles.',
                },
                {
                  num: '03', titulo: 'Medir y ajustar', icon: TrendingUp, color: 'text-green-400',
                  desc: 'NeuroScore te da feedback en tiempo real. Sabes qué funciona y qué ajustar. Ciencia, no fe ciega.',
                },
                {
                  num: '04', titulo: 'Integrar y escalar', icon: Heart, color: 'text-rose-400',
                  desc: 'Lleva la consciencia a cada momento. Trabajo, relaciones, creatividad. Tu vida entera se transforma.',
                },
              ].map((step) => (
                <div key={step.num} className="glass rounded-2xl p-5 flex gap-4 card-hover">
                  <div className="shrink-0">
                    <span className="font-heading text-3xl font-bold text-white/10">{step.num}</span>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <step.icon className={`w-4 h-4 ${step.color}`} />
                      <h3 className="text-white font-semibold">{step.titulo}</h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Testimonials */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-8">
              Lo que dicen nuestros usuarios
            </h2>
            <div className="glass rounded-3xl p-6">
              <div className="flex gap-1 mb-3">
                {Array.from({ length: TESTIMONIOS[testimonioIdx].stars }).map((_, i) => (
                  <Star key={i} className="w-4 h-4 text-cyan-400 fill-cyan-400" />
                ))}
              </div>
              <p className="text-white text-lg leading-relaxed mb-4 italic">
                &ldquo;{TESTIMONIOS[testimonioIdx].texto}&rdquo;
              </p>
              <p className="text-text-secondary text-sm font-medium">
                — {TESTIMONIOS[testimonioIdx].nombre}
              </p>
              <div className="flex gap-2 mt-4">
                {TESTIMONIOS.map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setTestimonioIdx(i)}
                    className={`w-2 h-2 rounded-full transition-all ${
                      i === testimonioIdx ? 'bg-accent-blue w-6' : 'bg-white/20'
                    }`}
                  />
                ))}
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Pricing quick */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl md:text-3xl font-bold text-white text-center mb-2">
              Empieza hoy
            </h2>
            <p className="text-text-secondary text-center mb-8">Sin compromiso. Cancela cuando quieras.</p>
            <div className="grid md:grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-6">
                <h3 className="text-white font-semibold text-lg mb-1">Gratis</h3>
                <p className="text-text-muted text-xs mb-4">Para descubrir el método</p>
                <p className="font-heading text-4xl font-bold text-white mb-5">0€</p>
                <ul className="space-y-2 mb-6">
                  {['Test de ruido mental', '3 meditaciones guiadas', 'Ejercicios básicos', 'Diario de consciencia'].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                      <Check className="w-4 h-4 text-green-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/planes"
                  className="block text-center py-3 rounded-xl border border-white/10 text-white font-medium text-sm active:scale-95 transition-transform"
                >
                  Empezar gratis
                </Link>
              </div>
              <div className="glass rounded-2xl p-6 border border-violet-500/20 relative">
                <div className="absolute -top-3 right-4 px-3 py-1 bg-violet-500/20 text-violet-400 text-xs font-semibold rounded-full flex items-center gap-1">
                  <Crown className="w-3 h-3" /> RECOMENDADO
                </div>
                <h3 className="text-white font-semibold text-lg mb-1">Premium</h3>
                <p className="text-text-muted text-xs mb-4">Acceso completo al método</p>
                <p className="font-heading text-4xl font-bold text-white mb-1">4,99€<span className="text-text-muted text-base font-normal">/mes</span></p>
                <p className="text-green-400 text-xs mb-5">Acceso completo al método</p>
                <ul className="space-y-2 mb-6">
                  {[
                    'Todo lo Gratis +',
                    'Curso 21 Días completo',
                    '40+ meditaciones PRO',
                    'NeuroScore avanzado',
                    'Sonidos binaurales',
                    'Despertar en Vida',
                    'Soporte prioritario',
                  ].map((f) => (
                    <li key={f} className="flex items-center gap-2 text-text-secondary text-sm">
                      <Check className="w-4 h-4 text-violet-400 shrink-0" /> {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/planes"
                  className="block text-center py-3 rounded-xl bg-violet-500/20 text-violet-400 font-semibold text-sm active:scale-95 transition-transform"
                >
                  <Crown className="w-4 h-4 inline mr-1" /> Activar Premium
                </Link>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Lead magnet */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 md:p-8 text-center border border-accent-blue/20">
              <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-5">
                <Gift className="w-8 h-8 text-accent-blue" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-white mb-2">
                Reto gratuito: 7 días de neurociencia aplicada
              </h2>
              <p className="text-text-secondary mb-6 max-w-md mx-auto">
                7 ejercicios prácticos del Método N.E.U.R.O. con la base neurocientífica de cada uno. Gratis al suscribirte.
              </p>

              {!enviado ? (
                <div className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    className="flex-1 px-4 py-3 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                  />
                  <input
                    type="email"
                    placeholder="Tu email *"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={!email.trim() || loading}
                    className="px-6 py-3 bg-accent-blue rounded-xl text-white font-medium text-sm active:scale-95 transition-transform disabled:opacity-40"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Acceder gratis'}
                  </button>
                </div>
              ) : (
                <div className="glass-light rounded-2xl p-5 max-w-md mx-auto">
                  <Check className="w-8 h-8 text-green-400 mx-auto mb-2" />
                  <p className="text-white font-medium">¡Listo!</p>
                  <Link href="/plan-7-dias" className="inline-flex items-center gap-2 mt-3 px-5 py-2.5 bg-accent-blue rounded-xl text-white font-medium text-sm active:scale-95 transition-transform">
                    Empezar el Reto 7 Días <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              )}

              <p className="text-text-muted text-[10px] mt-4">
                <Shield className="w-3 h-3 inline mr-1" />
                Sin spam. Tus datos están protegidos.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
