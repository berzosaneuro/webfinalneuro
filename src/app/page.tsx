'use client'

import Link from 'next/link'
import Image from 'next/image'
import Container from '@/components/Container'
import Card from '@/components/Card'
import FadeInSection from '@/components/FadeInSection'
import { usePremium } from '@/context/PremiumContext'
import { Brain, Headphones, BookOpen, ClipboardCheck, Crosshair, Timer, Moon, Zap, ChevronRight, Crown, Sparkles, Activity, AlertCircle, Flame, Calendar, Dumbbell, PenLine, Trophy, Podcast, GraduationCap, Users, Video, Gift, Bot, ClipboardList } from 'lucide-react'

const quickActions = [
  { href: '/meditacion', label: 'Meditación', icon: Headphones, color: 'bg-blue-500/15 text-blue-400' },
  { href: '/retos', label: 'Retos', icon: Flame, color: 'bg-orange-500/15 text-orange-400' },
  { href: '/plan-7-dias', label: 'Reto 7 Días Gratis', icon: Sparkles, color: 'bg-emerald-500/15 text-emerald-400' },
  { href: '/programa', label: 'Curso 21 Días', icon: Activity, color: 'bg-violet-500/15 text-violet-400' },
  { href: '/ejercicios', label: 'Ejercicios', icon: Dumbbell, color: 'bg-teal-500/15 text-teal-400' },
  { href: '/biblioteca', label: 'Biblioteca', icon: BookOpen, color: 'bg-sky-500/15 text-sky-400' },
  { href: '/sos', label: 'SOS Respira', icon: AlertCircle, color: 'bg-rose-500/15 text-rose-400' },
  { href: '/diario', label: 'Diario', icon: PenLine, color: 'bg-cyan-500/15 text-cyan-400' },
  { href: '/neuroscore', label: 'NeuroScore', icon: ClipboardList, color: 'bg-teal-500/15 text-teal-400' },
]

const moreActions = [
  { href: '/programa', label: 'Curso 21 Días', icon: Calendar, desc: 'Programa completo', color: 'bg-orange-500/15 text-orange-400' },
  { href: '/ejercicios', label: 'Ejercicios', icon: Dumbbell, desc: 'Metacognición interactiva', color: 'bg-emerald-500/15 text-emerald-400' },
  { href: '/diario', label: 'Diario', icon: PenLine, desc: 'Registra tu presencia', color: 'bg-cyan-500/15 text-cyan-400' },
  { href: '/test', label: 'Test Ruido Mental', icon: Brain, desc: 'Mide tu ruido mental', color: 'bg-sky-500/15 text-sky-400' },
]

const meditations = [
  { title: 'Reinicio mental', duration: '5 min', icon: Brain, free: true },
  { title: 'Ansiedad', duration: '8 min', icon: Timer, free: false },
  { title: 'Insomnio', duration: '12 min', icon: Moon, free: false },
  { title: 'Presencia profunda', duration: '10 min', icon: Crosshair, free: false },
]

const neuroSteps = [
  { letter: 'N', text: 'Neutraliza', full: 'Neutraliza el pensamiento' },
  { letter: 'E', text: 'Entrena', full: 'Entrena la atención' },
  { letter: 'U', text: 'Ubícate', full: 'Ubícate en el cuerpo' },
  { letter: 'R', text: 'Regula', full: 'Regula la emoción' },
  { letter: 'O', text: 'Observa', full: 'Observa sin identificarte' },
]

export default function Home() {
  const { isPremium } = usePremium()

  return (
    <div className="relative overflow-hidden">
      {/* Ambient orbs */}
      <div className="orb w-72 h-72 bg-accent-blue top-20 -left-20" />
      <div className="orb w-56 h-56 bg-accent-blue top-96 -right-16" />

      {/* Hero greeting */}
      <section className="relative pt-8 pb-6 md:pt-20 md:pb-16">
        <Container>
          <div className="flex items-center gap-5">
            <div className="flex-1">
              <h1 className="font-heading text-4xl sm:text-5xl md:text-6xl font-black tracking-tight text-white mb-4 animate-fade-in">
                Elimina el ruido de tu mente
              </h1>
              <p className="text-text-secondary text-base md:text-lg animate-fade-in-up max-w-lg">
                Entrenamiento Mental. Basado en neuroplasticidad.
              </p>
            </div>
            <div className="w-24 h-32 sm:w-32 sm:h-44 md:w-44 md:h-60 rounded-2xl overflow-hidden ring-2 ring-accent-blue/25 shrink-0 animate-fade-in shadow-xl">
              <Image
                src="/elias-2.jpg"
                alt="Dr. Berzosa"
                width={176}
                height={240}
                className="w-full h-full object-cover object-top"
                priority
              />
            </div>
          </div>
        </Container>
      </section>

      {/* Banner de registro + regalo reto 7 días */}
      <section className="relative pb-4">
        <Container>
          <Link href="/registro" className="block animate-fade-in-up">
            <div className="rounded-2xl p-4 relative overflow-hidden active:scale-[0.98] transition-transform"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.20), rgba(16,185,129,0.10))' }}>
              <div className="absolute inset-0 border border-accent-blue/25 rounded-2xl" />
              <div className="absolute -top-8 -right-8 w-28 h-28 bg-emerald-500/10 rounded-full" />
              <div className="relative">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/20 flex items-center justify-center shrink-0 mt-0.5">
                    <Gift className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div className="flex-1">
                    <p className="text-white font-bold text-sm leading-tight">Regístrate gratis</p>
                    <p className="text-emerald-400 text-xs font-semibold mt-0.5">🎁 Regalo: Reto de 7 días incluido</p>
                    <p className="text-text-secondary text-xs mt-1">Meditaciones, IA Coach, NeuroScore y más sin coste</p>
                  </div>
                  <div className="shrink-0 px-3 py-1.5 rounded-xl bg-accent-blue text-white text-xs font-bold self-center">
                    Entrar
                  </div>
                </div>
              </div>
            </div>
          </Link>
        </Container>
      </section>

      {/* Quick actions grid */}
      <section className="relative pb-6">
        <Container>
          <div className="grid grid-cols-3 gap-3 animate-fade-in-up">
            {quickActions.map((action) => (
              <Link
                key={action.href}
                href={action.href}
                className="flex flex-col items-center gap-2.5 py-4 rounded-2xl glass-light active:scale-95 transition-transform"
              >
                <div className={`w-13 h-13 rounded-xl ${action.color} flex items-center justify-center`}>
                  <action.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-semibold text-text-secondary text-center leading-tight px-1">{action.label}</span>
              </Link>
            ))}
          </div>
        </Container>
      </section>

      {/* Daily tip card */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-blue/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="w-4 h-4 text-white" />
                  <span className="text-xs font-semibold text-white uppercase tracking-wider">Dato del día</span>
                </div>
                <p className="text-white font-medium text-sm leading-relaxed">
                  Tu cerebro recibe más estímulos en un día que el de tus abuelos en un mes. Entrenar la atención ya no es opcional.
                </p>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* NeuroScore widget */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <Link href="/neuroscore" className="block">
              <div className="glass rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="absolute top-0 right-0 w-28 h-28 bg-green-500/8 rounded-full -translate-y-1/3 translate-x-1/3" />
                <div className="relative flex items-center gap-4">
                  <div className="relative">
                    <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                      <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
                      <circle cx="28" cy="28" r="24" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset={`${2 * Math.PI * 24 * 0.7}`} />
                    </svg>
                    <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">30</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <h3 className="font-heading font-semibold text-white text-base">NeuroScore</h3>
                      <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10">
                        <Flame className="w-3 h-3 text-orange-400" />
                        <span className="text-orange-400 text-[10px] font-bold">0 días</span>
                      </div>
                    </div>
                    <p className="text-text-secondary text-xs">Completa tu entrenamiento diario</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                </div>
              </div>
            </Link>
          </FadeInSection>
        </Container>
      </section>

      {/* Despertar en Vida - Hero CTA */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <Link href="/despertar" className="block">
              <div className="rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
                style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(244,63,94,0.08))' }}>
                <div className="absolute inset-0 border border-white/5 rounded-3xl" />
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-violet-500/10 rounded-full" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-violet-500/20 to-rose-500/20 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-white text-base mb-0.5">Despertar en Vida</h3>
                    <p className="text-text-secondary text-xs">No hace falta morir para despertar</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                </div>
              </div>
            </Link>
          </FadeInSection>
        </Container>
      </section>

      {/* Meditation section */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-white text-lg">Meditaciones</h2>
              <Link href="/meditacion" className="flex items-center gap-1 text-accent-blue text-sm font-medium active:opacity-70">
                Ver todo <ChevronRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'none' }}>
              {meditations.map((m) => (
                <Link
                  key={m.title}
                  href="/meditacion"
                  className="flex-shrink-0 w-36 snap-start"
                >
                  <div className="glass rounded-2xl p-4 h-full active:scale-95 transition-transform">
                    <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center mb-3">
                      <m.icon className="w-5 h-5 text-accent-blue" />
                    </div>
                    <h3 className="font-medium text-white text-sm mb-1">{m.title}</h3>
                    <div className="flex items-center gap-1.5">
                      <span className="text-text-muted text-xs">{m.duration}</span>
                      {!m.free && (
                        <Crown className="w-3 h-3 text-violet-400" />
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Método N.E.U.R.O. — destacado */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <Link href="/metodo" className="block">
              <div className="relative rounded-3xl overflow-hidden active:scale-[0.99] transition-transform" style={{ background: 'linear-gradient(135deg, #050505 0%, #0a0a0a 100%)', border: '1px solid rgba(255,255,255,0.1)' }}>
                {/* Decorative top bar */}
                <div className="h-1 w-full" style={{ background: 'linear-gradient(90deg, #0066FF, #ffffff, #0066FF)' }} />
                <div className="p-5">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <p className="text-white/40 text-[10px] uppercase tracking-widest font-semibold mb-1">La base de todo</p>
                      <h2 className="font-heading font-black text-2xl tracking-tight" style={{ background: 'linear-gradient(90deg, #0066FF, #60a5fa)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Método N.E.U.R.O.</h2>
                    </div>
                    <div className="w-10 h-10 rounded-2xl bg-white/5 flex items-center justify-center border border-white/10">
                      <Brain className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-2 mb-4">
                    {neuroSteps.map((step) => (
                      <div key={step.letter} className="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/4 border border-white/6">
                        <span className="font-heading font-black text-xl leading-none" style={{ color: '#0066FF' }}>{step.letter}</span>
                        <span className="text-white/60 text-[9px] text-center leading-tight">{step.text}</span>
                      </div>
                    ))}
                  </div>
                  <p className="text-white/50 text-xs leading-relaxed mb-3">
                    5 pasos basados en neurociencia para entrenar tu mente y salir del piloto automático.
                  </p>
                  <div className="flex items-center gap-1 text-white text-xs font-semibold">
                    Ver el método completo <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          </FadeInSection>
        </Container>
      </section>

      {/* More tools */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Herramientas</h2>
            <div className="grid grid-cols-2 gap-3">
              {moreActions.map((action) => (
                <Link key={action.href} href={action.href} className="block">
                  <div className="glass rounded-2xl p-4 h-full active:scale-95 transition-transform">
                    <div className={`w-10 h-10 rounded-xl ${action.color} flex items-center justify-center mb-3`}>
                      <action.icon className="w-5 h-5" />
                    </div>
                    <h3 className="font-medium text-white text-sm mb-0.5">{action.label}</h3>
                    <p className="text-text-muted text-xs">{action.desc}</p>
                  </div>
                </Link>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Test CTA */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <Link href="/test" className="block">
              <div className="glass rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="absolute bottom-0 right-0 w-24 h-24 bg-purple-500/10 rounded-full translate-y-1/2 translate-x-1/2" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/15 flex items-center justify-center shrink-0">
                    <ClipboardCheck className="w-6 h-6 text-purple-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-white text-base mb-0.5">Test de ruido mental</h3>
                    <p className="text-text-secondary text-xs">Descubre tu nivel en 2 minutos</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                </div>
              </div>
            </Link>
          </FadeInSection>
        </Container>
      </section>

      {/* New features grid */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Explora</h2>
            <div className="grid grid-cols-3 gap-3">
              {[
                { href: '/retos', label: 'Retos', icon: Trophy, color: 'bg-emerald-500/15 text-emerald-400' },
                { href: '/masterclass', label: 'Masterclass', icon: Video, color: 'bg-violet-500/15 text-violet-400' },
                { href: '/podcast', label: 'NeuroPodcast', icon: Podcast, color: 'bg-rose-500/15 text-rose-400' },
                { href: '/circulos', label: 'Círculos', icon: Users, color: 'bg-teal-500/15 text-teal-400' },
                { href: '/leaderboard', label: 'Ranking', icon: Trophy, color: 'bg-emerald-500/15 text-emerald-400' },
                { href: '/referidos', label: 'Referidos', icon: Gift, color: 'bg-pink-500/15 text-pink-400' },
              ].map((item) => (
                <Link key={item.href} href={item.href} className="block">
                  <div className="glass rounded-2xl p-3 text-center active:scale-95 transition-transform">
                    <div className={`w-10 h-10 rounded-xl ${item.color} flex items-center justify-center mx-auto mb-2`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <span className="text-text-secondary text-xs font-medium">{item.label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Historias de transformación CTA */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <Link href="/historias" className="block">
              <div className="glass rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform">
                <div className="absolute -top-8 -right-8 w-32 h-32 bg-emerald-500/10 rounded-full" />
                <div className="relative flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                    <Sparkles className="w-6 h-6 text-emerald-400" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-white text-base mb-0.5">Historias de transformación</h3>
                    <p className="text-text-secondary text-xs">Personas reales con NeuroScore verificado</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                </div>
              </div>
            </Link>
          </FadeInSection>
        </Container>
      </section>

      {/* Premium banner */}
      {!isPremium && (
        <section className="relative pb-8">
          <Container>
            <FadeInSection>
              <Link href="/planes" className="block">
                <div className="rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
                  style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.12), rgba(0,82,204,0.08))' }}>
                  <div className="absolute inset-0 border border-[#0066FF]/15 rounded-3xl" />
                  <div className="relative flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-[#0066FF]/15 flex items-center justify-center shrink-0">
                      <Crown className="w-6 h-6 text-[#0066FF]" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-heading font-semibold text-white text-base mb-0.5">Desbloquea Premium</h3>
                      <p className="text-text-secondary text-xs">Todas las meditaciones y artículos por 4,99 &euro;/mes</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                  </div>
                </div>
              </Link>
            </FadeInSection>
          </Container>
        </section>
      )}
    </div>
  )
}
