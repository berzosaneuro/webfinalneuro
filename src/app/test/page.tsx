import { Metadata } from 'next'
import Container from '@/components/Container'
import TestQuiz from './TestQuiz'

export const metadata: Metadata = {
  title: 'Test de Ruido Mental — Berzosa Neuro',
  description: 'Descubre en qué nivel está tu mente y qué necesitas entrenar. Test de 10 preguntas.',
}

export default function TestPage() {
  return (
    <>
      <section className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in">
              TEST DE RUIDO MENTAL
            </h1>
            <p className="text-text-secondary text-lg md:text-xl animate-fade-in-up">
              Descubre en qué nivel está tu mente y qué necesitas entrenar.
            </p>
          </div>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <TestQuiz />
        </Container>
      </section>
    </>
  )
}
