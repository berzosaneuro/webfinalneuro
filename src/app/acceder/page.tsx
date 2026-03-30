'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import { useUser } from '@/context/UserContext'
import FadeInSection from '@/components/FadeInSection'
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react'

async function getApiError(response: Response): Promise<string> {
  try {
    const json = await response.json() as { error?: string }
    if (json?.error) return json.error
  } catch {
    // ignore parse error
  }
  return `HTTP ${response.status}`
}

export default function AccederPage() {
  const router = useRouter()
  const { setUser } = useUser()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password.trim()) {
      setError('Introduce tu email y contraseña.')
      return
    }

    setLoading(true)
    try {
      const email = form.email.trim().toLowerCase()
      const nombre = email.split('@')[0] || 'Usuario'
      const userRes = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Usuarios se guardan en la tabla `users` vía /api/users
        body: JSON.stringify({ email, nombre }),
      })
      if (!userRes.ok) {
        throw new Error(await getApiError(userRes))
      }
      const ok = await setUser({ email, nombre })
      if (!ok) throw new Error('No se pudo iniciar sesión segura')
      router.push('/')
    } catch (err) {
      console.error('Error de acceso:', err)
      setError('Error al acceder. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative overflow-hidden min-h-screen">
      <div className="orb w-72 h-72 bg-accent-blue top-10 -left-20" />
      <div className="orb w-56 h-56 bg-accent-blue bottom-20 -right-16" />

      <section className="relative pt-16 pb-12">
        <Container>
          <div className="max-w-sm mx-auto">
            <FadeInSection>
              <div className="text-center mb-8">
                <div className="w-16 h-16 rounded-2xl bg-accent-blue/15 flex items-center justify-center mx-auto mb-5">
                  <Brain className="w-8 h-8 text-accent-blue" />
                </div>
                <h1 className="font-heading font-black text-white text-3xl mb-2">Acceder</h1>
                <p className="text-text-secondary text-sm">
                  Entra con tu cuenta
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Mail className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors"
                    autoComplete="email"
                  />
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-accent-blue text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-blue-hover"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Acceder
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-text-muted text-xs mt-6">
                ¿No tienes cuenta?{' '}
                <Link href="/registro" className="text-accent-blue hover:underline font-medium">
                  Empezar gratis
                </Link>
                {' '}— Regalo: Reto de 7 días
              </p>

              <p className="text-center text-text-muted text-xs mt-4">
                <Link href="/admin/login" className="text-accent-blue/80 hover:underline">
                  Acceder al panel Admin
                </Link>
              </p>
            </FadeInSection>
          </div>
        </Container>
      </section>
    </div>
  )
}
