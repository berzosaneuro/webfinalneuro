'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminContextType {
  isAdmin: boolean
  adminLogin: (password: string) => boolean
  adminLogout: () => void
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  adminLogin: () => false,
  adminLogout: () => {},
})

const ADMIN_KEY = 'neuroconciencia-admin'

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const saved = localStorage.getItem(ADMIN_KEY)
    if (saved === 'true') setIsAdmin(true)
  }, [])

  const adminLogin = (password: string): boolean => {
    const expected = process.env.NEXT_PUBLIC_ADMIN_PASSWORD || 'berzosaneuro'
    if (password === expected) {
      setIsAdmin(true)
      localStorage.setItem(ADMIN_KEY, 'true')
      return true
    }
    return false
  }

  const adminLogout = () => {
    setIsAdmin(false)
    localStorage.removeItem(ADMIN_KEY)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, adminLogin, adminLogout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
