'use client'

import { usePremium } from '@/context/PremiumContext'

export function useSubscription() {
  const { isPremium, syncing, syncPremiumFromDb, subscriptionStatus } = usePremium()

  return {
    isPremium,
    isLoading: syncing,
    syncing,
    subscriptionStatus,
    refreshSubscription: syncPremiumFromDb,
  }
}
