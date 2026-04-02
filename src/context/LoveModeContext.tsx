'use client'

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { useUser } from '@/context/UserContext'
import {
  buildLoveModeMessagePool,
  getLoveCalendarFlag,
  isLoveTheme,
  LOVE_THEME_HINT_STORAGE_KEY,
  LOVE_THEME_HINT_VALUE,
  resolvePersonalizedTheme,
  type PersonalizedThemeId,
} from '@/lib/personalized-ui'
import LoveModeLayer from '@/components/personalized/LoveModeLayer'

/** Cada cuánto refrescar mensajes contextuales (hora / día) y re-barajar */
const LOVE_POOL_REFRESH_MS = 30 * 60 * 1000

export type LoveModeContextValue = {
  isLoveMode: boolean
  themeId: PersonalizedThemeId | null
  messages: readonly string[]
}

const LoveModeContext = createContext<LoveModeContextValue>({
  isLoveMode: false,
  themeId: null,
  messages: [],
})

export function LoveModeProvider({ children }: { children: ReactNode }) {
  const { user, loading } = useUser()
  const themeId = useMemo(() => resolvePersonalizedTheme(user?.email), [user?.email])
  /** Sin capa Love ni intervalos hasta conocer la sesión (usuarios no objetivo: cero trabajo extra). */
  const isLoveMode = !loading && isLoveTheme(themeId)

  const [poolTick, setPoolTick] = useState(0)
  useEffect(() => {
    if (!isLoveMode) return
    const id = window.setInterval(() => setPoolTick((t) => t + 1), LOVE_POOL_REFRESH_MS)
    return () => window.clearInterval(id)
  }, [isLoveMode])

  const messages = useMemo(() => {
    void poolTick
    if (!isLoveMode || themeId !== 'love') return []
    return buildLoveModeMessagePool(new Date())
  }, [isLoveMode, themeId, poolTick])

  useEffect(() => {
    const root = document.documentElement
    if (themeId) {
      root.dataset.theme = themeId
    } else {
      delete root.dataset.theme
    }
    return () => {
      delete root.dataset.theme
    }
  }, [themeId])

  useEffect(() => {
    const root = document.documentElement
    if (!isLoveMode) {
      delete root.dataset.loveDay
      return
    }
    const flag = getLoveCalendarFlag(new Date())
    if (flag) root.dataset.loveDay = flag
    else delete root.dataset.loveDay
    const id = window.setInterval(() => {
      const f = getLoveCalendarFlag(new Date())
      if (f) root.dataset.loveDay = f
      else delete root.dataset.loveDay
    }, 60 * 60 * 1000)
    return () => {
      window.clearInterval(id)
      delete root.dataset.loveDay
    }
  }, [isLoveMode])

  const contextValue = useMemo(
    () => ({ isLoveMode, themeId, messages }),
    [isLoveMode, themeId, messages]
  )

  return (
    <LoveModeContext.Provider value={contextValue}>
      {isLoveMode && messages.length > 0 ? <LoveModeLayer messages={messages} /> : null}
      {children}
    </LoveModeContext.Provider>
  )
}

export function useLoveMode() {
  return useContext(LoveModeContext)
}
