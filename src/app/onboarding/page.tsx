'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Brain, ChevronRight, Sparkles, Moon, Wind, Eye, Zap, Heart, Target, CheckCircle2 } from 'lucide-react'

type Profile = 'ansioso' | 'disperso' | 'buscador' | 'ejecutivo' | 'emocional'

const questions = [
  {
    question: '¿Qué te trajo aquí?',
    options: [
      { label: 'Ansiedad o estrés constante', icon: Wind, profile: 'ansioso' as Profile },
      { label: 'No puedo concentrarme ni 5 minutos', icon: Eye, profile: 'disperso' as Profile },
      { label: 'Quiero entenderme mejor, crecer', icon: Sparkles, profile: 'buscador' as Profile },
      { label: 'Rendimiento: quiero más foco y productividad', icon: Target, profile: 'ejecutivo' as Profile },
    ],
  },
  {
    question: '¿Cuál es tu mayor obstáculo mental?',
    options: [
      { label: 'Pensamientos repetitivos que no paran', icon: Brain, profile: 'ansioso' as Profile },
      { label: 'Me distraigo con todo', icon: Eye, profile: 'disperso' as Profile },
      { label: 'Siento vacío o falta de propósito', icon: Heart, profile: 'buscador' as Profile },
      { label: 'Sobrecarga: demasiadas decisiones', icon: Zap, profile: 'ejecutivo' as Profile },
    ],
  },
  {
    question: '¿Cómo duermes normalmente?',
    options: [
      { label: 'Mal. Tardo en dormirme, me despierto', icon: Moon, profile: 'ansioso' as Profile },
      { label: 'Irregular, depende del día', icon: Moon, profile: 'disperso' as Profile },
      { label: 'Bien pero me despierto sin energía', icon: Moon, profile: 'emocional' as Profile },
      { label: 'Poco. Sacrifico sueño por productividad', icon: Moon, profile: 'ejecutivo' as Profile },
    ],
  },
  {
    question: '¿Has meditado antes?',
    options: [
      { label: 'Nunca. No sé por dónde empezar', icon: Brain, profile: 'ansioso' as Profile },
      { label: 'Intenté pero no aguanto quieto', icon: Eye, profile: 'disperso' as Profile },
      { label: 'Sí, algo. Quiero ir más profundo', icon: Sparkles, profile: 'buscador' as Profile },
      { label: 'Sí, pero busco pasos claros y repetibles', icon: Target, profile: 'ejecutivo' as Profile },
    ],
  },
  {
    question: '¿Cuánto tiempo puedes dedicar al día?',
    options: [
      { label: '3-5 minutos', icon: Zap, profile: 'ansioso' as Profile },
      { label: '5-10 minutos', icon: Zap, profile: 'disperso' as Profile },
      { label: '10-20 minutos', icon: Zap, profile: 'buscador' as Profile },
      { label: 'Lo que sea necesario si funciona', icon: Zap, profile: 'ejecutivo' as Profile },
    ],
  },
]

const profiles: Record<Profile, {
  title: string
  subtitle: string
  description: string
  recommended: { label: string; href: string }[]
  color: string
}> = {
  ansioso: {
    title: 'El Nervioso Consciente',
    subtitle: 'Tu sistema nervioso necesita un reset',
    description: 'Tu mente está en modo supervivencia constante: alerta, corto aliento, cabeza acelerada. La buena noticia: con práctica breve y repetida el sistema puede aflojar en semanas.',
    recommended: [
      { label: 'Modo SOS — Respiración 4-7-8', href: '/sos' },
      { label: 'Meditación: Calma Rápida (3 min)', href: '/meditacion' },
      { label: 'Meditación: Desactivar Estrés (10 min)', href: '/meditacion' },
      { label: 'Test de Ruido Mental', href: '/test' },
    ],
    color: 'from-cyan-500 to-blue-500',
  },
  disperso: {
    title: 'El Mono Mental',
    subtitle: 'Tu atención salta de rama en rama',
    description: 'Tu mente prefiere divagar que estar presente: es el hábito, no un defecto. Entrenar la atención es como ir al gym: duele al principio, pero transforma.',
    recommended: [
      { label: 'Meditación: Atención Plena (10 min)', href: '/meditacion' },
      { label: 'Ejercicio: Contador de Pensamientos', href: '/ejercicios' },
      { label: 'Curso 21 Días', href: '/programa' },
      { label: 'Timer de Presencia (3 min)', href: '/meditacion' },
    ],
    color: 'from-violet-500 to-purple-500',
  },
  buscador: {
    title: 'El Buscador Profundo',
    subtitle: 'Quieres ir más allá de la superficie',
    description: 'No te conformas con relajarte. Quieres entender la naturaleza de tu mente, la consciencia, el observador detrás del pensamiento. Estás en el lugar correcto.',
    recommended: [
      { label: 'Despertar en Vida', href: '/despertar' },
      { label: 'Meditación: Presencia Profunda (15 min)', href: '/meditacion' },
      { label: 'Meditación: El Observador (12 min)', href: '/meditacion' },
      { label: 'Mapa de Consciencia', href: '/mapa' },
    ],
    color: 'from-violet-500 to-purple-600',
  },
  ejecutivo: {
    title: 'El Optimizador',
    subtitle: 'Quieres resultados medibles',
    description: 'Tu cabeza es tu herramienta principal de trabajo y a veces la usas sin pausa. Unos minutos de práctica al día suelen devolver foco y menos dispersión —sin prometer milagros de laboratorio.',
    recommended: [
      { label: 'Meditación: Flow State (20 min)', href: '/meditacion' },
      { label: 'Meditación: Claridad y Foco (10 min)', href: '/meditacion' },
      { label: 'NeuroScore — Mide tu progreso', href: '/neuroscore' },
      { label: 'Curso 21 Días', href: '/programa' },
    ],
    color: 'from-emerald-500 to-teal-500',
  },
  emocional: {
    title: 'El Sensible Consciente',
    subtitle: 'Sientes mucho. A veces demasiado',
    description: 'Sientes fuerte y a veces te desborda. No se trata de sentir menos, sino de tener un poco más de espacio antes de reaccionar. Eso se entrena con pasos concretos.',
    recommended: [
      { label: 'Meditación: Autocompasión (5 min)', href: '/meditacion' },
      { label: 'Meditación: Regulación Emocional (12 min)', href: '/meditacion' },
      { label: 'Diario de Presencia', href: '/diario' },
      { label: 'Meditación: Amor Incondicional (20 min)', href: '/meditacion' },
    ],
    color: 'from-rose-500 to-pink-500',
  },
}

export default function OnboardingPage() {
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [answers, setAnswers] = useState<Profile[]>([])
  const [result, setResult] = useState<Profile | null>(null)

  const handleAnswer = (profile: Profile) => {
    const newAnswers = [...answers, profile]
    setAnswers(newAnswers)

    if (step < questions.length - 1) {
      setStep(step + 1)
    } else {
      // Calculate dominant profile
      const counts: Record<string, number> = {}
      newAnswers.forEach((p) => {
        counts[p] = (counts[p] || 0) + 1
      })
      const dominant = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0] as Profile
      setResult(dominant)

      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('neuro_profile', dominant)
        localStorage.setItem('neuro_onboarded', 'true')
      }
    }
  }

  if (result) {
    const p = profiles[result]
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className={`absolute inset-0 bg-gradient-to-br ${p.color} opacity-[0.06]`} />
        <div className="orb w-96 h-96 bg-accent-blue top-1/4 left-1/2 -translate-x-1/2" />

        <div className="relative max-w-md w-full text-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-blue/20 to-accent-purple/20 flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-accent-blue" />
          </div>

          <h1 className="font-heading text-3xl font-bold text-white mb-2">{p.title}</h1>
          <p className="text-accent-blue font-medium text-sm mb-4">{p.subtitle}</p>
          <p className="text-text-secondary text-sm leading-relaxed mb-8">{p.description}</p>

          <div className="text-left space-y-3 mb-8">
            <p className="text-text-muted text-xs uppercase tracking-wider font-semibold mb-3">Tu plan personalizado</p>
            {p.recommended.map((r, i) => (
              <button
                key={i}
                onClick={() => router.push(r.href)}
                className="w-full glass rounded-2xl px-4 py-3 flex items-center gap-3 text-left active:scale-[0.98] transition-transform"
              >
                <div className="w-8 h-8 rounded-lg bg-accent-blue/15 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4 text-accent-blue" />
                </div>
                <span className="text-white text-sm font-medium">{r.label}</span>
                <ChevronRight className="w-4 h-4 text-text-muted ml-auto shrink-0" />
              </button>
            ))}
          </div>

          <button
            onClick={() => router.push('/')}
            className="w-full py-4 bg-accent-blue text-white rounded-2xl font-semibold text-base active:scale-95 transition-transform"
            style={{ boxShadow: '0 0 25px rgba(124,58,237,0.3)' }}
          >
            Empezar mi camino
          </button>
        </div>
      </div>
    )
  }

  const q = questions[step]
  const progress = ((step + 1) / questions.length) * 100

  return (
    <div className="min-h-screen flex flex-col px-6 pt-12 pb-8 relative overflow-hidden">
      <div className="orb w-72 h-72 bg-accent-purple -top-20 -right-20" />

      {/* Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          <span className="text-text-muted text-xs">{step + 1} de {questions.length}</span>
          <span className="text-text-muted text-xs">{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-1.5 bg-white/5 rounded-full">
          <div
            className="h-1.5 bg-accent-blue rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
        <h1 className="font-heading text-2xl md:text-3xl font-bold text-white mb-8 text-center">
          {q.question}
        </h1>

        <div className="space-y-3">
          {q.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt.profile)}
              className="w-full glass rounded-2xl px-5 py-4 flex items-center gap-4 text-left active:scale-[0.97] transition-all hover:border-accent-blue/30"
            >
              <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                <opt.icon className="w-5 h-5 text-accent-blue" />
              </div>
              <span className="text-white text-sm font-medium">{opt.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
