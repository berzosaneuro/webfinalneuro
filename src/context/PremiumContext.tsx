'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

type Plan = 'free' | 'premium'

interface PremiumContextType {
  plan: Plan
  isPremium: boolean
  upgradeToPremium: () => void
  downgradeToFree: () => void
}

const PremiumContext = createContext<PremiumContextType>({
  plan: 'free',
  isPremium: false,
  upgradeToPremium: () => {},
  downgradeToFree: () => {},
})

export function PremiumProvider({ children }: { children: ReactNode }) {
  const [plan, setPlan] = useState<Plan>('free')

  useEffect(() => {
    const saved = localStorage.getItem('neuroconciencia-plan')
    if (saved === 'premium') setPlan('premium')
  }, [])

  const upgradeToPremium = () => {
    setPlan('premium')
    localStorage.setItem('neuroconciencia-plan', 'premium')
  }

  const downgradeToFree = () => {
    setPlan('free')
    localStorage.setItem('neuroconciencia-plan', 'free')
  }

  return (
    <PremiumContext.Provider
      value={{ plan, isPremium: plan === 'premium', upgradeToPremium, downgradeToFree }}
    >
      {children}
    </PremiumContext.Provider>
  )
}

export function usePremium() {
  return useContext(PremiumContext)
}
