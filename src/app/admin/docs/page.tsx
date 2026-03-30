'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import Link from 'next/link'
import { ArrowLeft, BookOpen, Volume2, Bot, Activity, Route, Layers } from 'lucide-react'

export default function AdminDocsPage() {
  const { isAdmin } = useAdmin()
  const router = useRouter()

  useEffect(() => {
    if (!isAdmin) {
      router.push('/admin/login')
    }
  }, [isAdmin, router])

  if (!isAdmin) return null

  return (
    <div className="min-h-screen bg-dark-primary text-text-primary px-4 py-8">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-text-secondary hover:text-white mb-8"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver al panel
        </Link>

        <div className="flex items-center gap-3 mb-8">
          <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center">
            <BookOpen className="w-6 h-6 text-accent-blue" />
          </div>
          <div>
            <h1 className="font-heading text-2xl font-bold text-white">Documentación interna</h1>
            <p className="text-text-muted text-sm">Referencia técnica para el creador de la app</p>
          </div>
        </div>

        <div className="space-y-8">
          {/* Arquitectura */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-accent-blue" />
              Arquitectura general
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Berzosa Neuro es una PWA Next.js 14 (App Router) con Supabase como backend. Stack:
              React 18, TypeScript, Tailwind CSS, lucide-react.
            </p>
            <ul className="text-text-secondary text-sm space-y-1 list-disc list-inside">
              <li><code className="text-accent-blue">src/app/</code> — Rutas (páginas) y API routes</li>
              <li><code className="text-accent-blue">src/components/</code> — Componentes reutilizables</li>
              <li><code className="text-accent-blue">src/context/</code> — PremiumContext, AdminContext, UserContext</li>
              <li><code className="text-accent-blue">src/lib/</code> — Utilidades (supabase, audio-manager, session-tracking, elias-progress)</li>
            </ul>
          </section>

          {/* Sistema de audio */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Volume2 className="w-5 h-5 text-accent-blue" />
              Sistema de audio
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Un solo audio activo a la vez (meditación, podcast, masterclass o SOS). Gestión en <code className="text-accent-blue">lib/audio-manager.ts</code>.
            </p>
            <ul className="text-text-secondary text-sm space-y-1">
              <li><strong>Meditación:</strong> <code>/meditacion</code> — MeditationCards.tsx, usa trackSessionStart/Complete/Interrupted</li>
              <li><strong>Podcast:</strong> <code>/podcast</code> — mismo flujo de sesión</li>
              <li><strong>Masterclass:</strong> <code>/masterclass</code> — vídeo/audio con tracking</li>
              <li><strong>SOS:</strong> <code>/sos</code> — respiración 4-7-8 con audio ambiente generado (Web Audio API)</li>
            </ul>
            <p className="text-text-muted text-xs mt-3">
              AudioRouteHandler detiene todo al cambiar de ruta. Session tracking: localStorage neuro_audio_sessions.
            </p>
          </section>

          {/* Asistente */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Bot className="w-5 h-5 text-accent-blue" />
              Asistente &quot;Habla con Elías&quot;
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Orb flotante visible en toda la app. Panel lazy-loaded al hacer clic. API: <code className="text-accent-blue">/api/ia-coach</code>.
            </p>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>Componentes: EliasOrb, EliasChatPanel, EliasAvatar, EliasMessage, EliasSuggestions</li>
              <li>Claude (Anthropic) si ANTHROPIC_API_KEY está definida; si no, respuestas locales inteligentes</li>
              <li>Progreso: el panel envía un resumen de localStorage al API para respuestas contextuales</li>
              <li>No hace llamadas API hasta que el usuario envía un mensaje</li>
            </ul>
          </section>

          {/* Progreso */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent-blue" />
              Tracking de progreso
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Datos en localStorage (cliente) y Supabase (si hay usuario identificado).
            </p>
            <ul className="text-text-secondary text-sm space-y-1">
              <li><code>neuro_audio_sessions</code> — meditación, podcast, masterclass (started/completed/interrupted)</li>
              <li><code>plan7_data</code> — reto 7 días (completedDays, startDate)</li>
              <li><code>programa21_data</code> — programa 21 días (completedDays, startDate)</li>
              <li><code>neuroscore_data</code> — logs diarios (meditated, exerciseDone, testDone, trainingDone, etc.)</li>
              <li><code>neuro_training_daily</code> — entrenamiento N.E.U.R.O. del día (completions, streak)</li>
              <li>Elías usa <code>lib/elias-progress.ts</code> para leer esto y personalizar respuestas</li>
            </ul>
          </section>

          {/* Entrenamiento diario */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent-blue" />
              Entrenamiento Mental Diario
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Sección en la home: <strong>Entrenamiento N.E.U.R.O. del día</strong>. Ejercicio breve de observación de la mente que cambia cada día. Almacenamiento: <code>neuro_training_daily</code>. +10 NeuroScore al completar.
            </p>
            <ul className="text-text-secondary text-sm space-y-1">
              <li>Lib: <code>lib/daily-training.ts</code></li>
              <li>Componente: <code>DailyTrainingSection</code></li>
            </ul>
          </section>

          {/* NeuroScore evolución */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Activity className="w-5 h-5 text-accent-blue" />
              NeuroScore Evolution
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed mb-3">
              Niveles según NeuroScore acumulado: 1) Observador (0), 2) Regulador (500), 3) Metacognitivo (1500), 4) Integración (3500), 5) Supra-consciente (7000).
            </p>
            <p className="text-text-muted text-xs">
              Lib: <code>lib/neuroscore-levels.ts</code>
            </p>
          </section>

          {/* Rutas principales */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Route className="w-5 h-5 text-accent-blue" />
              Rutas principales
            </h2>
            <div className="grid grid-cols-2 gap-2 text-sm">
              {[
                ['/', 'Inicio'],
                ['/meditacion', 'Meditaciones'],
                ['/sos', 'SOS Respiración'],
                ['/plan-7-dias', 'Reto 7 días'],
                ['/programa', 'Programa 21 días'],
                ['/neuroscore', 'NeuroScore'],
                ['/diario', 'Diario'],
                ['/test', 'Test Ruido Mental'],
                ['/ia-coach', 'IA Coach (standalone)'],
                ['/comunidad', 'Comunidad'],
                ['/admin', 'Panel Admin'],
              ].map(([path, label]) => (
                <div key={path} className="flex justify-between">
                  <span className="text-text-secondary">{label}</span>
                  <code className="text-accent-blue text-xs">{path}</code>
                </div>
              ))}
            </div>
          </section>

          {/* Módulos */}
          <section className="glass rounded-2xl p-6">
            <h2 className="font-heading font-semibold text-white flex items-center gap-2 mb-4">
              <Layers className="w-5 h-5 text-accent-blue" />
              Módulos clave
            </h2>
            <ul className="text-text-secondary text-sm space-y-2">
              <li><strong>Navbar + BottomTabBar:</strong> Navegación principal. Tab bar solo móvil.</li>
              <li><strong>PremiumContext:</strong> plan free/premium en localStorage.</li>
              <li><strong>AdminContext:</strong> login admin por contraseña (localStorage).</li>
              <li><strong>PWARegister:</strong> Registro del Service Worker.</li>
              <li><strong>notifications.ts:</strong> Capa preparada para futuras notificaciones push.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  )
}
