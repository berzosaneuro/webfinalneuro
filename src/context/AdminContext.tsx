'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAdmin: boolean
  loading: boolean
  adminLogin: (password: string) => Promise<boolean>
  adminLogout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  adminLogin: async () => false,
  adminLogout: async () => {},
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/session')
        if (!res.ok) return
        const data = await res.json() as { isAdmin?: boolean }
        if (data?.isAdmin) setIsAdmin(true)
      } catch {}
      setLoading(false)
    }
    void load()
  }, [])

  const adminLogin = async (password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      if (!res.ok) return false
      setIsAdmin(true)
      return true
    } catch {
      return false
    }
  }

  const adminLogout = async () => {
    try {
      await fetch('/api/admin/session', { method: 'DELETE' })
    } catch {}
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, loading, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
