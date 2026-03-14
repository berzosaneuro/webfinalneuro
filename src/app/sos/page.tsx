'use client'

import { useState, useEffect, useRef, useCallback, useId } from 'react'
import { ArrowLeft, Volume2, VolumeX } from 'lucide-react'
import Link from 'next/link'
import { claimAndPlay, unregister } from '@/lib/audio-manager'

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

function createAmbientPad(): { ctx: AudioContext; gain: GainNode; stop: () => void } {
  const ctx = new AudioContext()
  const gain = ctx.createGain()
  gain.gain.value = 0
  gain.connect(ctx.destination)

  const freqs = [65.41, 82.41, 98, 130.81]
  const oscs: OscillatorNode[] = []
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.value = f
    const g = ctx.createGain()
    g.gain.value = 0.2 / (i + 1)
    osc.connect(g)
    g.connect(gain)
    osc.start()
    oscs.push(osc)
  })
  gain.gain.setTargetAtTime(0.12, ctx.currentTime, 0.08)

  const stop = () => {
    gain.gain.setTargetAtTime(0, ctx.currentTime, 0.04)
    setTimeout(() => {
      oscs.forEach((o) => {
        try { o.stop(ctx.currentTime) } catch {}
      })
      try { ctx.close() } catch {}
    }, 130)
  }
  return { ctx, gain, stop }
}

export default function SOSPage() {
  const uid = useId().replace(/:/g, '')
  const [started, setStarted] = useState(false)
  const [phase, setPhase] = useState<Phase>('inhale')
  const [counter, setCounter] = useState(4)
  const [cycles, setCycles] = useState(0)
  const [muted, setMuted] = useState(false)
  const [affirmation, setAffirmation] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const ambientRef = useRef<{ ctx: AudioContext; gain: GainNode; stop: () => void } | null>(null)

  const currentPhase = PATTERN[phase]

  const stopSOS = useCallback(() => {
    ambientRef.current?.stop()
    ambientRef.current = null
  }, [])

  useEffect(() => {
    return () => {
      unregister('sos')
      stopSOS()
    }
  }, [stopSOS])

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
    claimAndPlay('sos', stopSOS)
    if (!muted) {
      try {
        const pad = createAmbientPad()
        if (pad.ctx.state === 'suspended') pad.ctx.resume().catch(() => {})
        ambientRef.current = pad
      } catch {}
    }
    setStarted(true)
    setPhase('inhale')
    setCounter(PATTERN.inhale.duration)
    setCycles(0)
  }

  const toggleMute = () => {
    const newMuted = !muted
    setMuted(newMuted)
    if (ambientRef.current) {
      ambientRef.current.gain.gain.setTargetAtTime(newMuted ? 0 : 0.12, ambientRef.current.ctx.currentTime, 0.3)
    }
  }

  const scaleValue =
    phase === 'inhale' ? 1 + (1 - counter / PATTERN.inhale.duration) * 0.35 :
    phase === 'hold' ? 1.35 :
    phase === 'exhale' ? 1.35 - (1 - counter / PATTERN.exhale.duration) * 0.35 :
    1

  const phaseColors = {
    inhale: { from: '#06b6d4', to: '#8b5cf6', glow: 'rgba(6,182,212,0.4)' },
    hold: { from: '#8b5cf6', to: '#7c3aed', glow: 'rgba(139,92,246,0.5)' },
    exhale: { from: '#f43f5e', to: '#f97316', glow: 'rgba(244,63,94,0.4)' },
    holdOut: { from: '#64748b', to: '#475569', glow: 'rgba(100,116,139,0.3)' },
  }
  const colors = phaseColors[phase]
  const transitionDuration = phase === 'inhale' ? PATTERN.inhale.duration : phase === 'exhale' ? PATTERN.exhale.duration : 0.5

  if (!started) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-dark-primary to-violet-950/20" />
        <div className="orb w-96 h-96 bg-cyan-500 top-1/4 -left-32 opacity-10" />
        <div className="orb w-80 h-80 bg-violet-600 bottom-1/4 -right-24 opacity-10" />

        <div className="relative text-center max-w-sm z-10">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6 border border-white/10 backdrop-blur-sm">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-cyan-400/30 to-violet-400/30 flex items-center justify-center">
              <span className="text-3xl">☁️</span>
            </div>
          </div>

          <h1 className="font-heading text-3xl font-bold text-white mb-2">
            Modo SOS
          </h1>
          <p className="text-cyan-400 text-sm font-medium mb-1">Respiración 4-7-8</p>
          <p className="text-text-muted text-sm mb-8">
            Activa tu sistema parasimpático y reduce la ansiedad en menos de 2 minutos.
          </p>

          <button
            onClick={start}
            className="w-full py-4 bg-gradient-to-r from-cyan-500 to-violet-600 text-white rounded-2xl font-semibold text-lg active:scale-[0.98] transition-all mb-4"
            style={{ boxShadow: '0 0 40px rgba(6,182,212,0.25)' }}
          >
            Necesito calma ahora
          </button>
          <p className="text-text-muted text-xs mb-4">Con música ambiente relajante</p>

          <Link href="/" className="inline-flex items-center gap-2 text-text-muted text-sm active:opacity-70">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-dark-primary via-dark-primary to-violet-950/10" />
      <div className="orb w-[500px] h-[500px] opacity-5" style={{ background: colors.from, top: '50%', left: '50%', transform: `translate(-50%,-50%) scale(${scaleValue})` }} />

      {/* Top bar */}
      <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 py-4 z-20" style={{ paddingTop: 'max(1rem, env(safe-area-inset-top))' }}>
        <Link href="/" className="w-10 h-10 flex items-center justify-center rounded-xl glass text-text-secondary active:scale-90 transition-transform">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <span className="text-text-muted text-xs font-medium">{cycles} ciclos</span>
        <button
          onClick={toggleMute}
          className="w-10 h-10 flex items-center justify-center rounded-xl glass text-text-secondary active:scale-90 transition-transform"
        >
          {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
        </button>
      </div>

      {/* Futuristic breathing circle */}
      <div className="relative flex flex-col items-center justify-center z-10">
        <div className="relative">
          {/* Outer glow rings */}
          <div
            className="absolute inset-0 rounded-full border-2 border-white/5"
            style={{
              width: 280,
              height: 280,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${scaleValue})`,
              transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
            }}
          />
          <div
            className="absolute rounded-full"
            style={{
              width: 260,
              height: 260,
              left: '50%',
              top: '50%',
              transform: `translate(-50%, -50%) scale(${scaleValue})`,
              transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
              border: `1px solid ${colors.from}40`,
              boxShadow: `0 0 80px ${colors.glow}, inset 0 0 60px ${colors.from}15`,
            }}
          />
          {/* Main circle with hex pattern */}
          <div
            className="relative rounded-full flex items-center justify-center overflow-visible"
            style={{
              width: 200,
              height: 200,
              transform: `scale(${scaleValue})`,
              transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
              background: `linear-gradient(135deg, ${colors.from}30, ${colors.to}20)`,
              border: `2px solid ${colors.from}50`,
              boxShadow: `0 0 60px ${colors.glow}, 0 0 120px ${colors.from}20`,
            }}
          >
            {/* Inner grid/hex effect */}
            <svg className="absolute inset-0 w-full h-full opacity-25" viewBox="0 0 200 200">
              <defs>
                <linearGradient id={`sos-grad-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor={colors.from} />
                  <stop offset="100%" stopColor={colors.to} />
                </linearGradient>
                <pattern id={`sos-hex-${uid}`} x="0" y="0" width="20" height="17.32" patternUnits="userSpaceOnUse">
                  <path d="M10 0L20 5v10l-10 5L0 15V5z" fill="none" stroke={colors.from} strokeWidth="0.4" opacity="0.6" />
                </pattern>
              </defs>
              <circle cx="100" cy="100" r="95" fill="none" stroke={`url(#sos-grad-${uid})`} strokeWidth="1" />
              <circle cx="100" cy="100" r="95" fill={`url(#sos-hex-${uid})`} />
            </svg>
            <div className="relative text-center z-10">
              <p className="text-white/90 text-sm font-medium tracking-wider uppercase">{currentPhase.label}</p>
              <p className="text-white text-5xl font-heading font-bold mt-1 tabular-nums" style={{ textShadow: `0 0 30px ${colors.glow}` }}>
                {counter}
              </p>
            </div>
          </div>
          {/* Floating particles */}
          {[0, 1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white/40"
              style={{
                left: `50%`,
                top: `50%`,
                transform: `translate(-50%, -50%) rotate(${i * 60}deg) translateY(${-120 * scaleValue}px)`,
                transition: `transform ${transitionDuration}s cubic-bezier(0.4, 0, 0.2, 1)`,
                animation: `pulse 2s ease-in-out ${i * 0.3}s infinite`,
              }}
            />
          ))}
        </div>

        {/* Affirmation */}
        <div className="mt-14 text-center max-w-xs px-4">
          <p className="text-text-secondary/90 text-sm italic transition-opacity duration-500 font-light">
            {affirmations[affirmation]}
          </p>
        </div>
      </div>

      {/* Phase indicator - futuristic dots */}
      <div className="absolute bottom-24 left-0 right-0 flex justify-center gap-2 z-10" style={{ paddingBottom: 'max(1.5rem, env(safe-area-inset-bottom))' }}>
        {(['inhale', 'hold', 'exhale', 'holdOut'] as Phase[]).map((p) => (
          <div
            key={p}
            className="rounded-full transition-all duration-300"
            style={{
              width: p === phase ? 24 : 8,
              height: 8,
              background: p === phase ? `linear-gradient(90deg, ${colors.from}, ${colors.to})` : 'rgba(255,255,255,0.15)',
              boxShadow: p === phase ? `0 0 12px ${colors.glow}` : 'none',
            }}
          />
        ))}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 1; }
        }
      `}</style>
    </div>
  )
}
