'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@/context/UserContext'

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
  const { user, logout } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAdmin(user?.role === 'master')
    setLoading(false)
  }, [user?.role])

  const adminLogin = async (password: string): Promise<boolean> => {
    void password
    return false
  }

  const adminLogout = async () => {
    await logout()
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
