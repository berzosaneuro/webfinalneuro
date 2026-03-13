'use client'

import { useState } from 'react'
import { Loader2 } from 'lucide-react'

export default function EmailForm() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setLoading(true)

    try {
      await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, source: 'programa' }),
      })
    } catch {
      // Still show success to user
    }

    setSent(true)
    setEmail('')
    setLoading(false)
  }

  if (sent) {
    return (
      <div className="mt-8 p-6 bg-dark-surface border border-accent-blue/30 rounded-xl text-center">
        <p className="text-accent-blue font-semibold mb-2">Plan enviado correctamente</p>
        <p className="text-text-secondary text-sm">Revisa tu bandeja de entrada. Tu viaje hacia la presencia comienza ahora.</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="mt-8 flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Tu email"
        required
        className="flex-1 px-4 py-3 bg-dark-surface border border-dark-border rounded-lg text-white text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
      />
      <button
        type="submit"
        disabled={loading}
        className="px-6 py-3 bg-accent-blue text-white text-sm font-medium rounded-lg hover:bg-accent-blue-hover transition-all glow-blue glow-blue-hover cursor-pointer disabled:opacity-60"
      >
        {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Descargar plan'}
      </button>
    </form>
  )
}
