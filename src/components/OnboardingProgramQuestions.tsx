'use client'

import { useState, useEffect } from 'react'
import { Wind, Target, Moon, Sparkles, Zap, Clock, Bell } from 'lucide-react'

const STORAGE_KEY = 'user_training_preferences'

export type TrainingPreferences = {
  goal?: 'stress' | 'focus' | 'sleep' | 'spiritual'
  experience?: 'new' | 'used_apps' | 'regular'
  preferredTime?: 'morning' | 'midday' | 'evening'
  extraReminder?: boolean
}

function loadPreferences(): TrainingPreferences {
  if (typeof window === 'undefined') return {}
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return {}
}

function savePreferences(prefs: TrainingPreferences) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs))
  } catch {}
}

export default function OnboardingProgramQuestions() {
  const [prefs, setPrefs] = useState<TrainingPreferences>({})
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setPrefs(loadPreferences())
  }, [])

  const update = (key: keyof TrainingPreferences, value: string | boolean) => {
    const next = { ...prefs, [key]: value }
    setPrefs(next)
    savePreferences(next)
  }

  if (!mounted) return null

  return (
    <div className="space-y-6">
      <div>
        <p className="text-text-secondary text-sm mb-2">¿Objetivo principal?</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'stress' as const, label: 'Estrés', icon: Wind },
            { id: 'focus' as const, label: 'Foco', icon: Target },
            { id: 'sleep' as const, label: 'Sueño', icon: Moon },
            { id: 'spiritual' as const, label: 'Espiritual', icon: Sparkles },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update('goal', o.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                prefs.goal === o.id ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40' : 'bg-white/5 text-text-secondary border border-transparent'
              }`}
            >
              <o.icon className="w-3.5 h-3.5" />
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-text-secondary text-sm mb-2">¿Experiencia?</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'new' as const, label: 'Nuevo' },
            { id: 'used_apps' as const, label: 'Usé apps de meditación' },
            { id: 'regular' as const, label: 'Practicante regular' },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update('experience', o.id)}
              className={`px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                prefs.experience === o.id ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40' : 'bg-white/5 text-text-secondary border border-transparent'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-text-secondary text-sm mb-2">¿Momento preferido?</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'morning' as const, label: 'Mañana', icon: Zap },
            { id: 'midday' as const, label: 'Mediodía', icon: Clock },
            { id: 'evening' as const, label: 'Noche', icon: Moon },
          ].map((o) => (
            <button
              key={o.id}
              type="button"
              onClick={() => update('preferredTime', o.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                prefs.preferredTime === o.id ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40' : 'bg-white/5 text-text-secondary border border-transparent'
              }`}
            >
              <o.icon className="w-3.5 h-3.5" />
              {o.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <p className="text-text-secondary text-sm mb-2">¿Recordatorio extra?</p>
        <div className="flex flex-wrap gap-2">
          {[
            { id: true as const, label: 'Sí', icon: Bell },
            { id: false as const, label: 'No', icon: null },
          ].map((o) => (
            <button
              key={String(o.id)}
              type="button"
              onClick={() => update('extraReminder', o.id)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                prefs.extraReminder === o.id ? 'bg-accent-blue/20 text-accent-blue border border-accent-blue/40' : 'bg-white/5 text-text-secondary border border-transparent'
              }`}
            >
              {o.icon && <o.icon className="w-3.5 h-3.5" />}
              {o.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
