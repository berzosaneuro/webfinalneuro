'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import { useUser } from '@/context/UserContext'
import FadeInSection from '@/components/FadeInSection'
import { Brain, Mail, User, Lock, Eye, EyeOff, ArrowRight, Gift, Check } from 'lucide-react'
import { getPublicSupportEmail } from '@/lib/support-contact'

export default function RegistroPage() {
  const supportEmail = getPublicSupportEmail()
  const router = useRouter()
  const { refreshUser } = useUser()
  const [form, setForm] = useState({ nombre: '', email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [needsConfirmation, setNeedsConfirmation] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.nombre.trim() || !form.email.trim() || !form.password.trim()) {
      setError('Por favor, rellena todos los campos.')
      return
    }
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }

    setLoading(true)
    try {
      const nombre = form.nombre.trim()
      const email = form.email.trim().toLowerCase()
      const password = form.password

      // Mismo origen que la web: el servidor habla con Supabase (evita "Failed to fetch" por
      // bloqueo a *.supabase.co en el navegador, extensiones, etc.) y fija la sesión en cookies.
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({ email, password, nombre }),
      })
      let payload: { error?: string; needsConfirmation?: boolean; ok?: boolean } = {}
      try {
        payload = (await res.json()) as typeof payload & {
          ok?: boolean
          code?: string
          supabaseError?: string | null
        }
      } catch {
        setError('Respuesta del servidor no válida. Inténtalo de nuevo.')
        return
      }
      console.log('CLIENT SIGNUP RESPONSE:', { status: res.status, payload })
      if (!res.ok) {
        const code = (payload as { code?: string }).code
        const errStr =
          payload.error ??
          ((payload as { supabaseError?: string | null }).supabaseError || undefined)
        setError(
          errStr ||
            (code === 'EMAIL_ALREADY_REGISTERED'
              ? 'Ese email ya está registrado. Prueba «Acceder» o recuperar contraseña.'
              : res.status >= 500
                ? 'El servicio de cuentas no está disponible. Inténtalo en unos minutos.'
                : 'No se pudo crear la cuenta. Revisa los datos o prueba a acceder si ya estás registrado.'),
        )
        return
      }

      const needsConfirmation = Boolean(payload.needsConfirmation)

      void Promise.all([
        fetch('/api/leads', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ nombre, email, fuente: 'registro' }),
        }),
        fetch('/api/subscribers', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ nombre, email }),
        }),
      ])

      if (needsConfirmation) {
        setNeedsConfirmation(true)
        setSuccess(true)
        return
      }

      await refreshUser()
      setSuccess(true)
      setTimeout(() => router.push('/plan-7-dias'), 2000)
    } catch (err) {
      console.error('Error de registro:', err)
      const msg = err instanceof Error ? err.message : ''
      if (/failed to fetch|network|load failed/i.test(msg)) {
        setError('No se pudo conectar. Revisa la red o vuelve a intentarlo en unos minutos.')
      } else {
        setError('Error al crear la cuenta. Inténtalo de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <FadeInSection>
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <Check className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="font-heading font-black text-white text-2xl mb-3">
              {needsConfirmation ? 'Revisa tu email' : 'Listo'}
            </h1>
            <p className="text-text-secondary text-sm mb-4">
              {needsConfirmation
                ? 'Te hemos enviado un enlace de confirmación. Haz click en él para activar tu cuenta.'
                : 'Cuenta creada. Siguiente paso: Reto 7 Días, desbloqueado.'}
            </p>
            {!needsConfirmation && (
              <div className="flex items-center justify-center gap-2 text-green-400 text-sm font-medium">
                <Gift className="w-4 h-4" />
                Reto 7 Días desbloqueado
              </div>
            )}
          </div>
        </FadeInSection>
      </div>
    )
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
                <h1 className="font-heading font-black text-white text-3xl mb-2">Crear cuenta</h1>
                <p className="text-text-secondary text-sm">
                  Un minuto. Sin tarjeta. Acceso inmediato.
                </p>
              </div>

              <div className="flex items-center gap-3 p-3.5 rounded-2xl mb-6" style={{ background: 'linear-gradient(135deg, rgba(0,102,255,0.12), rgba(0,82,204,0.06))', border: '1px solid rgba(0,102,255,0.2)' }}>
                <Gift className="w-5 h-5 text-[#0066FF] shrink-0" />
                <div>
                  <p className="text-white text-xs font-semibold">Bienvenida</p>
                  <p className="text-text-secondary text-xs">Reto 7 Días incluido al crear cuenta</p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <User className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={form.nombre}
                    onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors"
                    autoComplete="name"
                  />
                </div>

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
                    placeholder="Contraseña (mín. 6 caracteres)"
                    value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {error && (
                  <p className="text-red-400 text-xs text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 rounded-2xl bg-accent-blue text-white font-bold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed hover:bg-accent-blue-hover"
                >
                  {loading ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>
                      Crear cuenta y entrar
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <p className="text-center text-text-muted text-[11px] mt-4 leading-relaxed">
                Al registrarte aceptas recibir contenido de Berzosa Neuro.<br />
                Puedes darte de baja en cualquier momento.
              </p>
              <p className="text-center text-text-muted/90 text-[11px] mt-3 leading-relaxed max-w-sm mx-auto">
                ¿Error al registrarte? Escríbenos:{' '}
                <a href={`mailto:${supportEmail}?subject=Registro%20web%20Berzosa%20Neuro`} className="text-accent-blue hover:underline">
                  {supportEmail}
                </a>
              </p>
            </FadeInSection>
          </div>
        </Container>
      </section>
    </div>
  )
}
