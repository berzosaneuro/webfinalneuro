/**
 * Centralized Audio Manager
 * - Only one primary audio source at a time (meditation, podcast, or sonidos)
 * - Stops others when one starts
 * - Prevents overlapping playback
 */

export type AudioSource = 'meditation' | 'podcast' | 'sonidos'

type StopCallback = () => void

const stopCallbacks = new Map<AudioSource, StopCallback>()

export function registerStopCallback(source: AudioSource, stop: StopCallback): void {
  stopCallbacks.set(source, stop)
}

export function unregister(source: AudioSource): void {
  stopCallbacks.delete(source)
}

/** Stop all audio except the given source */
export function stopAllExcept(source?: AudioSource): void {
  stopCallbacks.forEach((stop, s) => {
    if (source === undefined || s !== source) {
      try {
        stop()
      } catch {
        // ignore
      }
    }
  })
}

/** Claim playback: stops all others, then registers this source's stop */
export function claimAndPlay(source: AudioSource, stop: StopCallback): void {
  stopAllExcept(source)
  stopCallbacks.set(source, stop)
}

/** Stop all audio globally */
export function stopAll(): void {
  stopAllExcept()
  if (typeof window !== 'undefined' && window.speechSynthesis) {
    window.speechSynthesis.cancel()
  }
}
