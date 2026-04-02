'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import Link from 'next/link'
import {
  Eye, Wind, Brain, Heart, Zap, Target, Shield, Sparkles,
  Check, ChevronRight, ArrowLeft, Play, Lock, Gift,
  Loader2, Send, Mail, Flame, Star
} from 'lucide-react'
import { recordActivity } from '@/lib/streak'

const STORAGE_KEY = 'plan7_data'
const SUB_KEY = 'plan7_subscribed'

const days = [
  {
    day: 1,
    letter: 'N',
    title: 'Neutraliza el pensamiento',
    icon: Brain,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    desc: 'La N del Método N.E.U.R.O. El primer paso no es callar la mente: es darte cuenta de cuánto ruido hay. Sin juzgar, sin cambiar nada. Solo observar y contar.',
    exercise: 'Siéntate en silencio con los ojos cerrados durante 3 minutos. Cada vez que aparezca un pensamiento —cualquiera— cuenta uno en silencio. Al terminar, anota el número total. Ese número es tu punto de partida: tu índice de ruido mental inicial.',
    neuro: 'Contar sin juzgar te saca del piloto automático. No hace falta callar la mente: basta con ver el ruido. Ese gesto ya cambia cómo respondes al día.',
    link: '/ejercicios',
    duration: '3 min',
  },
  {
    day: 2,
    letter: 'E',
    title: 'Entrena la atención',
    icon: Target,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
    desc: 'La E del Método N.E.U.R.O. La atención es un músculo. Se entrena, se debilita con el desuso y se fortalece con la práctica deliberada. Hoy haces tu primer entrenamiento real.',
    exercise: 'Elige un objeto del entorno: una vela, un punto en la pared, el sonido del ambiente. Mantén tu atención en ese objeto durante 5 minutos completos. Cada vez que tu mente se desvíe a un pensamiento, dite "distracción" y vuelve al objeto. El momento en que te das cuenta de que te fuiste ya ES el entrenamiento. Cuenta cuántas veces volviste.',
    neuro: 'Cada vez que notas la distracción y vuelves al foco, entrenas la atención como un músculo. Al principio cansa; con el tiempo eliges mejor dónde pones la mirada.',
    link: '/meditacion',
    duration: '5 min',
  },
  {
    day: 3,
    letter: 'U',
    title: 'Ubícate en el cuerpo',
    icon: Heart,
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
    desc: 'La U del Método N.E.U.R.O. Tu mente viaja al pasado y al futuro sin parar. Tu cuerpo siempre está aquí, en el presente. Hoy aprendes a usarlo como ancla de presencia.',
    exercise: 'Siéntate o túmbate cómodamente. Empieza por los pies: ¿notas calor, frío, presión, hormigueo? Sube despacio por piernas, cadera, vientre, pecho, manos, brazos, hombros, cuello, cara. En cada zona dedica 20-30 segundos. No intentes cambiar nada. Solo observa lo que hay. Total: 5 minutos.',
    neuro: 'Sentir el cuerpo con calma te devuelve al presente cuando la cabeza va a mil. Es la ancla más simple y la que menos discute la mente.',
    link: '/ejercicios',
    duration: '5 min',
  },
  {
    day: 4,
    letter: 'R',
    title: 'Regula la emoción',
    icon: Shield,
    color: 'text-emerald-400',
    bg: 'bg-emerald-500/10',
    desc: 'La R del Método N.E.U.R.O. Las emociones no son el problema. El problema es reaccionar desde ellas sin elegirlo. Hoy aprendes el protocolo de 3 pasos para regularlas antes de actuar.',
    exercise: 'Durante el día de hoy, cada vez que sientas una emoción intensa (ansiedad, enfado, tristeza, frustración): 1) Para. Detecta dónde la sientes en el cuerpo. 2) Nómbrala en voz baja o mentalmente: "hay enfado", "hay ansiedad". 3) Inhala 4 segundos, exhala 8 segundos. Tres veces. Luego decide qué hacer. Practica mínimo 2 veces hoy.',
    neuro: 'Nombrar lo que sientes y alargar la exhalación suele bajar la intensidad. No es magia: es dejar de reaccionar en automático durante unos segundos.',
    link: '/ejercicios',
    duration: 'Todo el día',
  },
  {
    day: 5,
    letter: 'O',
    title: 'Observa sin identificarte',
    icon: Eye,
    color: 'text-accent-blue',
    bg: 'bg-accent-blue/10',
    desc: 'La O del Método N.E.U.R.O. Este es el núcleo de todo. No eres tus pensamientos. No eres tus emociones. Eres quien los observa. Hoy lo experimentas por primera vez.',
    exercise: 'Cierra los ojos 5 minutos. Imagina que estás sentado en la orilla de un río tranquilo. Tus pensamientos son hojas que flotan en el agua. Tu único trabajo es observar las hojas desde la orilla sin subirte a ninguna. Cuando notes que te has subido a una hoja —que estás siguiendo un pensamiento— simplemente di "enganchado" y vuelve a la orilla. Vuelve tantas veces como haga falta. Cada vuelta es una repetición.',
    neuro: 'Ver el pensamiento pasar sin subirte a él es el paso que más claridad da. Se entrena: cada vuelta a la orilla cuenta.',
    link: '/meditacion',
    duration: '5 min',
  },
  {
    day: 6,
    letter: '↺',
    title: 'Integración N.E.U.R.O.',
    icon: Zap,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    desc: 'Hoy juntas las 5 letras en una sola práctica. No es un repaso: es la primera vez que experimentas el método como un flujo continuo. Así es como funciona en la vida real.',
    exercise: '1) N — Cuenta tus pensamientos durante 2 minutos (¿cuántos tienes hoy vs. el día 1?). 2) E — Foco en un punto fijo durante 2 minutos. 3) U — Escaneo corporal rápido de pies a cabeza (2 minutos). 4) R — Nombra 3 emociones que notes ahora mismo. 5) O — Observador 3 minutos: deja pasar todo. Anota: ¿qué ha cambiado esta semana?',
    neuro: 'Juntar las cinco letras en un solo bloque es cómo el método entra en la vida real. No necesitas laboratorio: necesitas repetición honesta.',
    link: '/meditacion',
    duration: '10 min',
  },
  {
    day: 7,
    letter: '★',
    title: 'Graduación: mide tu cambio',
    icon: Sparkles,
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
    desc: 'Último día: solo medición. Ves el cambio frente al día 1 y eliges el siguiente paso.',
    exercise: '1) Cuenta pensamientos 3 minutos. Compara con el día 1. 2) Test de Ruido Mental en /test. Compara puntuación. 3) Por escrito: momento clave de la semana, mayor cambio notado, qué seguir entrenando. 4) Siguiente nivel: programa de 21 días en /programa.',
    neuro: 'Una semana con práctica real ya deja sensación distinta: menos piloto automático, más opciones. Lo que importa es que puedas repetirlo mañana.',
    link: '/test',
    duration: '15 min',
  },
]

type PlanData = {
  completedDays: number[]
  completedAtMap: Record<number, string>
  startDate?: string | null
}

const HOURS_BETWEEN_DAYS = 24

export default function Plan7DiasPage() {
  const [subscribed, setSubscribed] = useState(false)
  const [email, setEmail] = useState('')
  const [sending, setSending] = useState(false)
  const [data, setData] = useState<PlanData>({ completedDays: [], completedAtMap: {} })
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    if (typeof window !== 'undefined') {
      const sub = localStorage.getItem(SUB_KEY) === 'true'
      setSubscribed(sub)
      try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PlanData>
          const completedAtMap = parsed.completedAtMap ?? {}
          const completedDays = Array.isArray(parsed.completedDays) ? parsed.completedDays : []
          if (sub && !parsed.startDate) {
            const today = new Date().toISOString().split('T')[0]
            const fixed = { ...parsed, completedDays, completedAtMap, startDate: today }
            setData(fixed as PlanData)
            localStorage.setItem(STORAGE_KEY, JSON.stringify(fixed))
          } else {
            setData({ ...parsed, completedDays, completedAtMap } as PlanData)
          }
        }
      } catch {}
    }
  }, [])

  const save = (newData: PlanData) => {
    setData(newData)
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newData))
    }
  }

  const handleSubscribe = async () => {
    if (!email.trim()) return
    setSending(true)
    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'plan-7-dias' }),
      })
    } catch {}
    if (typeof window !== 'undefined') {
      localStorage.setItem(SUB_KEY, 'true')
      const today = new Date().toISOString().split('T')[0]
      const newData = { ...data, startDate: data.startDate || today }
      setData(newData)
      save(newData)
    }
    setSubscribed(true)
    setSending(false)
  }

  const completeDay = (dayNum: number) => {
    if (data.completedDays.includes(dayNum)) return
    const status = getDayStatus(dayNum)
    if (status !== 'current') return
    const completedAt = new Date().toISOString()
    const newData: PlanData = {
      ...data,
      completedDays: [...data.completedDays, dayNum].sort((a, b) => a - b),
      completedAtMap: { ...data.completedAtMap, [dayNum]: completedAt },
    }
    save(newData)
    recordActivity()
    setSelectedDay(null)
  }

  const getCurrentUnlockedDay = (): number => {
    const start = data.startDate
    if (!start) return 0
    const now = Date.now()
    const startMs = new Date(start + 'T00:00:00').getTime()
    if (now < startMs) return 0
    const getCompletedAt = (d: number) => {
      const at = data.completedAtMap?.[d]
      if (at) return new Date(at).getTime()
      if (data.completedDays.includes(d)) {
        const legacy = startMs + (d - 1) * HOURS_BETWEEN_DAYS * 60 * 60 * 1000
        return Math.min(legacy, now - HOURS_BETWEEN_DAYS * 60 * 60 * 1000)
      }
      return 0
    }
    let unlocked = 1
    for (let d = 1; d < 7; d++) {
      const prevMs = getCompletedAt(d)
      if (prevMs === 0) break
      const hoursSincePrev = (now - prevMs) / (60 * 60 * 1000)
      if (hoursSincePrev < HOURS_BETWEEN_DAYS) break
      unlocked = d + 1
    }
    return Math.min(7, unlocked)
  }

  const getDayStatus = (dayNum: number): 'completed' | 'current' | 'locked' => {
    if (data.completedDays.includes(dayNum)) return 'completed'
    const unlockedDay = getCurrentUnlockedDay()
    if (dayNum <= unlockedDay) return 'current'
    return 'locked'
  }

  const progress = (data.completedDays.length / 7) * 100
  const selected = selectedDay ? days.find(d => d.day === selectedDay) : null

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Gate: email subscription
  if (!subscribed) {
    return (
      <div className="relative overflow-hidden">
        <div className="orb w-96 h-96 bg-purple-600 top-0 -right-32" />
        <div className="orb w-80 h-80 bg-accent-blue top-[400px] -left-40" />

        <section className="pt-10 md:pt-24 pb-12">
          <Container>
            <FadeInSection>
              <div className="max-w-md mx-auto text-center">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-purple-500/20 to-accent-blue/20 flex items-center justify-center mx-auto mb-6 border border-purple-500/10">
                  <Gift className="w-9 h-9 text-purple-400" />
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium mb-4">
                  <Star className="w-3 h-3" />
                  100% Gratis
                </div>

                <h1 className="font-heading text-3xl md:text-4xl font-bold text-white mb-3">
                  Reto 7 Días
                </h1>
                <p className="text-text-secondary mb-2">
                  Siete días. Cinco letras del método. Un ejercicio cada mañana.
                </p>
                <p className="text-text-muted text-sm mb-8">
                  Acceso gratis con tu email. Sin tarjeta. Desbloqueo día a día.
                </p>

                {/* Preview of what they get */}
                <div className="glass rounded-2xl p-4 mb-6 text-left">
                  <h3 className="text-white text-sm font-semibold mb-3">Incluye</h3>
                  <div className="space-y-2">
                    {[
                      '7 ejercicios, uno por día',
                      'Texto corto: qué vigilar al practicar',
                      'Siguiente día al completar el anterior',
                      'Método N.E.U.R.O. en la app, en abierto',
                      'Puente claro al programa de 21 días',
                    ].map((item) => (
                      <div key={item} className="flex items-center gap-2">
                        <Check className="w-4 h-4 text-green-400 shrink-0" />
                        <span className="text-text-secondary text-sm">{item}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Subscribe form */}
                <div className="space-y-3">
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSubscribe()}
                      placeholder="Tu email"
                      className="w-full pl-11 pr-4 py-3.5 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                    />
                  </div>
                  <button
                    onClick={handleSubscribe}
                    disabled={!email.trim() || sending}
                    className="w-full py-3.5 bg-accent-blue rounded-xl text-white font-semibold active:scale-95 transition-transform disabled:opacity-40 glow-blue"
                  >
                    {sending ? (
                      <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 inline mr-2" />
                    )}
                    {sending ? 'Activando...' : 'Empezar ahora'}
                  </button>
                  <p className="text-text-muted text-[10px]">
                    Sin spam. Práctica y método en el buzón solo si lo pides.
                  </p>
                </div>
              </div>
            </FadeInSection>
          </Container>
        </section>
      </div>
    )
  }

  // Day detail view
  if (selected) {
    const status = getDayStatus(selected.day)
    return (
      <div className="relative overflow-hidden">
        <div className="orb w-64 h-64 bg-purple-600 top-20 -right-20" />
        <section className="pt-8 pb-6">
          <Container>
            <button onClick={() => setSelectedDay(null)} className="flex items-center gap-2 text-text-secondary text-sm mb-6 active:opacity-70">
              <ArrowLeft className="w-4 h-4" /> Volver al plan
            </button>

            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <span className={`px-2.5 py-1 rounded-full ${selected.bg} ${selected.color} text-xs font-semibold`}>
                  Día {selected.day}
                </span>
                {selected.letter && selected.letter.length === 1 && /[NEURO]/.test(selected.letter) && (
                  <span className="px-2.5 py-1 rounded-full bg-white/5 text-text-secondary text-xs font-bold tracking-widest">
                    {selected.letter}
                  </span>
                )}
                <span className="text-text-muted text-xs">{selected.duration}</span>
              </div>

              <div className={`w-14 h-14 rounded-2xl ${selected.bg} flex items-center justify-center mb-4`}>
                <selected.icon className={`w-7 h-7 ${selected.color}`} />
              </div>

              <h2 className="font-heading font-bold text-white text-2xl mb-3">{selected.title}</h2>
              <p className="text-text-secondary leading-relaxed mb-6">{selected.desc}</p>

              {/* Exercise */}
              <div className="glass-light rounded-xl p-4 mb-4">
                <h3 className="text-accent-blue text-sm font-semibold uppercase tracking-wider mb-2">Ejercicio</h3>
                <p className="text-text-secondary text-sm leading-relaxed">{selected.exercise}</p>
              </div>

              {/* Neuro basis */}
              <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-4 mb-6">
                <div className="flex items-center gap-2 mb-2">
                  <Brain className="w-4 h-4 text-purple-400" />
                  <h3 className="text-purple-400 text-sm font-semibold uppercase tracking-wider">Lo que notas al practicar</h3>
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{selected.neuro}</p>
              </div>

              {status === 'locked' ? (
                <div className="py-3 px-4 bg-white/5 rounded-xl text-center">
                  <p className="text-text-muted text-sm">Completa el día {selected.day - 1} para desbloquear</p>
                </div>
              ) : status === 'completed' ? (
                <div className="py-3 px-4 bg-green-500/10 rounded-xl text-center">
                  <p className="text-green-400 text-sm font-medium flex items-center justify-center gap-2">
                    <Check className="w-4 h-4" /> Completado
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={selected.link}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-accent-blue/10 text-accent-blue rounded-xl font-medium text-sm active:scale-95 transition-transform"
                  >
                    <Play className="w-4 h-4" /> Ir al ejercicio
                  </Link>
                  <button
                    onClick={() => completeDay(selected.day)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500/15 text-green-400 rounded-xl font-medium text-sm active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4" /> Marcar como completado
                  </button>
                </div>
              )}
            </div>

            {/* Next step after day 7 */}
            {selected.day === 7 && status === 'completed' && (
              <FadeInSection>
                <div className="glass rounded-2xl p-5 mt-4 border border-violet-500/20">
                  <div className="flex items-center gap-3 mb-3">
                    <Flame className="w-6 h-6 text-violet-400" />
                    <h3 className="text-white font-semibold">¿Y ahora qué?</h3>
                  </div>
                  <p className="text-text-secondary text-sm mb-4">
                    Has completado los 7 días. Tu cerebro ya ha empezado a cambiar. El Curso 21 Días lleva esto al siguiente nivel con cambios estructurales reales.
                  </p>
                  <Link
                    href="/programa"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-violet-500/15 text-violet-400 rounded-xl font-medium text-sm active:scale-95 transition-transform"
                  >
                    <Flame className="w-4 h-4" /> Continuar con Curso 21 Días
                  </Link>
                </div>
              </FadeInSection>
            )}
          </Container>
        </section>
      </div>
    )
  }

  // Main plan view
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-purple-600 top-10 -right-20" />
      <div className="orb w-48 h-48 bg-accent-blue top-[500px] -left-24" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-heading text-3xl font-bold text-white animate-fade-in">Reto 7 Días</h1>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
              <Star className="w-3 h-3" />
              Gratis
            </div>
          </div>
          <p className="text-text-secondary text-sm animate-fade-in-up">
            Introducción al Método N.E.U.R.O.
          </p>
        </Container>
      </section>

      {/* Progress */}
      <section className="pb-4">
        <Container>
          <FadeInSection>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-xs font-medium">Progreso</span>
                <span className="text-white text-xs font-bold">{data.completedDays.length}/7</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full">
                <div className="h-2 bg-gradient-to-r from-purple-500 to-accent-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              {data.completedDays.length === 7 && (
                <div className="mt-3 flex items-center gap-2 justify-center">
                  <Star className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  <span className="text-emerald-400 text-sm font-semibold">Plan completado</span>
                </div>
              )}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Days */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="space-y-2.5">
              {days.map((d) => {
                const status = getDayStatus(d.day)
                return (
                  <button
                    key={d.day}
                    onClick={() => status !== 'locked' && setSelectedDay(d.day)}
                    disabled={status === 'locked'}
                    className={`w-full glass rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98] ${
                      status === 'locked' ? 'opacity-40' : ''
                    }`}
                  >
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      status === 'completed' ? 'bg-green-500/20' :
                      status === 'current' ? d.bg :
                      'bg-white/5'
                    }`}>
                      {status === 'completed' ? (
                        <Check className="w-5 h-5 text-green-400" />
                      ) : status === 'locked' ? (
                        <Lock className="w-4 h-4 text-text-muted" />
                      ) : (
                        <d.icon className={`w-5 h-5 ${d.color}`} />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-medium truncate ${status === 'completed' ? 'text-green-400' : 'text-white'}`}>
                        Día {d.day}: {d.title}
                      </p>
                      <p className="text-text-muted text-xs">
                        {/[NEURO]/.test(d.letter) ? `Letra ${d.letter} · ` : ''}{d.duration}
                      </p>
                    </div>
                    {status !== 'locked' && (
                      <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* CTA to 21 days */}
      {data.completedDays.length === 7 && (
        <section className="pb-12">
          <Container>
            <FadeInSection>
              <div className="glass rounded-2xl p-5 border border-accent-blue/20 text-center">
                <Flame className="w-8 h-8 text-accent-blue mx-auto mb-3" />
                <h3 className="font-heading text-lg font-bold text-white mb-2">¿Listo para el siguiente nivel?</h3>
                <p className="text-text-secondary text-sm mb-4">
                  El Curso 21 Días consolida lo que empezaste aquí y lo lleva al día a día con más profundidad.
                </p>
                <Link
                  href="/programa"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-accent-blue rounded-xl text-white font-medium text-sm active:scale-95 transition-transform glow-blue"
                >
                  Continuar con Curso 21 Días <ChevronRight className="w-4 h-4" />
                </Link>
              </div>
            </FadeInSection>
          </Container>
        </section>
      )}

      {/* Link from captación */}
      {data.completedDays.length < 7 && (
        <section className="pb-12">
          <Container>
            <FadeInSection>
              <div className="glass rounded-2xl p-4 flex items-center gap-3">
                <Brain className="w-5 h-5 text-purple-400 shrink-0" />
                <p className="text-text-secondary text-xs flex-1">
                  Cada ejercicio sigue el Método N.E.U.R.O.: pasos claros, vividos en la práctica, sin postureo.
                </p>
                <Link href="/metodo" className="text-accent-blue text-xs font-medium shrink-0">
                  Ver método
                </Link>
              </div>
            </FadeInSection>
          </Container>
        </section>
      )}
    </div>
  )
}
