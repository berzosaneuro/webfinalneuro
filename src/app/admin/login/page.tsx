'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Lock, Eye, EyeOff, Brain, AlertCircle, ArrowRight } from 'lucide-react'
import { useAdmin } from '@/context/AdminContext'

export default function AdminLoginPage() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(false)
  const [loading, setLoading] = useState(false)
  const { adminLogin } = useAdmin()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(false)

    const success = await adminLogin(password)
    if (success) {
      router.push('/admin')
    } else {
      setError(true)
      setPassword('')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden">
      <div className="orb w-80 h-80 bg-accent-blue top-10 -right-24" />
      <div className="orb w-64 h-64 bg-purple-600 bottom-20 -left-32" />

      <div className="glass rounded-3xl p-8 w-full max-w-md animate-fade-in relative z-10">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-accent-blue/10 flex items-center justify-center mx-auto mb-4">
            <Brain className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="font-heading text-2xl font-bold text-white mb-1">
            Panel Admin
          </h1>
          <p className="text-text-secondary text-sm">
            Berzosa Neuro — Admin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-text-secondary text-xs font-medium mb-1.5 block">
              Contraseña de administrador
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(false) }}
                placeholder="Introduce tu contraseña"
                autoFocus
                className={`w-full pl-10 pr-12 py-3.5 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-2 transition-all ${
                  error ? 'focus:ring-red-500/50 ring-1 ring-red-500/30' : 'focus:ring-accent-blue/50'
                }`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="flex items-center gap-2 px-3 py-2.5 bg-red-500/10 border border-red-500/20 rounded-xl">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <p className="text-red-400 text-xs">Contraseña incorrecta. Inténtalo de nuevo.</p>
            </div>
          )}

          <button
            type="submit"
            disabled={!password.trim() || loading}
            className="w-full py-3.5 bg-accent-blue rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all disabled:opacity-40 glow-blue"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                Acceder al panel <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  )
}
