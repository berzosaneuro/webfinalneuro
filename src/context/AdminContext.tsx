'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { useUser } from '@/context/UserContext'

interface AdminContextType {
  isAdmin: boolean
  loading: boolean
  adminLogout: () => Promise<void>
}

const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  loading: true,
  adminLogout: async () => {},
})

export function AdminProvider({ children }: { children: ReactNode }) {
  const { user, logout, loading: userLoading } = useUser()
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsAdmin(user?.role === 'admin' || user?.role === 'master')
    setLoading(userLoading)
  }, [user?.role, userLoading])

  const adminLogout = async () => {
    await logout()
    setIsAdmin(false)
  }

  return (
    <AdminContext.Provider value={{ isAdmin, loading, adminLogout }}>
      {children}
    </AdminContext.Provider>
  )
}

export function useAdmin() {
  return useContext(AdminContext)
}
