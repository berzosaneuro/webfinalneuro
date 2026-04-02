'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { clearLoveThemeHintAndDocument } from '@/lib/personalized-ui'

type UserProfile = {
  email: string
  nombre: string
  role: 'user' | 'master'
}

type UserContextType = {
  user: UserProfile | null
  setUser: (profile: Omit<UserProfile, 'role'>, password?: string) => Promise<boolean>
  /** Tras POST /api/auth/session: actualiza estado local sin nueva petición (evita segundo POST). */
  applyLoginUser: (user: UserProfile) => void
  logout: () => Promise<void>
  loading: boolean
  isCertified: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: async () => false,
  applyLoginUser: () => {},
  logout: async () => {},
  loading: true,
  isCertified: false,
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

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/auth/session')
        if (!res.ok) return
        const data = await res.json() as { user?: UserProfile | null }
        if (data?.user?.email) setUserState(data.user)
      } catch {}
      setLoading(false)
    }
    void load()
    setIsCertified(loadIsCertified())
  }, [])

  const setUser = async (profile: Omit<UserProfile, 'role'>, password?: string) => {
    const payload = {
      email: profile.email.trim().toLowerCase(),
      nombre: (profile.nombre || profile.email.split('@')[0] || 'Usuario').trim(),
      ...(password ? { password } : {}),
    }
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) return false
      const data = await res.json() as { user?: UserProfile }
      if (data?.user?.email) {
        setUserState(data.user)
        return true
      }
    } catch {
      return false
    }
    return false
  }

  const applyLoginUser = (u: UserProfile) => {
    setUserState(u)
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch {}
    clearLoveThemeHintAndDocument()
    setUserState(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, applyLoginUser, logout, loading, isCertified }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
