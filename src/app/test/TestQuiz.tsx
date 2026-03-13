'use client'

import { useState, useEffect } from 'react'
import Card from '@/components/Card'
import Button from '@/components/Button'
import EmailCapture from '@/components/EmailCapture'
import { useUser } from '@/context/UserContext'

const questions = [
  '¿Con qué frecuencia te descubres pensando en el pasado sin motivo?',
  '¿Cuántas veces al día sientes ansiedad por el futuro?',
  '¿Te cuesta mantener la atención en una sola tarea?',
  '¿Tu mente se acelera cuando intentas dormir?',
  '¿Reaccionas emocionalmente antes de procesar la situación?',
  '¿Sientes que tus días pasan demasiado rápido sin estar presente?',
  '¿Tienes diálogos mentales repetitivos contigo mismo?',
  '¿Te comparas frecuentemente con otros?',
  '¿Te cuesta estar en silencio sin hacer nada?',
  '¿Sientes que tu mente nunca para?',
]

const levels = [
  {
    range: [10, 20],
    level: 'Nivel 1 — Mente tranquila',
    interpretation: 'Tu ruido mental es bajo. Tienes buena capacidad de presencia y regulación.',
    recommendation: 'Mantén tu práctica actual. Puedes profundizar con meditaciones de presencia profunda y observación del ego.',
  },
  {
    range: [21, 28],
    level: 'Nivel 2 — Ruido leve',
    interpretation: 'Tienes momentos de ruido mental, pero en general manejas bien tu atención.',
    recommendation: 'Incorpora 5-10 minutos diarios de atención focalizada. El Método N.E.U.R.O. puede ayudarte a fortalecer tu práctica.',
  },
  {
    range: [29, 36],
    level: 'Nivel 3 — Ruido moderado',
    interpretation: 'Tu mente genera ruido con frecuencia. Hay patrones de rumiación o ansiedad que consumen energía.',
    recommendation: 'Necesitas un entrenamiento estructurado. Empieza con el plan de 7 días y practica el Método N.E.U.R.O. diariamente.',
  },
  {
    range: [37, 44],
    level: 'Nivel 4 — Ruido alto',
    interpretation: 'El ruido mental domina gran parte de tu día. Pilotas en automático con frecuencia.',
    recommendation: 'Es urgente que empieces a entrenar tu atención. Descarga el plan de 7 días y empieza hoy. La meditación diaria es fundamental.',
  },
  {
    range: [45, 50],
    level: 'Nivel 5 — Ruido extremo',
    interpretation: 'Tu mente está en modo hiperactivo constante. Esto afecta tu bienestar, tus decisiones y tu descanso.',
    recommendation: 'Necesitas intervención inmediata. Empieza con las meditaciones de Reinicio Mental y Ansiedad. Sigue el plan de 7 días sin excepciones.',
  },
]

function getLevel(score: number) {
  return levels.find((l) => score >= l.range[0] && score <= l.range[1]) || levels[levels.length - 1]
}

export default function TestQuiz() {
  const { user } = useUser()
  const [answers, setAnswers] = useState<number[]>(new Array(10).fill(0))
  const [showResult, setShowResult] = useState(false)

  const score = answers.reduce((a, b) => a + b, 0)
  const result = getLevel(score)

  useEffect(() => {
    if (showResult) {
      fetch('/api/test-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userEmail: user?.email ?? '',
          score,
          level: result.level,
          answers,
        }),
      }).catch(() => {})
    }
  }, [showResult, score, result.level, answers, user?.email])
  const allAnswered = answers.every((a) => a > 0)

  const setAnswer = (qi: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[qi] = value
    setAnswers(newAnswers)
  }

  if (showResult) {
    return (
      <div className="max-w-2xl mx-auto">
        <Card className="text-center">
          <div className="mb-6">
            <span className="text-6xl font-heading font-bold text-accent-blue">{score}</span>
            <span className="text-text-secondary text-lg"> / 50</span>
          </div>
          <h2 className="font-heading text-2xl font-bold text-white mb-4">{result.level}</h2>
          <p className="text-text-secondary mb-6">{result.interpretation}</p>
          <div className="p-4 bg-dark-primary rounded-lg border border-dark-border mb-8">
            <h3 className="text-accent-blue font-semibold text-sm uppercase tracking-wider mb-2">Recomendación</h3>
            <p className="text-text-secondary text-sm">{result.recommendation}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
            <Button href="/metodo">Ver Método N.E.U.R.O.</Button>
            <Button
              variant="secondary"
              onClick={() => {
                setShowResult(false)
                setAnswers(new Array(10).fill(0))
              }}
            >
              Repetir test
            </Button>
          </div>

          <EmailCapture
            source="test-ruido-mental"
            title="Guarda tu resultado"
            subtitle="Recibe tu análisis por email y haz seguimiento de tu progreso."
            buttonText="Enviar"
            extraData={{ score, level: result.level, answers }}
          />
        </Card>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {questions.map((q, qi) => (
        <Card key={qi}>
          <p className="text-white font-medium mb-4">
            <span className="text-accent-blue font-mono text-sm mr-2">{qi + 1}.</span>
            {q}
          </p>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((v) => (
              <button
                key={v}
                onClick={() => setAnswer(qi, v)}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all cursor-pointer ${
                  answers[qi] === v
                    ? 'bg-accent-blue text-white glow-blue'
                    : 'bg-dark-primary border border-dark-border text-text-secondary hover:border-accent-blue/50'
                }`}
              >
                {v}
              </button>
            ))}
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-text-secondary text-xs">Nunca</span>
            <span className="text-text-secondary text-xs">Siempre</span>
          </div>
        </Card>
      ))}

      <div className="text-center pt-6">
        <button
          onClick={() => allAnswered && setShowResult(true)}
          disabled={!allAnswered}
          className={`px-8 py-3 rounded-lg font-medium text-sm transition-all cursor-pointer ${
            allAnswered
              ? 'bg-accent-blue text-white hover:bg-accent-blue-hover glow-blue glow-blue-hover'
              : 'bg-dark-surface text-text-secondary border border-dark-border cursor-not-allowed'
          }`}
        >
          Ver resultado
        </button>
        {!allAnswered && (
          <p className="text-text-secondary text-xs mt-3">Responde todas las preguntas para ver tu resultado.</p>
        )}
      </div>
    </div>
  )
}
