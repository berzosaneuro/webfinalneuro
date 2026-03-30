'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserProfile = {
  email: string
  nombre: string
}

type UserContextType = {
  user: UserProfile | null
  setUser: (profile: UserProfile) => Promise<boolean>
  logout: () => Promise<void>
  loading: boolean
  isCertified: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: async () => false,
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

  const setUser = async (profile: UserProfile) => {
    const payload = {
      email: profile.email.trim().toLowerCase(),
      nombre: (profile.nombre || profile.email.split('@')[0] || 'Usuario').trim(),
    }
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      if (!res.ok) return false
    } catch {
      return false
    }
    setUserState(profile)
    return true
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/session', { method: 'DELETE' })
    } catch {}
    setUserState(null)
  }

  return (
    <UserContext.Provider value={{ user, setUser, logout, loading, isCertified }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  return useContext(UserContext)
}
