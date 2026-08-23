'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { clearLoveThemeHintAndDocument } from '@/lib/personalized-ui'
import { createBrowserSupabase } from '@/lib/supabase-browser'

type UserProfile = {
  email: string
  nombre: string
  role: 'user' | 'admin' | 'master'
}

type SessionJson =
  | {
      ok?: true
      user: UserProfile | null
    }
  | {
      ok?: false
      user?: null
      error?: string
      code?: string
    }

type UserContextType = {
  user: UserProfile | null
  logout: () => Promise<void>
  loading: boolean
  isCertified: boolean
  refreshUser: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  logout: async () => {},
  loading: true,
  isCertified: false,
  refreshUser: async () => {},
})

function loadIsCertified(): boolean {
  try {
    const raw = localStorage.getItem('neuro_cert_progress')
    if (raw) {
      const parsed = JSON.parse(raw)
      return Array.isArray(parsed?.completedDays) && parsed.completedDays.length >= 84
    }
  } catch {}
  return false
}

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isCertified, setIsCertified] = useState(false)

  /**
   * Única fuente de identidad: cookies de sesión leídas en el servidor (`getAuthUser` + `public.users`).
   * No usar `supabase.auth.getUser()` en cliente: la sesión la fija el Route Handler; el cliente
   * JS no siempre comparte storage con esas cookies.
   */
  const fetchUser = useCallback(async () => {
    try {
      const res = await fetch('/api/auth/session', {
        method: 'GET',
        credentials: 'same-origin',
        cache: 'no-store',
      })
      if (res.status === 401) {
        setUserState(null)
        return
      }
      if (!res.ok) {
        setUserState(null)
        return
      }
      const data = (await res.json()) as SessionJson
      if (data.user?.email) {
        setUserState(data.user)
      } else {
        setUserState(null)
      }
    } catch (e) {
      console.error(
        '[UserContext] fetchUser error:',
        e instanceof Error ? e.message : 'unknown',
      )
      setUserState(null)
    }
  }, [])

  // Hidratación: la API es la única verdad. loading=false solo tras respuesta (éxito o 401).
  useEffect(() => {
    let cancelled = false
    const run = async () => {
      try {
        await fetchUser()
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }
    void run()
    setIsCertified(loadIsCertified())
    return () => {
      cancelled = true
    }
  }, [fetchUser])

  useEffect(() => {
    const supabase = createBrowserSupabase()
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUserState(null)
        return
      }
      void fetchUser()
    })
    return () => subscription.unsubscribe()
  }, [fetchUser])

  useEffect(() => {
    const onFocus = () => {
      void fetchUser()
    }
    const onVisible = () => {
      if (document.visibilityState === 'visible') void fetchUser()
    }
    window.addEventListener('focus', onFocus)
    document.addEventListener('visibilitychange', onVisible)
    return () => {
      window.removeEventListener('focus', onFocus)
      document.removeEventListener('visibilitychange', onVisible)
    }
  }, [fetchUser])

  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE', credentials: 'same-origin' })
    } catch {}
    try {
      const supabase = createBrowserSupabase()
      await supabase.auth.signOut()
    } catch {}
    clearLoveThemeHintAndDocument()
    setUserState(null)
  }

  return (
    <UserContext.Provider value={{ user, logout, loading, isCertified, refreshUser: fetchUser }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
