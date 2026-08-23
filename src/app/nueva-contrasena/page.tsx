'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Container from '@/components/Container'
import { useUser } from '@/context/UserContext'
import FadeInSection from '@/components/FadeInSection'
import { Lock, Eye, EyeOff, Check, ShieldCheck, AlertTriangle } from 'lucide-react'
import { createBrowserSupabase } from '@/lib/supabase-browser'

export default function NuevaContrasenaPage() {
  const router = useRouter()
  const { refreshUser } = useUser()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [sessionChecked, setSessionChecked] = useState(false)
  const [hasSession, setHasSession] = useState(false)

  useEffect(() => {
    let cancelled = false
    const checkSession = async () => {
      try {
        const supabase = createBrowserSupabase()
        const { data } = await supabase.auth.getSession()
        if (!cancelled) {
          setHasSession(Boolean(data.session))
          setSessionChecked(true)
        }
      } catch (err) {
        console.error('[nueva-contrasena] session check failed:', err)
        if (!cancelled) {
          setHasSession(false)
          setSessionChecked(true)
        }
      }
    }
    void checkSession()
    return () => { cancelled = true }
  }, [])

  useEffect(() => {
    if (sessionChecked && !hasSession) {
      router.replace('/acceder?error=invalid_or_expired_link')
    }
  }, [sessionChecked, hasSession, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    if (password !== confirm) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setLoading(true)
    try {
      const supabase = createBrowserSupabase()
      const { error: updateError } = await supabase.auth.updateUser({
        password,
      })

      if (updateError) {
        console.error('[nueva-contrasena] updateUser error:', updateError.message)
        if (
          updateError.message.includes('same_password') ||
          updateError.message.includes('same as the old')
        ) {
          setError('La nueva contraseña debe ser diferente a la anterior.')
        } else if (updateError.message.includes('session')) {
          setError('Tu sesión ha expirado. Solicita un nuevo enlace de recuperación.')
        } else {
          setError(updateError.message)
        }
        return
      }

      setSuccess(true)
      await refreshUser()
      setTimeout(() => router.push('/'), 2500)
    } catch (err) {
      console.error('[nueva-contrasena] unhandled error:', err)
      setError('Error al actualizar la contraseña. Inténtalo de nuevo.')
    } finally {
      setLoading(false)
    }
  }

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="w-8 h-8 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      </div>
    )
  }

  if (!hasSession) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <FadeInSection>
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-yellow-500/15 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-10 h-10 text-yellow-400" />
            </div>
            <h1 className="font-heading font-black text-white text-2xl mb-3">
              Enlace expirado
            </h1>
            <p className="text-text-secondary text-sm mb-4">
              El enlace de recuperación ha expirado o ya fue usado. Solicita uno nuevo.
            </p>
            <button
              type="button"
              onClick={() => router.push('/acceder')}
              className="text-accent-blue text-sm hover:underline"
            >
              Volver al login
            </button>
          </div>
        </FadeInSection>
      </div>
    )
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <FadeInSection>
          <div className="text-center max-w-sm">
            <div className="w-20 h-20 rounded-full bg-green-500/15 flex items-center justify-center mx-auto mb-6">
              <ShieldCheck className="w-10 h-10 text-green-400" />
            </div>
            <h1 className="font-heading font-black text-white text-2xl mb-3">
              Contraseña actualizada
            </h1>
            <p className="text-text-secondary text-sm">
              Tu nueva contraseña ha sido guardada. Redirigiendo...
            </p>
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
                  <Lock className="w-8 h-8 text-accent-blue" />
                </div>
                <h1 className="font-heading font-black text-white text-3xl mb-2">
                  Nueva contraseña
                </h1>
                <p className="text-text-secondary text-sm">
                  Establece tu nueva contraseña para acceder a tu cuenta.
                </p>
              </div>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Lock className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Nueva contraseña"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-11 pr-12 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors"
                    autoComplete="new-password"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>

                <div className="relative">
                  <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                    <Check className="w-4 h-4 text-text-muted" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Repetir contraseña"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className="w-full pl-11 pr-4 py-3.5 rounded-2xl bg-dark-surface border border-dark-border text-white placeholder:text-text-muted text-sm focus:outline-none focus:border-accent-blue transition-colors"
                    autoComplete="new-password"
                  />
                </div>

                <ul className="text-xs text-text-muted space-y-1 px-1">
                  <li className={password.length >= 6 ? 'text-green-400' : ''}>
                    • Mínimo 6 caracteres
                  </li>
                  <li
                    className={
                      confirm.length > 0 && password === confirm
                        ? 'text-green-400'
                        : ''
                    }
                  >
                    • Las contraseñas coinciden
                  </li>
                </ul>

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
                    'Guardar contraseña'
                  )}
                </button>
              </form>
            </FadeInSection>
          </div>
        </Container>
      </section>
    </div>
  )
}
