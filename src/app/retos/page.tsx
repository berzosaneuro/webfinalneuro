'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Flame, Trophy, Check, Lock, Brain, Eye, Heart, Wind, Zap, Moon, Target, Shield } from 'lucide-react'

const STORAGE_KEY = 'neuro_retos'

type Challenge = {
  id: string
  title: string
  description: string
  science: string
  icon: React.ElementType
  color: string
  days: number
  actions: string[]
}

const challenges: Challenge[] = [
  {
    id: 'zero-queja',
    title: '0 quejas conscientes',
    description: 'Cada vez que te pilles quejándote, pulsa el botón. La queja activa cortisol y refuerza circuitos negativos.',
    science: 'Quejarse repetidamente recablea el hipocampo hacia patrones negativos. 21 días sin queja reduce cortisol un 23%.',
    icon: Shield,
    color: 'bg-rose-500/15 text-rose-400',
    days: 7,
    actions: ['No quejarte en voz alta', 'Detectar quejas mentales', 'Sustituir por gratitud'],
  },
  {
    id: 'atencion-3min',
    title: '3 min de atención pura',
    description: 'Cada día, 3 minutos observando un objeto sin que tu mente se vaya. Entrena la corteza prefrontal.',
    science: 'La atención sostenida fortalece las conexiones prefrontales-parietales, mejorando el control ejecutivo.',
    icon: Eye,
    color: 'bg-violet-500/15 text-violet-400',
    days: 7,
    actions: ['Elige un objeto (vela, punto, mano)', 'Observa 3 min sin narrar', 'Cuando la mente se vaya, vuelve'],
  },
  {
    id: 'body-check',
    title: 'Body check cada 2 horas',
    description: 'Pon alarma cada 2h. Para. Siente tu cuerpo 30 segundos. Rompe el piloto automático.',
    science: 'Las interrupciones conscientes desactivan la Red Neuronal por Defecto (DMN) y activan la ínsula anterior.',
    icon: Heart,
    color: 'bg-teal-500/15 text-teal-400',
    days: 7,
    actions: ['Alarma cada 2 horas', '30 seg sintiendo el cuerpo', 'Nota la diferencia antes/después'],
  },
  {
    id: 'respiracion-478',
    title: 'Respiración 4-7-8 al despertar',
    description: 'Antes de mirar el móvil, 3 ciclos de respiración 4-7-8. Configura tu sistema nervioso para el día.',
    science: 'La respiración lenta activa el nervio vago, reduciendo la frecuencia cardíaca y activando el parasimpático.',
    icon: Wind,
    color: 'bg-cyan-500/15 text-cyan-400',
    days: 7,
    actions: ['Nada más despertar: 3 ciclos', 'Inhala 4s, mantén 7s, exhala 8s', 'ANTES de tocar el móvil'],
  },
  {
    id: 'gratitud-3',
    title: '3 gratitudes con detalle',
    description: 'Cada noche, escribe 3 cosas específicas por las que estás agradecido. No vale genérico.',
    science: 'La práctica de gratitud aumenta la actividad en la corteza prefrontal medial y libera dopamina.',
    icon: Zap,
    color: 'bg-teal-500/15 text-teal-400',
    days: 7,
    actions: ['Antes de dormir', '3 cosas específicas del día', 'Describe POR QUÉ agradeces cada una'],
  },
  {
    id: 'pantalla-consciente',
    title: 'Detox digital: 1h sin pantallas',
    description: 'Una hora al día sin móvil, tablet ni ordenador. Tu cerebro necesita espacio para pensar.',
    science: 'El scroll constante reduce la materia gris en la corteza cingulada anterior, centro de la autoregulación.',
    icon: Brain,
    color: 'bg-emerald-500/15 text-emerald-400',
    days: 7,
    actions: ['Elige tu hora (mañana recomendado)', 'Modo avión o en otra habitación', 'Observa qué sientes sin el móvil'],
  },
  {
    id: 'observador-10',
    title: '10 min como observador',
    description: 'Siéntate y observa tus pensamientos sin engancharte a ninguno. Solo mira.',
    science: 'Desidentificarse del pensamiento fortalece la corteza prefrontal dorsolateral, sede del metacognición.',
    icon: Target,
    color: 'bg-purple-500/15 text-purple-400',
    days: 7,
    actions: ['Siéntate en silencio 10 min', 'Observa pensamientos como nubes', 'No sigas ninguno, solo observa'],
  },
  {
    id: 'sleep-ritual',
    title: 'Ritual de sueño sagrado',
    description: 'Sin pantallas 30 min antes de dormir + 5 min de relajación progresiva.',
    science: 'La luz azul suprime melatonina un 50%. La relajación progresiva reduce el tiempo de inicio de sueño en 36%.',
    icon: Moon,
    color: 'bg-indigo-500/15 text-indigo-400',
    days: 7,
    actions: ['30 min antes: sin pantallas', '5 min relajación progresiva', 'Misma hora cada noche'],
  },
]

type Progress = Record<string, number[]>

function loadProgress(): Progress {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveProgress(p: Progress) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(p))
}

export default function RetosPage() {
  const [progress, setProgress] = useState<Progress>({})
  const [active, setActive] = useState<string | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setProgress(loadProgress())
    const saved = localStorage.getItem('neuro_reto_activo')
    if (saved) setActive(saved)
  }, [])

  const todayStr = new Date().toISOString().split('T')[0]
  const todayNum = new Date(todayStr).getTime()

  const startChallenge = (id: string) => {
    setActive(id)
    localStorage.setItem('neuro_reto_activo', id)
    if (!progress[id]) {
      const p = { ...progress, [id]: [] }
      setProgress(p)
      saveProgress(p)
    }
  }

  const completeToday = (id: string) => {
    const days = progress[id] || []
    if (days.includes(todayNum)) return
    const p = { ...progress, [id]: [...days, todayNum] }
    setProgress(p)
    saveProgress(p)
  }

  const activeChallenge = challenges.find(c => c.id === active)
  const activeDays = active ? (progress[active] || []) : []
  const completedToday = activeDays.includes(todayNum)

  const totalCompleted = Object.values(progress).reduce((sum, days) => {
    return sum + (days.length >= 7 ? 1 : 0)
  }, 0)

  if (!mounted) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
    </div>
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-violet-600 top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Retos Semanales</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Microhábitos con base neurocientífica. 7 días cada uno.</p>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-5">
        <Container>
          <div className="flex gap-3">
            <div className="glass rounded-2xl p-4 flex-1 text-center">
              <Trophy className="w-5 h-5 text-emerald-400 mx-auto mb-1" />
              <span className="text-white font-bold text-lg">{totalCompleted}</span>
              <p className="text-text-muted text-[10px]">Completados</p>
            </div>
            <div className="glass rounded-2xl p-4 flex-1 text-center">
              <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
              <span className="text-white font-bold text-lg">{activeDays.length}</span>
              <p className="text-text-muted text-[10px]">Racha actual</p>
            </div>
            <div className="glass rounded-2xl p-4 flex-1 text-center">
              <Brain className="w-5 h-5 text-accent-blue mx-auto mb-1" />
              <span className="text-white font-bold text-lg">{challenges.length}</span>
              <p className="text-text-muted text-[10px]">Disponibles</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Active challenge detail */}
      {activeChallenge && (
        <section className="pb-6">
          <Container>
            <FadeInSection>
              <div className="glass rounded-3xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl ${activeChallenge.color} flex items-center justify-center`}>
                    <activeChallenge.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-heading font-bold text-white">{activeChallenge.title}</h2>
                    <p className="text-text-muted text-xs">Día {activeDays.length + (completedToday ? 0 : 1)} de {activeChallenge.days}</p>
                  </div>
                </div>

                <div className="flex gap-1.5 mb-4">
                  {Array.from({ length: activeChallenge.days }).map((_, i) => (
                    <div key={i} className={`h-2 flex-1 rounded-full ${i < activeDays.length ? 'bg-accent-blue' : 'bg-white/5'}`} />
                  ))}
                </div>

                <div className="space-y-2 mb-4">
                  {activeChallenge.actions.map((a, i) => (
                    <div key={i} className="flex items-center gap-2 text-text-secondary text-sm">
                      <Check className="w-4 h-4 text-accent-blue shrink-0" />
                      {a}
                    </div>
                  ))}
                </div>

                <div className="bg-accent-blue/5 rounded-xl p-3 mb-4">
                  <p className="text-text-secondary text-xs leading-relaxed">
                    <span className="text-accent-blue font-semibold">Neurociencia:</span> {activeChallenge.science}
                  </p>
                </div>

                {activeDays.length >= activeChallenge.days ? (
                  <div className="w-full py-3 rounded-xl bg-emerald-500/15 text-emerald-400 font-semibold text-center text-sm flex items-center justify-center gap-2">
                    <Trophy className="w-4 h-4" /> Reto completado
                  </div>
                ) : (
                  <button
                    onClick={() => completeToday(activeChallenge.id)}
                    disabled={completedToday}
                    className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                      completedToday
                        ? 'bg-emerald-500/15 text-emerald-400'
                        : 'bg-accent-blue text-white'
                    }`}
                  >
                    {completedToday ? 'Hecho hoy' : 'Marcar como hecho'}
                  </button>
                )}
              </div>
            </FadeInSection>
          </Container>
        </section>
      )}

      {/* All challenges */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">
              {active ? 'Otros retos' : 'Elige tu reto'}
            </h2>
            <div className="space-y-3">
              {challenges.filter(c => c.id !== active).map((c) => {
                const days = progress[c.id] || []
                const completed = days.length >= c.days
                return (
                  <button
                    key={c.id}
                    onClick={() => startChallenge(c.id)}
                    className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
                  >
                    <div className={`w-10 h-10 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>
                      <c.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{c.title}</p>
                      <p className="text-text-muted text-xs truncate">{c.description.slice(0, 60)}...</p>
                    </div>
                    {completed ? (
                      <Trophy className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : days.length > 0 ? (
                      <span className="text-accent-blue text-xs font-bold shrink-0">{days.length}/7</span>
                    ) : null}
                  </button>
                )
              })}
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
