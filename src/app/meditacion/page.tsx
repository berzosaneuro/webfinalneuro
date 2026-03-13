import { Metadata } from 'next'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import MeditationCards from './MeditationCards'
import PresenceTimer from './PresenceTimer'
import Link from 'next/link'
import { Volume2, ChevronRight } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sala de Meditación — Berzosa Neuro',
  description: 'Apaga el ruido mental. Vuelve al presente. Meditaciones guiadas por tema y duración.',
}

export default function MeditacionPage() {
  return (
    <div className="relative">
      <div className="orb w-64 h-64 bg-accent-blue top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-6">
        <Container>
          <div className="md:text-center">
            <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 animate-fade-in">
              Meditación
            </h1>
            <p className="text-text-secondary text-base animate-fade-in-up">
              25 sesiones guiadas. 10 gratis · 15 premium.
            </p>
          </div>
        </Container>
      </section>

      {/* Sonidos CTA */}
      <section className="pb-5">
        <Container>
          <Link href="/sonidos" className="block">
            <div className="glass rounded-2xl px-4 py-3 flex items-center gap-3 active:scale-[0.98] transition-transform">
              <div className="w-9 h-9 rounded-lg bg-sky-500/15 flex items-center justify-center shrink-0">
                <Volume2 className="w-4 h-4 text-sky-400" />
              </div>
              <div className="flex-1">
                <p className="text-white text-sm font-medium">Sonidos ambientales</p>
                <p className="text-text-muted text-[11px]">Mezcla lluvia, bosque, cuencos...</p>
              </div>
              <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
            </div>
          </Link>
        </Container>
      </section>

      <section className="pb-8">
        <Container>
          <FadeInSection>
            <MeditationCards />
          </FadeInSection>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Timer libre</h2>
            <PresenceTimer />
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
