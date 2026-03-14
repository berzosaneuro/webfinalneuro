/**
 * Lightweight stats for Personal Progress Panel.
 * Reads from existing localStorage sources. No extra storage.
 */

const AUDIO_KEY = 'neuro_audio_sessions'
const TRAINING_KEY = 'neuro_training_daily'

function getSessions(): Array<{ type: string; event: string }> {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(AUDIO_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch { return [] }
}

/** Count completed meditation sessions (all time) */
export function getMeditationCount(): number {
  return getSessions().filter((s) => s.type === 'meditation' && s.event === 'completed').length
}

/** Count days with completed daily training */
export function getTrainingDaysCount(): number {
  if (typeof window === 'undefined') return 0
  try {
    const raw = localStorage.getItem(TRAINING_KEY)
    if (!raw) return 0
    const data = JSON.parse(raw) as { completions?: Record<string, boolean> }
    const comp = data?.completions ?? {}
    return Object.values(comp).filter(Boolean).length
  } catch { return 0 }
}
