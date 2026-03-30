'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import {
  Users, UserPlus, MessageCircle, Calendar, Target,
  Award, Shield, ChevronRight, Check, Heart,
} from 'lucide-react'

const FOCUS_TOPICS = [
  { id: 'ansiedad', label: 'Ansiedad' },
  { id: 'presencia', label: 'Presencia' },
  { id: 'sueno', label: 'Sueño' },
  { id: 'emociones', label: 'Emociones' },
  { id: 'crecimiento', label: 'Crecimiento' },
]

export default function CompaneroPage() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_COMPANERO === 'true'
  const [searching, setSearching] = useState(false)
  const [language, setLanguage] = useState('es')
  const [timezone, setTimezone] = useState('espana')
  const [frequency, setFrequency] = useState('semanal')
  const [topics, setTopics] = useState<string[]>(['ansiedad'])

  if (!enabled) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 text-center">
        <div className="glass rounded-3xl p-6 max-w-md">
          <h1 className="font-heading text-white text-xl font-bold mb-2">Compañero no disponible por ahora</h1>
          <p className="text-text-secondary text-sm">
            El emparejamiento aún no está conectado a backend real. Está desactivado para evitar experiencias falsas.
          </p>
        </div>
      </div>
    )
  }
  const toggleTopic = (id: string) =>
    setTopics(prev => prev.includes(id) ? prev.filter(t => t !== id) : [...prev, id])

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-violet-600 top-10 -right-24" />
      <div className="orb w-64 h-64 bg-purple-600 top-[700px] -left-32" />

      {/* Hero */}
      <section className="pt-8 md:pt-16 pb-6">
        <Container>
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-6 h-6 text-violet-400" />
            <span className="text-violet-400 text-xs font-medium uppercase tracking-wider">Sistema de emparejamiento</span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 animate-fade-in">
            Compañero de Conciencia
          </h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">
            No caminas solo. Te emparejamos con alguien de tu nivel.
          </p>
        </Container>
      </section>

      {/* Your profile card */}
      <section className="pb-5">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5">
              <h2 className="font-heading font-semibold text-white text-sm mb-4 flex items-center gap-2">
                <Shield className="w-4 h-4 text-violet-400" /> Tu perfil
              </h2>
              <div className="grid grid-cols-3 gap-3 mb-4">
                <div className="glass rounded-2xl p-3 text-center">
                  <Award className="w-5 h-5 text-violet-400 mx-auto mb-1" />
                  <p className="font-heading text-sm font-bold text-white">Nivel 12</p>
                  <p className="text-text-muted text-[10px]">Observador</p>
                </div>
                <div className="glass rounded-2xl p-3 text-center">
                  <Target className="w-5 h-5 text-orange-400 mx-auto mb-1" />
                  <p className="font-heading text-sm font-bold text-white">23 días</p>
                  <p className="text-text-muted text-[10px]">Racha</p>
                </div>
                <div className="glass rounded-2xl p-3 text-center">
                  <Heart className="w-5 h-5 text-cyan-400 mx-auto mb-1" />
                  <p className="font-heading text-sm font-bold text-white">Ansiedad</p>
                  <p className="text-text-muted text-[10px]">Foco</p>
                </div>
              </div>
              <button
                onClick={() => setSearching(true)}
                className="w-full py-3 bg-accent-blue text-white rounded-xl text-sm font-medium active:scale-95 transition-transform flex items-center justify-center gap-2"
              >
                <UserPlus className="w-4 h-4" />
                {searching ? 'Buscando compañero...' : 'Encontrar compañero'}
              </button>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Matching preferences */}
      <section className="pb-5">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5">
              <h2 className="font-heading font-semibold text-white text-sm mb-4">Preferencias de emparejamiento</h2>
              <div className="space-y-4">
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Idioma</label>
                  <div className="flex gap-2">
                    {[{ id: 'es', label: 'Español' }, { id: 'en', label: 'Inglés' }].map(l => (
                      <button key={l.id} onClick={() => setLanguage(l.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${language === l.id ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'glass text-text-muted'}`}>
                        {l.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Zona horaria</label>
                  <div className="flex gap-2">
                    {[{ id: 'espana', label: 'España' }, { id: 'latam', label: 'Latinoamérica' }].map(tz => (
                      <button key={tz.id} onClick={() => setTimezone(tz.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${timezone === tz.id ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'glass text-text-muted'}`}>
                        {tz.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Frecuencia de check-in</label>
                  <div className="flex gap-2">
                    {[{ id: 'diario', label: 'Diario' }, { id: 'semanal', label: 'Semanal' }, { id: 'bisemanal', label: 'Bisemanal' }].map(f => (
                      <button key={f.id} onClick={() => setFrequency(f.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${frequency === f.id ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'glass text-text-muted'}`}>
                        {f.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-text-muted text-xs mb-1.5 block">Temas de enfoque</label>
                  <div className="flex flex-wrap gap-2">
                    {FOCUS_TOPICS.map(t => (
                      <button key={t.id} onClick={() => toggleTopic(t.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all active:scale-95 flex items-center gap-1.5 ${topics.includes(t.id) ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30' : 'glass text-text-muted'}`}>
                        {topics.includes(t.id) && <Check className="w-3 h-3" />}
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* How it works */}
      <section className="pb-5">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Cómo funciona</h2>
            <div className="space-y-3">
              {[
                { step: 1, title: 'Completa tu perfil', desc: 'Selecciona tus preferencias y área de enfoque', icon: Shield },
                { step: 2, title: 'Te emparejamos con IA', desc: 'Nuestro algoritmo encuentra tu match ideal', icon: Users },
                { step: 3, title: 'Check-in semanal de 10 min', desc: 'Compartid progreso, retos y aprendizajes', icon: Calendar },
                { step: 4, title: 'Crecen juntos', desc: 'Accountability mutua que multiplica resultados', icon: Award },
              ].map(s => (
                <div key={s.step} className="glass rounded-2xl p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                    <span className="font-heading text-violet-400 font-bold text-sm">{s.step}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-white text-sm font-medium">{s.title}</p>
                    <p className="text-text-muted text-xs">{s.desc}</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Active buddy */}
      <section className="pb-5">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Tu compañero activo</h2>
            <div className="glass rounded-3xl p-5 border border-violet-500/20">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-2xl bg-violet-500/15 flex items-center justify-center text-2xl">
                  🧘
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">Anónimo #4782</p>
                  <p className="text-violet-400 text-xs font-medium">Observador Nivel 11</p>
                  <p className="text-text-muted text-[10px]">Racha: 31 días · Foco: Presencia</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-white text-sm font-bold">6 semanas</p>
                  <p className="text-text-muted text-[10px]">Compromiso mutuo</p>
                </div>
                <div className="glass rounded-xl p-3 text-center">
                  <p className="text-white text-sm font-bold">2 Mar 2026</p>
                  <p className="text-text-muted text-[10px]">Próximo check-in</p>
                </div>
              </div>
              <button className="w-full py-3 bg-accent-blue text-white rounded-xl text-sm font-medium active:scale-95 transition-transform flex items-center justify-center gap-2">
                <MessageCircle className="w-4 h-4" />
                Enviar mensaje
              </button>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-5">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5 text-center">
              <Target className="w-8 h-8 text-violet-400 mx-auto mb-3" />
              <p className="font-heading text-2xl font-bold text-white mb-1">87% vs 23%</p>
              <p className="text-text-secondary text-sm">
                de usuarios con compañero mantienen su racha vs sin compañero
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Testimonial */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-5">
              <div className="flex items-center gap-2 mb-3">
                <MessageCircle className="w-4 h-4 text-violet-400" />
                <span className="text-violet-400 text-xs font-medium">Testimonio</span>
              </div>
              <p className="text-white text-sm leading-relaxed italic mb-3">
                &ldquo;Llevaba meses intentando meditar solo y siempre abandonaba. Desde que tengo
                compañero, no he fallado ni un solo día. Saber que alguien cuenta contigo cambia
                todo. Es como tener un espejo de consciencia.&rdquo;
              </p>
              <p className="text-text-muted text-xs">
                — Usuario anónimo, Nivel 9 · 4 meses con compañero
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
