'use client'

import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw } from 'lucide-react'

const presets = [3, 5, 10, 20]

export default function PresenceTimer() {
  const [duration, setDuration] = useState(5)
  const [remaining, setRemaining] = useState(5 * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (running && remaining > 0) {
      intervalRef.current = setInterval(() => {
        setRemaining((r) => r - 1)
      }, 1000)
    } else if (remaining === 0) {
      setRunning(false)
    }

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running, remaining])

  const selectDuration = (mins: number) => {
    setDuration(mins)
    setRemaining(mins * 60)
    setRunning(false)
  }

  const reset = () => {
    setRunning(false)
    setRemaining(duration * 60)
  }

  const mins = Math.floor(remaining / 60)
  const secs = remaining % 60
  const progress = 1 - remaining / (duration * 60)
  const circumference = 2 * Math.PI * 120
  const strokeDashoffset = circumference * (1 - progress)

  return (
    <div className="glass rounded-3xl p-6 text-center">
      {/* Duration presets */}
      <div className="flex justify-center gap-2 mb-8">
        {presets.map((p) => (
          <button
            key={p}
            onClick={() => selectDuration(p)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
              duration === p && !running
                ? 'bg-accent-blue text-white'
                : 'bg-white/5 text-text-secondary'
            }`}
          >
            {p} min
          </button>
        ))}
      </div>

      {/* Circular timer */}
      <div className="relative inline-flex items-center justify-center mb-8">
        <svg className="w-64 h-64 -rotate-90" viewBox="0 0 256 256">
          <circle
            cx="128" cy="128" r="120"
            fill="none"
            stroke="rgba(255,255,255,0.04)"
            strokeWidth="6"
          />
          <circle
            cx="128" cy="128" r="120"
            fill="none"
            stroke="#7C3AED"
            strokeWidth="6"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-linear"
            style={{ filter: 'drop-shadow(0 0 8px rgba(124,58,237,0.4))' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-heading text-5xl font-light text-white tracking-wider tabular-nums">
            {String(mins).padStart(2, '0')}:{String(secs).padStart(2, '0')}
          </span>
          <span className="text-text-muted text-xs mt-2">
            {running ? 'En curso' : remaining === 0 ? 'Completado' : 'Listo'}
          </span>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center gap-4">
        <button
          onClick={reset}
          className="w-12 h-12 flex items-center justify-center rounded-full bg-white/5 text-text-secondary active:scale-90 transition-transform"
        >
          <RotateCcw className="w-5 h-5" />
        </button>
        <button
          onClick={() => setRunning(!running)}
          className={`w-16 h-16 flex items-center justify-center rounded-full active:scale-90 transition-transform ${
            running
              ? 'bg-white/10 text-white'
              : 'bg-accent-blue text-white'
          }`}
          style={!running ? { boxShadow: '0 0 20px rgba(124,58,237,0.4)' } : undefined}
        >
          {running ? (
            <Pause className="w-6 h-6" />
          ) : (
            <Play className="w-6 h-6 ml-0.5" />
          )}
        </button>
        <div className="w-12 h-12" />
      </div>

      {remaining === 0 && (
        <div className="mt-6 py-3 px-4 bg-accent-blue/10 rounded-2xl">
          <p className="text-accent-blue font-medium text-sm">Sesión completada</p>
          <p className="text-text-secondary text-xs mt-0.5">Has estado presente. Eso es todo.</p>
        </div>
      )}
    </div>
  )
}
