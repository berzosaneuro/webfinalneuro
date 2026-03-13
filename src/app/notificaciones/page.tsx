'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Bell, Clock, Brain, Moon, Sun, Zap, Shield, Check, BellOff } from 'lucide-react'

const STORAGE_KEY = 'neuro_notifications'

type NotifSettings = {
  enabled: boolean
  morningReminder: boolean
  morningTime: string
  eveningReminder: boolean
  eveningTime: string
  sosAlert: boolean
  weeklyReport: boolean
  challengeReminder: boolean
  smartTiming: boolean
  quietHoursStart: string
  quietHoursEnd: string
}

const defaults: NotifSettings = {
  enabled: true,
  morningReminder: true,
  morningTime: '08:00',
  eveningReminder: true,
  eveningTime: '21:00',
  sosAlert: true,
  weeklyReport: true,
  challengeReminder: true,
  smartTiming: true,
  quietHoursStart: '23:00',
  quietHoursEnd: '07:00',
}

export default function NotificacionesPage() {
  const [settings, setSettings] = useState<NotifSettings>(defaults)
  const [mounted, setMounted] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setMounted(true)
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setSettings(JSON.parse(raw))
    } catch {}
  }, [])

  const update = (key: keyof NotifSettings, value: boolean | string) => {
    const next = { ...settings, [key]: value }
    setSettings(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(true)
    setTimeout(() => setSaved(false), 1500)
  }

  if (!mounted) return <div className="min-h-screen flex items-center justify-center">
    <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
  </div>

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-accent-blue top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Notificaciones</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Inteligentes. En el momento justo. Sin spam.</p>
        </Container>
      </section>

      {/* Master toggle */}
      <section className="pb-5">
        <Container>
          <div className="glass rounded-2xl p-4 flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
              settings.enabled ? 'bg-accent-blue/15' : 'bg-white/5'
            }`}>
              {settings.enabled ? <Bell className="w-5 h-5 text-accent-blue" /> : <BellOff className="w-5 h-5 text-text-muted" />}
            </div>
            <div className="flex-1">
              <p className="text-white text-sm font-medium">Notificaciones</p>
              <p className="text-text-muted text-xs">{settings.enabled ? 'Activadas' : 'Desactivadas'}</p>
            </div>
            <button
              onClick={() => update('enabled', !settings.enabled)}
              className={`w-12 h-7 rounded-full transition-all ${settings.enabled ? 'bg-accent-blue' : 'bg-white/10'}`}
            >
              <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.enabled ? 'translate-x-6' : 'translate-x-1'}`} />
            </button>
          </div>
        </Container>
      </section>

      {settings.enabled && (
        <>
          {/* Smart timing */}
          <section className="pb-5">
            <Container>
              <FadeInSection>
                <div className="glass rounded-3xl p-5">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center">
                      <Brain className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Timing inteligente</p>
                      <p className="text-text-muted text-xs">La app detecta tus patrones y envía recordatorios en el momento óptimo</p>
                    </div>
                    <button
                      onClick={() => update('smartTiming', !settings.smartTiming)}
                      className={`w-12 h-7 rounded-full transition-all ${settings.smartTiming ? 'bg-accent-blue' : 'bg-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.smartTiming ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {settings.smartTiming && (
                    <div className="bg-accent-blue/5 rounded-xl p-3">
                      <p className="text-text-secondary text-xs leading-relaxed">
                        Analizamos a qué hora sueles meditar, qué días fallas y cuándo tu uso del móvil indica estrés para enviar el recordatorio perfecto.
                      </p>
                    </div>
                  )}
                </div>
              </FadeInSection>
            </Container>
          </section>

          {/* Reminders */}
          <section className="pb-5">
            <Container>
              <FadeInSection>
                <h2 className="font-heading font-semibold text-white text-lg mb-4">Recordatorios</h2>
                <div className="space-y-3">
                  {/* Morning */}
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-teal-500/15 flex items-center justify-center shrink-0">
                      <Sun className="w-5 h-5 text-teal-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Meditación matutina</p>
                      <p className="text-text-muted text-xs">Empieza el día con intención</p>
                    </div>
                    <button
                      onClick={() => update('morningReminder', !settings.morningReminder)}
                      className={`w-12 h-7 rounded-full transition-all ${settings.morningReminder ? 'bg-accent-blue' : 'bg-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.morningReminder ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Evening */}
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/15 flex items-center justify-center shrink-0">
                      <Moon className="w-5 h-5 text-indigo-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Ritual nocturno</p>
                      <p className="text-text-muted text-xs">Prepara tu mente para dormir</p>
                    </div>
                    <button
                      onClick={() => update('eveningReminder', !settings.eveningReminder)}
                      className={`w-12 h-7 rounded-full transition-all ${settings.eveningReminder ? 'bg-accent-blue' : 'bg-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.eveningReminder ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* Challenge */}
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/15 flex items-center justify-center shrink-0">
                      <Zap className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Reto semanal</p>
                      <p className="text-text-muted text-xs">No pierdas tu racha</p>
                    </div>
                    <button
                      onClick={() => update('challengeReminder', !settings.challengeReminder)}
                      className={`w-12 h-7 rounded-full transition-all ${settings.challengeReminder ? 'bg-accent-blue' : 'bg-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.challengeReminder ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>

                  {/* SOS */}
                  <div className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0">
                      <Shield className="w-5 h-5 text-rose-400" />
                    </div>
                    <div className="flex-1">
                      <p className="text-white text-sm font-medium">Detección de estrés</p>
                      <p className="text-text-muted text-xs">Alerta cuando detectamos picos de uso</p>
                    </div>
                    <button
                      onClick={() => update('sosAlert', !settings.sosAlert)}
                      className={`w-12 h-7 rounded-full transition-all ${settings.sosAlert ? 'bg-accent-blue' : 'bg-white/10'}`}
                    >
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${settings.sosAlert ? 'translate-x-6' : 'translate-x-1'}`} />
                    </button>
                  </div>
                </div>
              </FadeInSection>
            </Container>
          </section>

          {/* Quiet hours */}
          <section className="pb-12">
            <Container>
              <FadeInSection>
                <h2 className="font-heading font-semibold text-white text-lg mb-4">Horas de silencio</h2>
                <div className="glass rounded-2xl p-4">
                  <p className="text-text-secondary text-sm mb-3">No molestar entre:</p>
                  <div className="flex items-center gap-3">
                    <input
                      type="time"
                      value={settings.quietHoursStart}
                      onChange={(e) => update('quietHoursStart', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-blue/50"
                    />
                    <span className="text-text-muted text-sm">y</span>
                    <input
                      type="time"
                      value={settings.quietHoursEnd}
                      onChange={(e) => update('quietHoursEnd', e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-accent-blue/50"
                    />
                  </div>
                </div>
              </FadeInSection>
            </Container>
          </section>
        </>
      )}

      {saved && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 px-4 py-2 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center gap-2 animate-fade-in">
          <Check className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium">Guardado</span>
        </div>
      )}
    </div>
  )
}
