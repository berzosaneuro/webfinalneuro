import { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/Container'
import Button from '@/components/Button'
import FadeInSection from '@/components/FadeInSection'
import { Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre — Berzosa Neuro',
  description: 'Berzosa Neuro: método y herramientas para bajar el ruido mental. Lo construí desde la experiencia y lo uso cada día.',
}

export default function SobrePage() {
  return (
    <>
      <section className="relative pt-24 pb-20 overflow-hidden">
        {/* Foto como fondo con marca de agua */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="/elias-1.jpg"
            alt=""
            fill
            className="object-cover object-top opacity-[0.08]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-primary/50 via-transparent to-dark-primary/90" />
        </div>
        <Container>
          <div className="relative max-w-3xl mx-auto">
            <FadeInSection>
              <div className="flex flex-col md:flex-row items-center gap-8 mb-10">
                <div className="w-48 h-64 md:w-56 md:h-72 rounded-3xl overflow-hidden ring-2 ring-accent-blue/30 shrink-0 shadow-2xl">
                  <Image
                    src="/elias-1.jpg"
                    alt="Berzosa Neuro"
                    width={224}
                    height={288}
                    className="w-full h-full object-cover object-top"
                    priority
                  />
                </div>
                <div>
                  <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 animate-fade-in">
                    SOY BERZOSA NEURO.
                  </h1>
                  <div className="flex items-center gap-3">
                    <Brain className="w-6 h-6 text-accent-blue" />
                    <span className="text-accent-blue font-heading font-semibold text-lg">Berzosa Neuro</span>
                  </div>
                </div>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="space-y-6 text-text-secondary text-lg leading-relaxed">
                <p>
                  Enseño lo que a mí me faltó: el ruido mental es un hábito y la atención se entrena.
                </p>
                <p>
                  No hace falta huir de tu vida. Hace falta dejar de ir a remolque de la cabeza.
                </p>
                <p>
                  Lo que hay en la app lo he vivido, lo uso y lo he visto funcionar con miles de personas. Sin postureo.
                </p>
                <p>
                  La mente es herramienta. El objetivo es que mandes tú.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Button href="/metodo">Ver el método</Button>
                <Button href="/contacto" variant="secondary">Escribirme</Button>
              </div>
            </FadeInSection>
          </div>
        </Container>
      </section>
    </>
  )
}
