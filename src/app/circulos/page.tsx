'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Users, Video, Calendar, Clock, MapPin, UserPlus, Check, ChevronRight, Heart, Brain, Moon, Zap } from 'lucide-react'

type Circle = {
  name: string
  description: string
  members: number
  maxMembers: number
  nextSession: string
  time: string
  facilitator: string
  icon: React.ElementType
  color: string
  frequency: string
}

const circles: Circle[] = [
  {
    name: 'Círculo de Calma',
    description: 'Para personas con ansiedad. Meditaciones guiadas + compartir experiencias en un espacio seguro.',
    members: 6,
    maxMembers: 8,
    nextSession: 'Lunes 20:00',
    time: '45 min',
    facilitator: 'María L. (Nivel 9)',
    icon: Heart,
    color: 'bg-cyan-500/15 text-cyan-400',
    frequency: 'Semanal',
  },
  {
    name: 'Despertar Consciente',
    description: 'Exploración profunda: consciencia, observador, desidentificación. Para practicantes avanzados.',
    members: 5,
    maxMembers: 6,
    nextSession: 'Miércoles 19:30',
    time: '60 min',
    facilitator: 'Carlos V. (Nivel 10)',
    icon: Brain,
    color: 'bg-violet-500/15 text-violet-400',
    frequency: 'Semanal',
  },
  {
    name: 'Sueño Reparador',
    description: 'Protocolos de sueño, Yoga Nidra grupal y seguimiento de hábitos nocturnos.',
    members: 7,
    maxMembers: 8,
    nextSession: 'Jueves 21:30',
    time: '40 min',
    facilitator: 'Laura P. (Nivel 8)',
    icon: Moon,
    color: 'bg-indigo-500/15 text-indigo-400',
    frequency: 'Semanal',
  },
  {
    name: 'Rendimiento Mental',
    description: 'Para ejecutivos y emprendedores. Flow state, foco, gestión de energía mental.',
    members: 4,
    maxMembers: 6,
    nextSession: 'Martes 07:30',
    time: '30 min',
    facilitator: 'Javier S. (Nivel 8)',
    icon: Zap,
    color: 'bg-teal-500/15 text-teal-400',
    frequency: 'Semanal',
  },
]

export default function CirculosPage() {
  const [joined, setJoined] = useState<string[]>([])

  const toggleJoin = (name: string) => {
    setJoined(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name])
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-violet-600 top-10 -left-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Círculos de Consciencia</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Grupos de 5-8 personas. Práctica semanal. Accountability real.</p>
        </Container>
      </section>

      {/* How it works */}
      <section className="pb-5">
        <Container>
          <div className="flex gap-3 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {[
              { icon: Users, text: '5-8 personas', desc: 'Grupo íntimo' },
              { icon: Video, text: 'Videollamada', desc: 'Online' },
              { icon: Calendar, text: 'Semanal', desc: 'Misma hora' },
              { icon: Clock, text: '30-60 min', desc: 'Eficiente' },
            ].map((item, i) => (
              <div key={i} className="shrink-0 glass rounded-2xl px-4 py-3 flex items-center gap-2.5 min-w-[140px]">
                <div className="w-8 h-8 rounded-lg bg-accent-blue/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <p className="text-white text-xs font-medium">{item.text}</p>
                  <p className="text-text-muted text-[10px]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Circles */}
      <section className="pb-6">
        <Container>
          <h2 className="font-heading font-semibold text-white text-lg mb-4">Círculos abiertos</h2>
          <div className="space-y-4">
            {circles.map((c) => {
              const isJoined = joined.includes(c.name)
              const isFull = c.members >= c.maxMembers && !isJoined
              return (
                <FadeInSection key={c.name}>
                  <div className="glass rounded-3xl p-5">
                    <div className="flex items-start gap-3 mb-3">
                      <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center shrink-0`}>
                        <c.icon className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-heading font-semibold text-white">{c.name}</h3>
                        <p className="text-text-muted text-xs">{c.frequency} · {c.time} · {c.facilitator}</p>
                      </div>
                    </div>

                    <p className="text-text-secondary text-sm mb-3">{c.description}</p>

                    <div className="flex items-center gap-4 mb-4">
                      <div className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-text-muted text-xs">{c.members}/{c.maxMembers}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-text-muted" />
                        <span className="text-text-muted text-xs">{c.nextSession}</span>
                      </div>
                    </div>

                    {/* Progress bar of spots */}
                    <div className="w-full h-1.5 bg-white/5 rounded-full mb-4">
                      <div
                        className={`h-1.5 rounded-full transition-all ${c.members >= c.maxMembers ? 'bg-red-400' : 'bg-accent-blue'}`}
                        style={{ width: `${(c.members / c.maxMembers) * 100}%` }}
                      />
                    </div>

                    <button
                      onClick={() => !isFull && toggleJoin(c.name)}
                      disabled={isFull}
                      className={`w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-95 flex items-center justify-center gap-2 ${
                        isJoined
                          ? 'bg-emerald-500/15 text-emerald-400'
                          : isFull
                          ? 'bg-white/5 text-text-muted cursor-not-allowed'
                          : 'bg-accent-blue text-white'
                      }`}
                    >
                      {isJoined ? (
                        <><Check className="w-4 h-4" /> Unido</>
                      ) : isFull ? (
                        'Completo'
                      ) : (
                        <><UserPlus className="w-4 h-4" /> Unirme</>
                      )}
                    </button>
                  </div>
                </FadeInSection>
              )
            })}
          </div>
        </Container>
      </section>

      {/* Become facilitator */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5 text-center">
              <h3 className="font-heading font-semibold text-white mb-2">¿Quieres facilitar un círculo?</h3>
              <p className="text-text-secondary text-sm mb-4">
                A partir de Nivel 7, puedes formarte como facilitador y crear tu propio círculo de consciencia.
              </p>
              <button className="px-6 py-2.5 bg-accent-blue/15 text-accent-blue rounded-xl text-sm font-medium active:scale-95 transition-transform">
                Saber más sobre la certificación
              </button>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
