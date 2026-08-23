'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Container from '@/components/Container'
import { useUser } from '@/context/UserContext'
import FadeInSection from '@/components/FadeInSection'
import { Brain, Mail, Lock, Eye, EyeOff, ArrowRight, KeyRound } from 'lucide-react'
import { getPublicSupportEmail } from '@/lib/support-contact'

const CALLBACK_ERRORS: Record<string, string> = {
  missing_code: 'Enlace de recuperación inválido. Solicita uno nuevo.',
  invalid_or_expired_link: 'El enlace ha expirado o ya fue usado. Solicita uno nuevo.',
  config: 'Error de configuración del servidor (Supabase). Comprueba variables en Vercel y vuelve a intentarlo.',
}

export default function AccederPage() {
  const supportEmail = getPublicSupportEmail()
  const { refreshUser } = useUser()
  const [form, setForm] = useState({ email: '', password: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [resetSent, setResetSent] = useState(false)
  const [showResetForm, setShowResetForm] = useState(false)
  const [resetEmail, setResetEmail] = useState('')
  const [resetLoading, setResetLoading] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const callbackError = params.get('error')
    if (callbackError && CALLBACK_ERRORS[callbackError]) {
      setError(CALLBACK_ERRORS[callbackError])
      setShowResetForm(true)
    }
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!form.email.trim() || !form.password.trim()) {
      setError('Introduce tu email y contraseña.')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/auth/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'same-origin',
        body: JSON.stringify({
          email: form.email.trim().toLowerCase(),
          password: form.password,
        }),
      })
      const data = (await res.json().catch(() => ({}))) as {
        error?: string
        code?: string
        ok?: boolean
        supabaseError?: string | null
        supabaseCode?: string | null
      }
      console.log('CLIENT LOGIN RESPONSE:', { status: res.status, ok: data.ok, ...data })
      if (!res.ok) {
        const code = data.code
        const base =
          data.error ||
          data.supabaseError ||
          (res.status >= 503
            ? 'No se pudo conectar con el servicio de cuentas. Inténtalo en unos minutos.'
            : undefined)
        let message = base ?? 'No se pudo acceder. Revisa email y contraseña.'
        if (code === 'EMAIL_NOT_CONFIRMED') {
          message =
            'Confirma tu email antes de acceder: abre el enlace que te enviamos al registrarte.'
        } else if (code === 'PASSWORD_RESET_REQUIRED') {
          message =
            'La cuenta existe pero la contraseña no coincide. Prueba «¿Olvidaste tu contraseña?» o usa el enlace correcto.'
        } else if (code === 'INVALID_PASSWORD') {
          message = 'Contraseña incorrecta. Puedes usar «¿Olvidaste tu contraseña?» si no la recuerdas.'
        } else if (code === 'USER_NOT_FOUND') {
          message = 'No existe una cuenta con ese email. Comprueba que esté bien escrito o regístrate.'
        } else if (code === 'SUPABASE_UNREACHABLE') {
          message =
            base ?? 'Servicio de autenticación no disponible. Inténtalo en unos minutos.'
        }
        setError(message)
        return
      }

      await refreshUser()
      const params = new URLSearchParams(window.location.search)
      const next = params.get('next')
      window.location.href = next && next.startsWith('/') ? next : '/'
    } catch (err) {
      console.error('[acceder] login', err)
      if (err instanceof TypeError && /fetch|network|load failed|failed to fetch/i.test(String(err.message))) {
        setError('No se pudo conectar. Comprueba tu conexión o inténtalo en unos minutos.')
      } else {
        setError('Error al acceder. Inténtalo de nuevo.')
      }
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async () => {
    const email = (resetEmail || form.email).trim().toLowerCase()
    if (!email) {
      setError('Introduce tu email para recuperar la contraseña.')
      return
    }

    setResetLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (res.ok) {
        setResetSent(true)
        setShowResetForm(false)
      } else {
        try {
          const data = (await res.json()) as { error?: string }
          setError(data.error || 'Error al enviar el enlace.')
        } catch {
          setError('Error al enviar el enlace.')
        }
      }
    } catch {
      setError('Error de conexión.')
    } finally {
      setResetLoading(false)
    }
  }

  if (resetSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <FadeInSection>
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-accent-blue/15 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-accent-blue" />
            </div>
            <h1 className="font-heading font-black text-white text-2xl mb-3">Revisa tu email</h1>
            <p className="text-text-secondary text-sm mb-4">
              Te hemos enviado un enlace para establecer tu contraseña. Haz click en él y podrás acceder.
            </p>
            <button
              type="button"
              onClick={() => { setResetSent(false); setShowResetForm(false) }}
              className="text-accent-blue text-sm hover:underline"
            >
              Volver al login
            </button>
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
                <h1 className="font-heading font-black text-white text-3xl mb-2">Acceder</h1>
                <p className="text-text-secondary text-sm">
                  Email y contraseña. Siguiente pantalla: tu espacio.
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

              <div className="mt-4 text-center">
                <button
                  type="button"
                  onClick={() => {
                    setShowResetForm(true)
                    setResetEmail(form.email)
                  }}
                  className="text-accent-blue text-xs hover:underline inline-flex items-center gap-1"
                >
                  <KeyRound className="w-3 h-3" />
                  ¿Olvidaste tu contraseña?
                </button>
              </div>

              {showResetForm && (
                <div className="mt-4 p-4 rounded-2xl bg-dark-surface border border-dark-border">
                  <p className="text-text-secondary text-xs mb-3">
                    Introduce tu email y te enviaremos un enlace para establecer tu contraseña.
                  </p>
                  <input
                    type="email"
                    placeholder="Tu email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-dark-primary border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors mb-3"
                  />
                  <button
                    type="button"
                    onClick={() => void handleResetPassword()}
                    disabled={resetLoading}
                    className="w-full py-3 rounded-xl bg-accent-purple text-white font-semibold text-sm disabled:opacity-60"
                  >
                    {resetLoading ? 'Enviando...' : 'Enviar enlace de recuperación'}
                  </button>
                </div>
              )}

              <p className="text-center text-text-muted text-xs mt-6">
                ¿No tienes cuenta?{' '}
                <Link href="/registro" className="text-accent-blue hover:underline font-medium">
                  Crear cuenta
                </Link>
                {' '}· Reto 7 días incluido
              </p>

              <p className="text-center text-text-muted/90 text-[11px] mt-4 leading-relaxed max-w-sm mx-auto">
                ¿Problema para entrar o acabas de pagar y no accedes? Es un fallo técnico, no intencionado.{' '}
                <a href={`mailto:${supportEmail}?subject=Acceso%20web%20Berzosa%20Neuro`} className="text-accent-blue hover:underline">
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
