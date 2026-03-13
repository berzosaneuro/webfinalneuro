'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import { ArrowLeft, RotateCcw } from 'lucide-react'

const bodyParts = [
  { id: 'head', label: 'Cabeza', y: 8, x: 50 },
  { id: 'neck', label: 'Cuello', y: 16, x: 50 },
  { id: 'shoulders', label: 'Hombros', y: 22, x: 50 },
  { id: 'chest', label: 'Pecho', y: 32, x: 50 },
  { id: 'arms', label: 'Brazos', y: 38, x: 25 },
  { id: 'stomach', label: 'Estómago', y: 45, x: 50 },
  { id: 'back', label: 'Espalda', y: 40, x: 75 },
  { id: 'hips', label: 'Caderas', y: 55, x: 50 },
  { id: 'legs', label: 'Piernas', y: 70, x: 50 },
  { id: 'feet', label: 'Pies', y: 90, x: 50 },
]

type TensionLevel = 0 | 1 | 2 | 3

const tensionColors: Record<TensionLevel, string> = {
  0: 'bg-green-500/30 border-green-500/40 text-green-400',
  1: 'bg-cyan-500/30 border-cyan-500/40 text-cyan-400',
  2: 'bg-orange-500/30 border-orange-500/40 text-orange-400',
  3: 'bg-red-500/30 border-red-500/40 text-red-400',
}

const tensionLabels: Record<TensionLevel, string> = {
  0: 'Relajado',
  1: 'Leve tensión',
  2: 'Tenso',
  3: 'Muy tenso',
}

export default function BodyScan({ onBack }: { onBack: () => void }) {
  const [tensions, setTensions] = useState<Record<string, TensionLevel>>({})
  const [done, setDone] = useState(false)

  const cycleTension = (id: string) => {
    const current = (tensions[id] || 0) as TensionLevel
    const next = ((current + 1) % 4) as TensionLevel
    setTensions(prev => ({ ...prev, [id]: next }))
  }

  const totalTension = Object.values(tensions).reduce<number>((sum, v) => sum + v, 0)
  const maxTension = bodyParts.length * 3
  const tensionPercent = Math.round((totalTension / maxTension) * 100)
  const scannedParts = Object.keys(tensions).length

  const getInsight = () => {
    if (tensionPercent <= 15) return 'Tu cuerpo está bastante relajado. Buen estado base.'
    if (tensionPercent <= 40) return 'Tensión moderada. La respiración profunda y el estiramiento pueden ayudar.'
    if (tensionPercent <= 65) return 'Nivel alto de tensión corporal. Tu cuerpo está absorbiendo estrés que tu mente no procesa.'
    return 'Tensión muy alta. Tu sistema nervioso está en modo alerta constante. Prioriza la relajación.'
  }

  const tenseParts = bodyParts.filter(p => (tensions[p.id] || 0) >= 2)

  return (
    <div className="relative overflow-hidden">
      <section className="pt-8 pb-6">
        <Container>
          <button onClick={onBack} className="flex items-center gap-2 text-text-secondary text-sm mb-6 active:opacity-70">
            <ArrowLeft className="w-4 h-4" /> Volver
          </button>

          {!done ? (
            <div className="glass rounded-3xl p-6">
              <h2 className="font-heading font-bold text-white text-2xl mb-2 text-center">Body Scan</h2>
              <p className="text-text-secondary text-sm text-center mb-6">Toca cada zona. Toca repetidamente para aumentar el nivel de tensión.</p>

              {/* Body map */}
              <div className="relative mx-auto" style={{ width: '240px', height: '420px' }}>
                {/* Body silhouette line */}
                <div className="absolute left-1/2 top-[12%] bottom-[8%] w-px bg-white/5 -translate-x-1/2" />
                <div className="absolute left-[30%] right-[30%] top-[20%] h-px bg-white/5" />

                {bodyParts.map((part) => {
                  const tension = (tensions[part.id] || 0) as TensionLevel
                  return (
                    <button
                      key={part.id}
                      onClick={() => cycleTension(part.id)}
                      className={`absolute w-16 h-16 -translate-x-1/2 -translate-y-1/2 rounded-2xl border flex flex-col items-center justify-center transition-all active:scale-90 ${tensionColors[tension]}`}
                      style={{ left: `${part.x}%`, top: `${part.y}%` }}
                    >
                      <span className="text-[10px] font-medium">{part.label}</span>
                      <span className="text-[9px] opacity-70">{tensionLabels[tension]}</span>
                    </button>
                  )
                })}
              </div>

              <div className="flex items-center justify-between mt-4 mb-4 text-xs text-text-muted">
                <span>{scannedParts}/{bodyParts.length} zonas</span>
                <div className="flex gap-2">
                  {[0, 1, 2, 3].map((level) => (
                    <div key={level} className="flex items-center gap-1">
                      <div className={`w-2 h-2 rounded-full ${level === 0 ? 'bg-green-500' : level === 1 ? 'bg-cyan-500' : level === 2 ? 'bg-orange-500' : 'bg-red-500'}`} />
                      <span>{tensionLabels[level as TensionLevel]}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setDone(true)}
                disabled={scannedParts < 5}
                className={`w-full py-3 rounded-xl font-medium text-sm transition-all active:scale-95 ${
                  scannedParts >= 5 ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-muted cursor-not-allowed'
                }`}
              >
                Ver resultado ({scannedParts >= 5 ? 'listo' : `mínimo 5 zonas`})
              </button>
            </div>
          ) : (
            <div className="glass rounded-3xl p-6 text-center">
              <h2 className="font-heading font-bold text-white text-2xl mb-6">Tu mapa corporal</h2>

              {/* Tension gauge */}
              <div className="relative inline-flex items-center justify-center mb-6">
                <svg className="w-36 h-36 -rotate-90" viewBox="0 0 144 144">
                  <circle cx="72" cy="72" r="64" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                  <circle
                    cx="72" cy="72" r="64"
                    fill="none"
                    stroke={tensionPercent <= 25 ? '#22c55e' : tensionPercent <= 50 ? '#eab308' : tensionPercent <= 75 ? '#f97316' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 64}`}
                    strokeDashoffset={`${2 * Math.PI * 64 * (1 - tensionPercent / 100)}`}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold text-white">{tensionPercent}%</span>
                  <span className="text-text-muted text-xs">tensión</span>
                </div>
              </div>

              {tenseParts.length > 0 && (
                <div className="bg-red-500/10 rounded-xl p-4 mb-4 text-left">
                  <p className="text-red-400 text-xs font-semibold mb-2">Zonas de atención:</p>
                  <p className="text-red-300 text-sm">{tenseParts.map(p => p.label).join(', ')}</p>
                </div>
              )}

              <div className="bg-white/5 rounded-xl p-4 mb-6">
                <p className="text-white text-sm font-medium">{getInsight()}</p>
              </div>

              <div className="flex gap-3">
                <button onClick={() => { setDone(false); setTensions({}) }} className="flex-1 flex items-center justify-center gap-2 py-3 bg-white/5 rounded-xl text-text-secondary text-sm font-medium active:scale-95 transition-transform">
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
