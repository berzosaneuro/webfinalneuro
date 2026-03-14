/**
 * Daily streak system for mental training activity.
 * Activity counts: meditation, daily training, or challenge day completed.
 * Stored in localStorage: neuro_streak
 */

const STORAGE_KEY = 'neuro_streak'

export type StreakData = {
  currentStreak: number
  longestStreak: number
  lastActivityDate: string
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function parseDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

function daysBetween(a: string, b: string): number {
  return Math.round((parseDate(b).getTime() - parseDate(a).getTime()) / (24 * 60 * 60 * 1000))
}

/** Get displayed current streak (0 if streak broken, i.e. last activity >1 day ago) */
export function getDisplayStreak(): number {
  const data = loadStreak()
  if (!data.lastActivityDate) return 0
  const gap = daysBetween(data.lastActivityDate, getToday())
  if (gap > 1) return 0
  return data.currentStreak
}

/** Load streak data from localStorage */
export function loadStreak(): StreakData {
  if (typeof window === 'undefined') {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: '' }
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { currentStreak: 0, longestStreak: 0, lastActivityDate: '' }
    const parsed = JSON.parse(raw) as Partial<StreakData>
    return {
      currentStreak: typeof parsed.currentStreak === 'number' ? parsed.currentStreak : 0,
      longestStreak: typeof parsed.longestStreak === 'number' ? parsed.longestStreak : 0,
      lastActivityDate: typeof parsed.lastActivityDate === 'string' ? parsed.lastActivityDate : '',
    }
  } catch {
    return { currentStreak: 0, longestStreak: 0, lastActivityDate: '' }
  }
}

/** Record activity and update streak. Call when user completes meditation, daily training, or challenge day. */
export function recordActivity(): void {
  if (typeof window === 'undefined') return
  const today = getToday()
  const data = loadStreak()

  if (data.lastActivityDate === today) return

  let newCurrent = data.currentStreak
  const gap = data.lastActivityDate ? daysBetween(data.lastActivityDate, today) : 999

  if (gap === 1) {
    newCurrent += 1
  } else if (gap > 1) {
    newCurrent = 1
  } else {
    newCurrent = 1
  }

  const newLongest = Math.max(data.longestStreak, newCurrent)

  const updated: StreakData = {
    currentStreak: newCurrent,
    longestStreak: newLongest,
    lastActivityDate: today,
  }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  } catch { /* ignore */ }
}
