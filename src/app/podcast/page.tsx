'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Play, Pause, Headphones, Clock, Brain, ChevronRight } from 'lucide-react'

type Episode = {
  id: number
  title: string
  description: string
  duration: string
  date: string
  category: string
}

const episodes: Episode[] = [
  { id: 1, title: '¿Por qué tu cerebro prefiere el sufrimiento conocido?', description: 'El sesgo de negatividad y por qué tu mente elige lo malo conocido antes que lo bueno por conocer.', duration: '5:30', date: '2024-12-01', category: 'Neurociencia' },
  { id: 2, title: 'La adicción al pensamiento', description: 'Piensas 60.000 pensamientos al día. El 95% son iguales que ayer. Estás enganchado y no lo sabes.', duration: '6:15', date: '2024-12-08', category: 'Consciencia' },
  { id: 3, title: 'No eres tus pensamientos (y hay pruebas)', description: 'La neurociencia confirma lo que los místicos decían: hay un observador detrás del pensamiento.', duration: '7:00', date: '2024-12-15', category: 'Consciencia' },
  { id: 4, title: '¿Meditar o medicar?', description: 'La meditación cambia la estructura cerebral en 8 semanas. La medicación la cambia en 2 horas. ¿Cuál es mejor?', duration: '5:45', date: '2024-12-22', category: 'Neurociencia' },
  { id: 5, title: 'La trampa del "debería"', description: 'Tu corteza prefrontal te dice lo que deberías hacer. Tu amígdala te dice lo que sientes. ¿Quién manda?', duration: '4:50', date: '2025-01-05', category: 'Emociones' },
  { id: 6, title: 'Dopamina: la molécula que te controla', description: 'Instagram, Netflix, azúcar. Tu cerebro busca dopamina como un adicto busca su dosis.', duration: '6:30', date: '2025-01-12', category: 'Neurociencia' },
  { id: 7, title: '¿Por qué recordamos lo malo?', description: 'Tu cerebro es velcro para lo negativo y teflón para lo positivo. Se llama sesgo de negatividad.', duration: '5:10', date: '2025-01-19', category: 'Neurociencia' },
  { id: 8, title: 'El piloto automático te roba la vida', description: 'Pasas el 47% del día sin estar presente. Eso son 33 años de vida en automático.', duration: '6:00', date: '2025-01-26', category: 'Presencia' },
  { id: 9, title: 'Tu cuerpo sabe lo que tu mente ignora', description: 'La interocepción: la capacidad olvidada de escuchar las señales de tu cuerpo.', duration: '5:20', date: '2025-02-02', category: 'Cuerpo' },
  { id: 10, title: 'Morir antes de morir: el despertar que no necesita muerte', description: 'Las experiencias cercanas a la muerte cambian a la gente para siempre. Pero hay un atajo.', duration: '7:30', date: '2025-02-09', category: 'Despertar' },
]

const categories = ['Todos', 'Neurociencia', 'Consciencia', 'Emociones', 'Presencia', 'Cuerpo', 'Despertar']

export default function PodcastPage() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [filter, setFilter] = useState('Todos')

  const filtered = filter === 'Todos' ? episodes : episodes.filter(e => e.category === filter)

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-accent-purple top-10 -left-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/15 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white animate-fade-in">NeuroPodcast</h1>
              <p className="text-text-secondary text-sm animate-fade-in-up">5 min de neurociencia que cambian tu día</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="pb-5">
        <Container>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  filter === c ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Episodes */}
      <section className="pb-12">
        <Container>
          <div className="space-y-3">
            {filtered.map((ep) => {
              const isPlaying = playing === ep.id
              return (
                <FadeInSection key={ep.id}>
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => setPlaying(isPlaying ? null : ep.id)}
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                          isPlaying ? 'bg-accent-blue text-white' : 'bg-accent-blue/15 text-accent-blue'
                        }`}
                      >
                        {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-0.5">{ep.title}</p>
                        <p className="text-text-muted text-xs line-clamp-2 mb-2">{ep.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-text-muted" />
                            <span className="text-text-muted text-[10px]">{ep.duration}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-white/5 rounded text-text-muted text-[10px]">{ep.category}</span>
                        </div>
                      </div>
                    </div>

                    {isPlaying && (
                      <div className="mt-3 pt-3 border-t border-white/5">
                        <div className="w-full h-1 bg-white/5 rounded-full">
                          <div className="h-1 bg-accent-blue rounded-full w-1/3 animate-pulse" />
                        </div>
                        <p className="text-text-muted text-[10px] mt-1.5 text-center">Reproduciendo...</p>
                      </div>
                    )}
                  </div>
                </FadeInSection>
              )
            })}
          </div>
        </Container>
      </section>
    </div>
  )
}
