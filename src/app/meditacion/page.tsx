import { Metadata } from 'next'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import MeditationCards from './MeditationCards'
import PresenceTimer from './PresenceTimer'

export const metadata: Metadata = {
  title: 'Sala de Meditación — Berzosa Neuro',
  description: 'Meditaciones guiadas con el Método N.E.U.R.O.: cortas, claras y pensadas para el día a día. 10 gratis · 15 premium.',
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
              25 sesiones para bajar el ruido y volver a ti. Nada de postureo: práctica que puedes repetir. 10 gratis · 15 premium.
            </p>
          </div>
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
