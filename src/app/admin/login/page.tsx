'use client'

import Link from 'next/link'
import { Brain, ArrowRight } from 'lucide-react'

export default function AdminLoginPage() {
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
            Acceso admin integrado en login principal
          </p>
        </div>
        <p className="text-text-secondary text-sm text-center mb-5">
          Inicia sesión desde Acceder con las credenciales master para abrir el panel.
        </p>
        <Link
          href="/acceder"
          className="w-full py-3.5 bg-accent-blue rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 active:scale-95 transition-all glow-blue"
        >
          Ir a Acceder <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  )
}
