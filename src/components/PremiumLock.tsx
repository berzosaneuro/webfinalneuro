'use client'

import { Lock, Crown } from 'lucide-react'
import Link from 'next/link'
import { usePremium } from '@/context/PremiumContext'

interface PremiumLockProps {
  children: React.ReactNode
  label?: string
}

export default function PremiumLock({ children, label = 'Contenido Premium' }: PremiumLockProps) {
  const { isPremium } = usePremium()

  if (isPremium) return <>{children}</>

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="pointer-events-none select-none blur-sm opacity-30">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center glass rounded-2xl">
        <div className="flex flex-col items-center gap-2.5 p-5 text-center">
          <div className="w-12 h-12 rounded-2xl bg-accent-blue/15 flex items-center justify-center">
            <Lock className="w-5 h-5 text-accent-blue" />
          </div>
          <p className="text-white font-heading font-semibold text-sm">{label}</p>
          <p className="text-text-secondary text-xs max-w-[200px]">
            Desbloquea con Premium
          </p>
          <Link
            href="/planes"
            className="mt-1 inline-flex items-center gap-1.5 px-4 py-2 bg-accent-blue text-white rounded-full font-semibold text-xs transition-all active:scale-95"
          >
            <Crown className="w-3.5 h-3.5" />
            Ver planes
          </Link>
        </div>
      </div>
    </div>
  )
}
