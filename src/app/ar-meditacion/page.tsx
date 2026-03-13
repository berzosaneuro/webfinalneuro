'use client'

import { useState } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Camera, Sparkles, Eye, Trees, Orbit, Play, Smartphone, ChevronRight, Maximize, Wind } from 'lucide-react'

const arModes = [
  { id: 'particles', icon: Sparkles, name: 'Particulas de luz', desc: 'Particulas luminosas flotando a tu alrededor', color: 'text-violet-400', bg: 'bg-violet-500/10', border: 'border-violet-500/30' },
  { id: 'mandala', icon: Orbit, name: 'Mandala vivo', desc: 'Un mandala que pulsa al ritmo de tu respiracion', color: 'text-cyan-400', bg: 'bg-cyan-500/10', border: 'border-cyan-500/30' },
  { id: 'energy', icon: Eye, name: 'Campo de energia', desc: 'Visualizacion de aura y campo energetico', color: 'text-teal-400', bg: 'bg-teal-500/10', border: 'border-teal-500/30' },
  { id: 'forest', icon: Trees, name: 'Bosque interior', desc: 'Un bosque virtual superpuesto en tu espacio', color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30' },
]

const steps = [
  { num: '01', icon: Camera, title: 'Permite el acceso a tu camara', desc: 'Necesitamos tu camara para proyectar la experiencia AR en tu entorno real.' },
  { num: '02', icon: Maximize, title: 'Elige tu experiencia', desc: 'Selecciona entre particulas, mandalas, campos de energia o un bosque inmersivo.' },
  { num: '03', icon: Wind, title: 'Sigue la guia de respiracion', desc: 'Un circulo animado te marca el ritmo. Inhala cuando se expande, exhala cuando se contrae.' },
]

export default function ARMeditacionPage() {
  const [selected, setSelected] = useState('particles')
  const [cameraOn, setCameraOn] = useState(false)

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-violet-600 -top-20 -right-40" />
      <div className="orb w-72 h-72 bg-cyan-600 top-[800px] -left-32" />

      {/* Hero */}
      <section className="relative pt-10 pb-8 md:pt-20 md:pb-14">
        <Container>
          <div className="max-w-2xl md:mx-auto md:text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-5 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">Realidad Aumentada</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 animate-fade-in leading-[1.1]">
              Meditacion{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-purple-400 to-cyan-400">AR</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg animate-fade-in-up leading-relaxed">
              Transforma tu espacio fisico en un santuario inmersivo. Usa tu camara para proyectar experiencias meditativas directamente en tu entorno.
            </p>
          </div>
        </Container>
      </section>

      {/* AR Experience Selector */}
      <section className="relative pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Elige tu experiencia</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {arModes.map((mode) => (
                <button
                  key={mode.id}
                  onClick={() => setSelected(mode.id)}
                  className={`glass rounded-2xl p-4 text-left transition-all duration-300 ${
                    selected === mode.id
                      ? `ring-2 ring-violet-500/60 ${mode.border} shadow-[0_0_24px_rgba(124,58,237,0.2)]`
                      : 'hover:scale-[1.02] active:scale-[0.97]'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-xl ${mode.bg} flex items-center justify-center mb-3`}>
                    <mode.icon className={`w-5 h-5 ${mode.color}`} />
                  </div>
                  <p className="text-white text-sm font-semibold mb-1">{mode.name}</p>
                  <p className="text-text-muted text-xs leading-snug">{mode.desc}</p>
                </button>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Camera Preview Area */}
      <section className="relative pb-8">
        <Container>
          <FadeInSection>
            <div className="relative rounded-3xl overflow-hidden" style={{ minHeight: 360 }}>
              {/* Animated gradient placeholder */}
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(135deg, #0F1423, #1a103a, #0d2a3a, #0F1423)',
                  backgroundSize: '400% 400%',
                  animation: 'gradientShift 8s ease infinite',
                }}
              />
              <style jsx>{`
                @keyframes gradientShift {
                  0% { background-position: 0% 50% }
                  50% { background-position: 100% 50% }
                  100% { background-position: 0% 50% }
                }
              `}</style>

              {/* Scan lines overlay */}
              <div className="absolute inset-0 opacity-[0.03]" style={{
                backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.08) 2px, rgba(255,255,255,0.08) 4px)',
              }} />

              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-8 h-8 border-l-2 border-t-2 border-violet-500/40 rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-8 h-8 border-r-2 border-t-2 border-violet-500/40 rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-8 h-8 border-l-2 border-b-2 border-violet-500/40 rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-8 h-8 border-r-2 border-b-2 border-violet-500/40 rounded-br-lg" />

              {/* Center content */}
              <div className="relative flex flex-col items-center justify-center h-full py-20 gap-5">
                {!cameraOn ? (
                  <>
                    <div className="w-16 h-16 rounded-full bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                      <Camera className="w-7 h-7 text-violet-400" />
                    </div>
                    <p className="text-text-muted text-sm">Vista previa de camara</p>
                    <button
                      onClick={() => setCameraOn(true)}
                      className="flex items-center gap-2 px-6 py-3 rounded-full bg-accent-blue text-white text-sm font-semibold transition-all duration-200 hover:shadow-[0_0_24px_rgba(124,58,237,0.4)] active:scale-95"
                    >
                      <Play className="w-4 h-4" />
                      Iniciar camara
                    </button>
                  </>
                ) : (
                  <>
                    <p className="text-violet-400 text-sm font-medium animate-pulse">Camara activa — {arModes.find(m => m.id === selected)?.name}</p>
                    <p className="text-text-muted text-xs">Aqui se renderizaria la experiencia WebXR</p>
                    <button
                      onClick={() => setCameraOn(false)}
                      className="px-5 py-2 rounded-full border border-white/10 text-text-secondary text-xs font-medium hover:bg-white/5 transition-all"
                    >
                      Detener
                    </button>
                  </>
                )}
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Breathing Guide Overlay */}
      <section className="relative pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-2">Guia de respiracion</h2>
            <p className="text-text-secondary text-sm mb-6">Sincroniza tu respiracion con el circulo. Inhala al expandirse, exhala al contraerse.</p>
            <div className="flex flex-col items-center justify-center py-10">
              <div className="relative flex items-center justify-center">
                {/* Outer glow ring */}
                <div
                  className="absolute rounded-full border border-violet-500/20"
                  style={{
                    width: 180, height: 180,
                    animation: 'breathe 8s ease-in-out infinite',
                  }}
                />
                {/* Main breathing circle */}
                <div
                  className="rounded-full flex items-center justify-center"
                  style={{
                    width: 120, height: 120,
                    background: 'radial-gradient(circle, rgba(124,58,237,0.35), rgba(124,58,237,0.08))',
                    boxShadow: '0 0 40px rgba(124,58,237,0.2)',
                    animation: 'breathe 8s ease-in-out infinite',
                  }}
                >
                  <Wind className="w-6 h-6 text-violet-300" />
                </div>
              </div>
              <style jsx>{`
                @keyframes breathe {
                  0%, 100% { transform: scale(1); opacity: 0.7; }
                  50% { transform: scale(1.45); opacity: 1; }
                }
              `}</style>
              <p className="text-text-muted text-xs mt-6 tracking-wide uppercase">4s inhalar — 4s exhalar</p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* How it Works */}
      <section className="relative pb-10">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-5">Como funciona</h2>
            <div className="space-y-4">
              {steps.map((step) => (
                <div key={step.num} className="glass rounded-2xl p-5 flex items-start gap-4">
                  <div className="w-11 h-11 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                    <step.icon className="w-5 h-5 text-violet-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-violet-500 text-xs font-bold tracking-widest">{step.num}</span>
                      <ChevronRight className="w-3 h-3 text-text-muted" />
                      <p className="text-white text-sm font-semibold">{step.title}</p>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Compatibility Note */}
      <section className="relative pb-16">
        <Container>
          <FadeInSection>
            <div className="glass rounded-2xl p-5 flex items-start gap-4">
              <div className="w-11 h-11 rounded-xl bg-teal-500/10 flex items-center justify-center shrink-0">
                <Smartphone className="w-5 h-5 text-teal-400" />
              </div>
              <div>
                <p className="text-white text-sm font-semibold mb-1">Compatibilidad</p>
                <p className="text-text-secondary text-sm leading-relaxed">
                  Requiere navegador con soporte WebXR. Funciona mejor en Chrome para Android y Safari en iOS 16+.
                </p>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
