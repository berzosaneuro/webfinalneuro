'use client'

import { useState, useEffect, useRef } from 'react'
import Container from '@/components/Container'
import { ArrowLeft, RotateCcw } from 'lucide-react'

export default function ThoughtCounter({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'counting' | 'done'>('ready')
  const [count, setCount] = useState(0)
  const [timeLeft, setTimeLeft] = useState(60)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === 'counting' && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            setPhase('done')
            return 0
          }
          return t - 1
        })
      }, 1000)
      return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
    }
  }, [phase, timeLeft])

  const start = () => {
    setPhase('counting')
    setCount(0)
    setTimeLeft(60)
  }

  const reset = () => {
    setPhase('ready')
    setCount(0)
    setTimeLeft(60)
  }

  const getMessage = () => {
    if (count <= 10) return 'Tu mente está relativamente calmada. Buen control.'
    if (count <= 20) return 'Nivel normal. Con entrenamiento puedes bajar a menos de 10.'
    if (count <= 35) return 'Alto volumen mental. Tu mente está hiperactiva. Necesitas entrenar.'
    return 'Ruido mental muy alto. La meditación diaria te va a cambiar la vida.'
  }

  return (
    <div className="relative overflow-hidden">
      <section className="pt-8 pb-6">
        <Container>
          <button onClick={onBack} className="flex items-center gap-2 text-text-secondary text-sm mb-6 active:opacity-70">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          {phase === 'ready' && (
            <div className="glass rounded-3xl p-6 text-center">
              <h2 className="font-heading font-bold text-white text-2xl mb-3">Contador de pensamientos</h2>
              <p className="text-text-secondary text-sm mb-2">Cierra los ojos. Cada vez que notes un pensamiento, toca la pantalla.</p>
              <p className="text-text-muted text-xs mb-8">Tienes 60 segundos. No intentes controlar nada. Solo observa y cuenta.</p>
              <button
                onClick={start}
                className="w-full py-4 bg-accent-blue text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform"
              >
                Empezar
              </button>
            </div>
          )}

          {phase === 'counting' && (
            <div
              onClick={() => setCount(c => c + 1)}
              className="glass rounded-3xl p-8 text-center min-h-[400px] flex flex-col items-center justify-center cursor-pointer select-none active:bg-white/5 transition-colors"
            >
              <p className="text-text-muted text-xs mb-2 uppercase tracking-wider">Toca al notar un pensamiento</p>
              <span className="font-heading text-7xl font-bold text-white mb-4">{count}</span>
              <p className="text-text-secondary text-sm mb-1">pensamientos</p>
              <div className="mt-6 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <span className="text-text-muted text-sm font-mono">{timeLeft}s</span>
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="glass rounded-3xl p-6 text-center">
              <h2 className="font-heading font-bold text-white text-2xl mb-2">Resultado</h2>
              <div className="my-6">
                <span className="font-heading text-6xl font-bold text-accent-blue">{count}</span>
                <p className="text-text-secondary text-sm mt-2">pensamientos en 60 segundos</p>
              </div>
              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-white text-sm font-medium">{getMessage()}</p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={reset}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-text-secondary text-sm font-medium active:scale-95 transition-transform"
                >
                  <RotateCcw className="w-4 h-4" /> Repetir
                </button>
                <button
                  onClick={onBack}
                  className="flex-1 py-3 bg-accent-blue text-white rounded-xl text-sm font-medium active:scale-95 transition-transform"
                >
                  Más ejercicios
                </button>
              </div>
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
