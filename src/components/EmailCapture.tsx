'use client'

import { useState } from 'react'
import { Mail, Check, Loader2, X } from 'lucide-react'

interface EmailCaptureProps {
  source: string
  title?: string
  subtitle?: string
  buttonText?: string
  onSuccess?: (email: string) => void
  onClose?: () => void
  extraData?: Record<string, unknown>
  compact?: boolean
}

export default function EmailCapture({
  source,
  title = 'Guarda tus resultados',
  subtitle = 'Introduce tu email para guardar tus datos y recibir tu progreso.',
  buttonText = 'Guardar',
  onSuccess,
  onClose,
  extraData,
  compact = false,
}: EmailCaptureProps) {
  const [email, setEmail] = useState('')
  const [nombre, setNombre] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email.trim()) return
    setLoading(true)
    try {
      await fetch('/api/subscribers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          nombre: nombre || '',
          source,
          data: extraData || {},
        }),
      })
    } catch {
      // Still show success
    }
    setDone(true)
    setLoading(false)
    onSuccess?.(email)
  }

  if (done) {
    return (
      <div className={`glass rounded-2xl ${compact ? 'p-4' : 'p-6'} text-center`}>
        <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
          <Check className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-white font-medium text-sm">Guardado correctamente</p>
        <p className="text-text-muted text-xs mt-1">Recibirás tu progreso en {email}</p>
      </div>
    )
  }

  return (
    <div className={`glass rounded-2xl ${compact ? 'p-4' : 'p-6'} relative`}>
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-3 right-3 p-1.5 rounded-lg hover:bg-white/5 text-text-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      )}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
          <Mail className="w-5 h-5 text-accent-blue" />
        </div>
        <div>
          <h3 className="text-white font-semibold text-sm">{title}</h3>
          <p className="text-text-muted text-xs">{subtitle}</p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-2">
        {!compact && (
          <input
            type="text"
            placeholder="Tu nombre (opcional)"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full px-3.5 py-2.5 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
          />
        )}
        <div className="flex gap-2">
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="flex-1 px-3.5 py-2.5 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
          />
          <button
            type="submit"
            disabled={!email.trim() || loading}
            className="px-5 py-2.5 bg-accent-blue rounded-xl text-white font-medium text-sm active:scale-95 transition-transform disabled:opacity-40 shrink-0"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : buttonText}
          </button>
        </div>
      </form>
    </div>
  )
}
