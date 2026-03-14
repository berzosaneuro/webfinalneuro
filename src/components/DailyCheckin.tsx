'use client'

import { useState, useEffect } from 'react'
import { loadTodayCheckin, saveCheckin, type Mood } from '@/lib/daily-checkin'

const OPTIONS: { mood: Mood; label: string; emoji: string }[] = [
  { mood: 'tranquilo', label: 'tranquilo', emoji: '🙂' },
  { mood: 'neutro', label: 'neutro', emoji: '😐' },
  { mood: 'tenso', label: 'tenso', emoji: '😟' },
]

export default function DailyCheckin() {
  const [selected, setSelected] = useState<Mood | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const checkin = loadTodayCheckin()
    if (checkin) setSelected(checkin.mood)
  }, [])

  const handleSelect = (mood: Mood) => {
    saveCheckin(mood)
    setSelected(mood)
  }

  if (!mounted) return null

  return (
    <div className="glass rounded-2xl p-4">
      <p className="text-text-secondary text-sm mb-3">¿Cómo está tu mente hoy?</p>
      <div className="flex gap-2">
        {OPTIONS.map(({ mood, label, emoji }) => (
          <button
            key={mood}
            type="button"
            onClick={() => handleSelect(mood)}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-medium transition-all active:scale-95 ${
              selected === mood
                ? 'bg-white/10 text-white border border-white/20'
                : 'bg-white/5 text-text-muted border border-transparent hover:bg-white/8'
            }`}
          >
            <span className="text-base">{emoji}</span>
            {label}
          </button>
        ))}
      </div>
    </div>
  )
}
