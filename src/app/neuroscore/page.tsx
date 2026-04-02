'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { useUser } from '@/context/UserContext'
import { Activity, Flame, Brain, Target, TrendingUp, ChevronRight, Trophy, Zap } from 'lucide-react'
import Link from 'next/link'
import EmailCapture from '@/components/EmailCapture'
import { isCompletedToday } from '@/lib/daily-training'
import { getAccumulatedScore, getCurrentLevel, getNextLevel, getPointsToNextLevel } from '@/lib/neuroscore-levels'
import { getDisplayStreak } from '@/lib/streak'
import { getMeditationCount, getTrainingDaysCount } from '@/lib/progress-stats'
import DailyCheckin from '@/components/DailyCheckin'

const STORAGE_KEY = 'neuroscore_data'

type DayLog = {
  date: string
  meditated: boolean
  exerciseDone: boolean
  testDone: boolean
  despertarDone: boolean
  journalDone: boolean
  trainingDone?: boolean
}

function getToday() {
  return new Date().toISOString().split('T')[0]
}

function loadData(): { logs: DayLog[]; streak: number } {
  if (typeof window === 'undefined') return { logs: [], streak: 0 }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { logs: [], streak: 0 }
}

function saveData(data: { logs: DayLog[]; streak: number }) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

function calculateScore(log: DayLog): number {
  let score = 0
  if (log.meditated) score += 30
  if (log.exerciseDone) score += 25
  if (log.testDone) score += 15
  if (log.despertarDone) score += 15
  if (log.journalDone) score += 15
  if (log.trainingDone) score += 10
  return score
}

function calculateStreak(logs: DayLog[]): number {
  let streak = 0
  const sorted = [...logs].sort((a, b) => b.date.localeCompare(a.date))
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().split('T')[0]
    const log = sorted.find((l) => l.date === dateStr)
    if (log && calculateScore(log) > 0) {
      streak++
    } else if (i > 0) {
      break
    }
  }
  return streak
}

type NeuroRow = { date: string; meditated?: boolean; exercise_done?: boolean; test_done?: boolean; despertar_done?: boolean; journal_done?: boolean; training_done?: boolean }

function apiToDayLog(row: NeuroRow): DayLog {
  return {
    date: row.date,
    meditated: row.meditated ?? false,
    exerciseDone: row.exercise_done ?? false,
    testDone: row.test_done ?? false,
    despertarDone: row.despertar_done ?? false,
    journalDone: row.journal_done ?? false,
    trainingDone: row.training_done ?? false,
  }
}

export default function NeuroScorePage() {
  const { user } = useUser()
  const [data, setData] = useState<{ logs: DayLog[]; streak: number }>({ logs: [], streak: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const today = getToday()
    const load = async () => {
      let result: { logs: DayLog[]; streak: number }
      if (user?.email) {
        try {
          const res = await fetch(`/api/neuroscore?email=${encodeURIComponent(user.email)}`)
          if (res.ok) {
            const rows: NeuroRow[] = await res.json()
            const logs = rows.map(apiToDayLog)
            result = { logs, streak: calculateStreak(logs) }
          } else {
            result = loadData()
          }
        } catch {
          result = loadData()
        }
      } else {
        result = loadData()
      }
      if (isCompletedToday()) {
        const todayLog = result.logs.find((l) => l.date === today)
        const updated = { ...(todayLog || { date: today, meditated: false, exerciseDone: false, testDone: false, despertarDone: false, journalDone: false }), trainingDone: true }
        result = {
          logs: [...result.logs.filter((l) => l.date !== today), updated],
          streak: calculateStreak([...result.logs.filter((l) => l.date !== today), updated]),
        }
      }
      setData(result)
    }
    load()
  }, [user?.email])

  const today = getToday()
  const todayLog = data.logs.find((l) => l.date === today) || {
    date: today,
    meditated: false,
    exerciseDone: false,
    testDone: false,
    despertarDone: false,
    journalDone: false,
    trainingDone: false,
  }

  const todayScore = calculateScore(todayLog)
  const maxScore = 110
  const streak = getDisplayStreak()
  const accumulatedScore = getAccumulatedScore(data.logs, calculateScore)
  const currentLevel = getCurrentLevel(accumulatedScore)
  const nextLevel = getNextLevel(accumulatedScore)
  const pointsToNext = getPointsToNextLevel(accumulatedScore)
  const circumference = 2 * Math.PI * 80
  const scoreOffset = circumference * (1 - Math.min(todayScore, maxScore) / maxScore)

  const toggleTask = async (key: keyof Omit<DayLog, 'date'>) => {
    const updated = { ...todayLog, [key]: !todayLog[key] }
    const newLogs = data.logs.filter((l) => l.date !== today)
    newLogs.push(updated)
    const newStreak = calculateStreak(newLogs)
    const newData = { logs: newLogs, streak: newStreak }
    setData(newData)
    if (user?.email) {
      try {
        const res = await fetch('/api/neuroscore', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            date: today,
            meditated: updated.meditated,
            exerciseDone: updated.exerciseDone,
            testDone: updated.testDone,
            despertarDone: updated.despertarDone,
            journalDone: updated.journalDone,
          }),
        })
        if (!res.ok) throw new Error()
      } catch {
        saveData(newData)
      }
    } else {
      saveData(newData)
    }
  }

  const tasks = [
    { key: 'meditated' as const, label: 'Meditar', desc: 'Cualquier sesión', icon: Brain, points: 30, href: '/meditacion' },
    { key: 'exerciseDone' as const, label: 'Ejercicio NEURO', desc: 'Método u observación de la mente', icon: Target, points: 25, href: '/metodo' },
    { key: 'trainingDone' as const, label: 'Entrenamiento del día', desc: 'Ejercicio N.E.U.R.O. diario', icon: Target, points: 10, href: '/' },
    { key: 'testDone' as const, label: 'Test completado', desc: 'Test de ruido mental', icon: Activity, points: 15, href: '/test' },
    { key: 'despertarDone' as const, label: 'Despertar', desc: 'Claridad vital', icon: Zap, points: 15, href: '/despertar' },
    { key: 'journalDone' as const, label: 'Diario', desc: 'Reflexión escrita', icon: TrendingUp, points: 15, href: '/diario' },
  ]

  // Weekly mini-chart
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    const dateStr = d.toISOString().split('T')[0]
    const log = data.logs.find((l) => l.date === dateStr)
    return {
      day: ['D', 'L', 'M', 'X', 'J', 'V', 'S'][d.getDay()],
      score: log ? calculateScore(log) : 0,
      isToday: dateStr === today,
    }
  })

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-72 h-72 bg-green-600 top-10 -right-24" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-1 animate-fade-in">
            NeuroScore
          </h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">
            Hábitos del día en un número. Lo que haces cuenta en la pantalla.
          </p>
        </Container>
      </section>

      {/* Score + Streak */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 flex flex-col items-center">
              {/* Circular score */}
              <div className="relative inline-flex items-center justify-center mb-4">
                <svg className="w-44 h-44 -rotate-90" viewBox="0 0 176 176">
                  <circle cx="88" cy="88" r="80" fill="none" stroke="rgba(255,255,255,0.04)" strokeWidth="8" />
                  <circle
                    cx="88" cy="88" r="80"
                    fill="none"
                    stroke={todayScore >= 70 ? '#22c55e' : todayScore >= 40 ? '#eab308' : '#ef4444'}
                    strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={circumference}
                    strokeDashoffset={scoreOffset}
                    className="transition-all duration-1000 ease-out"
                    style={{ filter: `drop-shadow(0 0 10px ${todayScore >= 70 ? 'rgba(34,197,94,0.4)' : todayScore >= 40 ? 'rgba(234,179,8,0.3)' : 'rgba(239,68,68,0.3)'})` }}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="font-heading text-4xl font-bold text-white">{todayScore}</span>
                  <span className="text-text-muted text-xs">/ {maxScore}</span>
                </div>
              </div>

              {/* Level evolution */}
              <div className="w-full mb-4 px-2 py-3 rounded-xl bg-white/5 border border-white/5">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-text-muted text-xs">Nivel actual</span>
                  <span className="text-accent-blue text-sm font-semibold">{currentLevel.name}</span>
                </div>
                <p className="text-text-secondary text-xs mb-2">{currentLevel.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-text-muted">Acumulado: <span className="text-white font-medium">{accumulatedScore}</span> pts</span>
                  {nextLevel && pointsToNext !== null && (
                    <span className="text-accent-blue">Siguiente: {nextLevel.name} ({pointsToNext} pts)</span>
                  )}
                </div>
              </div>

              {/* Streak */}
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <Flame className={`w-5 h-5 ${streak > 0 ? 'text-orange-400' : 'text-text-muted'}`} />
                  <div>
                    <span className="text-white font-bold text-lg">{streak}</span>
                    <span className="text-text-muted text-xs ml-1">días de entrenamiento mental</span>
                  </div>
                </div>
                <div className="w-px h-8 bg-white/10" />
                <div className="flex items-center gap-2">
                  <Trophy className={`w-5 h-5 ${todayScore >= maxScore ? 'text-emerald-400' : 'text-text-muted'}`} />
                  <div>
                    <span className="text-white font-bold text-lg">{data.logs.filter(l => calculateScore(l) >= maxScore).length}</span>
                    <span className="text-text-muted text-xs ml-1">días perfectos</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Personal Progress Panel */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Tu progreso</h2>
            <div className="grid grid-cols-2 gap-3">
              <div className="glass rounded-2xl p-4">
                <Brain className="w-5 h-5 text-accent-blue mb-1" />
                <span className="text-white font-bold text-lg">{getMeditationCount()}</span>
                <p className="text-text-muted text-[10px]">Meditaciones completadas</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <Target className="w-5 h-5 text-emerald-400 mb-1" />
                <span className="text-white font-bold text-lg">{getTrainingDaysCount()}</span>
                <p className="text-text-muted text-[10px]">Entrenamientos diarios</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <Flame className="w-5 h-5 text-orange-400 mb-1" />
                <span className="text-white font-bold text-lg">{streak}</span>
                <p className="text-text-muted text-[10px]">Racha actual</p>
              </div>
              <div className="glass rounded-2xl p-4">
                <Trophy className="w-5 h-5 text-amber-400 mb-1" />
                <span className="text-white font-bold text-lg">{currentLevel.name}</span>
                <p className="text-text-muted text-[10px]">Nivel NeuroScore</p>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Daily check-in */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <DailyCheckin />
          </FadeInSection>
        </Container>
      </section>

      {/* Weekly chart */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Esta semana</h2>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-end justify-between gap-2 h-24">
                {last7.map((day, i) => (
                  <div key={i} className="flex flex-col items-center gap-1 flex-1">
                    <div className="w-full flex items-end justify-center h-16">
                      <div
                        className={`w-6 rounded-t-lg transition-all duration-500 ${
                          day.score >= 70 ? 'bg-green-500/60' : day.score >= 40 ? 'bg-cyan-500/60' : day.score > 0 ? 'bg-red-500/40' : 'bg-white/5'
                        }`}
                        style={{ height: `${Math.max(day.score * 0.64, 4)}px` }}
                      />
                    </div>
                    <span className={`text-[10px] font-medium ${day.isToday ? 'text-accent-blue' : 'text-text-muted'}`}>
                      {day.day}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Daily tasks */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Entrenamiento de hoy</h2>
            <div className="space-y-2.5">
              {tasks.map((task) => {
                const done = todayLog[task.key]
                return (
                  <div key={task.key} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <button
                      onClick={() => toggleTask(task.key)}
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                        done
                          ? 'bg-green-500/20 text-green-400'
                          : 'bg-white/5 text-text-muted'
                      }`}
                    >
                      <task.icon className="w-5 h-5" />
                    </button>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${done ? 'text-green-400 line-through' : 'text-white'}`}>
                        {task.label}
                      </p>
                      <p className="text-text-muted text-xs">{task.desc}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-xs font-semibold ${done ? 'text-green-400' : 'text-text-muted'}`}>
                        +{task.points}
                      </span>
                      {task.href !== '#' && (
                        <Link href={task.href}>
                          <ChevronRight className="w-4 h-4 text-text-muted" />
                        </Link>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Email capture for progress sync */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <EmailCapture
              source="neuroscore"
              title="Sincroniza tu progreso"
              subtitle="Opcional: resumen semanal por email con NeuroScore y racha."
              buttonText="Activar resumen"
              extraData={{ todayScore, streak, perfectDays: data.logs.filter(l => calculateScore(l) >= maxScore).length }}
            />
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
