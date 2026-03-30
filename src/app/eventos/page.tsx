'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { MapPin, Calendar, Users, Clock, Star, Plus, Globe, ChevronRight, Filter, Navigation } from 'lucide-react'

const CIUDADES = ['Todas', 'Madrid', 'Barcelona', 'Valencia', 'Sevilla', 'México DF', 'Buenos Aires', 'Bogotá', 'Lima']

type Evento = {
  id: string; nombre: string; ciudad: string; lugar: string
  fecha: string; hora: string; organizador: string; nivel: number
  asistentes: number; maxCapacidad: number
  tags: string[]; nivelEvento: string
}

const EVENTOS: Evento[] = [
  {
    id: '1', nombre: 'Meditación al amanecer en Retiro', ciudad: 'Madrid',
    lugar: 'Parque del Retiro, Fuente del Ángel Caído', fecha: '2026-03-07', hora: '07:00',
    organizador: 'Observador Nivel 34', nivel: 34, asistentes: 18, maxCapacidad: 25,
    tags: ['presencial', 'gratuito'], nivelEvento: 'principiante',
  },
  {
    id: '2', nombre: 'Círculo de silencio en Gracia', ciudad: 'Barcelona',
    lugar: 'Plaça del Sol, Gràcia', fecha: '2026-03-08', hora: '19:30',
    organizador: 'Consciencia Nivel 41', nivel: 41, asistentes: 12, maxCapacidad: 15,
    tags: ['presencial', 'donación'], nivelEvento: 'intermedio',
  },
  {
    id: '3', nombre: 'Respiración consciente en Turia', ciudad: 'Valencia',
    lugar: 'Jardines del Turia, tramo 5', fecha: '2026-03-09', hora: '08:00',
    organizador: 'Despierto Nivel 27', nivel: 27, asistentes: 9, maxCapacidad: 20,
    tags: ['presencial', 'gratuito'], nivelEvento: 'principiante',
  },
  {
    id: '4', nombre: 'Meditación caminando en María Luisa', ciudad: 'Sevilla',
    lugar: 'Parque de María Luisa', fecha: '2026-03-10', hora: '09:00',
    organizador: 'Guía Nivel 52', nivel: 52, asistentes: 22, maxCapacidad: 30,
    tags: ['presencial', 'gratuito'], nivelEvento: 'principiante',
  },
  {
    id: '5', nombre: 'Sesión de atención plena en Chapultepec', ciudad: 'México DF',
    lugar: 'Bosque de Chapultepec, Sección 1', fecha: '2026-03-11', hora: '07:30',
    organizador: 'Meditador Nivel 38', nivel: 38, asistentes: 30, maxCapacidad: 40,
    tags: ['presencial', 'donación'], nivelEvento: 'intermedio',
  },
  {
    id: '6', nombre: 'Encuentro de silencio en Palermo', ciudad: 'Buenos Aires',
    lugar: 'Parque Tres de Febrero, Rosedal', fecha: '2026-03-12', hora: '18:00',
    organizador: 'Presente Nivel 45', nivel: 45, asistentes: 14, maxCapacidad: 20,
    tags: ['presencial', 'gratuito'], nivelEvento: 'avanzado',
  },
  {
    id: '7', nombre: 'Contemplación al atardecer en Monserrate', ciudad: 'Bogotá',
    lugar: 'Cerro de Monserrate, mirador', fecha: '2026-03-13', hora: '17:00',
    organizador: 'Vigilia Nivel 29', nivel: 29, asistentes: 8, maxCapacidad: 15,
    tags: ['presencial', 'donación'], nivelEvento: 'principiante',
  },
  {
    id: '8', nombre: 'Retiro urbano de medio día en Miraflores', ciudad: 'Lima',
    lugar: 'Parque del Amor, Miraflores', fecha: '2026-03-14', hora: '10:00',
    organizador: 'Sabio Nivel 60', nivel: 60, asistentes: 16, maxCapacidad: 20,
    tags: ['presencial', 'donación'], nivelEvento: 'avanzado',
  },
  {
    id: '9', nombre: 'Micro-meditación express en el Born', ciudad: 'Barcelona',
    lugar: 'Parc de la Ciutadella', fecha: '2026-03-15', hora: '13:00',
    organizador: 'Fluir Nivel 33', nivel: 33, asistentes: 6, maxCapacidad: 12,
    tags: ['presencial', 'gratuito'], nivelEvento: 'principiante',
  },
  {
    id: '10', nombre: 'Noche de mantras en Casa de Campo', ciudad: 'Madrid',
    lugar: 'Casa de Campo, zona del lago', fecha: '2026-03-16', hora: '21:00',
    organizador: 'Resonancia Nivel 47', nivel: 47, asistentes: 20, maxCapacidad: 25,
    tags: ['presencial', 'donación'], nivelEvento: 'intermedio',
  },
]

const nivelColor: Record<string, string> = {
  principiante: 'text-emerald-400 bg-emerald-500/10',
  intermedio: 'text-cyan-400 bg-cyan-500/10',
  avanzado: 'text-rose-400 bg-rose-500/10',
}

export default function EventosPage() {
  const enabled = process.env.NEXT_PUBLIC_ENABLE_EVENTOS === 'true'
  const [ciudadActiva, setCiudadActiva] = useState('Todas')

  if (!enabled) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-6 text-center">
        <div className="glass rounded-3xl p-6 max-w-md">
          <h1 className="font-heading text-white text-xl font-bold mb-2">Eventos no disponible por ahora</h1>
          <p className="text-text-secondary text-sm">
            El módulo de eventos aún usa datos de demostración. Está desactivado en producción hasta su integración real.
          </p>
        </div>
      </div>
    )
  }
  const eventosFiltrados = ciudadActiva === 'Todas'
    ? EVENTOS
    : EVENTOS.filter(e => e.ciudad === ciudadActiva)

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-accent-blue top-10 -right-24" />
      <div className="orb w-64 h-64 bg-purple-600 top-[700px] -left-32" />

      {/* Hero */}
      <section className="pt-8 md:pt-16 pb-6">
        <Container>
          <div className="flex items-center gap-2 mb-3">
            <Globe className="w-5 h-5 text-accent-blue" />
            <span className="text-accent-blue text-xs font-medium uppercase tracking-wider">Geolocalizados</span>
          </div>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 animate-fade-in">
            Eventos Presenciales
          </h1>
          <p className="text-text-secondary text-sm md:text-base animate-fade-in-up max-w-xl">
            Encuentra encuentros de meditación cerca de ti. Practica en comunidad, conecta con otros meditadores y profundiza tu camino.
          </p>
        </Container>
      </section>

      {/* City filter */}
      <section className="pb-6">
        <Container>
          <div className="flex items-center gap-2 mb-3">
            <Filter className="w-4 h-4 text-text-muted" />
            <span className="text-text-muted text-xs">Filtrar por ciudad</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
            {CIUDADES.map(c => (
              <button
                key={c}
                onClick={() => setCiudadActiva(c)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-medium transition-all active:scale-95 ${
                  ciudadActiva === c
                    ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/25'
                    : 'glass text-text-secondary hover:text-white'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Events list */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-heading font-semibold text-white text-lg">
                Próximos eventos
                <span className="text-text-muted text-sm font-normal ml-2">({eventosFiltrados.length})</span>
              </h2>
            </div>
            <div className="space-y-3">
              {eventosFiltrados.map(evento => {
                const plazas = evento.maxCapacidad - evento.asistentes
                const casiLleno = plazas <= 5
                return (
                  <div key={evento.id} className="glass rounded-2xl p-4">
                    <div className="flex items-start gap-3 mb-3">
                      <div className="w-11 h-11 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                        <MapPin className="w-5 h-5 text-accent-blue" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium leading-snug">{evento.nombre}</p>
                        <p className="text-text-muted text-xs mt-0.5">{evento.ciudad} · {evento.lugar}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mb-3 text-xs text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" /> {evento.fecha}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {evento.hora}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3.5 h-3.5" /> {evento.organizador}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {evento.asistentes}/{evento.maxCapacidad}
                        {casiLleno && <span className="text-orange-400 font-medium ml-1">Casi lleno</span>}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex flex-wrap gap-1.5">
                        {evento.tags.map(tag => (
                          <span key={tag} className="text-[10px] px-2 py-0.5 rounded-full bg-accent-blue/10 text-accent-blue font-medium">
                            {tag}
                          </span>
                        ))}
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${nivelColor[evento.nivelEvento]}`}>
                          {evento.nivelEvento}
                        </span>
                      </div>
                      <button className="px-4 py-2 bg-accent-blue rounded-xl text-white text-xs font-medium active:scale-95 transition-transform">
                        Unirme
                      </button>
                    </div>
                  </div>
                )
              })}

              {eventosFiltrados.length === 0 && (
                <div className="glass rounded-2xl p-8 text-center">
                  <MapPin className="w-8 h-8 text-text-muted mx-auto mb-2" />
                  <p className="text-text-secondary text-sm">No hay eventos en esta ciudad todavía.</p>
                  <p className="text-text-muted text-xs mt-1">Sé el primero en organizar uno.</p>
                </div>
              )}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Create event section */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-purple/15 flex items-center justify-center">
                  <Plus className="w-6 h-6 text-accent-purple" />
                </div>
                <div>
                  <h2 className="font-heading font-bold text-white">¿Quieres organizar?</h2>
                  <p className="text-text-muted text-xs">Crea eventos presenciales en tu ciudad</p>
                </div>
              </div>
              <div className="space-y-2.5 mb-5">
                {[
                  { label: 'Nivel 20+ en la plataforma', done: true },
                  { label: '30 días de racha de meditación', done: false },
                  { label: 'Completar módulo de facilitación', done: false },
                ].map((req, i) => (
                  <div key={i} className="flex items-center gap-2.5">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center ${
                      req.done ? 'bg-emerald-500/15' : 'bg-white/5'
                    }`}>
                      {req.done ? (
                        <ChevronRight className="w-3 h-3 text-emerald-400" />
                      ) : (
                        <div className="w-1.5 h-1.5 rounded-full bg-text-muted" />
                      )}
                    </div>
                    <span className={`text-sm ${req.done ? 'text-white' : 'text-text-muted'}`}>
                      {req.label}
                    </span>
                  </div>
                ))}
              </div>
              <button className="w-full py-3 glass rounded-xl text-accent-blue font-medium text-sm active:scale-95 transition-transform flex items-center justify-center gap-2">
                <Navigation className="w-4 h-4" />
                Solicitar ser organizador
              </button>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Map placeholder */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-8 md:p-12 text-center min-h-[240px] flex flex-col items-center justify-center">
              <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-accent-blue" />
              </div>
              <h3 className="font-heading font-bold text-white text-lg mb-1">Mapa interactivo próximamente</h3>
              <p className="text-text-muted text-sm max-w-sm">
                Visualiza todos los eventos cerca de ti en un mapa en tiempo real. Estamos trabajando en ello.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="glass rounded-2xl p-6 text-center">
              <p className="text-text-secondary text-sm leading-relaxed">
                <span className="text-white font-heading font-bold text-2xl block mb-1">127</span>
                eventos este mes en <span className="text-accent-blue font-semibold">12 ciudades</span>.{' '}
                <span className="text-white font-heading font-bold text-2xl block mt-2 mb-1">2,340</span>
                meditadores presenciales.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
