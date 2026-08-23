'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase/client'

type SessionUser = { email: string; nombre: string; role: string } | null

type ServerSummary = {
  server: {
    supabaseProjectUrl?: string
    hasNextPublicAnon: boolean
    hasServiceRole: boolean
    hasAppUrl: boolean
  }
  session: SessionUser
  sessionError?: string
} | null

export default function DebugPage() {
  const [clientUrl, setClientUrl] = useState(false)
  const [clientAnon, setClientAnon] = useState(false)
  const [sessionUser, setSessionUser] = useState<SessionUser | undefined>(undefined)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [serverBlock, setServerBlock] = useState<ServerSummary>(null)
  const [serverError, setServerError] = useState<string | null>(null)

  useEffect(() => {
    setClientUrl(Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL))
    setClientAnon(Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY))
  }, [])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      setSessionLoading(true)
      try {
        const {
          data: { user: u },
        } = await supabase.auth.getUser()
        if (cancel) return
        if (!u?.email) {
          setSessionUser(null)
        } else {
          const m = (u.user_metadata || {}) as { nombre?: string; name?: string; role?: string }
          setSessionUser({
            email: u.email,
            nombre: (m.nombre || m.name || u.email.split('@')[0] || '') as string,
            role: (m.role as string) || 'user',
          })
        }
      } catch {
        if (!cancel) setSessionUser(null)
      } finally {
        if (!cancel) setSessionLoading(false)
      }
    })()
    return () => {
      cancel = true
    }
  }, [])

  useEffect(() => {
    let cancel = false
    ;(async () => {
      try {
        const res = await fetch('/api/debug/summary', { cache: 'no-store' })
        if (cancel) return
        if (res.status === 404) {
          setServerBlock(null)
          setServerError('Panel servidor desactivado. Define ENABLE_DEBUG_PANEL=true en Vercel para ver flags del servidor.')
          return
        }
        if (!res.ok) {
          setServerError(`HTTP ${res.status}`)
          return
        }
        const data = (await res.json()) as ServerSummary
        setServerBlock(data)
        setServerError(null)
      } catch (e) {
        if (!cancel) setServerError(e instanceof Error ? e.message : 'Error')
      }
    })()
    return () => {
      cancel = true
    }
  }, [])

  return (
    <div className="min-h-screen bg-dark-primary text-white p-6 max-w-lg mx-auto font-sans text-sm">
      <h1 className="font-heading text-xl font-bold mb-4">Debug auth (temporal)</h1>
      <p className="text-text-secondary text-xs mb-6">
        Valores comprobados en el navegador (build) y sesión vía API. No se muestran claves.
      </p>

      <section className="glass rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-accent-blue mb-2">Cliente (NEXT_PUBLIC en build)</h2>
        <ul className="space-y-1 text-text-secondary">
          <li>NEXT_PUBLIC_SUPABASE_URL: {clientUrl ? 'presente' : 'ausente'}</li>
          <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {clientAnon ? 'presente' : 'ausente'}</li>
        </ul>
        {!clientUrl || !clientAnon ? (
          <p className="text-amber-400 mt-2 text-xs">
            Si faltan URL o anon, el login fallará: añádelas en Vercel (Production) y haz redeploy.
          </p>
        ) : null}
      </section>

      <section className="glass rounded-2xl p-4 mb-4">
        <h2 className="font-semibold text-accent-blue mb-2">Sesión (cliente Supabase)</h2>
        {sessionLoading ? (
          <p className="text-text-muted">Cargando…</p>
        ) : sessionUser ? (
          <ul className="space-y-1 text-text-secondary">
            <li>email: {sessionUser.email}</li>
            <li>role: {sessionUser.role}</li>
            <li>nombre: {sessionUser.nombre}</li>
          </ul>
        ) : (
          <p className="text-text-muted">Sin sesión (no logueado o cookies no enviadas)</p>
        )}
      </section>

      <section className="glass rounded-2xl p-4 mb-6">
        <h2 className="font-semibold text-accent-blue mb-2">Servidor (requiere ENABLE_DEBUG_PANEL=true)</h2>
        {serverError && <p className="text-text-secondary text-xs mb-2">{serverError}</p>}
        {serverBlock && (
          <ul className="space-y-1 text-text-secondary text-xs">
            <li>URL Supabase (código): {serverBlock.server.supabaseProjectUrl ?? '—'}</li>
            <li>NEXT_PUBLIC_SUPABASE_ANON_KEY: {serverBlock.server.hasNextPublicAnon ? 'sí' : 'no'}</li>
            <li>SUPABASE_SERVICE_ROLE_KEY: {serverBlock.server.hasServiceRole ? 'sí' : 'no'}</li>
            <li>NEXT_PUBLIC_APP_URL: {serverBlock.server.hasAppUrl ? 'sí' : 'no'}</li>
            {serverBlock.sessionError && (
              <li className="text-amber-400 pt-2">{serverBlock.sessionError}</li>
            )}
            {serverBlock.session && (
              <li className="pt-2 border-t border-dark-border">
                auth (servidor): {serverBlock.session.email} — {serverBlock.session.role}
              </li>
            )}
          </ul>
        )}
      </section>

      <Link href="/" className="text-accent-blue text-sm hover:underline">
        ← Volver
      </Link>
    </div>
  )
}
