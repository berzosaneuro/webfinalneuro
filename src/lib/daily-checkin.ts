/**
 * Daily emotional check-in. Stores mood for assistant personalization.
 * Stored in localStorage: neuro_daily_checkin
 */

const STORAGE_KEY = 'neuro_daily_checkin'

export type Mood = 'tranquilo' | 'neutro' | 'tenso'

export type CheckinEntry = {
  date: string
  mood: Mood
}

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

/** Load today's check-in if exists */
export function loadTodayCheckin(): CheckinEntry | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const data = JSON.parse(raw) as CheckinEntry
    if (data.date === getToday() && ['tranquilo', 'neutro', 'tenso'].includes(data.mood)) {
      return data
    }
  } catch {}
  return null
}

/** Save today's mood */
export function saveCheckin(mood: Mood): void {
  if (typeof window === 'undefined') return
  const entry: CheckinEntry = { date: getToday(), mood }
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(entry))
  } catch { /* ignore */ }
}
