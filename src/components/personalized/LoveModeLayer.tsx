'use client'

import { memo, useCallback, useEffect, useRef, useState } from 'react'
import { LOVE_SURPRISE_MESSAGE } from '@/lib/personalized-ui'

type Props = {
  messages: readonly string[]
  /** Base ms; se varía ligeramente para que la rotación no se sienta robótica */
  rotateIntervalMs?: number
}

/** Umbrales altos para evitar disparos accidentales al leer o ajustar el toast. */
const SURPRISE_CLICKS = 12
const RAPID_WINDOW_MS = 2000
const RAPID_NEEDED = 4

/**
 * Capa visual modo amor: mensajes, corazones ligeros, sorpresa por toques en el toast.
 */
function LoveModeLayer({ messages, rotateIntervalMs = 8200 }: Props) {
  const [idx, setIdx] = useState(0)
  const [surprise, setSurprise] = useState(false)
  const [displayOverride, setDisplayOverride] = useState<string | null>(null)
  const clickCount = useRef(0)
  const rapidRef = useRef<number[]>([])
  const overrideClearRef = useRef<number | null>(null)

  const clearOverrideSoon = useCallback(() => {
    if (overrideClearRef.current != null) {
      window.clearTimeout(overrideClearRef.current)
      overrideClearRef.current = null
    }
    overrideClearRef.current = window.setTimeout(() => {
      overrideClearRef.current = null
      setDisplayOverride(null)
      setSurprise(false)
    }, 5200)
  }, [])

  useEffect(() => {
    return () => {
      if (overrideClearRef.current != null) {
        window.clearTimeout(overrideClearRef.current)
        overrideClearRef.current = null
      }
    }
  }, [])

  const triggerSurprise = useCallback(() => {
    setDisplayOverride(LOVE_SURPRISE_MESSAGE)
    setSurprise(true)
    clearOverrideSoon()
  }, [clearOverrideSoon])

  useEffect(() => {
    setIdx(0)
  }, [messages])

  useEffect(() => {
    if (messages.length <= 1) return
    let cancelled = false
    let timeoutId: number | null = null
    const nextDelay = () => Math.max(4500, rotateIntervalMs + Math.floor(Math.random() * 2200) - 800)
    const step = () => {
      if (cancelled) return
      timeoutId = window.setTimeout(() => {
        timeoutId = null
        if (cancelled) return
        setIdx((i) => (i + 1) % messages.length)
        step()
      }, nextDelay())
    }
    step()
    return () => {
      cancelled = true
      if (timeoutId != null) window.clearTimeout(timeoutId)
    }
  }, [messages, rotateIntervalMs])

  const onToastClick = () => {
    clickCount.current += 1
    const now = Date.now()
    rapidRef.current = rapidRef.current.filter((t) => now - t < RAPID_WINDOW_MS)
    rapidRef.current.push(now)
    if (rapidRef.current.length >= RAPID_NEEDED) {
      triggerSurprise()
      rapidRef.current = []
      clickCount.current = 0
      return
    }
    if (clickCount.current >= SURPRISE_CLICKS) {
      triggerSurprise()
      clickCount.current = 0
    }
  }

  const text = displayOverride ?? messages[idx] ?? ''
  const messageKey = `${idx}-${displayOverride ? 's' : 'm'}`

  return (
    <>
      <div
        className="personalized-love-hearts pointer-events-none fixed inset-0 z-[15] overflow-hidden"
        aria-hidden
      >
        <span className="love-particle love-particle-1" />
        <span className="love-particle love-particle-2" />
        <span className="love-particle love-particle-3" />
        <span className="love-heart love-heart-a">♥</span>
        <span className="love-heart love-heart-b">✧</span>
        <span className="love-heart love-heart-c">♥</span>
        <span className="love-heart love-heart-d">✦</span>
        <span className="love-heart love-heart-e">♥</span>
        <span className="love-heart love-heart-f">·</span>
      </div>
      <div
        className="love-toast-float-wrap pointer-events-none fixed bottom-28 left-1/2 z-[35] w-[min(92vw,32rem)] max-w-2xl -translate-x-1/2 md:bottom-14 md:w-[min(88vw,40rem)]"
        style={{ marginBottom: 'max(0px, env(safe-area-inset-bottom))' }}
      >
      <button
        type="button"
        className={`love-toast-btn group pointer-events-auto w-full cursor-default ${
          surprise ? 'love-toast-btn--surprise' : ''
        }`}
        onClick={onToastClick}
        aria-label="Mensaje personal"
      >
        <span className="love-toast-btn__glow" aria-hidden />
        <span className="love-toast-btn__inner">
          <span className="love-note-decor" aria-hidden>
            💕
          </span>
          <span
            key={messageKey}
            className={`love-message-text pointer-events-none block ${surprise ? 'love-toast-surprise' : ''}`}
          >
            {text}
          </span>
        </span>
        <span className="love-toast-whisper" aria-hidden>
          (psst… un toque más, por si acaso)
        </span>
      </button>
      </div>
    </>
  )
}

export default memo(LoveModeLayer)
