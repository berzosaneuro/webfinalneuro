/**
 * Internal session tracking for meditation/podcast/masterclass playback.
 * Stored in localStorage. No UI. Used for analytics and progress.
 */

const STORAGE_KEY = 'neuro_audio_sessions'
const MAX_SESSIONS = 200

export type SessionEvent = {
  type: 'meditation' | 'podcast' | 'masterclass'
  itemId: string
  event: 'started' | 'completed' | 'interrupted'
  durationSeconds?: number
  timestamp: string
}

function getSessions(): SessionEvent[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw) as SessionEvent[]
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveSessions(sessions: SessionEvent[]) {
  if (typeof window === 'undefined') return
  try {
    const trimmed = sessions.slice(-MAX_SESSIONS)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(trimmed))
  } catch { /* ignore */ }
}

export function trackSessionStart(type: SessionEvent['type'], itemId: string): void {
  saveSessions([
    ...getSessions(),
    { type, itemId, event: 'started', timestamp: new Date().toISOString() },
  ])
}

export function trackSessionComplete(
  type: SessionEvent['type'],
  itemId: string,
  durationSeconds: number
): void {
  saveSessions([
    ...getSessions(),
    { type, itemId, event: 'completed', durationSeconds, timestamp: new Date().toISOString() },
  ])
}

export function trackSessionInterrupted(
  type: SessionEvent['type'],
  itemId: string,
  durationSeconds: number
): void {
  saveSessions([
    ...getSessions(),
    { type, itemId, event: 'interrupted', durationSeconds, timestamp: new Date().toISOString() },
  ])
}
