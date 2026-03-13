'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { useUser } from '@/context/UserContext'
import {
  Brain, Eye, Heart, Zap, Moon, TrendingUp, Calendar,
  ChevronRight, Star, Flame, Target, Layers
} from 'lucide-react'

const STORAGE_KEY = 'neuroconciencia_mapa'

type DimensionKey = 'presencia' | 'calma' | 'claridad' | 'energia' | 'conexion'

type DayEntry = {
  date: string
  dimensions: Record<DimensionKey, number> // 0-10
  nota: string
  nivel: number // overall level 1-10
}

const DIMENSIONS: { key: DimensionKey; label: string; icon: React.ElementType; color: string; desc: string }[] = [
  { key: 'presencia', label: 'Presencia', icon: Eye, color: '#8B5CF6', desc: 'Capacidad de estar en el ahora' },
  { key: 'calma', label: 'Calma interior', icon: Moon, color: '#06B6D4', desc: 'Nivel de paz mental' },
  { key: 'claridad', label: 'Claridad mental', icon: Zap, color: '#7C3AED', desc: 'Nitidez de pensamiento' },
  { key: 'energia', label: 'Energía vital', icon: Flame, color: '#14B8A6', desc: 'Vitalidad y motivación' },
  { key: 'conexion', label: 'Conexión', icon: Heart, color: '#EF4444', desc: 'Empatía y relaciones' },
]

const NIVELES = [
  { min: 0, max: 2, nombre: 'Dormido', color: 'text-red-400', desc: 'Piloto automático. La mente controla.' },
  { min: 2, max: 4, nombre: 'Despertando', color: 'text-orange-400', desc: 'Empiezas a ver los patrones.' },
  { min: 4, max: 6, nombre: 'Observador', color: 'text-cyan-400', desc: 'Puedes observar sin reaccionar.' },
  { min: 6, max: 8, nombre: 'Consciente', color: 'text-green-400', desc: 'Vives desde la presencia.' },
  { min: 8, max: 10, nombre: 'Supraconsciente', color: 'text-purple-400', desc: 'La consciencia es tu estado natural.' },
]

function generateDemoData(): DayEntry[] {
  const entries: DayEntry[] = []
  for (let i = 30; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    const progress = (30 - i) / 30
    const base = 2 + progress * 5
    const jitter = () => Math.max(0, Math.min(10, base + (Math.random() - 0.4) * 3))
    const dims: Record<DimensionKey, number> = {
      presencia: Math.round(jitter() * 10) / 10,
      calma: Math.round(jitter() * 10) / 10,
      claridad: Math.round(jitter() * 10) / 10,
      energia: Math.round(jitter() * 10) / 10,
      conexion: Math.round(jitter() * 10) / 10,
    }
    const avg = Object.values(dims).reduce((a, b) => a + b, 0) / 5
    entries.push({
      date: d.toISOString().split('T')[0],
      dimensions: dims,
      nota: '',
      nivel: Math.round(avg * 10) / 10,
    })
  }
  return entries
}

function loadData(): DayEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return generateDemoData()
}

function saveData(data: DayEntry[]) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

type MapRow = { date: string; presencia: number; calma: number; claridad: number; energia: number; conexion: number; nivel: number; nota: string }

function apiToDayEntry(row: MapRow): DayEntry {
  return {
    date: row.date,
    dimensions: {
      presencia: row.presencia ?? 5,
      calma: row.calma ?? 5,
      claridad: row.claridad ?? 5,
      energia: row.energia ?? 5,
      conexion: row.conexion ?? 5,
    },
    nota: row.nota ?? '',
    nivel: row.nivel ?? 5,
  }
}

export default function MapaPage() {
  const { user } = useUser()
  const [data, setData] = useState<DayEntry[]>([])
  const [mounted, setMounted] = useState(false)
  const [editing, setEditing] = useState(false)
  const [todayValues, setTodayValues] = useState<Record<DimensionKey, number>>({
    presencia: 5, calma: 5, claridad: 5, energia: 5, conexion: 5,
  })

  useEffect(() => {
    setMounted(true)
    const load = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`/api/mapa?email=${encodeURIComponent(user.email)}`)
          if (res.ok) {
            const rows: MapRow[] = await res.json()
            const loaded = rows.map(apiToDayEntry)
            setData(loaded)
            const today = new Date().toISOString().split('T')[0]
            const todayEntry = loaded.find((e) => e.date === today)
            if (todayEntry) setTodayValues(todayEntry.dimensions)
            return
          }
        } catch {}
      }
      const loaded = loadData()
      setData(loaded)
      const today = new Date().toISOString().split('T')[0]
      const todayEntry = loaded.find((e) => e.date === today)
      if (todayEntry) setTodayValues(todayEntry.dimensions)
    }
    load()
  }, [user?.email])

  const today = new Date().toISOString().split('T')[0]
  const todayEntry = data.find((e) => e.date === today)
  const currentLevel = todayEntry?.nivel || Object.values(todayValues).reduce((a, b) => a + b, 0) / 5
  const currentNivel = NIVELES.find((n) => currentLevel >= n.min && currentLevel < n.max) || NIVELES[0]

  const last7 = data.slice(-7)
  const last30 = data.slice(-30)
  const avgLast7 = last7.length > 0 ? last7.reduce((a, b) => a + b.nivel, 0) / last7.length : 0
  const avgPrev7 = data.slice(-14, -7)
  const avgPrevWeek = avgPrev7.length > 0 ? avgPrev7.reduce((a, b) => a + b.nivel, 0) / avgPrev7.length : 0
  const weekTrend = avgLast7 - avgPrevWeek

  const saveTodayEntry = async () => {
    const avg = Object.values(todayValues).reduce((a, b) => a + b, 0) / 5
    const entry: DayEntry = {
      date: today,
      dimensions: todayValues,
      nota: '',
      nivel: Math.round(avg * 10) / 10,
    }
    const updated = data.filter((e) => e.date !== today)
    updated.push(entry)
    updated.sort((a, b) => a.date.localeCompare(b.date))
    setData(updated)
    if (user?.email) {
      try {
        const res = await fetch('/api/mapa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user.email,
            date: today,
            dimensions: todayValues,
            nota: '',
          }),
        })
        if (!res.ok) throw new Error()
      } catch {
        saveData(updated)
      }
    } else {
      saveData(updated)
    }
    setEditing(false)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-purple-600 top-10 -right-24" />
      <div className="orb w-64 h-64 bg-accent-blue top-[600px] -left-32" />

      {/* Header */}
      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-1 animate-fade-in">
            Mapa de Consciencia
          </h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">
            Tu evolución mental, visualizada.
          </p>
        </Container>
      </section>

      {/* Current level */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 text-center">
              {/* Radial visualization */}
              <div className="relative w-52 h-52 mx-auto mb-5">
                <svg viewBox="0 0 200 200" className="w-full h-full">
                  {/* Pentagon background */}
                  {[0.2, 0.4, 0.6, 0.8, 1].map((scale, i) => (
                    <polygon
                      key={i}
                      points={DIMENSIONS.map((_, di) => {
                        const angle = (di * 2 * Math.PI) / 5 - Math.PI / 2
                        const r = 80 * scale
                        return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
                      }).join(' ')}
                      fill="none"
                      stroke="rgba(255,255,255,0.05)"
                      strokeWidth="1"
                    />
                  ))}
                  {/* Axis lines */}
                  {DIMENSIONS.map((_, i) => {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                    return (
                      <line
                        key={i}
                        x1="100" y1="100"
                        x2={100 + 80 * Math.cos(angle)}
                        y2={100 + 80 * Math.sin(angle)}
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="1"
                      />
                    )
                  })}
                  {/* Data polygon */}
                  <polygon
                    points={DIMENSIONS.map((dim, i) => {
                      const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                      const val = todayValues[dim.key] / 10
                      const r = 80 * val
                      return `${100 + r * Math.cos(angle)},${100 + r * Math.sin(angle)}`
                    }).join(' ')}
                    fill="rgba(139, 92, 246, 0.15)"
                    stroke="#8B5CF6"
                    strokeWidth="2"
                    strokeLinejoin="round"
                  />
                  {/* Data points */}
                  {DIMENSIONS.map((dim, i) => {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                    const val = todayValues[dim.key] / 10
                    const r = 80 * val
                    return (
                      <circle
                        key={dim.key}
                        cx={100 + r * Math.cos(angle)}
                        cy={100 + r * Math.sin(angle)}
                        r="4"
                        fill={dim.color}
                      />
                    )
                  })}
                  {/* Labels */}
                  {DIMENSIONS.map((dim, i) => {
                    const angle = (i * 2 * Math.PI) / 5 - Math.PI / 2
                    const r = 95
                    return (
                      <text
                        key={dim.key}
                        x={100 + r * Math.cos(angle)}
                        y={100 + r * Math.sin(angle)}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-text-muted"
                        fontSize="8"
                      >
                        {dim.label.split(' ')[0]}
                      </text>
                    )
                  })}
                </svg>
              </div>

              <div className="mb-3">
                <span className={`text-xs px-3 py-1 rounded-full font-semibold ${currentNivel.color} bg-white/5`}>
                  {currentNivel.nombre}
                </span>
              </div>
              <p className="font-heading text-4xl font-bold text-white mb-1">{currentLevel.toFixed(1)}</p>
              <p className="text-text-muted text-xs">{currentNivel.desc}</p>

              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="flex items-center gap-1.5">
                  <TrendingUp className={`w-4 h-4 ${weekTrend >= 0 ? 'text-green-400' : 'text-red-400'}`} />
                  <span className={`text-sm font-medium ${weekTrend >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                    {weekTrend >= 0 ? '+' : ''}{weekTrend.toFixed(1)}
                  </span>
                  <span className="text-text-muted text-xs">vs semana anterior</span>
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Rate today */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-heading font-semibold text-white text-lg">
                {editing ? 'Evalúa tu consciencia hoy' : 'Dimensiones de hoy'}
              </h2>
              {!editing && (
                <button
                  onClick={() => setEditing(true)}
                  className="text-accent-blue text-xs font-medium"
                >
                  Editar
                </button>
              )}
            </div>
            <div className="space-y-3">
              {DIMENSIONS.map((dim) => (
                <div key={dim.key} className="glass rounded-2xl p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <dim.icon className="w-4 h-4" style={{ color: dim.color }} />
                    <span className="text-white text-sm font-medium flex-1">{dim.label}</span>
                    <span className="text-white font-heading font-bold">{todayValues[dim.key].toFixed(1)}</span>
                  </div>
                  {editing ? (
                    <input
                      type="range"
                      min="0" max="10" step="0.5"
                      value={todayValues[dim.key]}
                      onChange={(e) => setTodayValues({ ...todayValues, [dim.key]: parseFloat(e.target.value) })}
                      className="w-full h-1.5 rounded-full appearance-none bg-white/10 accent-purple-500"
                    />
                  ) : (
                    <div className="w-full h-1.5 rounded-full bg-white/5">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${todayValues[dim.key] * 10}%`,
                          backgroundColor: dim.color,
                          boxShadow: `0 0 8px ${dim.color}40`,
                        }}
                      />
                    </div>
                  )}
                  <p className="text-text-muted text-[10px] mt-1">{dim.desc}</p>
                </div>
              ))}
              {editing && (
                <button
                  onClick={saveTodayEntry}
                  className="w-full py-3 bg-purple-500/20 text-purple-400 rounded-xl font-medium text-sm active:scale-95 transition-transform"
                >
                  Guardar evaluación
                </button>
              )}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* 30-day timeline */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Evolución 30 días</h2>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-end gap-[3px] h-32">
                {last30.map((entry, i) => {
                  const height = (entry.nivel / 10) * 100
                  const nivel = NIVELES.find((n) => entry.nivel >= n.min && entry.nivel < n.max) || NIVELES[0]
                  const colorMap: Record<string, string> = {
                    'text-red-400': 'bg-red-500/60',
                    'text-orange-400': 'bg-orange-500/60',
                    'text-cyan-400': 'bg-cyan-500/60',
                    'text-green-400': 'bg-green-500/60',
                    'text-purple-400': 'bg-purple-500/60',
                  }
                  return (
                    <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                      <div
                        className={`w-full rounded-t-sm transition-all duration-300 ${colorMap[nivel.color] || 'bg-white/10'}`}
                        style={{ height: `${Math.max(height, 3)}%` }}
                      />
                    </div>
                  )
                })}
              </div>
              <div className="flex justify-between mt-2">
                <span className="text-text-muted text-[10px]">30 días</span>
                <span className="text-text-muted text-[10px]">Hoy</span>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Levels explanation */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-3">Niveles de consciencia</h2>
            <div className="space-y-2">
              {NIVELES.map((n) => {
                const isActive = currentNivel.nombre === n.nombre
                return (
                  <div
                    key={n.nombre}
                    className={`glass rounded-2xl p-4 flex items-center gap-3 ${isActive ? 'border border-purple-500/30' : ''}`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isActive ? 'bg-purple-500/20' : 'bg-white/5'}`}>
                      <Layers className={`w-5 h-5 ${n.color}`} />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-sm font-semibold ${n.color}`}>{n.nombre}</p>
                        <span className="text-text-muted text-[10px]">{n.min}-{n.max}</span>
                        {isActive && (
                          <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-500/10 text-purple-400 font-medium">
                            Tú estás aquí
                          </span>
                        )}
                      </div>
                      <p className="text-text-muted text-xs">{n.desc}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
