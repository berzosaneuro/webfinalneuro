'use client'

import { usePremium } from '@/context/PremiumContext'

export function useSubscription() {
  const { isPremium, syncing, syncPremiumFromDb, subscriptionStatus, isMentoria, mentoriaStatus } = usePremium()

  return {
    isPremium,
    isLoading: syncing,
    syncing,
    subscriptionStatus,
    isMentoria,
    mentoriaStatus,
    refreshSubscription: syncPremiumFromDb,
  }
}
