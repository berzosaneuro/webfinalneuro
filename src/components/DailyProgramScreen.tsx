'use client'

import { useState, useEffect } from 'react'
import { Play, Target, Flame } from 'lucide-react'
import programsData from '@/data/programs.json'
import type { Program, ProgramDay, UserDailyProgress } from '@/lib/types'

const PROGRESS_KEY = 'user_daily_program_progress'
const USER_ID = 'default'

type ProgramsJson = {
  programs: Array<{ id: string; name: string; durationDays: number; mainGoal: string }>
  programDays: Array<{
    id: string
    programId: string
    dayNumber: number
    title: string
    notificationCopy: string
  }>
}

function loadProgress(): UserDailyProgress | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(PROGRESS_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return null
}

function saveProgress(progress: UserDailyProgress) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(progress))
  } catch {}
}

export default function DailyProgramScreen() {
  const [progress, setProgress] = useState<UserDailyProgress | null>(null)
  const [program, setProgram] = useState<Program | null>(null)
  const [todayDay, setTodayDay] = useState<ProgramDay | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const data = programsData as ProgramsJson
    const prog = loadProgress()

    if (prog && prog.currentProgramId) {
      const p = data.programs.find((x) => x.id === prog.currentProgramId)
      if (p) {
        setProgress(prog)
        setProgram(p as Program)
        const day = data.programDays.find(
          (d) => d.programId === prog.currentProgramId && d.dayNumber === prog.currentDay
        )
        if (day) setTodayDay(day as unknown as ProgramDay)
        else {
          const nextDay = data.programDays.find(
            (d) => d.programId === prog.currentProgramId && d.dayNumber === prog.currentDay
          )
          if (nextDay) setTodayDay(nextDay as unknown as ProgramDay)
        }
      }
    }

    if (!prog || !prog.currentProgramId) {
      setProgress(null)
      setProgram(null)
      setTodayDay(null)
    }
  }, [])

  const handleStartPractice = () => {
    if (!progress || !program) return
    window.location.href = '/meditacion'
  }

  const assignProgram = (programId: string) => {
    const data = programsData as ProgramsJson
    const p = data.programs.find((x) => x.id === programId)
    if (!p) return
    const newProgress: UserDailyProgress = {
      userId: USER_ID,
      currentProgramId: programId,
      currentDay: 1,
      streakDays: progress?.streakDays ?? 0,
      preferredTime: progress?.preferredTime ?? 'morning',
    }
    setProgress(newProgress)
    setProgram(p as Program)
    saveProgress(newProgress)
    const day1 = data.programDays.find((d) => d.programId === programId && d.dayNumber === 1)
    if (day1) setTodayDay(day1 as unknown as ProgramDay)
  }

  const completeToday = () => {
    if (!progress || !program) return
    const data = programsData as ProgramsJson
    const nextDay = progress.currentDay + 1
    if (nextDay > program.durationDays) {
      return
    }
    const newProgress: UserDailyProgress = {
      ...progress,
      currentDay: nextDay,
      streakDays: progress.streakDays + 1,
    }
    setProgress(newProgress)
    saveProgress(newProgress)
    const dayEntry = data.programDays.find(
      (d) => d.programId === program.id && d.dayNumber === nextDay
    )
    if (dayEntry) setTodayDay(dayEntry as unknown as ProgramDay)
  }

  if (!mounted) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!program && !progress) {
    const data = programsData as ProgramsJson
    return (
      <div className="space-y-4">
        <p className="text-text-secondary text-sm">Elige un programa para comenzar:</p>
        <div className="space-y-2">
          {data.programs.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => assignProgram(p.id)}
              className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left"
            >
              <Target className="w-5 h-5 text-accent-blue" />
              <div>
                <p className="text-white font-medium">{p.name}</p>
                <p className="text-text-muted text-xs">{p.durationDays} días</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="glass rounded-3xl p-5 space-y-4">
      <div className="flex items-center gap-2">
        <Target className="w-5 h-5 text-accent-blue" />
        <h3 className="font-heading font-semibold text-white">{program?.name}</h3>
      </div>
      <div className="flex items-center gap-2">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-text-secondary text-sm">
          Día {progress?.currentDay ?? 1} / {program?.durationDays ?? 0}
        </span>
        {progress && progress.streakDays > 0 && (
          <span className="text-orange-400 text-xs">• {progress.streakDays} días racha</span>
        )}
      </div>
      {todayDay && (
        <>
          <p className="text-white font-medium">{todayDay.title}</p>
          <button
            type="button"
            onClick={() => {
              completeToday()
              handleStartPractice()
            }}
            className="w-full py-3 rounded-xl bg-accent-blue text-white font-medium flex items-center justify-center gap-2 hover:bg-accent-blue-hover transition-colors"
          >
            <Play className="w-4 h-4" />
            Iniciar práctica
          </button>
        </>
      )}
    </div>
  )
}
