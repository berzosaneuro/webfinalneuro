/**
 * Daily Training Program scheduler.
 * ADD-ONLY: Independent from existing cron jobs.
 * Opt-in: only runs when user has activated the daily program.
 */

import { sendDailyNotification } from './notificationService'

const PROGRESS_KEY = 'user_daily_program_progress'
const PREFERENCES_KEY = 'user_training_preferences'

type UserProgress = {
  userId: string
  currentProgramId: string
  currentDay: number
  streakDays: number
  preferredTime: string
}

type UserPreferences = {
  preferredTime?: 'morning' | 'midday' | 'evening'
  extraReminder?: boolean
}

function getUsersWithPreferences(): Array<{ userId: string; progress: UserProgress; prefs: UserPreferences }> {
  if (typeof window === 'undefined') return []
  const users: Array<{ userId: string; progress: UserProgress; prefs: UserPreferences }> = []
  try {
    const progressRaw = localStorage.getItem(PROGRESS_KEY)
    const prefsRaw = localStorage.getItem(PREFERENCES_KEY)
    if (!progressRaw) return []
    const progress = JSON.parse(progressRaw) as UserProgress
    const prefs: UserPreferences = prefsRaw ? JSON.parse(prefsRaw) : {}
    users.push({ userId: progress.userId, progress, prefs })
  } catch {}
  return users
}

/**
 * Daily job: sends notifications to users at their preferred time.
 * Call this from a scheduler (e.g. client-side timer at preferred hour).
 * Remains independent from existing cron jobs.
 */
export function dailyJob(): void {
  const users = getUsersWithPreferences()
  const now = new Date()
  const currentHour = now.getHours()
  const timeSlots: Record<string, number> = {
    morning: 8,
    midday: 13,
    evening: 20,
  }

  users.forEach(({ userId, progress, prefs }) => {
    const preferredTime = prefs.preferredTime ?? progress.preferredTime ?? 'morning'
    const targetHour = timeSlots[preferredTime] ?? 8

    if (currentHour === targetHour || (prefs.extraReminder && currentHour === targetHour + 1)) {
      const programMessage = `Día ${progress.currentDay}: práctica lista. ¡Empieza ahora!`
      sendDailyNotification(userId, programMessage).catch(() => {})
    }
  })
}

/**
 * Starts a client-side check that runs dailyJob at the user's preferred time.
 * Opt-in: only call when user has activated the Daily Training Program.
 */
export function startDailyScheduler(): () => void {
  if (typeof window === 'undefined') return () => {}

  const interval = setInterval(() => {
    dailyJob()
  }, 60 * 60 * 1000)

  dailyJob()

  return () => clearInterval(interval)
}
