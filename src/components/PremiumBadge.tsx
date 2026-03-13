'use client'

import { Crown } from 'lucide-react'

export default function PremiumBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-accent-blue/20 text-accent-blue rounded-full text-xs font-semibold">
      <Crown className="w-3 h-3" />
      Premium
    </span>
  )
}
