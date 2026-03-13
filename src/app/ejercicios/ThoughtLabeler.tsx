'use client'

import { useState, useEffect, useRef } from 'react'
import Container from '@/components/Container'
import { ArrowLeft, Rewind, FastForward, Minus, RotateCcw } from 'lucide-react'

type Label = 'pasado' | 'futuro' | 'neutro'

export default function ThoughtLabeler({ onBack }: { onBack: () => void }) {
  const [phase, setPhase] = useState<'ready' | 'labeling' | 'done'>('ready')
  const [labels, setLabels] = useState<Label[]>([])
  const [timeLeft, setTimeLeft] = useState(90)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (phase === 'labeling' && timeLeft > 0) {
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
    setPhase('labeling')
    setLabels([])
    setTimeLeft(90)
  }

  const addLabel = (label: Label) => {
    setLabels(prev => [...prev, label])
  }

  const reset = () => {
    setPhase('ready')
    setLabels([])
    setTimeLeft(90)
  }

  const pasado = labels.filter(l => l === 'pasado').length
  const futuro = labels.filter(l => l === 'futuro').length
  const neutro = labels.filter(l => l === 'neutro').length
  const total = labels.length

  const getInsight = () => {
    if (total === 0) return 'No registraste pensamientos. Inténtalo de nuevo.'
    const maxLabel = pasado >= futuro && pasado >= neutro ? 'pasado' : futuro >= neutro ? 'futuro' : 'neutro'
    if (maxLabel === 'pasado') return 'Tu mente vive en el pasado. Rumiación, culpa, repetición. El entrenamiento de presencia es prioritario para ti.'
    if (maxLabel === 'futuro') return 'Tu mente vive en el futuro. Ansiedad, anticipación, planificación excesiva. La respiración 4-7-8 te va a ayudar mucho.'
    return 'Tu mente está bastante equilibrada. Sigues teniendo pensamientos, pero no están dominados por tiempo pasado ni futuro.'
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
              <h2 className="font-heading font-bold text-white text-2xl mb-3">Etiquetador mental</h2>
              <p className="text-text-secondary text-sm mb-2">Cada vez que notes un pensamiento, clasifícalo:</p>
              <div className="flex justify-center gap-3 my-6">
                <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-blue-500/10">
                  <Rewind className="w-5 h-5 text-blue-400" />
                  <span className="text-blue-400 text-xs font-medium">Pasado</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-orange-500/10">
                  <FastForward className="w-5 h-5 text-orange-400" />
                  <span className="text-orange-400 text-xs font-medium">Futuro</span>
                </div>
                <div className="flex flex-col items-center gap-1 px-4 py-3 rounded-xl bg-gray-500/10">
                  <Minus className="w-5 h-5 text-gray-400" />
                  <span className="text-gray-400 text-xs font-medium">Neutro</span>
                </div>
              </div>
              <p className="text-text-muted text-xs mb-6">90 segundos. No juzgues, solo etiqueta.</p>
              <button onClick={start} className="w-full py-4 bg-accent-blue text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform">
                Empezar
              </button>
            </div>
          )}

          {phase === 'labeling' && (
            <div className="glass rounded-3xl p-6 text-center">
              <div className="flex items-center justify-between mb-6">
                <span className="text-text-muted text-sm">{total} pensamientos</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                  <span className="text-text-muted text-sm font-mono">{timeLeft}s</span>
                </div>
              </div>

              <p className="text-text-secondary text-sm mb-8">¿En qué tiempo vive tu pensamiento?</p>

              <div className="grid grid-cols-3 gap-3 mb-6">
                <button
                  onClick={() => addLabel('pasado')}
                  className="flex flex-col items-center gap-2 py-6 rounded-2xl bg-blue-500/10 border border-blue-500/20 active:scale-90 transition-transform"
                >
                  <Rewind className="w-8 h-8 text-blue-400" />
                  <span className="text-blue-400 text-sm font-semibold">Pasado</span>
                  <span className="text-blue-400/60 text-xs">{pasado}</span>
                </button>
                <button
                  onClick={() => addLabel('futuro')}
                  className="flex flex-col items-center gap-2 py-6 rounded-2xl bg-orange-500/10 border border-orange-500/20 active:scale-90 transition-transform"
                >
                  <FastForward className="w-8 h-8 text-orange-400" />
                  <span className="text-orange-400 text-sm font-semibold">Futuro</span>
                  <span className="text-orange-400/60 text-xs">{futuro}</span>
                </button>
                <button
                  onClick={() => addLabel('neutro')}
                  className="flex flex-col items-center gap-2 py-6 rounded-2xl bg-gray-500/10 border border-gray-500/20 active:scale-90 transition-transform"
                >
                  <Minus className="w-8 h-8 text-gray-400" />
                  <span className="text-gray-400 text-sm font-semibold">Neutro</span>
                  <span className="text-gray-400/60 text-xs">{neutro}</span>
                </button>
              </div>
            </div>
          )}

          {phase === 'done' && (
            <div className="glass rounded-3xl p-6 text-center">
              <h2 className="font-heading font-bold text-white text-2xl mb-6">Tu mapa mental</h2>

              {/* Visual bar */}
              {total > 0 && (
                <div className="flex h-4 rounded-full overflow-hidden mb-6">
                  {pasado > 0 && <div className="bg-blue-500" style={{ width: `${(pasado / total) * 100}%` }} />}
                  {futuro > 0 && <div className="bg-orange-500" style={{ width: `${(futuro / total) * 100}%` }} />}
                  {neutro > 0 && <div className="bg-gray-500" style={{ width: `${(neutro / total) * 100}%` }} />}
                </div>
              )}

              <div className="grid grid-cols-3 gap-3 mb-6">
                <div className="bg-blue-500/10 rounded-xl p-3">
                  <span className="text-blue-400 text-2xl font-bold">{pasado}</span>
                  <p className="text-blue-400 text-xs">Pasado</p>
                  <p className="text-blue-400/50 text-[10px]">{total > 0 ? Math.round((pasado / total) * 100) : 0}%</p>
                </div>
                <div className="bg-orange-500/10 rounded-xl p-3">
                  <span className="text-orange-400 text-2xl font-bold">{futuro}</span>
                  <p className="text-orange-400 text-xs">Futuro</p>
                  <p className="text-orange-400/50 text-[10px]">{total > 0 ? Math.round((futuro / total) * 100) : 0}%</p>
                </div>
                <div className="bg-gray-500/10 rounded-xl p-3">
                  <span className="text-gray-400 text-2xl font-bold">{neutro}</span>
                  <p className="text-gray-400 text-xs">Neutro</p>
                  <p className="text-gray-400/50 text-[10px]">{total > 0 ? Math.round((neutro / total) * 100) : 0}%</p>
                </div>
              </div>

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-white text-sm font-medium">{getInsight()}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={reset} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-text-secondary text-sm font-medium active:scale-95 transition-transform">
                  <RotateCcw className="w-4 h-4" /> Repetir
                </button>
                <button onClick={onBack} className="flex-1 py-3 bg-accent-blue text-white rounded-xl text-sm font-medium active:scale-95 transition-transform">
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
