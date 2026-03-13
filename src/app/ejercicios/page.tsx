'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import ThoughtCounter from './ThoughtCounter'
import ThoughtLabeler from './ThoughtLabeler'
import BodyScan from './BodyScan'
import { Brain, Tag, Heart, ChevronRight } from 'lucide-react'

const exercises = [
  { id: 'counter', title: 'Contador de pensamientos', desc: 'Cuenta cada pensamiento en 60 segundos', icon: Brain, color: 'bg-blue-500/15 text-blue-400' },
  { id: 'labeler', title: 'Etiquetador mental', desc: 'Clasifica: pasado, futuro o neutro', icon: Tag, color: 'bg-violet-500/15 text-violet-400' },
  { id: 'bodyscan', title: 'Body scan interactivo', desc: 'Detecta tensión en tu cuerpo', icon: Heart, color: 'bg-rose-500/15 text-rose-400' },
]

export default function EjerciciosPage() {
  const [active, setActive] = useState<string | null>(null)

  if (active === 'counter') return <ThoughtCounter onBack={() => setActive(null)} />
  if (active === 'labeler') return <ThoughtLabeler onBack={() => setActive(null)} />
  if (active === 'bodyscan') return <BodyScan onBack={() => setActive(null)} />

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-violet-600 top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold text-white mb-1 animate-fade-in">Ejercicios</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Metacognición aplicada. Entrena tu mente.</p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="space-y-3">
              {exercises.map((ex) => (
                <button
                  key={ex.id}
                  onClick={() => setActive(ex.id)}
                  className="w-full glass rounded-2xl p-5 flex items-center gap-4 text-left active:scale-[0.98] transition-transform"
                >
                  <div className={`w-12 h-12 rounded-xl ${ex.color} flex items-center justify-center shrink-0`}>
                    <ex.icon className="w-6 h-6" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-heading font-semibold text-white text-base mb-0.5">{ex.title}</h3>
                    <p className="text-text-secondary text-xs">{ex.desc}</p>
                  </div>
                  <ChevronRight className="w-5 h-5 text-text-muted shrink-0" />
                </button>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
