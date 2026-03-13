'use client'

import { useState, useEffect, useRef } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import {
  Shield, Lock, Smartphone, WifiOff, Clock, Brain, Eye, Moon,
  Play, Pause, Check, ChevronRight, Volume2, Bell, X, Flame, Zap
} from 'lucide-react'

const STORAGE_KEY = 'neuroconciencia_retiro'

type RetiroState = {
  activo: boolean
  inicioTimestamp: number | null
  duracionMinutos: number
  completados: number
  mejorRacha: number
}

type Fase = {
  minuto: number
  titulo: string
  instruccion: string
  icon: React.ElementType
  color: string
  duracion: string
}

const FASES_RETIRO: Fase[] = [
  {
    minuto: 0, titulo: 'Preparación', icon: Shield, color: 'text-accent-blue',
    instruccion: 'Silencia el teléfono. Cierra todas las apps. Busca un lugar tranquilo. Siéntate cómodamente. Este es TU tiempo.',
    duracion: '2 min',
  },
  {
    minuto: 2, titulo: 'Anclaje corporal', icon: Zap, color: 'text-teal-400',
    instruccion: 'Cierra los ojos. Siente los pies en el suelo. Las manos sobre las piernas. El peso de tu cuerpo. Respira 5 veces profundamente. No estás en tu cabeza. Estás AQUÍ.',
    duracion: '5 min',
  },
  {
    minuto: 7, titulo: 'Observación pura', icon: Eye, color: 'text-purple-400',
    instruccion: 'Observa qué surge: pensamientos, emociones, impulsos de mirar el móvil. No los sigas. Etiquétalos: "pensamiento", "impulso", "emoción". Tú no eres eso. Eres el que observa.',
    duracion: '10 min',
  },
  {
    minuto: 17, titulo: 'Silencio profundo', icon: Moon, color: 'text-cyan-400',
    instruccion: 'Deja de etiquetar. Solo ESTÁ. Sin hacer nada. Sin ser nadie. El silencio entre pensamientos se expande. Eso es supraconsciencia. No la busques. Ya está aquí.',
    duracion: '10 min',
  },
  {
    minuto: 27, titulo: 'Integración', icon: Brain, color: 'text-green-400',
    instruccion: 'Lentamente, trae tu atención de vuelta. Siente tu cuerpo. Escucha los sonidos. Abre los ojos despacio. Lleva esta presencia a todo lo que hagas hoy. El retiro termina. La consciencia no.',
    duracion: '3 min',
  },
]

const DURACIONES = [
  { minutos: 15, label: '15 min', desc: 'Express', color: 'text-accent-blue' },
  { minutos: 30, label: '30 min', desc: 'Estándar', color: 'text-green-400' },
  { minutos: 60, label: '1 hora', desc: 'Profundo', color: 'text-purple-400' },
  { minutos: 120, label: '2 horas', desc: 'Inmersivo', color: 'text-teal-400' },
  { minutos: 240, label: '4 horas', desc: 'Retiro total', color: 'text-orange-400' },
]

function loadState(): RetiroState {
  if (typeof window === 'undefined') return { activo: false, inicioTimestamp: null, duracionMinutos: 30, completados: 3, mejorRacha: 2 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { activo: false, inicioTimestamp: null, duracionMinutos: 30, completados: 3, mejorRacha: 2 }
}

function saveState(state: RetiroState) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export default function RetiroPage() {
  const [state, setState] = useState<RetiroState>({ activo: false, inicioTimestamp: null, duracionMinutos: 30, completados: 3, mejorRacha: 2 })
  const [mounted, setMounted] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds
  const [selectedDuracion, setSelectedDuracion] = useState(30)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    setMounted(true)
    const loaded = loadState()
    setState(loaded)
    setSelectedDuracion(loaded.duracionMinutos)

    if (loaded.activo && loaded.inicioTimestamp) {
      const elapsedSec = Math.floor((Date.now() - loaded.inicioTimestamp) / 1000)
      const totalSec = loaded.duracionMinutos * 60
      if (elapsedSec < totalSec) {
        setElapsed(elapsedSec)
      } else {
        const updated = { ...loaded, activo: false, inicioTimestamp: null, completados: loaded.completados + 1 }
        setState(updated)
        saveState(updated)
      }
    }
  }, [])

  useEffect(() => {
    if (state.activo) {
      timerRef.current = setInterval(() => {
        setElapsed((prev) => {
          const next = prev + 1
          if (next >= state.duracionMinutos * 60) {
            if (timerRef.current) clearInterval(timerRef.current)
            const updated = { ...state, activo: false, inicioTimestamp: null, completados: state.completados + 1 }
            setState(updated)
            saveState(updated)
          }
          return next
        })
      }, 1000)
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [state.activo, state.duracionMinutos])

  const startRetiro = () => {
    const updated: RetiroState = {
      ...state,
      activo: true,
      inicioTimestamp: Date.now(),
      duracionMinutos: selectedDuracion,
    }
    setState(updated)
    saveState(updated)
    setElapsed(0)
  }

  const stopRetiro = () => {
    if (timerRef.current) clearInterval(timerRef.current)
    const updated: RetiroState = { ...state, activo: false, inicioTimestamp: null }
    setState(updated)
    saveState(updated)
    setElapsed(0)
  }

  const totalSeconds = state.duracionMinutos * 60
  const progress = totalSeconds > 0 ? elapsed / totalSeconds : 0
  const remaining = totalSeconds - elapsed
  const remainMin = Math.floor(remaining / 60)
  const remainSec = remaining % 60
  const elapsedMin = Math.floor(elapsed / 60)

  const currentFase = FASES_RETIRO.filter((f) => elapsedMin >= f.minuto).pop() || FASES_RETIRO[0]
  const nextFase = FASES_RETIRO.find((f) => f.minuto > elapsedMin)

  const circumference = 2 * Math.PI * 90
  const dashOffset = circumference * (1 - progress)

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Active retiro mode - fullscreen experience
  if (state.activo) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[#02040A]">
        <div className="orb w-96 h-96 bg-purple-900/30 top-1/4 -right-32" />
        <div className="orb w-80 h-80 bg-cyan-900/20 bottom-1/4 -left-32" />

        <div className="flex flex-col items-center justify-center min-h-screen px-6">
          {/* Timer circle */}
          <div className="relative w-64 h-64 mb-8">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
              <circle cx="100" cy="100" r="90" fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="4" />
              <circle
                cx="100" cy="100" r="90"
                fill="none"
                stroke="#8B5CF6"
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={dashOffset}
                className="transition-all duration-1000 ease-linear"
                style={{ filter: 'drop-shadow(0 0 12px rgba(139,92,246,0.4))' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <p className="font-heading text-5xl font-bold text-white tracking-wider">
                {remainMin}:{remainSec.toString().padStart(2, '0')}
              </p>
              <p className="text-text-muted text-xs mt-1">restante</p>
            </div>
          </div>

          {/* Current phase */}
          <div className="text-center max-w-sm mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <currentFase.icon className={`w-5 h-5 ${currentFase.color}`} />
              <h2 className={`font-heading text-lg font-semibold ${currentFase.color}`}>
                {currentFase.titulo}
              </h2>
            </div>
            <p className="text-white/80 text-sm leading-relaxed">
              {currentFase.instruccion}
            </p>
          </div>

          {/* Next phase indicator */}
          {nextFase && (
            <div className="glass rounded-2xl px-4 py-2 flex items-center gap-2 mb-8">
              <Clock className="w-3 h-3 text-text-muted" />
              <span className="text-text-muted text-xs">
                Siguiente: {nextFase.titulo} en {nextFase.minuto - elapsedMin} min
              </span>
            </div>
          )}

          {/* Stop button */}
          <button
            onClick={stopRetiro}
            className="px-6 py-3 rounded-2xl bg-white/5 text-text-muted text-sm active:scale-95 transition-transform"
          >
            Salir del retiro
          </button>
        </div>
      </div>
    )
  }

  // Setup screen
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-cyan-600 top-10 -right-24" />
      <div className="orb w-64 h-64 bg-purple-600 top-[500px] -left-32" />

      {/* Header */}
      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-1 animate-fade-in">
            Retiro Digital
          </h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">
            Desconecta del ruido. Conecta contigo.
          </p>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="grid grid-cols-3 gap-2">
              <div className="glass rounded-2xl p-3 text-center">
                <p className="font-heading text-2xl font-bold text-purple-400">{state.completados}</p>
                <p className="text-text-muted text-[10px]">Retiros completados</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="font-heading text-2xl font-bold text-cyan-400">{state.completados * 30}</p>
                <p className="text-text-muted text-[10px]">Min. en silencio</p>
              </div>
              <div className="glass rounded-2xl p-3 text-center">
                <p className="font-heading text-2xl font-bold text-orange-400">{state.mejorRacha}</p>
                <p className="text-text-muted text-[10px]">Mejor racha (días)</p>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* What is it */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5 border border-cyan-500/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center">
                  <WifiOff className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-white font-semibold">¿Qué es el Retiro Digital?</h2>
                  <p className="text-text-muted text-xs">Experiencia inmersiva de silencio</p>
                </div>
              </div>
              <p className="text-text-secondary text-sm leading-relaxed">
                Un espacio guiado donde apagas todo estímulo externo y te sumerges en la observación pura.
                Basado en retiros Vipassana + neurociencia moderna. Incluye fases progresivas que
                te llevan del anclaje corporal al silencio profundo.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Duration selector */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Elige duración</h2>
            <div className="grid grid-cols-5 gap-2">
              {DURACIONES.map((d) => (
                <button
                  key={d.minutos}
                  onClick={() => setSelectedDuracion(d.minutos)}
                  className={`glass rounded-2xl p-3 text-center transition-all active:scale-95 ${
                    selectedDuracion === d.minutos ? 'border border-purple-500/40 bg-purple-500/5' : ''
                  }`}
                >
                  <p className={`font-heading text-sm font-bold ${selectedDuracion === d.minutos ? d.color : 'text-white'}`}>
                    {d.label}
                  </p>
                  <p className="text-text-muted text-[9px] mt-0.5">{d.desc}</p>
                </button>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Phases preview */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Fases del retiro</h2>
            <div className="space-y-2">
              {FASES_RETIRO.map((fase, i) => (
                <div key={i} className="glass rounded-2xl p-4 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center shrink-0 mt-0.5">
                    <fase.icon className={`w-4 h-4 ${fase.color}`} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{fase.titulo}</p>
                      <span className="text-text-muted text-[10px]">{fase.duracion}</span>
                    </div>
                    <p className="text-text-secondary text-xs mt-1 leading-relaxed">{fase.instruccion}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Preparation checklist */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Antes de empezar</h2>
            <div className="glass rounded-2xl p-4 space-y-3">
              {[
                { icon: Smartphone, text: 'Pon el teléfono en modo avión o no molestar' },
                { icon: Bell, text: 'Desactiva todas las notificaciones' },
                { icon: Lock, text: 'Busca un lugar donde nadie te interrumpa' },
                { icon: Volume2, text: 'Si quieres, pon sonidos de fondo desde /sonidos' },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center shrink-0">
                    <item.icon className="w-4 h-4 text-text-muted" />
                  </div>
                  <p className="text-text-secondary text-sm">{item.text}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Start button */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <button
              onClick={startRetiro}
              className="w-full py-5 bg-gradient-to-r from-purple-600/30 to-cyan-600/30 rounded-3xl border border-purple-500/20 text-white font-heading font-bold text-lg active:scale-[0.98] transition-transform flex items-center justify-center gap-3"
            >
              <Play className="w-6 h-6 text-purple-400" />
              Iniciar retiro de {DURACIONES.find((d) => d.minutos === selectedDuracion)?.label}
            </button>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
