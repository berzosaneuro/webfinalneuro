'use client'

import { useState, useEffect } from 'react'
import { Target, Check } from 'lucide-react'
import {
  getTodayExercise,
  loadDailyTraining,
  saveDailyTraining,
  calculateStreak,
  isCompletedToday,
  NEUROSCORE_POINTS,
} from '@/lib/daily-training'
import { useUser } from '@/context/UserContext'

const NEUROSCORE_KEY = 'neuroscore_data'

function addTrainingToNeuroScore(email?: string | null) {
  if (typeof window === 'undefined') return
  const today = new Date().toISOString().split('T')[0]
  try {
    const raw = localStorage.getItem(NEUROSCORE_KEY)
    const data = raw ? JSON.parse(raw) : { logs: [], streak: 0 }
    const logs = Array.isArray(data.logs) ? data.logs : []
    const todayLog = logs.find((l: { date: string }) => l.date === today) || {
      date: today,
      meditated: false,
      exerciseDone: false,
      testDone: false,
      despertarDone: false,
      journalDone: false,
      trainingDone: false,
    }
    const updated = { ...todayLog, trainingDone: true }
    const newLogs = logs.filter((l: { date: string }) => l.date !== today)
    newLogs.push(updated)
    const score =
      (updated.meditated ? 30 : 0) +
      (updated.exerciseDone ? 25 : 0) +
      (updated.testDone ? 15 : 0) +
      (updated.despertarDone ? 15 : 0) +
      (updated.journalDone ? 15 : 0) +
      (updated.trainingDone ? NEUROSCORE_POINTS : 0)
    const newData = { logs: newLogs, streak: data.streak ?? 0 }
    localStorage.setItem(NEUROSCORE_KEY, JSON.stringify(newData))

    if (email) {
      fetch('/api/neuroscore', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          date: today,
          meditated: updated.meditated,
          exerciseDone: updated.exerciseDone,
          testDone: updated.testDone,
          despertarDone: updated.despertarDone,
          journalDone: updated.journalDone,
          trainingDone: true,
        }),
      }).catch(() => {})
    }
  } catch {}
}

export default function DailyTrainingSection() {
  const { user } = useUser()
  const [completed, setCompleted] = useState(false)
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = loadDailyTraining()
    setCompleted(isCompletedToday())
    setStreak(data.streak)
  }, [])

  const handleComplete = () => {
    if (completed) return
    const today = new Date().toISOString().split('T')[0]
    const data = loadDailyTraining()
    const newCompletions = { ...data.completions, [today]: true }
    const newStreak = calculateStreak(newCompletions)
    saveDailyTraining({ completions: newCompletions, streak: newStreak })
    addTrainingToNeuroScore(user?.email)
    setCompleted(true)
    setStreak(newStreak)
  }

  if (!mounted) return null

  const exercise = getTodayExercise()

  return (
    <div className="glass rounded-3xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="relative">
          <div className="flex items-center gap-2 mb-3">
            <Target className="w-4 h-4 text-accent-blue" />
            <span className="text-xs font-semibold text-accent-blue uppercase tracking-wider">
              Entrenamiento N.E.U.R.O. del día
            </span>
            {streak > 0 && (
              <span className="ml-auto text-xs font-medium text-text-muted">
                Racha: {streak} {streak === 1 ? 'día' : 'días'}
              </span>
            )}
          </div>
          <h3 className="font-heading font-semibold text-white text-base mb-2">{exercise.title}</h3>
          <p className="text-text-secondary text-sm leading-relaxed mb-4">{exercise.text}</p>
          {completed ? (
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-emerald-500/10 text-emerald-400 text-sm font-medium">
              <Check className="w-4 h-4" />
              Completado hoy (+{NEUROSCORE_POINTS} NeuroScore)
            </div>
          ) : (
            <button
              type="button"
              onClick={handleComplete}
              className="w-full py-3 rounded-xl bg-accent-blue text-white font-medium text-sm hover:bg-accent-blue-hover active:scale-[0.98] transition-all"
            >
              Completar entrenamiento
            </button>
          )}
        </div>
    </div>
  )
}
