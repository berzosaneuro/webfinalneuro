'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { useAdmin } from '@/context/AdminContext'
import Container from '@/components/Container'
import {
  Users, Mail, Phone, MessageSquare, BarChart3, LogOut,
  Loader2, Trash2, UserCheck, Crown, Download, RefreshCw,
  PhoneCall, PhoneMissed, Star, BookOpen, Map as MapIcon, Activity, Calendar, ClipboardList, ExternalLink, Pencil, X, Music
} from 'lucide-react'

type Tab = 'resumen' | 'usuarios' | 'payments' | 'audios' | 'biblioteca' | 'suscriptores' | 'clientes' | 'leads' | 'contactos' | 'llamadas' | 'comunidad'
  | 'diario' | 'mapa' | 'neuroscore' | 'programa' | 'test'

type Cliente = {
  id: string; nombre: string; email: string; telefono: string
  estado: string; plan: string; notas: string; fechaAlta: string
  sesionesTotales: number; tags: string[]
}
type Lead = { id: string; email: string; name: string; source: string; created_at: string }
type Contacto = { id: string; name: string; email: string; message: string; created_at: string }
type Llamada = {
  id: string; clienteNombre: string; telefono: string; tipo: string
  fecha: string; hora: string; duracion: number; notas: string; motivo: string
}
type Post = {
  id: string; autor: string; avatar: string; nivel: string
  texto: string; likes: number; replies: number; tag: string; created_at: string
}
type Subscriber = {
  id: string; email: string; nombre: string; sources: string[]
  extra_data: Record<string, unknown>; created_at: string; updated_at: string
}
type DiarioEntry = { id: string; user_email: string; date: string; presence_level: number; mood: string; insight: string }
type MapaEntry = { id: string; user_email: string; date: string; presencia: number; calma: number; claridad: number; energia: number; conexion: number; nivel: number; nota: string }
type NeuroEntry = { id: string; user_email: string; date: string; score: number; meditated: boolean; exercise_done: boolean; test_done: boolean; despertar_done: boolean; journal_done: boolean }
type ProgramaEntry = { id: string; user_email: string; start_date: string; completed_days: number[] }
type TestResult = { id: string; user_email: string; score: number; level: string; created_at: string }
type PaymentRow = {
  id: string
  user_email: string
  amount_paid: number
  currency: string
  status: string
  paid_at: string | null
  stripe_invoice_id: string
}
type UserRow = {
  id: string
  email: string
  nombre: string
  last_login_at: string
  created_at: string
  is_premium?: boolean
  subscription_status?: string | null
}
type BiblioPost = { id: string; slug: string; title: string; date: string; summary: string; content: string; exercise: string; free: boolean }

function EditBiblioForm({ post, onSave, onCancel }: { post: BiblioPost; onSave: (d: Partial<BiblioPost>) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ slug: post.slug, title: post.title, date: post.date, summary: post.summary, content: post.content, exercise: post.exercise, free: post.free })
  return (
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); onSave(form) }}>
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-heading font-semibold text-white">Editar artículo</h3>
        <button type="button" onClick={onCancel} className="p-2 rounded-lg hover:bg-white/10 text-text-muted"><X className="w-4 h-4" /></button>
      </div>
      <div><label className="text-text-muted text-xs block mb-1">Slug</label><input value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" /></div>
      <div><label className="text-text-muted text-xs block mb-1">Título</label><input value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" /></div>
      <div><label className="text-text-muted text-xs block mb-1">Fecha</label><input value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" placeholder="2026-02-10" /></div>
      <div><label className="text-text-muted text-xs block mb-1">Resumen</label><textarea value={form.summary} onChange={e => setForm(f => ({ ...f, summary: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm resize-none" /></div>
      <div><label className="text-text-muted text-xs block mb-1">Contenido</label><textarea value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} rows={8} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm resize-none font-mono text-xs" /></div>
      <div><label className="text-text-muted text-xs block mb-1">Ejercicio práctico</label><textarea value={form.exercise} onChange={e => setForm(f => ({ ...f, exercise: e.target.value }))} rows={2} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm resize-none" /></div>
      <label className="flex items-center gap-2 text-sm text-text-secondary"><input type="checkbox" checked={form.free} onChange={e => setForm(f => ({ ...f, free: e.target.checked }))} /> Artículo gratis</label>
      <div className="flex gap-2 pt-2"><button type="submit" className="flex-1 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium">Guardar</button><button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl glass text-text-secondary text-sm">Cancelar</button></div>
    </form>
  )
}

function EditPostForm({ post, onSave, onCancel }: { post: Post; onSave: (d: { autor: string; avatar: string; nivel: string; texto: string; tag: string }) => void; onCancel: () => void }) {
  const [form, setForm] = useState({ autor: post.autor, avatar: post.avatar, nivel: post.nivel, texto: post.texto, tag: post.tag })
  const [saving, setSaving] = useState(false)
  return (
    <form className="space-y-3" onSubmit={e => { e.preventDefault(); setSaving(true); onSave(form); setSaving(false) }}>
      <div>
        <label className="text-text-muted text-xs block mb-1">Autor</label>
        <input value={form.autor} onChange={e => setForm(f => ({ ...f, autor: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" />
      </div>
      <div>
        <label className="text-text-muted text-xs block mb-1">Avatar (emoji)</label>
        <input value={form.avatar} onChange={e => setForm(f => ({ ...f, avatar: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" placeholder="🧘" />
      </div>
      <div>
        <label className="text-text-muted text-xs block mb-1">Nivel</label>
        <input value={form.nivel} onChange={e => setForm(f => ({ ...f, nivel: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" placeholder="Observador" />
      </div>
      <div>
        <label className="text-text-muted text-xs block mb-1">Tag</label>
        <input value={form.tag} onChange={e => setForm(f => ({ ...f, tag: e.target.value }))} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm" placeholder="experiencia" />
      </div>
      <div>
        <label className="text-text-muted text-xs block mb-1">Texto</label>
        <textarea value={form.texto} onChange={e => setForm(f => ({ ...f, texto: e.target.value }))} rows={4} className="w-full px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm resize-none" />
      </div>
      <div className="flex gap-2 pt-2">
        <button type="submit" disabled={saving} className="flex-1 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium disabled:opacity-60">Guardar</button>
        <button type="button" onClick={onCancel} className="px-4 py-2.5 rounded-xl glass text-text-secondary text-sm">Cancelar</button>
      </div>
    </form>
  )
}

function downloadCSV(data: Record<string, unknown>[], filename: string) {
  if (data.length === 0) return
  const headers = Object.keys(data[0])
  const csvRows = [
    headers.join(','),
    ...data.map(row =>
      headers.map(h => {
        const val = row[h]
        const str = typeof val === 'object' ? JSON.stringify(val) : String(val ?? '')
        return `"${str.replace(/"/g, '""')}"`
      }).join(',')
    ),
  ]
  const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `${filename}-${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}

export default function AdminPage() {
  const { isAdmin, loading: adminLoading, adminLogout } = useAdmin()
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('resumen')
  const [loading, setLoading] = useState(true)

  const [clientes, setClientes] = useState<Cliente[]>([])
  const [leads, setLeads] = useState<Lead[]>([])
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [llamadas, setLlamadas] = useState<Llamada[]>([])
  const [posts, setPosts] = useState<Post[]>([])
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [diario, setDiario] = useState<DiarioEntry[]>([])
  const [mapa, setMapa] = useState<MapaEntry[]>([])
  const [neuroscore, setNeuroscore] = useState<NeuroEntry[]>([])
  const [programa, setPrograma] = useState<ProgramaEntry[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [payments, setPayments] = useState<PaymentRow[]>([])
  const [usuarios, setUsuarios] = useState<UserRow[]>([])
  const [editingPost, setEditingPost] = useState<Post | null>(null)
  const [audioConfig, setAudioConfig] = useState<{ slot: string; url: string }[]>([])
  const [audioSaving, setAudioSaving] = useState(false)
  const [biblioteca, setBiblioteca] = useState<BiblioPost[]>([])
  const [editingBiblio, setEditingBiblio] = useState<BiblioPost | null>(null)
  const [manualPremiumEmail, setManualPremiumEmail] = useState('')
  const [manualPremiumLoading, setManualPremiumLoading] = useState(false)
  const [manualPremiumMsg, setManualPremiumMsg] = useState<{ type: 'ok' | 'error'; text: string } | null>(null)

  const supabaseUrl = typeof window !== 'undefined' ? (process.env.NEXT_PUBLIC_SUPABASE_URL || '') : ''
  const supabaseDashboardUrl = supabaseUrl
    ? `https://supabase.com/dashboard/project/${supabaseUrl.replace(/^https?:\/\//, '').replace(/\.supabase\.co.*$/, '')}`
    : ''

  const fetchAll = useCallback(async () => {
    setLoading(true)
    try {
      const [cRes, lRes, coRes, llRes, pRes, sRes, uRes, payRes, aRes, bRes, dRes, mRes, nRes, progRes, tRes] = await Promise.allSettled([
        fetch('/api/clients'),
        fetch('/api/leads'),
        fetch('/api/contact'),
        fetch('/api/calls'),
        fetch('/api/community'),
        fetch('/api/subscribers'),
        fetch('/api/admin/users'),
        fetch('/api/admin/payments'),
        fetch('/api/admin/audio-config'),
        fetch('/api/admin/biblioteca'),
        fetch('/api/admin/diario'),
        fetch('/api/admin/mapa'),
        fetch('/api/admin/neuroscore'),
        fetch('/api/admin/programa'),
        fetch('/api/admin/test-results'),
      ])
      if (cRes.status === 'fulfilled' && cRes.value.ok) setClientes(await cRes.value.json())
      if (lRes.status === 'fulfilled' && lRes.value.ok) setLeads(await lRes.value.json())
      if (coRes.status === 'fulfilled' && coRes.value.ok) setContactos(await coRes.value.json())
      if (llRes.status === 'fulfilled' && llRes.value.ok) setLlamadas(await llRes.value.json())
      if (pRes.status === 'fulfilled' && pRes.value.ok) setPosts(await pRes.value.json())
      if (sRes.status === 'fulfilled' && sRes.value.ok) setSubscribers(await sRes.value.json())
      if (uRes.status === 'fulfilled' && uRes.value.ok) setUsuarios(await uRes.value.json())
      if (payRes.status === 'fulfilled' && payRes.value.ok) setPayments(await payRes.value.json())
      if (aRes.status === 'fulfilled' && aRes.value.ok) setAudioConfig(await aRes.value.json())
      if (dRes.status === 'fulfilled' && dRes.value.ok) setDiario(await dRes.value.json())
      if (mRes.status === 'fulfilled' && mRes.value.ok) setMapa(await mRes.value.json())
      if (nRes.status === 'fulfilled' && nRes.value.ok) setNeuroscore(await nRes.value.json())
      if (progRes.status === 'fulfilled' && progRes.value.ok) setPrograma(await progRes.value.json())
      if (tRes.status === 'fulfilled' && tRes.value.ok) setTestResults(await tRes.value.json())
    } catch (err) {
      console.error('Error al cargar datos del admin:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    if (adminLoading) return
    if (!isAdmin) {
      router.push('/acceder')
      return
    }
    fetchAll()
  }, [adminLoading, isAdmin, router, fetchAll])

  if (adminLoading) return null
  if (!isAdmin) return null

  const handleLogout = async () => {
    await adminLogout()
    router.push('/acceder')
  }

  const updatePost = async (id: string, data: { autor?: string; avatar?: string; nivel?: string; texto?: string; tag?: string }) => {
    try {
      const res = await fetch('/api/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, ...data }),
      })
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === id ? { ...p, ...data } : p))
        setEditingPost(null)
      }
    } catch (err) { console.error(err) }
  }

  const deleteItem = async (table: string, id: string) => {
    try {
      await fetch('/api/admin/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ table, id }),
      })
      if (table === 'clients') setClientes((prev) => prev.filter((c) => c.id !== id))
      if (table === 'leads') setLeads((prev) => prev.filter((l) => l.id !== id))
      if (table === 'contacts') setContactos((prev) => prev.filter((c) => c.id !== id))
      if (table === 'calls') setLlamadas((prev) => prev.filter((l) => l.id !== id))
      if (table === 'community_posts') setPosts((prev) => prev.filter((p) => p.id !== id))
      if (table === 'subscribers') setSubscribers((prev) => prev.filter((s) => s.id !== id))
      if (table === 'diary_entries') setDiario((prev) => prev.filter((d) => d.id !== id))
      if (table === 'mapa_entries') setMapa((prev) => prev.filter((m) => m.id !== id))
      if (table === 'neuroscore_entries') setNeuroscore((prev) => prev.filter((n) => n.id !== id))
      if (table === 'programa_progress') setPrograma((prev) => prev.filter((p) => p.id !== id))
      if (table === 'test_results') setTestResults((prev) => prev.filter((t) => t.id !== id))
      if (table === 'users') setUsuarios((prev) => prev.filter((u) => u.id !== id))
      if (table === 'biblioteca_posts') setBiblioteca((prev) => prev.filter((b) => b.id !== id))
    } catch (err) {
      console.error('Error al eliminar:', err)
    }
  }

  const updateUserPremium = async (u: UserRow, enablePremium: boolean) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: u.id,
          is_premium: enablePremium,
          subscription_status: enablePremium ? 'manual_admin' : 'free',
        }),
      })
      if (!res.ok) return
      const updated = await res.json() as UserRow
      setUsuarios((prev) => prev.map((row) => (row.id === u.id ? { ...row, ...updated } : row)))
    } catch (err) {
      console.error('Error al actualizar premium manual:', err)
    }
  }

  const setPremiumByEmail = async (mode: 'grant' | 'revoke') => {
    const email = manualPremiumEmail.trim().toLowerCase()
    if (!email || !email.includes('@')) {
      setManualPremiumMsg({ type: 'error', text: 'Introduce un email válido.' })
      return
    }
    setManualPremiumLoading(true)
    setManualPremiumMsg(null)
    try {
      const endpoint = mode === 'grant' ? '/api/admin/grant-premium' : '/api/admin/revoke-premium'
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json() as { error?: string; user?: { email?: string; is_premium?: boolean; subscription_status?: string } }
      if (!res.ok) {
        setManualPremiumMsg({ type: 'error', text: data?.error || 'No se pudo actualizar premium.' })
        return
      }
      setManualPremiumMsg({ type: 'ok', text: `Actualizado: ${data.user?.email || email}` })
      setUsuarios((prev) => prev.map((u) => {
        if (u.email.toLowerCase() !== email) return u
        return {
          ...u,
          is_premium: data.user?.is_premium ?? (mode === 'grant'),
          subscription_status: data.user?.subscription_status ?? 'manual',
        }
      }))
    } catch {
      setManualPremiumMsg({ type: 'error', text: 'Error de conexión.' })
    } finally {
      setManualPremiumLoading(false)
    }
  }

  // Lista maestra de emails (todos los emails únicos de todas las fuentes)
  const allEmails = new Map<string, { email: string; nombre: string; sources: string[]; date: string }>()
  subscribers.forEach((s) => {
    const key = s.email.toLowerCase()
    if (!allEmails.has(key)) {
      allEmails.set(key, { email: s.email, nombre: s.nombre, sources: s.sources || [], date: s.created_at })
    }
  })
  leads.forEach((l) => {
    const key = l.email.toLowerCase()
    if (!allEmails.has(key)) {
      allEmails.set(key, { email: l.email, nombre: l.name, sources: [l.source], date: l.created_at })
    } else {
      const existing = allEmails.get(key)!
      if (!existing.sources.includes(l.source)) existing.sources.push(l.source)
    }
  })
  contactos.forEach((c) => {
    const key = c.email.toLowerCase()
    if (!allEmails.has(key)) {
      allEmails.set(key, { email: c.email, nombre: c.name, sources: ['contacto'], date: c.created_at })
    } else {
      const existing = allEmails.get(key)!
      if (!existing.sources.includes('contacto')) existing.sources.push('contacto')
    }
  })

  const totalEmails = allEmails.size

  const exportAllEmails = () => {
    const data = Array.from(allEmails.values()).map((e) => ({
      email: e.email,
      nombre: e.nombre,
      fuentes: e.sources.join('; '),
      fecha: new Date(e.date).toLocaleDateString('es'),
    }))
    downloadCSV(data, 'neuroconciencia-emails')
  }

  const tabs: { id: Tab; label: string; icon: typeof Users; count: number }[] = [
    { id: 'resumen', label: 'Resumen', icon: BarChart3, count: 0 },
    { id: 'usuarios', label: 'Usuarios', icon: Users, count: usuarios.length },
    { id: 'payments', label: 'Pagos', icon: Crown, count: payments.length },
    { id: 'audios', label: 'Audios', icon: Music, count: 0 },
    { id: 'biblioteca', label: 'Biblioteca', icon: BookOpen, count: biblioteca.length },
    { id: 'suscriptores', label: 'Emails', icon: Star, count: totalEmails },
    { id: 'clientes', label: 'Clientes', icon: Users, count: clientes.length },
    { id: 'leads', label: 'Leads', icon: Mail, count: leads.length },
    { id: 'contactos', label: 'Mensajes', icon: MessageSquare, count: contactos.length },
    { id: 'llamadas', label: 'Llamadas', icon: Phone, count: llamadas.length },
    { id: 'comunidad', label: 'Comunidad', icon: Users, count: posts.length },
    { id: 'diario', label: 'Diario', icon: BookOpen, count: diario.length },
    { id: 'mapa', label: 'Mapa', icon: MapIcon, count: mapa.length },
    { id: 'neuroscore', label: 'NeuroScore', icon: Activity, count: neuroscore.length },
    { id: 'programa', label: 'Programa 21', icon: Calendar, count: programa.length },
    { id: 'test', label: 'Test', icon: ClipboardList, count: testResults.length },
  ]

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-accent-blue animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-accent-blue top-10 -right-24" />
      <div className="orb w-64 h-64 bg-purple-600 top-96 -left-32" />

      {/* Header */}
      <section className="pt-8 md:pt-12 pb-4">
        <Container>
          <div className="flex items-center justify-between mb-1">
            <div>
              <h1 className="font-heading text-3xl md:text-4xl font-bold tracking-tight text-white animate-fade-in">
                Panel Admin
              </h1>
              <p className="text-text-secondary text-sm">Gestiona toda tu plataforma</p>
            </div>
            <div className="flex items-center gap-2">
              {supabaseDashboardUrl && (
                <a
                  href={supabaseDashboardUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl glass text-accent-blue hover:text-accent-blue-hover transition-colors"
                  title="Abrir Supabase"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span className="hidden sm:inline text-sm">Supabase</span>
                </a>
              )}
              <button
                onClick={fetchAll}
                className="p-2.5 rounded-xl glass text-text-secondary hover:text-white transition-colors active:scale-90"
                title="Refrescar datos"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 rounded-xl text-sm font-medium active:scale-95 transition-transform"
              >
                <LogOut className="w-4 h-4" />
                Salir
              </button>
            </div>
          </div>
        </Container>
      </section>

      {/* Tabs */}
      <section className="pb-4">
        <Container>
          <div className="flex gap-1 overflow-x-auto pb-1 -mx-1 px-1">
            {tabs.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                  tab === t.id
                    ? 'bg-accent-blue/10 text-accent-blue'
                    : 'glass text-text-muted hover:text-white'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
                {t.count > 0 && (
                  <span className="px-1.5 py-0.5 bg-white/10 rounded-full text-[10px]">{t.count}</span>
                )}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="pb-16">
        <Container>
          {/* USUARIOS */}
          {tab === 'usuarios' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-secondary text-sm">Usuarios registrados o que han accedido</p>
                <div className="flex items-center gap-2">
                  {usuarios.length > 0 && (
                    <button onClick={() => downloadCSV(usuarios.map(u => ({ email: u.email, nombre: u.nombre, ultimo_acceso: u.last_login_at, creado: u.created_at })), 'usuarios')} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue/10 text-accent-blue rounded-lg text-[10px] font-medium">
                      <Download className="w-3 h-3" /> CSV
                    </button>
                  )}
                </div>
              </div>
              <div className="glass rounded-2xl p-3 mb-3">
                <p className="text-text-secondary text-xs mb-2">Control manual por email</p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="email"
                    value={manualPremiumEmail}
                    onChange={(e) => setManualPremiumEmail(e.target.value)}
                    placeholder="usuario@email.com"
                    className="flex-1 px-3 py-2 rounded-xl bg-dark-surface border border-dark-border text-white text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => void setPremiumByEmail('grant')}
                    disabled={manualPremiumLoading}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 disabled:opacity-60"
                  >
                    Dar premium
                  </button>
                  <button
                    type="button"
                    onClick={() => void setPremiumByEmail('revoke')}
                    disabled={manualPremiumLoading}
                    className="px-3 py-2 rounded-xl text-xs font-semibold bg-amber-500/15 text-amber-300 hover:bg-amber-500/25 disabled:opacity-60"
                  >
                    Quitar premium
                  </button>
                </div>
                {manualPremiumMsg && (
                  <p className={`text-xs mt-2 ${manualPremiumMsg.type === 'ok' ? 'text-emerald-300' : 'text-rose-300'}`}>
                    {manualPremiumMsg.text}
                  </p>
                )}
              </div>
              {usuarios.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Users className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay usuarios registrados</p>
                  <p className="text-text-muted text-xs mt-1">Se guardan al registrarse o acceder</p>
                </div>
              ) : (
                usuarios.map((u) => (
                  <div key={u.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                      <Users className="w-5 h-5 text-accent-blue" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{u.email}</p>
                      <p className="text-text-muted text-xs">
                        {u.nombre || '—'} · Último acceso: {u.last_login_at ? new Date(u.last_login_at).toLocaleDateString('es') : '—'}
                      </p>
                      <div className="mt-1 flex items-center gap-2">
                        <span className={`text-[10px] px-2 py-0.5 rounded-full border ${u.is_premium ? 'text-emerald-300 border-emerald-500/30 bg-emerald-500/10' : 'text-text-muted border-white/10 bg-white/5'}`}>
                          {u.is_premium ? 'Premium activo' : 'Free'}
                        </span>
                        <span className="text-[10px] text-text-muted">
                          {u.subscription_status || 'none'}
                        </span>
                      </div>
                    </div>
                    <button
                      onClick={() => updateUserPremium(u, !u.is_premium)}
                      className={`px-2.5 py-2 rounded-lg text-[10px] font-semibold shrink-0 ${u.is_premium ? 'bg-amber-500/15 text-amber-300 hover:bg-amber-500/25' : 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25'}`}
                    >
                      {u.is_premium ? 'Quitar PRO' : 'Dar PRO'}
                    </button>
                    <button onClick={() => deleteItem('users', u.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {tab === 'payments' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex items-center justify-between mb-2">
                <p className="text-text-secondary text-sm">Pagos Stripe registrados</p>
                {payments.length > 0 && (
                  <button
                    onClick={() => downloadCSV(payments.map((p) => ({
                      email: p.user_email,
                      amount_paid: p.amount_paid,
                      currency: p.currency,
                      status: p.status,
                      paid_at: p.paid_at,
                      invoice: p.stripe_invoice_id,
                    })), 'pagos-stripe')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue/10 text-accent-blue rounded-lg text-[10px] font-medium"
                  >
                    <Download className="w-3 h-3" /> CSV
                  </button>
                )}
              </div>
              {payments.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Crown className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay pagos registrados</p>
                </div>
              ) : (
                payments.map((p) => (
                  <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center shrink-0">
                      <Crown className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{p.user_email}</p>
                      <p className="text-text-muted text-xs">
                        {(p.amount_paid / 100).toFixed(2)} {p.currency.toUpperCase()} · {p.status}
                        {p.paid_at ? ` · ${new Date(p.paid_at).toLocaleDateString('es')}` : ''}
                      </p>
                    </div>
                    <span className="text-[10px] text-text-muted truncate max-w-[130px]">{p.stripe_invoice_id}</span>
                  </div>
                ))
              )}
            </div>
          )}

          {/* RESUMEN */}
          {tab === 'resumen' && (
            <div className="space-y-4 animate-fade-in">
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {[
                  { label: 'Emails', value: totalEmails, icon: Star, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                  { label: 'Clientes', value: clientes.length, icon: Users, color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
                  { label: 'Leads', value: leads.length, icon: Mail, color: 'text-green-400', bg: 'bg-green-500/10' },
                  { label: 'Mensajes', value: contactos.length, icon: MessageSquare, color: 'text-purple-400', bg: 'bg-purple-500/10' },
                  { label: 'Llamadas', value: llamadas.length, icon: Phone, color: 'text-cyan-400', bg: 'bg-cyan-500/10' },
                  { label: 'Diario', value: diario.length, icon: BookOpen, color: 'text-amber-400', bg: 'bg-amber-500/10' },
                  { label: 'Mapa', value: mapa.length, icon: MapIcon, color: 'text-teal-400', bg: 'bg-teal-500/10' },
                  { label: 'NeuroScore', value: neuroscore.length, icon: Activity, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
                  { label: 'Programa 21', value: programa.length, icon: Calendar, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                  { label: 'Tests', value: testResults.length, icon: ClipboardList, color: 'text-violet-400', bg: 'bg-violet-500/10' },
                ].map((s) => (
                  <div key={s.label} className="glass rounded-2xl p-4">
                    <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center mb-3`}>
                      <s.icon className={`w-5 h-5 ${s.color}`} />
                    </div>
                    <p className="font-heading text-2xl font-bold text-white">{s.value}</p>
                    <p className="text-text-muted text-xs">{s.label}</p>
                  </div>
                ))}
              </div>

              {/* Quick export */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4 text-accent-blue" /> Exportar datos
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  <button onClick={exportAllEmails} className="py-2.5 px-3 rounded-xl bg-violet-500/10 text-violet-400 text-xs font-medium active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Todos los emails
                  </button>
                  <button onClick={() => downloadCSV(leads.map(l => ({ email: l.email, nombre: l.name, fuente: l.source, fecha: l.created_at })), 'leads')} className="py-2.5 px-3 rounded-xl bg-green-500/10 text-green-400 text-xs font-medium active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Leads CSV
                  </button>
                  <button onClick={() => downloadCSV(clientes.map(c => ({ nombre: c.nombre, email: c.email, telefono: c.telefono, estado: c.estado, plan: c.plan })), 'clientes')} className="py-2.5 px-3 rounded-xl bg-accent-blue/10 text-accent-blue text-xs font-medium active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Clientes CSV
                  </button>
                  <button onClick={() => downloadCSV(contactos.map(c => ({ nombre: c.name, email: c.email, mensaje: c.message, fecha: c.created_at })), 'mensajes')} className="py-2.5 px-3 rounded-xl bg-purple-500/10 text-purple-400 text-xs font-medium active:scale-95 transition-transform flex items-center justify-center gap-1.5">
                    <Download className="w-3.5 h-3.5" /> Mensajes CSV
                  </button>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-3">
                <div className="glass rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-green-400" /> Clientes por estado
                  </h3>
                  <div className="space-y-2">
                    {['activo', 'nuevo', 'potencial', 'inactivo'].map((estado) => {
                      const count = clientes.filter((c) => c.estado === estado).length
                      const colors: Record<string, string> = {
                        activo: 'bg-green-400', nuevo: 'bg-blue-400',
                        potencial: 'bg-violet-400', inactivo: 'bg-red-400',
                      }
                      return (
                        <div key={estado} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${colors[estado]}`} />
                          <span className="text-text-secondary text-sm capitalize flex-1">{estado}</span>
                          <span className="text-white font-medium text-sm">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div className="glass rounded-2xl p-5">
                  <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                    <Crown className="w-4 h-4 text-violet-400" /> Planes
                  </h3>
                  <div className="space-y-2">
                    {['premium', 'free', 'ninguno'].map((plan) => {
                      const count = clientes.filter((c) => c.plan === plan).length
                      const colors: Record<string, string> = {
                        premium: 'bg-violet-400', free: 'bg-blue-400', ninguno: 'bg-gray-400',
                      }
                      return (
                        <div key={plan} className="flex items-center gap-3">
                          <div className={`w-2 h-2 rounded-full ${colors[plan]}`} />
                          <span className="text-text-secondary text-sm capitalize flex-1">{plan}</span>
                          <span className="text-white font-medium text-sm">{count}</span>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>

              {/* Email sources breakdown */}
              <div className="glass rounded-2xl p-5">
                <h3 className="text-white font-semibold text-sm mb-3 flex items-center gap-2">
                  <Star className="w-4 h-4 text-violet-400" /> Emails por fuente
                </h3>
                <div className="space-y-2">
                  {(() => {
                    const sourceCounts: Record<string, number> = {}
                    allEmails.forEach((e) => {
                      e.sources.forEach((s) => {
                        sourceCounts[s] = (sourceCounts[s] || 0) + 1
                      })
                    })
                    return Object.entries(sourceCounts)
                      .sort(([, a], [, b]) => b - a)
                      .map(([source, count]) => (
                        <div key={source} className="flex items-center gap-3">
                          <div className="w-2 h-2 rounded-full bg-accent-blue" />
                          <span className="text-text-secondary text-sm flex-1">{source}</span>
                          <span className="text-white font-medium text-sm">{count}</span>
                        </div>
                      ))
                  })()}
                </div>
              </div>
            </div>
          )}

          {/* AUDIOS */}
          {tab === 'audios' && (
            <div className="space-y-4 animate-fade-in">
              <p className="text-text-secondary text-sm">URLs de música ambiente para meditaciones. Vacío = usa /ambient1.mp3, etc.</p>
              <div className="space-y-3">
                {['ambient1','ambient2','ambient3','ambient4','ambient5','ambient'].map((slot) => {
                  const item = audioConfig.find(a => a.slot === slot) || { slot, url: '' }
                  return (
                    <div key={slot} className="glass rounded-2xl p-4">
                      <label className="text-text-muted text-xs block mb-1">{slot}</label>
                      <input
                        type="text"
                        value={item.url}
                        onChange={(e) => {
                          const next = [...audioConfig]
                          const idx = next.findIndex(x => x.slot === slot)
                          const val = e.target.value
                          if (idx >= 0) next[idx] = { slot, url: val }
                          else next.push({ slot, url: val })
                          setAudioConfig(next)
                        }}
                        placeholder={`/${slot}.mp3`}
                        className="w-full px-4 py-2.5 rounded-xl bg-dark-surface border border-dark-border text-white text-sm"
                      />
                    </div>
                  )
                })}
              </div>
              <button
                onClick={async () => {
                  setAudioSaving(true)
                  try {
                    const items = ['ambient1','ambient2','ambient3','ambient4','ambient5','ambient'].map(s => {
                      const found = audioConfig.find(a => a.slot === s)
                      return { slot: s, url: found?.url ?? '' }
                    })
                    const res = await fetch('/api/admin/audio-config', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) })
                    if (res.ok) fetchAll()
                  } finally { setAudioSaving(false) }
                }}
                disabled={audioSaving}
                className="px-5 py-2.5 rounded-xl bg-accent-blue text-white text-sm font-medium disabled:opacity-60"
              >
                {audioSaving ? 'Guardando…' : 'Guardar URLs'}
              </button>
            </div>
          )}

          {/* BIBLIOTECA */}
          {tab === 'biblioteca' && (
            <div className="space-y-2 animate-fade-in">
              <p className="text-text-secondary text-sm mb-2">Artículos de la biblioteca. Si la tabla está vacía, se usan los de código. Ejecuta la migración y rellena datos.</p>
              {biblioteca.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay artículos en Supabase</p>
                </div>
              ) : (
                biblioteca.map((b) => (
                  <div key={b.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-accent-blue shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium">{b.title}</p>
                      <p className="text-text-muted text-xs">{b.slug} · {b.date}</p>
                    </div>
                    <button onClick={() => setEditingBiblio(b)} className="p-2 rounded-lg hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue" title="Editar"><Pencil className="w-4 h-4" /></button>
                    <button onClick={() => deleteItem('biblioteca_posts', b.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400"><Trash2 className="w-4 h-4" /></button>
                  </div>
                ))
              )}
              {editingBiblio && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setEditingBiblio(null)}>
                  <div className="glass rounded-2xl p-5 w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                    <EditBiblioForm post={editingBiblio} onSave={async (data) => {
                      const res = await fetch('/api/admin/biblioteca', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingBiblio.id, ...data }) })
                      if (res.ok) { setBiblioteca(prev => prev.map(p => p.id === editingBiblio.id ? { ...p, ...data } : p)); setEditingBiblio(null); fetchAll() }
                    }} onCancel={() => setEditingBiblio(null)} />
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SUSCRIPTORES */}
          {tab === 'suscriptores' && (
            <div className="space-y-3 animate-fade-in">
              <div className="flex items-center justify-between">
                <p className="text-text-secondary text-sm">{totalEmails} emails recopilados de todas las fuentes</p>
                <button
                  onClick={exportAllEmails}
                  className="flex items-center gap-1.5 px-4 py-2 bg-violet-500/10 text-violet-400 rounded-xl text-xs font-medium active:scale-95 transition-transform"
                >
                  <Download className="w-3.5 h-3.5" /> Exportar CSV
                </button>
              </div>

              {totalEmails === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Star className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay emails recopilados todavia</p>
                  <p className="text-text-muted text-xs mt-1">Los emails se capturan del test, programa, neuroscore, captacion y contacto</p>
                </div>
              ) : (
                Array.from(allEmails.values()).map((e) => (
                  <div key={e.email} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0">
                      <Star className="w-5 h-5 text-violet-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{e.email}</p>
                      <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                        <span className="text-text-muted text-[10px]">{e.nombre || 'Sin nombre'}</span>
                        {e.sources.map((s) => (
                          <span key={s} className="text-[10px] px-1.5 py-0.5 bg-accent-blue/10 text-accent-blue rounded-full">{s}</span>
                        ))}
                        <span className="text-text-muted text-[10px]">{new Date(e.date).toLocaleDateString('es')}</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CLIENTES */}
          {tab === 'clientes' && (
            <div className="space-y-2 animate-fade-in">
              {clientes.length > 0 && (
                <div className="flex justify-end mb-1">
                  <button onClick={() => downloadCSV(clientes.map(c => ({ nombre: c.nombre, email: c.email, telefono: c.telefono, estado: c.estado, plan: c.plan, sesiones: c.sesionesTotales })), 'clientes')} className="flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue/10 text-accent-blue rounded-lg text-[10px] font-medium active:scale-95 transition-transform">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                </div>
              )}
              {clientes.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Users className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay clientes registrados</p>
                </div>
              ) : (
                clientes.map((c) => {
                  const estadoColors: Record<string, string> = {
                    activo: 'text-green-400 bg-green-500/10',
                    inactivo: 'text-red-400 bg-red-500/10',
                    nuevo: 'text-blue-400 bg-blue-500/10',
                    potencial: 'text-violet-400 bg-violet-500/10',
                  }
                  return (
                    <div key={c.id} className="glass rounded-2xl p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center shrink-0">
                          <Users className="w-5 h-5 text-accent-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="text-white text-sm font-medium truncate">{c.nombre}</p>
                            {c.plan === 'premium' && (
                              <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400">PRO</span>
                            )}
                          </div>
                          <p className="text-text-muted text-xs">{c.email} · {c.telefono}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${estadoColors[c.estado] || 'text-text-muted bg-white/5'}`}>
                              {c.estado}
                            </span>
                            <span className="text-text-muted text-[10px]">{c.sesionesTotales} sesiones</span>
                          </div>
                          {c.notas && <p className="text-text-secondary text-xs mt-2">{c.notas}</p>}
                        </div>
                        <button onClick={() => deleteItem('clients', c.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors shrink-0">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* LEADS */}
          {tab === 'leads' && (
            <div className="space-y-2 animate-fade-in">
              {leads.length > 0 && (
                <div className="flex justify-end mb-1">
                  <button onClick={() => downloadCSV(leads.map(l => ({ email: l.email, nombre: l.name, fuente: l.source, fecha: l.created_at })), 'leads')} className="flex items-center gap-1.5 px-3 py-1.5 bg-green-500/10 text-green-400 rounded-lg text-[10px] font-medium active:scale-95 transition-transform">
                    <Download className="w-3 h-3" /> CSV
                  </button>
                </div>
              )}
              {leads.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Mail className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay leads captados</p>
                </div>
              ) : (
                leads.map((l) => (
                  <div key={l.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5 text-green-400" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm font-medium truncate">{l.email}</p>
                      <p className="text-text-muted text-xs">{l.name || 'Sin nombre'} · {l.source} · {new Date(l.created_at).toLocaleDateString('es')}</p>
                    </div>
                    <button onClick={() => deleteItem('leads', l.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* CONTACTOS / MENSAJES */}
          {tab === 'contactos' && (
            <div className="space-y-2 animate-fade-in">
              {contactos.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <MessageSquare className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay mensajes de contacto</p>
                </div>
              ) : (
                contactos.map((c) => (
                  <div key={c.id} className="glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
                        <MessageSquare className="w-5 h-5 text-purple-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white text-sm font-medium">{c.name}</p>
                          <span className="text-text-muted text-[10px]">{new Date(c.created_at).toLocaleDateString('es')}</span>
                        </div>
                        <p className="text-accent-blue text-xs mb-1">{c.email}</p>
                        <p className="text-text-secondary text-sm leading-relaxed">{c.message}</p>
                      </div>
                      <button onClick={() => deleteItem('contacts', c.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* LLAMADAS */}
          {tab === 'llamadas' && (
            <div className="space-y-2 animate-fade-in">
              {llamadas.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Phone className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay llamadas registradas</p>
                </div>
              ) : (
                llamadas.map((l) => {
                  const tipoColors: Record<string, { color: string; bg: string; icon: typeof Phone }> = {
                    programada: { color: 'text-accent-blue', bg: 'bg-accent-blue/10', icon: PhoneCall },
                    completada: { color: 'text-green-400', bg: 'bg-green-500/10', icon: Phone },
                    perdida: { color: 'text-red-400', bg: 'bg-red-500/10', icon: PhoneMissed },
                    cancelada: { color: 'text-text-muted', bg: 'bg-white/5', icon: Phone },
                  }
                  const cfg = tipoColors[l.tipo] || tipoColors.programada
                  return (
                    <div key={l.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center shrink-0`}>
                        <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium">{l.clienteNombre}</p>
                        <p className="text-text-muted text-xs">{l.fecha} · {l.hora} · {l.motivo}{l.duracion > 0 && ` · ${l.duracion}min`}</p>
                        {l.notas && <p className="text-text-secondary text-xs mt-1">{l.notas}</p>}
                      </div>
                      <span className={`text-[10px] px-2 py-1 rounded-full font-medium ${cfg.bg} ${cfg.color} shrink-0`}>{l.tipo}</span>
                      <button onClick={() => deleteItem('calls', l.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors shrink-0">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          )}

          {/* COMUNIDAD */}
          {tab === 'comunidad' && (
            <div className="space-y-2 animate-fade-in">
              {posts.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Users className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay posts en la comunidad</p>
                </div>
              ) : (
                posts.map((p) => (
                  <div key={p.id} className="glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-lg shrink-0">{p.avatar}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-white text-sm font-medium">{p.autor}</p>
                          <span className="text-text-muted text-[10px] px-1.5 py-0.5 bg-white/5 rounded-full">{p.nivel}</span>
                          <span className="text-text-muted text-[10px] px-1.5 py-0.5 bg-white/5 rounded-full">{p.tag}</span>
                        </div>
                        <p className="text-text-secondary text-sm leading-relaxed">{p.texto}</p>
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-text-muted text-[10px]">{p.likes} likes</span>
                          <span className="text-text-muted text-[10px]">{p.replies} respuestas</span>
                        </div>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button onClick={() => setEditingPost(p)} className="p-2 rounded-lg hover:bg-accent-blue/10 text-text-muted hover:text-accent-blue transition-colors" title="Editar">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteItem('community_posts', p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* Modal editar post comunidad */}
          {editingPost && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60" onClick={() => setEditingPost(null)}>
              <div className="glass rounded-2xl p-5 w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-heading font-semibold text-white">Editar post</h3>
                  <button onClick={() => setEditingPost(null)} className="p-2 rounded-lg hover:bg-white/10 text-text-muted"><X className="w-4 h-4" /></button>
                </div>
                <EditPostForm
                  post={editingPost}
                  onSave={(data) => updatePost(editingPost.id, data)}
                  onCancel={() => setEditingPost(null)}
                />
              </div>
            </div>
          )}

          {/* DIARIO */}
          {tab === 'diario' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <button onClick={() => downloadCSV(diario, 'diario')} className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 text-amber-400 rounded-lg text-[10px] font-medium">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {diario.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <BookOpen className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay entradas de diario</p>
                </div>
              ) : (
                diario.map((d) => (
                  <div key={d.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-amber-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{d.user_email}</p>
                      <p className="text-text-muted text-xs">{d.date} · Presencia: {d.presence_level} · {d.mood || '—'}</p>
                      {d.insight && <p className="text-text-secondary text-xs mt-1 line-clamp-2">{d.insight}</p>}
                    </div>
                    <button onClick={() => deleteItem('diary_entries', d.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* MAPA */}
          {tab === 'mapa' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <button onClick={() => downloadCSV(mapa, 'mapa')} className="flex items-center gap-1.5 px-3 py-1.5 bg-teal-500/10 text-teal-400 rounded-lg text-[10px] font-medium">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {mapa.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <MapIcon className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay entradas del mapa</p>
                </div>
              ) : (
                mapa.map((m) => (
                  <div key={m.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <MapIcon className="w-5 h-5 text-teal-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{m.user_email}</p>
                      <p className="text-text-muted text-xs">{m.date} · Nivel: {m.nivel?.toFixed(1) || '—'}</p>
                    </div>
                    <button onClick={() => deleteItem('mapa_entries', m.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* NEUROSCORE */}
          {tab === 'neuroscore' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <button onClick={() => downloadCSV(neuroscore, 'neuroscore')} className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-medium">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {neuroscore.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Activity className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay entradas de NeuroScore</p>
                </div>
              ) : (
                neuroscore.map((n) => (
                  <div key={n.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <Activity className="w-5 h-5 text-emerald-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{n.user_email}</p>
                      <p className="text-text-muted text-xs">{n.date} · Score: {n.score}</p>
                    </div>
                    <button onClick={() => deleteItem('neuroscore_entries', n.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* PROGRAMA 21 DÍAS */}
          {tab === 'programa' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <button onClick={() => downloadCSV(programa, 'programa')} className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-medium">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {programa.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <Calendar className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay progreso del programa</p>
                </div>
              ) : (
                programa.map((p) => (
                  <div key={p.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-blue-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{p.user_email}</p>
                      <p className="text-text-muted text-xs">Inicio: {p.start_date} · Días: {(p.completed_days || []).length}/21</p>
                    </div>
                    <button onClick={() => deleteItem('programa_progress', p.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TEST RESULTADOS */}
          {tab === 'test' && (
            <div className="space-y-2 animate-fade-in">
              <div className="flex justify-end mb-1">
                <button onClick={() => downloadCSV(testResults, 'test-results')} className="flex items-center gap-1.5 px-3 py-1.5 bg-violet-500/10 text-violet-400 rounded-lg text-[10px] font-medium">
                  <Download className="w-3 h-3" /> CSV
                </button>
              </div>
              {testResults.length === 0 ? (
                <div className="glass rounded-2xl p-8 text-center">
                  <ClipboardList className="w-10 h-10 text-text-muted mx-auto mb-3" />
                  <p className="text-text-secondary text-sm">No hay resultados del test</p>
                </div>
              ) : (
                testResults.map((t) => (
                  <div key={t.id} className="glass rounded-2xl p-4 flex items-center gap-3">
                    <ClipboardList className="w-5 h-5 text-violet-400 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">{t.user_email || 'Anónimo'}</p>
                      <p className="text-text-muted text-xs">{t.level} · Score: {t.score}</p>
                    </div>
                    <button onClick={() => deleteItem('test_results', t.id)} className="p-2 rounded-lg hover:bg-red-500/10 text-text-muted hover:text-red-400 shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          )}
        </Container>
      </section>
    </div>
  )
}
