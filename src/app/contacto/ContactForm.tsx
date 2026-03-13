'use client'

import { useState } from 'react'
import Card from '@/components/Card'
import { Send, Loader2 } from 'lucide-react'

export default function ContactForm() {
  const [form, setForm] = useState({ name: '', email: '', message: '' })
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.name || !form.email || !form.message) return

    setLoading(true)
    setError('')

    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })

      if (!res.ok) throw new Error()

      setSent(true)
      setForm({ name: '', email: '', message: '' })
    } catch {
      setError('Error al enviar. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <Card className="text-center">
        <div className="py-8">
          <Send className="w-8 h-8 text-accent-blue mx-auto mb-4" />
          <h3 className="font-heading text-xl font-bold text-white mb-2">Mensaje enviado</h3>
          <p className="text-text-secondary">Gracias por escribir. Te responderé lo antes posible.</p>
          <button
            onClick={() => setSent(false)}
            className="mt-6 text-accent-blue text-sm hover:text-accent-blue-hover transition-colors cursor-pointer"
          >
            Enviar otro mensaje
          </button>
        </div>
      </Card>
    )
  }

  return (
    <Card>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-text-secondary text-sm mb-2">Nombre</label>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
            className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-lg text-white text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
            placeholder="Tu nombre"
          />
        </div>
        <div>
          <label className="block text-text-secondary text-sm mb-2">Email</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
            className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-lg text-white text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors"
            placeholder="tu@email.com"
          />
        </div>
        <div>
          <label className="block text-text-secondary text-sm mb-2">Mensaje</label>
          <textarea
            value={form.message}
            onChange={(e) => setForm({ ...form, message: e.target.value })}
            required
            rows={5}
            className="w-full px-4 py-3 bg-dark-primary border border-dark-border rounded-lg text-white text-sm placeholder:text-text-secondary focus:outline-none focus:border-accent-blue transition-colors resize-none"
            placeholder="Escribe tu mensaje..."
          />
        </div>
        {error && <p className="text-red-400 text-sm">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 py-3 bg-accent-blue text-white font-medium rounded-lg hover:bg-accent-blue-hover transition-all glow-blue glow-blue-hover cursor-pointer disabled:opacity-60"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Send className="w-4 h-4" />
          )}
          {loading ? 'Enviando...' : 'Enviar mensaje'}
        </button>
      </form>
    </Card>
  )
}
