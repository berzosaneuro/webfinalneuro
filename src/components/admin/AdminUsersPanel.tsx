'use client'

import { useState, useMemo, useCallback, useEffect, useRef } from 'react'
import { useUser } from '@/context/UserContext'
import { useToast } from '@/components/admin/Toast'
import {
  Search, Crown, Shield, ShieldCheck, User as UserIcon,
  Loader2, Download, AlertTriangle, Zap,
} from 'lucide-react'

type UserRow = {
  id: string
  email: string
  nombre: string
  role?: string
  is_premium?: boolean
  subscription_status?: string | null
  last_login_at: string
  created_at: string
}

type Filter = 'all' | 'admin' | 'premium' | 'free'
type FlashState = { id: string; type: 'premium' | 'admin' }

const EASE_OUT_EXPO = 'cubic-bezier(0.16, 1, 0.3, 1)'
const EASE_IN_OUT = 'cubic-bezier(0.65, 0, 0.35, 1)'

function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const rows = [
    headers.join(','),
    ...data.map((row) =>
      headers.map((h) => {
        const v = row[h]
        const s = typeof v === 'object' ? JSON.stringify(v) : String(v ?? '')
        return `"${s.replace(/"/g, '""')}"`
      }).join(','),
    ),
  ]
  const blob = new Blob([rows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

/* ── Progress bar ────────────────────────────────────────── */

function ProgressBar({ active }: { active: boolean }) {
  return (
    <div className="h-[2px] w-full overflow-hidden rounded-full">
      <div
        className={`h-full rounded-full ${active ? 'animate-progress-slide' : ''}`}
        style={{
          background: active
            ? 'linear-gradient(90deg, transparent, rgba(139,92,246,0.6), rgba(16,185,129,0.6), transparent)'
            : 'transparent',
          transition: `opacity 300ms ${EASE_OUT_EXPO}`,
          opacity: active ? 1 : 0,
        }}
      />
      <style>{`
        @keyframes progress-slide {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        .animate-progress-slide {
          animation: progress-slide 1.2s ${EASE_IN_OUT} infinite;
        }
      `}</style>
    </div>
  )
}

/* ── Premium toggle (subtle, soft) ───────────────────────── */

function PremiumToggle({ on, loading, onToggle }: {
  on: boolean; loading?: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Premium"
      disabled={loading}
      onClick={onToggle}
      className="flex items-center gap-2.5 py-1 disabled:opacity-40 touch-manipulation group/toggle"
    >
      <span className="text-white/35 text-[12px] leading-none select-none">Premium</span>
      <span
        className="relative inline-flex h-[26px] w-[46px] shrink-0 rounded-full"
        style={{
          backgroundColor: on ? 'rgb(16 185 129)' : 'rgba(255,255,255,0.06)',
          transition: `background-color 350ms ${EASE_OUT_EXPO}`,
          boxShadow: on ? '0 0 12px rgba(16,185,129,0.15)' : 'none',
        }}
      >
        <span
          className="absolute top-[3px] left-[3px] h-[20px] w-[20px] rounded-full bg-white shadow-sm"
          style={{
            transform: on ? 'translateX(20px) scale(1)' : 'translateX(0) scale(1)',
            transition: `transform 350ms ${EASE_OUT_EXPO}`,
          }}
        >
          {loading && (
            <Loader2 className="w-3 h-3 text-black/25 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-spin" />
          )}
        </span>
      </span>
    </button>
  )
}

/* ── Admin toggle (strong, deliberate) ───────────────────── */

function AdminToggle({ on, onToggle }: {
  on: boolean; onToggle: () => void
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      aria-label="Admin"
      onClick={onToggle}
      className="flex items-center gap-2.5 py-1 touch-manipulation group/toggle"
    >
      <span className="flex items-center gap-1">
        <Shield
          className="w-3 h-3"
          style={{
            color: on ? 'rgb(167 139 250)' : 'rgba(255,255,255,0.2)',
            transition: `color 350ms ${EASE_OUT_EXPO}`,
          }}
        />
        <span
          className="text-[12px] leading-none select-none"
          style={{
            color: on ? 'rgb(167 139 250 / 0.8)' : 'rgba(255,255,255,0.35)',
            transition: `color 350ms ${EASE_OUT_EXPO}`,
          }}
        >
          Admin
        </span>
      </span>
      <span
        className="relative inline-flex h-[28px] w-[50px] shrink-0 rounded-full"
        style={{
          backgroundColor: on ? 'rgb(139 92 246)' : 'rgba(255,255,255,0.06)',
          transition: `background-color 350ms ${EASE_OUT_EXPO}, box-shadow 350ms ${EASE_OUT_EXPO}`,
          boxShadow: on ? '0 0 16px rgba(139,92,246,0.25), inset 0 1px 1px rgba(255,255,255,0.1)' : 'none',
        }}
      >
        <span
          className="absolute top-[4px] left-[4px] h-[20px] w-[20px] rounded-full bg-white shadow-sm"
          style={{
            transform: on ? 'translateX(22px)' : 'translateX(0)',
            transition: `transform 350ms ${EASE_OUT_EXPO}`,
          }}
        />
      </span>
    </button>
  )
}

/* ── Badges ──────────────────────────────────────────────── */

function RoleBadge({ role }: { role: string }) {
  if (role === 'master') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-amber-400/70">
      <ShieldCheck className="w-3 h-3" /> Master
    </span>
  )
  if (role === 'admin') return (
    <span className="inline-flex items-center gap-1 text-[10px] font-medium text-violet-400/70">
      <Shield className="w-3 h-3" /> Admin
    </span>
  )
  return null
}

/* ── Confirm modal ───────────────────────────────────────── */

function ConfirmModal({ title, message, onConfirm, onCancel, loading }: {
  title: string; message: string; onConfirm: () => void; onCancel: () => void; loading: boolean
}) {
  const [entered, setEntered] = useState(false)
  useEffect(() => { requestAnimationFrame(() => setEntered(true)) }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4" onClick={onCancel}>
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        style={{
          opacity: entered ? 1 : 0,
          transition: `opacity 250ms ${EASE_OUT_EXPO}`,
        }}
      />
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl bg-[#1c1c1e] border-t sm:border border-white/[0.08] p-6 pb-8 sm:pb-6 shadow-2xl"
        style={{
          transform: entered ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.97)',
          opacity: entered ? 1 : 0,
          transition: `transform 350ms ${EASE_OUT_EXPO}, opacity 250ms ${EASE_OUT_EXPO}`,
        }}
      >
        <div className="w-10 h-1 rounded-full bg-white/[0.12] mx-auto mb-5 sm:hidden" />
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center">
            <Shield className="w-5 h-5 text-violet-400" />
          </div>
          <h3 className="text-white font-semibold text-[16px]">{title}</h3>
        </div>
        <p className="text-white/40 text-[14px] leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-white/[0.06] text-white/50 text-[14px] font-medium active:scale-[0.97] disabled:opacity-50"
            style={{ transition: `all 200ms ${EASE_OUT_EXPO}` }}
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-3.5 rounded-2xl bg-violet-500/20 text-violet-300 text-[14px] font-semibold active:scale-[0.97] disabled:opacity-50 flex items-center justify-center gap-2"
            style={{ transition: `all 200ms ${EASE_OUT_EXPO}` }}
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirmar'}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── User card ───────────────────────────────────────────── */

function UserCard({ user, isMaster, isLoading, flash, onTogglePremium, onToggleAdmin }: {
  user: UserRow
  isMaster: boolean
  isLoading: boolean
  flash: FlashState | null
  onTogglePremium: () => void
  onToggleAdmin: () => void
}) {
  const role = (user.role || 'user') as string
  const isTargetMaster = role === 'master'
  const isFlashing = flash?.id === user.id

  const flashBg = isFlashing
    ? flash.type === 'admin'
      ? 'rgba(139,92,246,0.06)'
      : 'rgba(16,185,129,0.06)'
    : undefined

  return (
    <div
      className="rounded-2xl p-4 sm:p-5"
      style={{
        backgroundColor: flashBg || 'rgba(255,255,255,0.015)',
        transition: `background-color 600ms ${EASE_OUT_EXPO}`,
      }}
    >
      <div className="flex items-center gap-3.5 mb-3.5">
        <div className="w-11 h-11 rounded-[14px] bg-gradient-to-br from-white/[0.07] to-white/[0.02] flex items-center justify-center shrink-0">
          <span className="text-[16px] font-semibold text-white/35">
            {(user.nombre || user.email)[0]?.toUpperCase() || '?'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-white text-[15px] font-medium truncate leading-tight">
            {user.nombre || user.email.split('@')[0]}
          </p>
          <p className="text-white/20 text-[13px] truncate mt-0.5">{user.email}</p>
        </div>
        <RoleBadge role={role} />
      </div>

      <div className="flex items-center justify-between pl-[58px]">
        <div className="flex items-center gap-6">
          <PremiumToggle
            on={!!user.is_premium}
            loading={isLoading}
            onToggle={onTogglePremium}
          />
          {isMaster && !isTargetMaster && (
            <AdminToggle
              on={role === 'admin'}
              onToggle={onToggleAdmin}
            />
          )}
        </div>
        {user.is_premium && (
          <Crown
            className="w-4 h-4"
            style={{
              color: 'rgba(251,191,36,0.25)',
              transition: `color 350ms ${EASE_OUT_EXPO}`,
            }}
          />
        )}
      </div>
    </div>
  )
}

/* ── Main component ──────────────────────────────────────── */

export default function AdminUsersPanel({
  usuarios: initialUsuarios,
  onRefetch,
}: {
  usuarios: UserRow[]
  onRefetch: () => void
}) {
  const { user: currentUser } = useUser()
  const { toast } = useToast()
  const isMaster = currentUser?.role === 'master'

  const [usuarios, setUsuarios] = useState<UserRow[]>(initialUsuarios)
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [filter, setFilter] = useState<Filter>('all')
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [globalLoading, setGlobalLoading] = useState(false)
  const [flashState, setFlashState] = useState<FlashState | null>(null)
  const [confirmModal, setConfirmModal] = useState<{
    userId: string; email: string; action: 'grant-admin' | 'revoke-admin'
  } | null>(null)
  const [confirmLoading, setConfirmLoading] = useState(false)
  const [mounted, setMounted] = useState(false)
  const listRef = useRef<HTMLDivElement>(null)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => { setUsuarios(initialUsuarios) }, [initialUsuarios])

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 200)
    return () => clearTimeout(timer)
  }, [search])

  const filtered = useMemo(() => {
    let list = usuarios
    if (debouncedSearch) {
      const q = debouncedSearch.toLowerCase()
      list = list.filter(
        (u) => u.email.toLowerCase().includes(q) || (u.nombre || '').toLowerCase().includes(q),
      )
    }
    if (filter === 'admin') list = list.filter((u) => u.role === 'admin' || u.role === 'master')
    if (filter === 'premium') list = list.filter((u) => u.is_premium)
    if (filter === 'free') list = list.filter((u) => !u.is_premium)
    return list
  }, [usuarios, debouncedSearch, filter])

  const counts = useMemo(() => ({
    all: usuarios.length,
    admin: usuarios.filter((u) => u.role === 'admin' || u.role === 'master').length,
    premium: usuarios.filter((u) => u.is_premium).length,
    free: usuarios.filter((u) => !u.is_premium).length,
  }), [usuarios])

  const flash = useCallback((id: string, type: 'premium' | 'admin') => {
    setFlashState({ id, type })
    setTimeout(() => setFlashState(null), 800)
  }, [])

  const togglePremium = useCallback(async (user: UserRow) => {
    const newPremium = !user.is_premium
    setGlobalLoading(true)
    setActionLoading(user.id)
    setUsuarios((prev) => prev.map((u) =>
      u.id === user.id ? { ...u, is_premium: newPremium, subscription_status: 'manual' } : u,
    ))

    try {
      const endpoint = newPremium ? '/api/admin/grant-premium' : '/api/admin/revoke-premium'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email }),
      })
      const data = await res.json()
      if (!res.ok) {
        setUsuarios((prev) => prev.map((u) =>
          u.id === user.id ? { ...u, is_premium: !newPremium } : u,
        ))
        toast(data?.error || 'Error al actualizar premium', 'error')
        return
      }
      flash(user.id, 'premium')
      toast(newPremium ? `Premium activado — ${user.nombre || user.email}` : `Premium desactivado — ${user.nombre || user.email}`)
    } catch {
      setUsuarios((prev) => prev.map((u) =>
        u.id === user.id ? { ...u, is_premium: !newPremium } : u,
      ))
      toast('Error de conexión', 'error')
    } finally {
      setActionLoading(null)
      setGlobalLoading(false)
    }
  }, [toast, flash])

  const handleRoleChange = useCallback(async () => {
    if (!confirmModal) return
    setConfirmLoading(true)
    setGlobalLoading(true)
    const { userId, email, action } = confirmModal
    const newRole = action === 'grant-admin' ? 'admin' : 'user'

    try {
      const res = await fetch('/api/admin/manage-role', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, role: newRole }),
      })
      const data = await res.json()
      if (!res.ok) {
        toast(data?.error || data?.message || 'Error al cambiar rol', 'error')
        return
      }
      setUsuarios((prev) => prev.map((u) =>
        u.id === userId ? { ...u, role: newRole } : u,
      ))
      flash(userId, 'admin')
      toast(
        newRole === 'admin'
          ? `Acceso admin concedido — ${email}`
          : `Acceso admin revocado — ${email}`,
      )
    } catch {
      toast('Error de conexión', 'error')
    } finally {
      setConfirmLoading(false)
      setConfirmModal(null)
      setGlobalLoading(false)
    }
  }, [confirmModal, toast, flash])

  const filters: { id: Filter; label: string }[] = [
    { id: 'all', label: 'Todos' },
    { id: 'admin', label: 'Admin' },
    { id: 'premium', label: 'Premium' },
    { id: 'free', label: 'Free' },
  ]

  return (
    <div
      style={{
        opacity: mounted ? 1 : 0,
        transform: mounted ? 'translateY(0)' : 'translateY(8px)',
        transition: `opacity 500ms ${EASE_OUT_EXPO}, transform 500ms ${EASE_OUT_EXPO}`,
      }}
    >
      {/* Global progress bar */}
      <ProgressBar active={globalLoading} />

      <div className="mt-1 space-y-5">
        {/* Master presence */}
        {isMaster && (
          <div className="flex items-center gap-2 px-1">
            <Zap className="w-3.5 h-3.5 text-amber-400/60" />
            <span className="text-[11px] font-medium text-amber-400/50 uppercase tracking-wider">
              Control total
            </span>
          </div>
        )}

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-white/15 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar usuarios..."
            className="w-full pl-12 pr-4 py-3.5 rounded-2xl bg-white/[0.03] text-white placeholder:text-white/15 text-[15px] focus:outline-none focus:bg-white/[0.05]"
            style={{ transition: `background-color 250ms ${EASE_OUT_EXPO}` }}
          />
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex gap-1">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className="px-3.5 py-2 rounded-xl text-[13px] font-medium active:scale-[0.96]"
                style={{
                  backgroundColor: filter === f.id ? 'rgba(255,255,255,0.08)' : 'transparent',
                  color: filter === f.id ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.2)',
                  transition: `all 250ms ${EASE_OUT_EXPO}`,
                }}
              >
                {f.label}
                <span
                  className="ml-1.5 text-[11px]"
                  style={{
                    color: filter === f.id ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.1)',
                    transition: `color 250ms ${EASE_OUT_EXPO}`,
                  }}
                >
                  {counts[f.id]}
                </span>
              </button>
            ))}
          </div>
          {usuarios.length > 0 && (
            <button
              onClick={() => downloadCSV(
                usuarios.map((u) => ({
                  email: u.email,
                  nombre: u.nombre,
                  role: u.role || 'user',
                  premium: u.is_premium ? 'si' : 'no',
                  ultimo_acceso: u.last_login_at,
                })),
                'usuarios',
              )}
              className="p-2.5 rounded-xl text-white/15 active:bg-white/[0.05]"
              style={{ transition: `all 200ms ${EASE_OUT_EXPO}` }}
              aria-label="Exportar CSV"
            >
              <Download className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* List */}
        <div ref={listRef}>
          {filtered.length === 0 ? (
            <div className="py-24 text-center">
              <div
                className="w-16 h-16 rounded-3xl bg-white/[0.025] flex items-center justify-center mx-auto mb-5"
                style={{
                  opacity: mounted ? 1 : 0,
                  transform: mounted ? 'scale(1)' : 'scale(0.9)',
                  transition: `all 500ms ${EASE_OUT_EXPO} 100ms`,
                }}
              >
                <UserIcon className="w-7 h-7 text-white/10" />
              </div>
              <p className="text-white/25 text-[15px] font-medium">
                {debouncedSearch ? 'Sin resultados para esa búsqueda' : 'Aún no tienes usuarios en el sistema'}
              </p>
              {debouncedSearch && (
                <p className="text-white/10 text-[13px] mt-1.5">Prueba con otro nombre o email</p>
              )}
              {!debouncedSearch && (
                <p className="text-white/10 text-[13px] mt-1.5">Los usuarios aparecerán aquí al registrarse</p>
              )}
            </div>
          ) : (
            <div className="space-y-2.5">
              {filtered.map((u, i) => (
                <div
                  key={u.id}
                  style={{
                    opacity: mounted ? 1 : 0,
                    transform: mounted ? 'translateY(0)' : 'translateY(6px)',
                    transition: `opacity 400ms ${EASE_OUT_EXPO} ${Math.min(i * 30, 300)}ms, transform 400ms ${EASE_OUT_EXPO} ${Math.min(i * 30, 300)}ms`,
                  }}
                >
                  <UserCard
                    user={u}
                    isMaster={isMaster}
                    isLoading={actionLoading === u.id}
                    flash={flashState}
                    onTogglePremium={() => togglePremium(u)}
                    onToggleAdmin={() =>
                      setConfirmModal({
                        userId: u.id,
                        email: u.email,
                        action: (u.role || 'user') === 'admin' ? 'revoke-admin' : 'grant-admin',
                      })
                    }
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Confirmation modal */}
      {confirmModal && (
        <ConfirmModal
          title={confirmModal.action === 'grant-admin' ? 'Conceder acceso admin' : 'Revocar acceso admin'}
          message={
            confirmModal.action === 'grant-admin'
              ? `${confirmModal.email} obtendrá permisos de administrador. Podrá gestionar usuarios, contenido y configuración.`
              : `${confirmModal.email} perderá todos los permisos de administrador de forma inmediata.`
          }
          onConfirm={handleRoleChange}
          onCancel={() => setConfirmModal(null)}
          loading={confirmLoading}
        />
      )}
    </div>
  )
}
