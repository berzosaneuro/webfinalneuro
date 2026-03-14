/**
 * NeuroScore Evolution System
 * Niveles de progreso basados en NeuroScore acumulado.
 */

export type NeuroScoreLevel = {
  id: number
  name: string
  minScore: number
  description: string
}

export const LEVELS: NeuroScoreLevel[] = [
  { id: 1, name: 'Observador', minScore: 0, description: 'Empiezas a observar tu mente' },
  { id: 2, name: 'Regulador', minScore: 500, description: 'Regulas mejor tus respuestas' },
  { id: 3, name: 'Metacognitivo', minScore: 1500, description: 'Piensas sobre tu pensamiento' },
  { id: 4, name: 'Integración', minScore: 3500, description: 'Integras las prácticas en tu día' },
  { id: 5, name: 'Supra-consciente', minScore: 7000, description: 'Consciencia ampliada y estable' },
]

/** Calcula el NeuroScore total acumulado a partir de los logs */
export function getAccumulatedScore<T extends { date: string }>(
  logs: T[],
  calculateScore: (log: T) => number
): number {
  if (!logs?.length) return 0
  return logs.reduce((sum, log) => sum + calculateScore(log), 0)
}

/** Obtiene el nivel actual según el score acumulado */
export function getCurrentLevel(accumulatedScore: number): NeuroScoreLevel {
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (accumulatedScore >= LEVELS[i].minScore) return LEVELS[i]
  }
  return LEVELS[0]
}

/** Obtiene el siguiente nivel (o null si ya está en el máximo) */
export function getNextLevel(accumulatedScore: number): NeuroScoreLevel | null {
  const current = getCurrentLevel(accumulatedScore)
  const next = LEVELS.find((l) => l.id === current.id + 1)
  return next ?? null
}

/** Puntos restantes para el siguiente nivel */
export function getPointsToNextLevel(accumulatedScore: number): number | null {
  const next = getNextLevel(accumulatedScore)
  if (!next) return null
  return next.minScore - accumulatedScore
}
