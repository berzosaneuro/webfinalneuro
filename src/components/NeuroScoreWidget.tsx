'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ChevronRight, Flame } from 'lucide-react'
import { getDisplayStreak } from '@/lib/streak'

export default function NeuroScoreWidget() {
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    setStreak(getDisplayStreak())
  }, [])

  return (
    <Link href="/neuroscore" className="block">
      <div className="glass rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform">
        <div className="absolute top-0 right-0 w-28 h-28 bg-green-500/8 rounded-full -translate-y-1/3 translate-x-1/3" />
        <div className="relative flex items-center gap-4">
          <div className="relative">
            <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
              <circle cx="28" cy="28" r="24" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
              <circle cx="28" cy="28" r="24" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 24}`} strokeDashoffset={`${2 * Math.PI * 24 * 0.7}`} />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">30</span>
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-0.5">
              <h3 className="font-heading font-semibold text-white text-base">NeuroScore</h3>
              <div className="flex items-center gap-1 px-2 py-0.5 rounded-full bg-orange-500/10">
                <Flame className="w-3 h-3 text-orange-400" />
                <span className="text-orange-400 text-[10px] font-bold">{streak} días</span>
              </div>
            </div>
            <p className="text-text-secondary text-xs">Completa tu entrenamiento diario</p>
          </div>
          <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
        </div>
      </div>
    </Link>
  )
}
