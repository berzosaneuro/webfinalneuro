'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { TrendingUp, Quote, Star, ChevronDown, ChevronUp, Brain } from 'lucide-react'

type Story = {
  name: string
  age: number
  location: string
  avatar: string
  scoreBefore: number
  scoreAfter: number
  timeWeeks: number
  headline: string
  story: string
  quote: string
  tags: string[]
}

const stories: Story[] = [
  {
    name: 'María G.',
    age: 34,
    location: 'Madrid',
    avatar: 'MG',
    scoreBefore: 18,
    scoreAfter: 72,
    timeWeeks: 12,
    headline: 'De ansiedad crónica a calma interior',
    story: 'Llevaba 3 años con ansiedad generalizada. Probé terapia, medicación, yoga... nada me hacía click. Con Berzosa Neuro entendí que mi problema no era emocional, era atencional. Mi mente no paraba de producir escenarios catastróficos porque nunca le enseñé a parar. En 12 semanas de programa 21 días + meditaciones diarias, mi NeuroScore pasó de 18 a 72. No es magia, es neuroplasticidad.',
    quote: 'Entendí que la ansiedad no es una enfermedad. Es una mente sin entrenar.',
    tags: ['Ansiedad', 'Programa 21 días', 'Meditación'],
  },
  {
    name: 'Carlos R.',
    age: 42,
    location: 'Barcelona',
    avatar: 'CR',
    scoreBefore: 25,
    scoreAfter: 81,
    timeWeeks: 8,
    headline: 'CEO que aprendió a parar',
    story: 'Dirijo una empresa de 40 personas. Dormía 5 horas, vivía en modo reacción. Mi rendimiento bajaba y lo compensaba con más horas. Un círculo destructivo. Berzosa Neuro me enseñó que 10 minutos de Flow State antes de trabajar me dan 3 horas extra de productividad real. Mi equipo nota la diferencia.',
    quote: 'Trabajar más horas no es productividad. Es cobardía disfrazada de esfuerzo.',
    tags: ['Ejecutivo', 'Foco', 'Flow state'],
  },
  {
    name: 'Laura P.',
    age: 28,
    location: 'Valencia',
    avatar: 'LP',
    scoreBefore: 31,
    scoreAfter: 88,
    timeWeeks: 16,
    headline: 'Encontré el observador que siempre fui',
    story: 'Vine buscando relajarme y encontré algo mucho más profundo. La sección "Despertar en Vida" cambió mi perspectiva sobre TODO. No soy mis pensamientos, no soy mis emociones. Soy el espacio donde todo eso ocurre. Suena filosófico pero cuando lo EXPERIMENTAS... es la cosa más práctica del mundo.',
    quote: 'No necesitas una experiencia cercana a la muerte para despertar. Necesitas dejar de vivir dormida.',
    tags: ['Consciencia', 'Despertar', 'Presencia'],
  },
  {
    name: 'David M.',
    age: 38,
    location: 'Sevilla',
    avatar: 'DM',
    scoreBefore: 22,
    scoreAfter: 67,
    timeWeeks: 10,
    headline: 'Del insomnio crónico a dormir como un bebé',
    story: 'Llevaba 2 años sin dormir bien. Había probado melatonina, infusiones, terapia del sueño. El protocolo de sueño de Berzosa Neuro (ritual nocturno + meditación Yoga Nidra + respiración 4-7-8) me cambió la vida en 3 semanas. Ahora duermo 7-8 horas de calidad.',
    quote: 'El insomnio no es un problema de sueño. Es un problema de cómo usas tu mente durante el día.',
    tags: ['Sueño', 'Yoga Nidra', 'Respiración'],
  },
  {
    name: 'Ana T.',
    age: 31,
    location: 'Málaga',
    avatar: 'AT',
    scoreBefore: 15,
    scoreAfter: 74,
    timeWeeks: 14,
    headline: 'De ataques de pánico a guía de meditación',
    story: 'Tenía ataques de pánico semanales. El modo SOS de Berzosa Neuro fue mi salvavidas los primeros meses. La respiración 4-7-8 cortaba el ataque en 2 minutos. Con el tiempo, pasé de apagar fuegos a prevenir incendios. Hoy estoy preparándome para la certificación de Guía Berzosa Neuro.',
    quote: 'El pánico le tiene miedo a quien sabe respirar.',
    tags: ['Pánico', 'SOS', 'Certificación'],
  },
  {
    name: 'Javier S.',
    age: 45,
    location: 'Bilbao',
    avatar: 'JS',
    scoreBefore: 28,
    scoreAfter: 79,
    timeWeeks: 12,
    headline: 'Padre presente: dejé de existir en piloto automático',
    story: 'Mis hijos me decían "papá, no me escuchas". Tenían razón. Estaba presente físicamente pero mi mente siempre estaba en otro sitio. Los ejercicios de metacognición y el diario de presencia me hicieron ver que vivía el 90% del tiempo en piloto automático. Ahora mis hijos dicen que soy otro papá.',
    quote: 'No es que no tuviera tiempo para mis hijos. Es que no tenía presencia.',
    tags: ['Presencia', 'Familia', 'Diario'],
  },
]

function ScoreBadge({ before, after }: { before: number; after: number }) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-center">
        <div className="text-red-400 text-lg font-bold">{before}</div>
        <div className="text-text-muted text-[9px]">Antes</div>
      </div>
      <TrendingUp className="w-5 h-5 text-emerald-400" />
      <div className="text-center">
        <div className="text-emerald-400 text-lg font-bold">{after}</div>
        <div className="text-text-muted text-[9px]">Después</div>
      </div>
    </div>
  )
}

export default function HistoriasPage() {
  const [expanded, setExpanded] = useState<number | null>(null)

  const avgImprovement = Math.round(
    stories.reduce((sum, s) => sum + (s.scoreAfter - s.scoreBefore), 0) / stories.length
  )

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-emerald-600 top-10 -left-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Historias de Transformación</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Personas reales. Datos reales. NeuroScore verificado.</p>
        </Container>
      </section>

      {/* Global stats */}
      <section className="pb-6">
        <Container>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-4 text-center">
              <span className="text-emerald-400 text-xl font-bold">+{avgImprovement}</span>
              <p className="text-text-muted text-[10px] mt-0.5">Mejora media NeuroScore</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <span className="text-cyan-400 text-xl font-bold">{stories.length}</span>
              <p className="text-text-muted text-[10px] mt-0.5">Historias</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <div className="flex justify-center gap-0.5">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-cyan-400 fill-cyan-400" />)}
              </div>
              <p className="text-text-muted text-[10px] mt-1">4.9 valoración</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Stories */}
      <section className="pb-12">
        <Container>
          <div className="space-y-4">
            {stories.map((s, i) => (
              <FadeInSection key={i}>
                <div className="glass rounded-3xl p-5">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-12 h-12 rounded-full bg-accent-blue/15 flex items-center justify-center text-accent-blue font-bold text-sm">
                      {s.avatar}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium text-sm">{s.name}, {s.age}</p>
                      <p className="text-text-muted text-xs">{s.location} · {s.timeWeeks} semanas</p>
                    </div>
                    <ScoreBadge before={s.scoreBefore} after={s.scoreAfter} />
                  </div>

                  {/* Headline */}
                  <h3 className="font-heading font-semibold text-white mb-3">{s.headline}</h3>

                  {/* Quote */}
                  <div className="bg-accent-blue/5 rounded-xl p-3 mb-3 flex gap-2">
                    <Quote className="w-4 h-4 text-accent-blue shrink-0 mt-0.5" />
                    <p className="text-white/80 text-sm italic">{s.quote}</p>
                  </div>

                  {/* Tags */}
                  <div className="flex gap-2 flex-wrap mb-3">
                    {s.tags.map(t => (
                      <span key={t} className="px-2.5 py-1 bg-white/5 rounded-full text-text-secondary text-[10px] font-medium">
                        {t}
                      </span>
                    ))}
                  </div>

                  {/* Expandable story */}
                  <button
                    onClick={() => setExpanded(expanded === i ? null : i)}
                    className="flex items-center gap-1.5 text-accent-blue text-xs font-medium active:opacity-70"
                  >
                    {expanded === i ? 'Ver menos' : 'Leer historia completa'}
                    {expanded === i ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </button>

                  {expanded === i && (
                    <p className="text-text-secondary text-sm leading-relaxed mt-3">
                      {s.story}
                    </p>
                  )}
                </div>
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
