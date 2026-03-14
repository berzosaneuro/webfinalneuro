/**
 * Progress context for the Elias assistant.
 * Reads from localStorage (client-side only). Used to personalize responses.
 */

import { getAccumulatedScore, getCurrentLevel } from './neuroscore-levels'

export type EliasProgressContext = {
  meditatedToday: boolean
  lastMeditationDate: string | null
  meditationCountLast7Days: number
  plan7CurrentDay: number | null
  plan7CompletedDays: number
  programaCurrentDay: number | null
  programaCompletedDays: number
  neuroscoreToday: { meditated: boolean; exerciseDone: boolean; score: number }
  daysSinceLastActivity: number | null
  trainingCompletedToday: boolean
  neuroscoreLevel: string
  neuroscoreAccumulated: number
  summary: string
}

const AUDIO_KEY = 'neuro_audio_sessions'
const TRAINING_KEY = 'neuro_training_daily'
const PLAN7_KEY = 'plan7_data'
const NEUROSCORE_KEY = 'neuroscore_data'
const PROGRAMA_KEY = 'programa21_data'

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a).getTime()
  const d2 = new Date(b).getTime()
  return Math.floor((d2 - d1) / (24 * 60 * 60 * 1000))
}

export function getProgressContext(): EliasProgressContext | null {
  if (typeof window === 'undefined') return null

  const today = getToday()
  let meditatedToday = false
  let lastMeditationDate: string | null = null
  let meditationCountLast7Days = 0

  try {
    const raw = localStorage.getItem(AUDIO_KEY)
    if (raw) {
      const sessions = JSON.parse(raw) as Array<{ type: string; event: string; timestamp: string }>
      if (Array.isArray(sessions)) {
        const completed = sessions.filter((s) => s.event === 'completed' && s.type === 'meditation')
        const dates = Array.from(new Set(completed.map((s) => s.timestamp.split('T')[0]))).sort().reverse()
        if (dates.length > 0) {
          lastMeditationDate = dates[0]
          meditatedToday = lastMeditationDate === today
          const weekAgo = new Date()
          weekAgo.setDate(weekAgo.getDate() - 7)
          const weekAgoStr = weekAgo.toISOString().split('T')[0]
          meditationCountLast7Days = dates.filter((d) => d >= weekAgoStr).length
        }
      }
    }
  } catch {}

  let plan7CurrentDay: number | null = null
  let plan7CompletedDays = 0
  try {
    const raw = localStorage.getItem(PLAN7_KEY)
    if (raw) {
      const data = JSON.parse(raw) as { completedDays?: number[]; startDate?: string }
      const completed = Array.isArray(data?.completedDays) ? data.completedDays : []
      plan7CompletedDays = completed.length
      if (plan7CompletedDays < 7) plan7CurrentDay = plan7CompletedDays + 1
    }
  } catch {}

  let programaCurrentDay: number | null = null
  let programaCompletedDays = 0
  try {
    const raw = localStorage.getItem(PROGRAMA_KEY)
    if (raw) {
      const data = JSON.parse(raw) as { completedDays?: number[] }
      const completed = Array.isArray(data?.completedDays) ? data.completedDays : []
      programaCompletedDays = completed.length
      if (programaCompletedDays < 21) programaCurrentDay = programaCompletedDays + 1
    }
  } catch {}

  let neuroscoreToday = { meditated: false, exerciseDone: false }
  try {
    const raw = localStorage.getItem(NEUROSCORE_KEY)
    if (raw) {
      const data = JSON.parse(raw) as { logs?: Array<{ date: string; meditated?: boolean; exerciseDone?: boolean }> }
      const logs = Array.isArray(data?.logs) ? data.logs : []
      const todayLog = logs.find((l) => l.date === today)
      if (todayLog) {
        neuroscoreToday = {
          meditated: !!todayLog.meditated,
          exerciseDone: !!todayLog.exerciseDone,
        }
      }
    }
  } catch {}

  let daysSinceLastActivity: number | null = null
  const candidates: string[] = [lastMeditationDate].filter(Boolean) as string[]
  try {
    const nsRaw = localStorage.getItem(NEUROSCORE_KEY)
    if (nsRaw) {
      const ns = JSON.parse(nsRaw) as { logs?: Array<{ date: string }> }
      const lastLog = Array.isArray(ns?.logs)
        ? ns.logs.filter((l) => l.date).sort().reverse()[0]
        : null
      if (lastLog) candidates.push(lastLog.date)
    }
  } catch {}
  if (candidates.length > 0) {
    const last = candidates.sort().reverse()[0]
    daysSinceLastActivity = daysBetween(last, today)
  }

  let trainingCompletedToday = false
  try {
    const raw = localStorage.getItem(TRAINING_KEY)
    if (raw) {
      const data = JSON.parse(raw) as { completions?: Record<string, boolean> }
      trainingCompletedToday = !!(data?.completions?.[today])
    }
  } catch {}

  const parts: string[] = []
  if (!meditatedToday) parts.push('No ha meditado hoy')
  else parts.push('Ya meditó hoy')
  if (meditationCountLast7Days > 0) parts.push(`${meditationCountLast7Days} sesiones de meditación en los últimos 7 días`)
  if (plan7CurrentDay) parts.push(`Está en el reto de 7 días, día ${plan7CurrentDay} de 7 (completados: ${plan7CompletedDays})`)
  if (programaCurrentDay) parts.push(`Está en el programa de 21 días, día ${programaCurrentDay} (completados: ${programaCompletedDays})`)
  if (daysSinceLastActivity !== null && daysSinceLastActivity > 3)
    parts.push(`Inactivo desde hace ${daysSinceLastActivity} días`)
  if (!trainingCompletedToday) parts.push('No ha completado el entrenamiento N.E.U.R.O. del día')
  else parts.push('Ya completó el entrenamiento N.E.U.R.O. del día')

  let neuroscoreAccumulated = 0
  let neuroscoreLevel = 'Observador'
  try {
    const nsRaw = localStorage.getItem(NEUROSCORE_KEY)
    if (nsRaw) {
      const ns = JSON.parse(nsRaw) as { logs?: Array<{ date: string } & Record<string, unknown>> }
      const logs = (Array.isArray(ns?.logs) ? ns.logs : []) as Array<{ date: string } & Record<string, unknown>>
      const calc = (l: Record<string, unknown>) => {
        let s = 0
        if (l.meditated) s += 30
        if (l.exercise_done || l.exerciseDone) s += 25
        if (l.test_done || l.testDone) s += 15
        if (l.despertar_done || l.despertarDone) s += 15
        if (l.journal_done || l.journalDone) s += 15
        if (l.training_done || l.trainingDone) s += 10
        return s
      }
      neuroscoreAccumulated = getAccumulatedScore(
        logs as Array<{ date: string } & Record<string, unknown>>,
        (l) => calc(l)
      )
      neuroscoreLevel = getCurrentLevel(neuroscoreAccumulated).name
      parts.push(`NeuroScore nivel: ${neuroscoreLevel}, acumulado: ${neuroscoreAccumulated}`)
    }
  } catch {}

  return {
    meditatedToday,
    lastMeditationDate,
    meditationCountLast7Days,
    plan7CurrentDay,
    plan7CompletedDays,
    programaCurrentDay,
    programaCompletedDays,
    neuroscoreToday: { ...neuroscoreToday, score: 0 },
    daysSinceLastActivity,
    trainingCompletedToday,
    neuroscoreLevel,
    neuroscoreAccumulated,
    summary: parts.length > 0 ? parts.join('. ') : 'Usuario nuevo o sin datos de progreso',
  }
}
