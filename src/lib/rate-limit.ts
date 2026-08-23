const WINDOW_MS = 60_000
const CLEANUP_INTERVAL_MS = 30_000

const store = new Map<string, number[]>()
let lastCleanup = Date.now()

function cleanup() {
  const now = Date.now()
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return
  lastCleanup = now
  const cutoff = now - WINDOW_MS
  const keys: string[] = []
  store.forEach((_, k) => keys.push(k))
  keys.forEach((key) => {
    const timestamps = store.get(key)
    if (!timestamps) return
    const filtered = timestamps.filter((t) => t > cutoff)
    if (filtered.length === 0) store.delete(key)
    else store.set(key, filtered)
  })
}

/**
 * Sliding-window rate limiter (in-memory).
 * On Vercel Edge Runtime the Map persists across requests within the same
 * isolate, giving effective burst protection per edge location.
 *
 * @returns `remaining` requests left; `limited` true when quota exhausted.
 */
export function rateLimit(
  key: string,
  maxRequests: number,
): { limited: boolean; remaining: number } {
  cleanup()
  const now = Date.now()
  const cutoff = now - WINDOW_MS

  let timestamps = store.get(key)
  if (!timestamps) {
    store.set(key, [now])
    return { limited: false, remaining: maxRequests - 1 }
  }

  timestamps = timestamps.filter((t) => t > cutoff)

  if (timestamps.length >= maxRequests) {
    store.set(key, timestamps)
    return { limited: true, remaining: 0 }
  }

  timestamps.push(now)
  store.set(key, timestamps)
  return { limited: false, remaining: maxRequests - timestamps.length }
}
