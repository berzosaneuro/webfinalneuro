import { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/Container'
import Button from '@/components/Button'
import FadeInSection from '@/components/FadeInSection'
import { Brain } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Sobre — Berzosa Neuro',
  description: 'No soy un gurú ni un científico de laboratorio. Berzosa Neuro es lo que aprendí viviendo el ruido mental y saliendo al otro lado.',
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
                    NO SOY UN GURÚ.
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
                  Soy Berzosa Neuro.
                </p>
                <p>
                  Berzosa Neuro nace para enseñar lo que casi nadie explica: el ruido mental es un patrón aprendido y la conciencia se puede entrenar.
                </p>
                <p>
                  No necesitas escapar de tu vida. Necesitas dejar de vivir secuestrado por tu mente.
                </p>
                <p>
                  Todo lo que comparto sale de haberlo vivido y de haberlo probado con miles de personas. Sin misticismo de escaparate, sin promesas mágicas, sin venderte humo.
                </p>
                <p>
                  La mente es una herramienta. Aprende a usarla en lugar de ser usado por ella.
                </p>
              </div>
            </FadeInSection>

            <FadeInSection>
              <div className="mt-12 flex flex-col sm:flex-row gap-4">
                <Button href="/metodo">Cómo nació el método</Button>
                <Button href="/contacto" variant="secondary">Contactar</Button>
              </div>
            </FadeInSection>
          </div>
        </Container>
      </section>
    </>
  )
}
