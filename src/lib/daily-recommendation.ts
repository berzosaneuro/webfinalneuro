/**
 * Daily recommendation logic for "Recomendación de Elías para hoy".
 * Uses existing tracking data. No extra storage.
 */

const AUDIO_KEY = 'neuro_audio_sessions'
const TRAINING_KEY = 'neuro_training_daily'
const PLAN7_KEY = 'plan7_data'
const PROGRAMA_KEY = 'programa21_data'
const RETOS_KEY = 'neuro_retos'
const RETO_ACTIVO_KEY = 'neuro_reto_activo'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

export type Recommendation = {
  type: 'meditation' | 'challenge' | 'training'
  title: string
  description: string
  href: string
}

function hasMeditatedToday(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(AUDIO_KEY)
    if (!raw) return false
    const sessions = JSON.parse(raw) as Array<{ type: string; event: string; timestamp: string }>
    const completed = sessions.filter((s) => s.event === 'completed' && s.type === 'meditation')
    const today = getToday()
    return completed.some((s) => s.timestamp.startsWith(today))
  } catch { return false }
}

function hasTrainingCompletedToday(): boolean {
  if (typeof window === 'undefined') return false
  try {
    const raw = localStorage.getItem(TRAINING_KEY)
    if (!raw) return false
    const data = JSON.parse(raw) as { completions?: Record<string, boolean> }
    return !!(data?.completions?.[getToday()])
  } catch { return false }
}

function getPlan7NextDay(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PLAN7_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { completedDays?: number[] }
    const completed = Array.isArray(data?.completedDays) ? data.completedDays : []
    if (completed.length >= 7) return null
    return completed.length + 1
  } catch { return null }
}

function getProgramaNextDay(): number | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROGRAMA_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as { completedDays?: number[] }
    const completed = Array.isArray(data?.completedDays) ? data.completedDays : []
    if (completed.length >= 21) return null
    return completed.length + 1
  } catch { return null }
}

function getRetoActiveDay(): { day: number; total: number } | null {
  if (typeof window === 'undefined') return null
  try {
    const activeId = localStorage.getItem(RETO_ACTIVO_KEY)
    if (!activeId) return null
    const raw = localStorage.getItem(RETOS_KEY)
    if (!raw) return null
    const progress = JSON.parse(raw) as Record<string, number[]>
    const days = progress[activeId] || []
    const todayNum = new Date(getToday()).getTime()
    if (days.includes(todayNum)) return null
    return { day: days.length + 1, total: 7 }
  } catch { return null }
}

/** Get today's recommendation based on user activity */
export function getDailyRecommendation(): Recommendation {
  const meditated = hasMeditatedToday()
  const trainingDone = hasTrainingCompletedToday()
  const plan7Day = getPlan7NextDay()
  const programaDay = getProgramaNextDay()
  const retoDay = getRetoActiveDay()

  if (!meditated) {
    return {
      type: 'meditation',
      title: 'Meditación guiada',
      description: '3–5 minutos. Anclas el día antes de que la cabeza arranque sola.',
      href: '/meditacion',
    }
  }

  if (retoDay) {
    return {
      type: 'challenge',
      title: `Reto día ${retoDay.day}`,
      description: `Reto activo: día ${retoDay.day} de ${retoDay.total}. Un paso y listo.`,
      href: '/retos',
    }
  }

  if (plan7Day) {
    return {
      type: 'challenge',
      title: `Reto 7 días — Día ${plan7Day}`,
      description: 'Siguiente día del plan gratuito. Una letra del método, un ejercicio.',
      href: '/plan-7-dias',
    }
  }

  if (programaDay) {
    return {
      type: 'challenge',
      title: `Programa 21 días — Día ${programaDay}`,
      description: 'Sigue el día que toca. El calendario te mantiene en ritmo.',
      href: '/programa',
    }
  }

  if (!trainingDone) {
    return {
      type: 'training',
      title: 'Entrenamiento N.E.U.R.O. del día',
      description: 'El ejercicio de observación de hoy está en inicio. Márcalo cuando lo hagas.',
      href: '/',
    }
  }

  return {
    type: 'training',
    title: 'Base del día cubierta',
    description: 'Meditación y entrenamiento hechos. Explora o descansa; el día cuenta.',
    href: '/meditacion',
  }
}
