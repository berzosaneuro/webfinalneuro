'use client'

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react'
import { useUser } from '@/context/UserContext'

type Plan = 'free' | 'premium'

interface PremiumContextType {
  plan: Plan
  isPremium: boolean
  upgradeToPremium: () => void
  downgradeToFree: () => void
  /** Sincroniza plan con la tabla `users` (fuente de verdad tras Stripe). */
  syncPremiumFromDb: () => Promise<boolean>
  syncing: boolean
}

const PremiumContext = createContext<PremiumContextType>({
  plan: 'free',
  isPremium: false,
  upgradeToPremium: () => {},
  downgradeToFree: () => {},
  syncPremiumFromDb: async () => false,
  syncing: false,
})

export function PremiumProvider({ children }: { children: ReactNode }) {
  const { user } = useUser()
  const [plan, setPlan] = useState<Plan>('free')
  const [syncing, setSyncing] = useState(false)

  const syncPremiumFromDb = useCallback(async () => {
    const email = user?.email?.trim().toLowerCase()
    if (!email) {
      setPlan('free')
      return false
    }
    setSyncing(true)
    try {
      const res = await fetch('/api/users/premium-status')
      if (!res.ok) return plan === 'premium'
      const data = (await res.json()) as { is_premium?: boolean }
      const premium = data?.is_premium === true
      setPlan(premium ? 'premium' : 'free')
      return premium
    } catch {
      // Mantener último estado conocido para evitar "falsos free" por red/webhook lento.
      return plan === 'premium'
    } finally {
      setSyncing(false)
    }
  }, [plan, user?.email])

  useEffect(() => {
    void syncPremiumFromDb()
  }, [syncPremiumFromDb])

  const upgradeToPremium = () => {
    void syncPremiumFromDb()
  }

  const downgradeToFree = () => {
    void syncPremiumFromDb()
  }

  return (
    <PremiumContext.Provider
      value={{
        plan,
        isPremium: plan === 'premium',
        upgradeToPremium,
        downgradeToFree,
        syncPremiumFromDb,
        syncing,
      }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  return useContext(PremiumContext)
}
