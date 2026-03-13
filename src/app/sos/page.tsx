'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'

type Phase = 'inhale' | 'hold' | 'exhale' | 'holdOut'

const PATTERN = {
  inhale: { duration: 4, label: 'Inhala', next: 'hold' as Phase },
  hold: { duration: 7, label: 'Mantén', next: 'exhale' as Phase },
  exhale: { duration: 8, label: 'Exhala', next: 'holdOut' as Phase },
  holdOut: { duration: 2, label: 'Espera', next: 'inhale' as Phase },
}

const affirmations = [
  'Estás aquí. Estás a salvo.',
  'Esto pasará. Siempre pasa.',
  'Tu cuerpo sabe respirar. Déjale.',
  'No eres tus pensamientos.',
  'Este momento es lo único real.',
  'Inhala calma. Exhala ruido.',
  'Tu mente miente. Tu cuerpo sabe.',
  'Nada de lo que imaginas está pasando ahora.',
]

export default function SOSPage() {
  const [started, setStarted] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [counter, setCounter] = useState(4)
  const [cycles, setCycles] = useState(0)
  const [muted, setMuted] = useState(false)
  const [affirmation, setAffirmation] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  const currentPhase = PATTERN[phase]

  const tick = useCallback(() => {
    setCounter((prev) => {
      if (prev <= 1) {
        const nextPhase = PATTERN[phase].next
        setPhase(nextPhase)
        if (nextPhase === 'inhale') {
          setCycles((c) => c + 1)
          setAffirmation((a) => (a + 1) % affirmations.length)
        }
        return PATTERN[nextPhase].duration
      }
      return prev - 1
    })
  }, [phase])

  useEffect(() => {
    if (started) {
      intervalRef.current = setInterval(tick, 1000)
      return () => {
        if (intervalRef.current) clearInterval(intervalRef.current)
      }
    }
  }, [started, tick])

  const start = () => {
    setStarted(true)
    setPhase('inhale')
    setCounter(PATTERN.inhale.duration)
    setCycles(0)
  }

  const scaleValue =
    phase === 'inhale' ? 1 + (1 - counter / PATTERN.inhale.duration) * 0.3 :
    phase === 'hold' ? 1.3 :
    phase === 'exhale' ? 1.3 - (1 - counter / PATTERN.exhale.duration) * 0.3 :
    1

  const phaseColor =
    phase === 'inhale' ? 'from-blue-500 to-cyan-400' :
    phase === 'hold' ? 'from-violet-500 to-blue-500' :
    phase === 'exhale' ? 'from-rose-500 to-orange-400' :
    'from-gray-500 to-gray-400'

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="orb w-96 h-96 bg-red-600 top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-20" />

        <div className="relative text-center max-w-sm">
          <div className="w-20 h-20 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-6 animate-pulse">
            <div className="w-14 h-14 rounded-full bg-red-500/30 flex items-center justify-center">
              <div className="w-8 h-8 rounded-full bg-red-500" />
            </div>
          </div>

          <h1 className="font-heading text-3xl font-bold text-white mb-3">
            Modo SOS
          </h1>
          <p className="text-text-secondary text-base mb-2">
            Respiración 4-7-8
          </p>
          <p className="text-text-muted text-sm mb-8">
            Esta técnica activa tu sistema nervioso parasimpático y reduce la ansiedad en menos de 2 minutos. Comprobado por neurociencia.
          </p>

          <button
            onClick={start}
            className="w-full py-4 bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform mb-4"
            style={{ boxShadow: '0 0 30px rgba(239,68,68,0.3)' }}
          >
            Necesito calma ahora
          </button>

          <Link href="/" className="inline-flex items-center gap-2 text-text-muted text-sm active:opacity-70">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      {/* Breathing background */}
      <div
        className="absolute inset-0 flex items-center justify-center pointer-events-none"
        style={{ transition: 'all 1s ease-in-out' }}
      >
        <div
          className={`w-72 h-72 rounded-full bg-gradient-to-br ${phaseColor} opacity-10`}
          style={{
            transform: `scale(${scaleValue})`,
            transition: `transform ${phase === 'inhale' ? PATTERN.inhale.duration : phase === 'exhale' ? PATTERN.exhale.duration : 0.5}s ease-in-out`,
            filter: 'blur(40px)',
          }}
        />
      </div>

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-10">
        <Link href="/" className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-text-secondary active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-text-muted text-xs">{cycles} ciclos</span>
        <button
          onClick={() => setMuted(!muted)}
          className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 text-text-secondary active:scale-90 transition-transform"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Center breathing circle */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <div className="relative">
          <div
            className={`w-48 h-48 rounded-full bg-gradient-to-br ${phaseColor} flex items-center justify-center`}
            style={{
              transform: `scale(${scaleValue})`,
              transition: `transform ${phase === 'inhale' ? PATTERN.inhale.duration : phase === 'exhale' ? PATTERN.exhale.duration : 0.5}s ease-in-out`,
              boxShadow: `0 0 60px rgba(124,58,237,0.2)`,
            }}
          >
            <div className="text-center">
              <p className="text-white/90 text-lg font-medium">{currentPhase.label}</p>
              <p className="text-white text-4xl font-heading font-bold mt-1">{counter}</p>
            </div>
          </div>
        </div>

        {/* Affirmation */}
        <div className="mt-12 text-center max-w-xs">
          <p className="text-text-secondary text-sm italic transition-opacity duration-500">
            {affirmations[affirmation]}
          </p>
        </div>
      </div>

      {/* Phase indicator */}
      <div className="absolute bottom-24 md:bottom-12 left-0 right-0 flex justify-center gap-3">
        {(['inhale', 'hold', 'exhale', 'holdOut'] as Phase[]).map((p) => (
          <div
            key={p}
            className={`h-1 rounded-full transition-all duration-300 ${
              p === phase ? 'w-8 bg-white' : 'w-4 bg-white/20'
            }`}
          />
        ))}
      </div>
    </div>
  )
}
