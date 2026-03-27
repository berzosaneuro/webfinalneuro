'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type UserProfile = {
  email: string
  nombre: string
}

type UserContextType = {
  user: UserProfile | null
  setUser: (profile: UserProfile) => void
  logout: () => void
  loading: boolean
  isCertified: boolean
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  logout: () => {},
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
    try {
      const stored = localStorage.getItem('neuroconciencia_user') || localStorage.getItem('neuroconciencia-user')
      if (stored) {
        const parsed = JSON.parse(stored)
        if (parsed?.email) setUserState(parsed)
      }
    } catch {}
    setIsCertified(loadIsCertified())
    setLoading(false)
  }, [])

  const setUser = (profile: UserProfile) => {
    setUserState(profile)
    localStorage.setItem('neuroconciencia_user', JSON.stringify(profile))
  }

  const logout = () => {
    setUserState(null)
    localStorage.removeItem('neuroconciencia_user')
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
