'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { BookOpen, QrCode, Brain, Sparkles, ChevronRight, Star, Package, Mail, Check, ShoppingCart } from 'lucide-react'

const chapters = [
  { num: 1, title: 'Tu cerebro en piloto automático', meditation: 'Presencia inicial' },
  { num: 2, title: 'La tiranía del pensamiento', meditation: 'Observación de pensamientos' },
  { num: 3, title: 'El sistema nervioso: amigo o enemigo', meditation: 'Regulación vagal' },
  { num: 4, title: 'Neuroplasticidad: reescribe tu mente', meditation: 'Visualización de cambio' },
  { num: 5, title: 'La red neuronal por defecto (DMN)', meditation: 'Silenciar la DMN' },
  { num: 6, title: 'Meditación basada en evidencia', meditation: 'Atención focalizada' },
  { num: 7, title: 'El secuestro amigdalino', meditation: 'Calma amigdalina' },
  { num: 8, title: 'Ondas cerebrales y estados de conciencia', meditation: 'Ondas alfa guiadas' },
  { num: 9, title: 'El ego: una ilusión útil', meditation: 'Desidentificación' },
  { num: 10, title: 'Compasión y circuitos neuronales', meditation: 'Compasión radical' },
  { num: 11, title: 'Flow: el estado óptimo', meditation: 'Entrada al flow' },
  { num: 12, title: 'Despertar - más allá del cerebro', meditation: 'Consciencia pura' },
]

const bundles = [
  { name: 'Libro digital (PDF)', price: '14,99', icon: BookOpen, color: 'text-accent-blue', border: 'border-accent-blue/20', best: false },
  { name: 'Libro físico', price: '24,99', sub: 'Envío incluido España', icon: Package, color: 'text-cyan-400', border: 'border-cyan-500/20', best: false },
  { name: 'Bundle: Libro + 3 meses Premium', price: '39,99', icon: Sparkles, color: 'text-violet-400', border: 'border-violet-500/30', best: true },
]

export default function LibroPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [selected, setSelected] = useState(2)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email.trim()) setSent(true)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-violet-600 top-10 -right-32" />
      <div className="orb w-72 h-72 bg-cyan-600 top-[600px] -left-28" />
      <div className="orb w-64 h-64 bg-purple-600 top-[1400px] right-0" />

      {/* Hero */}
      <section className="pt-10 md:pt-20 pb-8">
        <Container>
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6 animate-fade-in">
              <BookOpen className="w-4 h-4 text-accent-blue" />
              <span className="text-accent-blue text-sm font-medium">El Libro</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 animate-fade-in">
              Neuro<span className="gradient-text">Conciencia</span>
            </h1>
            <p className="text-text-secondary text-lg md:text-xl max-w-xl mx-auto animate-fade-in-up">
              Despierta tu cerebro dormido
            </p>
            <p className="text-text-muted text-sm mt-2 animate-fade-in-up">por Berzosa</p>
          </div>
        </Container>
      </section>

      {/* Book Cover Mockup */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <div className="flex justify-center">
              <div className="glass rounded-3xl p-8 w-64 md:w-72 aspect-[3/4] flex flex-col items-center justify-between border border-violet-500/20 bg-gradient-to-br from-violet-900/30 via-dark-surface to-cyan-900/20 shadow-[0_0_60px_rgba(124,58,237,0.15)]">
                <div className="text-center pt-4">
                  <Brain className="w-12 h-12 text-violet-400 mx-auto mb-4 neural-pulse" />
                  <h2 className="font-heading text-xl font-bold text-white leading-tight">Neuro</h2>
                  <h2 className="font-heading text-xl font-bold gradient-text leading-tight">Conciencia</h2>
                </div>
                <div className="text-center">
                  <p className="text-text-muted text-[10px] tracking-widest uppercase mb-1">Despierta tu cerebro dormido</p>
                  <div className="w-8 h-px bg-violet-500/40 mx-auto mb-2" />
                  <p className="text-text-secondary text-xs font-medium">Berzosa</p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Description */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 border border-violet-500/10 text-center max-w-2xl mx-auto">
              <Sparkles className="w-6 h-6 text-violet-400 mx-auto mb-3" />
              <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                12 capítulos. Cada uno con un código QR que conecta con la meditación correspondiente en la app.
                Ciencia + práctica en tus manos.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Chapters */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white mb-5 text-center">Capítulos</h2>
          </FadeInSection>
          <div className="grid md:grid-cols-2 gap-2.5 max-w-3xl mx-auto">
            {chapters.map((ch) => (
              <FadeInSection key={ch.num}>
                <div className="glass rounded-2xl p-4 flex items-center gap-3 card-hover">
                  <div className="w-9 h-9 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <span className="text-violet-400 text-sm font-bold">{ch.num}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{ch.title}</p>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <QrCode className="w-3 h-3 text-text-muted shrink-0" />
                      <p className="text-text-muted text-xs truncate">{ch.meditation}</p>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                </div>
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Bundle Pricing */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white mb-2 text-center">Elige tu formato</h2>
            <p className="text-text-muted text-sm text-center mb-6">Invierte en tu despertar</p>
          </FadeInSection>
          <div className="grid md:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {bundles.map((b, i) => (
              <FadeInSection key={b.name}>
                <button
                  onClick={() => setSelected(i)}
                  className={`relative w-full glass rounded-3xl p-5 text-left transition-all active:scale-[0.98] ${
                    selected === i ? `border ${b.border} bg-white/[0.02]` : 'border border-transparent'
                  }`}
                >
                  {b.best && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 bg-gradient-to-r from-violet-500 to-purple-600 text-white text-[10px] font-bold rounded-full whitespace-nowrap">
                      MEJOR VALOR
                    </div>
                  )}
                  <div className={`w-10 h-10 rounded-xl ${b.best ? 'bg-violet-500/10' : 'bg-white/5'} flex items-center justify-center mb-3`}>
                    <b.icon className={`w-5 h-5 ${b.color}`} />
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">{b.name}</p>
                  {b.sub && <p className="text-text-muted text-[10px] mb-2">{b.sub}</p>}
                  <p className="font-heading text-2xl font-bold text-white">{b.price}<span className="text-sm text-text-muted ml-0.5">&euro;</span></p>
                  {selected === i && (
                    <div className="absolute top-4 right-4 w-5 h-5 rounded-full bg-accent-blue flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </button>
              </FadeInSection>
            ))}
          </div>
          <FadeInSection>
            <div className="max-w-3xl mx-auto mt-5">
              <button className="w-full py-4 rounded-2xl bg-accent-blue text-white font-heading font-bold text-sm flex items-center justify-center gap-2 active:scale-[0.98] transition-transform glow-blue">
                <ShoppingCart className="w-4 h-4" />
                Reservar — {bundles[selected].price}&euro;
              </button>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Author */}
      <section className="pb-10">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 border border-violet-500/10 max-w-2xl mx-auto">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center shrink-0">
                  <Star className="w-7 h-7 text-violet-400" />
                </div>
                <div>
                  <h3 className="font-heading text-lg font-bold text-white">Berzosa</h3>
                  <p className="text-text-muted text-xs">Autor &middot; Neurocientífico &middot; Meditador</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Investigador en neurociencia contemplativa con más de 15 años de práctica meditativa.
                Combina la evidencia científica con la experiencia directa para crear un puente entre
                el laboratorio y la consciencia. Creador del Método N.E.U.R.O. y la plataforma Berzosa Neuro.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Pre-order CTA */}
      <section className="pb-16">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 md:p-8 border border-violet-500/10 text-center max-w-lg mx-auto">
              <Mail className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <h3 className="font-heading text-lg font-bold text-white mb-1">Lista de espera</h3>
              <p className="text-text-muted text-xs mb-5">
                Sé el primero en recibir el libro. Sin compromiso.
              </p>
              {sent ? (
                <div className="flex items-center justify-center gap-2 py-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <p className="text-emerald-400 text-sm font-medium">Te avisaremos al lanzamiento</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex gap-2">
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="flex-1 px-4 py-3 rounded-2xl bg-white/5 border border-dark-border text-white text-sm placeholder:text-text-muted focus:outline-none focus:border-accent-blue/40 transition-colors"
                  />
                  <button
                    type="submit"
                    className="px-5 py-3 rounded-2xl bg-accent-blue text-white text-sm font-semibold active:scale-95 transition-transform glow-blue shrink-0"
                  >
                    Reservar
                  </button>
                </form>
              )}
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
