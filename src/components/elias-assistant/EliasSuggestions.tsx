'use client'

import type { EliasProgressContext } from '@/lib/elias-progress'

type Suggestion = {
  label: string
  prompt: string
}

const BASE_SUGGESTIONS: Suggestion[] = [
  { label: 'Recomiéndame una práctica', prompt: '¿Qué práctica me recomiendas para hoy?' },
  { label: 'Necesito calmar mi mente', prompt: 'Necesito calmar mi mente ahora, ¿qué me sugieres?' },
  { label: 'Explícame un concepto', prompt: 'Explícame un concepto del Método N.E.U.R.O.' },
]

function getSuggestions(progress: EliasProgressContext | null): Suggestion[] {
  const contextual: Suggestion[] = []
  if (progress?.plan7CurrentDay) {
    contextual.push({
      label: `Día ${progress.plan7CurrentDay} del reto 7 días`,
      prompt: `Estoy en el reto de 7 días, día ${progress.plan7CurrentDay}. ¿Qué me sugieres para hoy?`,
    })
  } else if (progress?.programaCurrentDay) {
    contextual.push({
      label: `Día ${progress.programaCurrentDay} del programa 21 días`,
      prompt: `Estoy en el programa de 21 días, día ${progress.programaCurrentDay}. ¿Qué me recomiendas?`,
    })
  }
  if (!progress?.meditatedToday) {
    contextual.push({
      label: '¿Qué meditación para hoy?',
      prompt: 'No he meditado hoy. ¿Qué práctica breve me recomiendas?',
    })
  }
  if (!progress?.trainingCompletedToday) {
    contextual.push({
      label: 'Entrenamiento del día',
      prompt: '¿Qué entrenamiento N.E.U.R.O. me propones para hoy?',
    })
  }
  if (progress?.daysSinceLastActivity != null && progress.daysSinceLastActivity > 3) {
    contextual.push({
      label: 'Volver tras varios días sin practicar',
      prompt: 'Llevo varios días sin practicar. Necesito algo sencillo para volver.',
    })
  }
  const combined = [...contextual, ...BASE_SUGGESTIONS].slice(0, 4)
  return combined
}

type Props = {
  onSelect: (prompt: string) => void
  disabled?: boolean
  progress?: EliasProgressContext | null
}

export default function EliasSuggestions({ onSelect, disabled, progress }: Props) {
  const suggestions = getSuggestions(progress ?? null)
  return (
    <div className="flex flex-wrap gap-2">
      {suggestions.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => onSelect(s.prompt)}
          disabled={disabled}
          className="px-3 py-2 rounded-xl text-xs font-medium bg-white/5 text-text-secondary hover:bg-white/10 hover:text-white border border-white/5 transition-colors active:scale-95 disabled:opacity-50"
        >
          {s.label}
        </button>
      ))}
    </div>
  )
}
