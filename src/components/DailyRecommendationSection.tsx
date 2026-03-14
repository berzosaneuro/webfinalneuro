'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { ChevronRight, Headphones, Flame, Target } from 'lucide-react'
import { getDailyRecommendation } from '@/lib/daily-recommendation'

const ICONS = {
  meditation: Headphones,
  challenge: Flame,
  training: Target,
}

export default function DailyRecommendationSection() {
  const [rec, setRec] = useState<ReturnType<typeof getDailyRecommendation> | null>(null)

  useEffect(() => {
    setRec(getDailyRecommendation())
  }, [])

  if (!rec) return null

  const Icon = ICONS[rec.type]

  return (
    <section className="relative pb-6">
      <Container>
        <FadeInSection>
        <Link href={rec.href} className="block">
          <div
            className="glass rounded-3xl p-5 relative overflow-hidden active:scale-[0.98] transition-transform"
            style={{ border: '1px solid rgba(255,255,255,0.06)' }}
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-accent-blue/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-accent-blue/15 flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6 text-accent-blue" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-text-muted text-[10px] uppercase tracking-wider font-semibold mb-0.5">
                  Recomendación de Elías para hoy
                </p>
                <h3 className="font-heading font-semibold text-white text-base mb-0.5">{rec.title}</h3>
                <p className="text-text-secondary text-xs">{rec.description}</p>
              </div>
              <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
            </div>
          </div>
        </Link>
        </FadeInSection>
      </Container>
    </section>
  )
}
