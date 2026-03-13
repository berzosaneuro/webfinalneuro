'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Watch, Activity, Heart, Bluetooth, TrendingUp, Wifi, BarChart3, Zap, Brain, ChevronRight } from 'lucide-react'

const devices = [
  { name: 'Apple Watch', icon: Watch, connected: true, battery: '72%' },
  { name: 'Oura Ring', icon: Activity, connected: false, battery: null },
  { name: 'Garmin', icon: Wifi, connected: false, battery: null },
  { name: 'Fitbit', icon: BarChart3, connected: false, battery: null },
  { name: 'Whoop', icon: Zap, connected: false, battery: null },
]

const sessions = [
  { date: '25 Feb', duration: '20 min', hrvBefore: 48, hrvDuring: 64, hrvAfter: 58, coherence: 7.2 },
  { date: '24 Feb', duration: '15 min', hrvBefore: 45, hrvDuring: 61, hrvAfter: 55, coherence: 6.8 },
  { date: '22 Feb', duration: '25 min', hrvBefore: 50, hrvDuring: 68, hrvAfter: 60, coherence: 7.9 },
  { date: '21 Feb', duration: '10 min', hrvBefore: 42, hrvDuring: 55, hrvAfter: 50, coherence: 5.4 },
  { date: '19 Feb', duration: '20 min', hrvBefore: 44, hrvDuring: 59, hrvAfter: 53, coherence: 6.1 },
]

function generateHRVPath() {
  const points: string[] = []
  for (let i = 0; i <= 60; i++) {
    const x = (i / 60) * 320
    const base = 55 + Math.sin(i * 0.15) * 12 + Math.sin(i * 0.4) * 5 + Math.cos(i * 0.08) * 8
    const y = 100 - base
    points.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`)
  }
  return points.join(' ')
}

export default function BiofeedbackPage() {
  const [hrv, setHrv] = useState(62)
  const [bpm, setBpm] = useState(68)
  const [coherence, setCoherence] = useState(7.4)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const interval = setInterval(() => {
      setHrv(prev => Math.max(45, Math.min(85, prev + Math.round((Math.random() - 0.45) * 4))))
      setBpm(prev => Math.max(58, Math.min(78, prev + Math.round((Math.random() - 0.5) * 2))))
      setCoherence(prev => Math.max(3, Math.min(10, +(prev + (Math.random() - 0.45) * 0.6).toFixed(1))))
    }, 2000)
    return () => clearInterval(interval)
  }, [])

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  const hrvPath = generateHRVPath()

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-accent-blue top-10 -right-28" />
      <div className="orb w-64 h-64 bg-accent-purple bottom-40 -left-20" />

      {/* Hero */}
      <section className="pt-8 md:pt-16 pb-6">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 animate-fade-in">
            Biofeedback
          </h1>
          <p className="text-text-secondary text-base animate-fade-in-up max-w-lg">
            Mide tu conciencia con datos reales. Conecta tus wearables y observa cómo la meditación transforma tu sistema nervioso.
          </p>
        </Container>
      </section>

      {/* Dispositivos */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="flex items-center gap-2 mb-3">
              <Bluetooth className="w-4 h-4 text-accent-blue" />
              <h2 className="font-heading font-semibold text-white text-lg">Dispositivos</h2>
            </div>
            <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
              {devices.map((d) => (
                <div key={d.name} className="glass rounded-2xl p-4 min-w-[140px] flex flex-col items-center gap-2.5 shrink-0">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${d.connected ? 'bg-accent-blue/20' : 'bg-white/5'}`}>
                    <d.icon className={`w-5 h-5 ${d.connected ? 'text-accent-blue' : 'text-text-muted'}`} />
                  </div>
                  <span className="text-white text-xs font-medium text-center">{d.name}</span>
                  {d.connected ? (
                    <span className="text-[10px] text-green-400 font-medium">Conectado {d.battery}</span>
                  ) : (
                    <button className="bg-accent-blue text-white text-[10px] font-semibold px-3 py-1 rounded-full active:scale-95 transition-transform">
                      Conectar
                    </button>
                  )}
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Dashboard en vivo */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="flex items-center gap-2 mb-3">
              <Activity className="w-4 h-4 text-green-400" />
              <h2 className="font-heading font-semibold text-white text-lg">Dashboard en vivo</h2>
              <span className="ml-auto flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                <span className="text-green-400 text-[10px] font-medium">EN VIVO</span>
              </span>
            </div>
            <div className="glass rounded-3xl p-5">
              {/* Metrics row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                <div className="text-center">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">HRV</p>
                  <p className="font-heading text-2xl font-bold text-white">{hrv}<span className="text-sm text-text-muted ml-0.5">ms</span></p>
                </div>
                <div className="text-center">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">BPM</p>
                  <p className="font-heading text-2xl font-bold text-white">{bpm}<span className="text-sm text-text-muted ml-0.5">bpm</span></p>
                </div>
                <div className="text-center">
                  <p className="text-text-muted text-[10px] uppercase tracking-wider mb-1">Coherencia</p>
                  <p className="font-heading text-2xl font-bold text-accent-blue">{coherence}</p>
                </div>
              </div>
              {/* SVG Chart */}
              <div className="relative rounded-2xl bg-white/[0.02] p-3 border border-white/5">
                <svg viewBox="0 0 320 110" className="w-full h-auto">
                  <defs>
                    <linearGradient id="hrvGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#7C3AED" stopOpacity="0.3" />
                      <stop offset="100%" stopColor="#7C3AED" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {[20, 40, 60, 80].map(y => (
                    <line key={y} x1="0" y1={y} x2="320" y2={y} stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                  ))}
                  <path d={`${hrvPath} L320,110 L0,110 Z`} fill="url(#hrvGrad)" />
                  <path d={hrvPath} fill="none" stroke="#7C3AED" strokeWidth="2" strokeLinecap="round" />
                </svg>
                <div className="flex justify-between mt-2 px-1">
                  {['0:00', '2:00', '4:00', '6:00', '8:00', '10:00'].map(t => (
                    <span key={t} className="text-text-muted text-[9px]">{t}</span>
                  ))}
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Historial de sesiones */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-accent-purple" />
              <h2 className="font-heading font-semibold text-white text-lg">Historial de sesiones</h2>
            </div>
            <div className="space-y-2.5">
              {sessions.map((s, i) => (
                <div key={i} className="glass rounded-2xl p-4 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                    <Heart className="w-5 h-5 text-accent-blue" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{s.date}</p>
                      <span className="text-text-muted text-[10px]">{s.duration}</span>
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-text-muted text-[10px]">Antes <span className="text-red-400 font-semibold">{s.hrvBefore}</span></span>
                      <span className="text-text-muted text-[10px]">Durante <span className="text-green-400 font-semibold">{s.hrvDuring}</span></span>
                      <span className="text-text-muted text-[10px]">Después <span className="text-accent-blue font-semibold">{s.hrvAfter}</span></span>
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-accent-blue text-sm font-bold">{s.coherence}</p>
                    <p className="text-text-muted text-[9px]">coherencia</p>
                  </div>
                  <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Ciencia */}
      <section className="pb-16">
        <Container>
          <FadeInSection>
            <div className="flex items-center gap-2 mb-3">
              <Brain className="w-4 h-4 text-accent-cyan" />
              <h2 className="font-heading font-semibold text-white text-lg">La ciencia detrás</h2>
            </div>
            <div className="glass rounded-3xl p-5 space-y-4">
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Heart className="w-4 h-4 text-accent-blue" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">Variabilidad cardíaca (HRV)</p>
                  <p className="text-text-muted text-xs leading-relaxed">
                    La HRV mide la variación entre latidos. Un HRV alto indica un sistema nervioso flexible y resiliente. La meditación aumenta la HRV activando el nervio vago.
                  </p>
                </div>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Activity className="w-4 h-4 text-green-400" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">Tono vagal y sistema parasimpático</p>
                  <p className="text-text-muted text-xs leading-relaxed">
                    El nervio vago es el freno del estrés. Meditar fortalece el tono vagal, activando la respuesta parasimpática: menor cortisol, mejor digestión, sueño profundo y claridad mental.
                  </p>
                </div>
              </div>
              <div className="w-full h-px bg-white/5" />
              <div className="flex gap-3">
                <div className="w-9 h-9 rounded-xl bg-accent-purple/10 flex items-center justify-center shrink-0 mt-0.5">
                  <Zap className="w-4 h-4 text-accent-purple" />
                </div>
                <div>
                  <p className="text-white text-sm font-medium mb-1">Coherencia cardíaca</p>
                  <p className="text-text-muted text-xs leading-relaxed">
                    Cuando el ritmo cardíaco, la respiración y el estado emocional se sincronizan, entras en coherencia. Este estado óptimo mejora la toma de decisiones y reduce la reactividad emocional.
                  </p>
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
