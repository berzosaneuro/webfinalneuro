'use client'

import { useState } from 'react'
import { ChevronRight, RotateCcw, Sparkles } from 'lucide-react'

const steps = [
  {
    phase: 'Confronta',
    instruction: 'Imagina que te quedan 24 horas de vida.',
    question: '¿Qué harías PRIMERO?',
    placeholder: 'Lo primero que haría es...',
  },
  {
    phase: 'Confronta',
    instruction: 'Piensa en las últimas 24 horas reales que has vivido.',
    question: '¿Cuánto de eso dedicaste a lo que realmente importa?',
    placeholder: 'Dediqué tiempo a...',
  },
  {
    phase: 'Observa',
    instruction: 'Las personas que vuelven de una ECM dicen que el amor y la presencia es lo único real.',
    question: '¿A quién le dirías algo que nunca te has atrevido a decir?',
    placeholder: 'Le diría a...',
  },
  {
    phase: 'Observa',
    instruction: 'Piensa en lo que más te preocupa ahora mismo.',
    question: '¿Importaría eso en tus últimas 24 horas?',
    placeholder: 'Lo que me preocupa es...',
  },
  {
    phase: 'Decide',
    instruction: 'No estás muriendo. Estás vivo. Ahora mismo.',
    question: '¿Qué vas a hacer DIFERENTE a partir de hoy?',
    placeholder: 'A partir de hoy voy a...',
  },
]

export default function ClarityExercise() {
  const [started, setStarted] = useState(false)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<string[]>(Array(steps.length).fill(''))
  const [finished, setFinished] = useState(false)

  const step = steps[currentStep]
  const progress = ((currentStep + 1) / steps.length) * 100

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      setFinished(true)
    }
  }

  const handleRestart = () => {
    setStarted(false)
    setCurrentStep(0)
    setAnswers(Array(steps.length).fill(''))
    setFinished(false)
  }

  if (!started) {
    return (
      <div className="glass rounded-3xl p-6 text-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500/20 to-rose-500/20 flex items-center justify-center mx-auto mb-5">
          <Sparkles className="w-7 h-7 text-violet-400" />
        </div>
        <h3 className="font-heading font-bold text-white text-xl mb-2">Claridad vital</h3>
        <p className="text-text-secondary text-sm mb-2 max-w-sm mx-auto">
          5 preguntas que te dan la perspectiva que otros solo obtienen al borde de la muerte.
        </p>
        <p className="text-text-muted text-xs mb-6">3 minutos de honestidad radical</p>
        <button
          onClick={() => setStarted(true)}
          className="px-6 py-3 bg-gradient-to-r from-violet-500 to-rose-500 text-white rounded-full font-semibold text-sm active:scale-95 transition-transform"
          style={{ boxShadow: '0 0 20px rgba(139,92,246,0.3)' }}
        >
          Empezar ejercicio
        </button>
      </div>
    )
  }

  if (finished) {
    return (
      <div className="glass rounded-3xl p-6">
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-green-500/15 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-6 h-6 text-green-400" />
          </div>
          <h3 className="font-heading font-bold text-white text-xl mb-2">Claridad obtenida</h3>
          <p className="text-text-secondary text-sm">
            Acabas de hacer lo que muchos solo consiguen al borde de la muerte: mirar tu vida con honestidad total.
          </p>
        </div>

        <div className="space-y-3 mb-6">
          {steps.map((s, i) => (
            answers[i] && (
              <div key={i} className="bg-white/5 rounded-xl p-4">
                <p className="text-text-muted text-xs font-medium mb-1">{s.question}</p>
                <p className="text-white text-sm">{answers[i]}</p>
              </div>
            )
          ))}
        </div>

        <div className="rounded-2xl p-4 bg-gradient-to-r from-violet-500/10 to-rose-500/10 border border-white/5 text-center mb-4">
          <p className="text-white text-sm font-medium">
            No necesitaste morir para ver con claridad.
          </p>
          <p className="text-text-secondary text-xs mt-1">
            Repite este ejercicio cada semana. La claridad se entrena.
          </p>
        </div>

        <button
          onClick={handleRestart}
          className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-white/5 text-text-secondary text-sm font-medium active:scale-95 transition-transform"
        >
          <RotateCcw className="w-4 h-4" />
          Repetir ejercicio
        </button>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-6">
      {/* Progress */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs font-semibold text-violet-400 uppercase tracking-wider">{step.phase}</span>
        <span className="text-text-muted text-xs">{currentStep + 1} / {steps.length}</span>
      </div>
      <div className="w-full h-1 bg-white/5 rounded-full mb-6">
        <div
          className="h-1 bg-gradient-to-r from-violet-500 to-rose-500 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Instruction */}
      <p className="text-text-secondary text-sm mb-4 italic">{step.instruction}</p>

      {/* Question */}
      <h3 className="font-heading font-semibold text-white text-lg mb-4">{step.question}</h3>

      {/* Answer */}
      <textarea
        value={answers[currentStep]}
        onChange={(e) => {
          const newAnswers = [...answers]
          newAnswers[currentStep] = e.target.value
          setAnswers(newAnswers)
        }}
        placeholder={step.placeholder}
        rows={3}
        className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white text-sm placeholder:text-text-muted resize-none focus:outline-none focus:border-violet-500/50 transition-colors"
      />

      {/* Next */}
      <button
        onClick={handleNext}
        disabled={!answers[currentStep].trim()}
        className={`flex items-center justify-center gap-2 w-full py-3 mt-4 rounded-xl font-medium text-sm transition-all active:scale-95 ${
          answers[currentStep].trim()
            ? 'bg-gradient-to-r from-violet-500 to-rose-500 text-white'
            : 'bg-white/5 text-text-muted cursor-not-allowed'
        }`}
      >
        {currentStep === steps.length - 1 ? 'Terminar' : 'Siguiente'}
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  )
}
