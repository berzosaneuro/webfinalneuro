'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import {
  Users, MessageCircle, Video, Calendar, Heart, Star, Send,
  Crown, Flame, Clock, ChevronRight, Radio, Globe, Award, X, Loader2,
  Zap, Brain
} from 'lucide-react'

type Post = {
  id: string
  autor: string
  avatar: string
  nivel: string
  texto: string
  created_at: string
  likes: number
  liked: boolean
  replies: number
  tag: string
}

type ChatMsg = {
  id: string
  autor: string
  avatar: string
  nivel: string
  texto: string
  hora: string
  esGuia?: boolean
}

const SALAS = [
  { id: 'general', nombre: 'General', icon: Zap, color: 'text-accent-blue', desc: 'Conversación abierta' },
  { id: 'dudas', nombre: 'Dudas', icon: MessageCircle, color: 'text-purple-400', desc: 'Preguntas sobre el método' },
  { id: 'logros', nombre: 'Logros', icon: Star, color: 'text-emerald-400', desc: 'Comparte tus avances' },
  { id: 'silencio', nombre: 'Sala de silencio', icon: Brain, color: 'text-cyan-400', desc: 'Solo presencia' },
]

const CHAT_INICIAL: Record<string, ChatMsg[]> = {
  general: [
    { id: '1', autor: 'Lucía M.', avatar: '🧠', nivel: 'Nivel 28', texto: 'Buenos días comunidad. Acabo de terminar la meditación de las 7am. Hoy he notado por primera vez ese espacio entre pensamiento y reacción. Es muy sutil pero está ahí.', hora: '07:14', },
    { id: '2', autor: 'Dr. Berzosa', avatar: '🔬', nivel: 'Guía', texto: 'Lucía, eso es oro: notar el hueco antes de reaccionar. Ahí empieza el cambio de verdad. Sigue así.', hora: '07:18', esGuia: true },
    { id: '3', autor: 'Pablo R.', avatar: '🌊', nivel: 'Nivel 15', texto: 'Yo llevo 3 semanas y aún me cuesta no engancharme a los pensamientos. ¿Es normal?', hora: '07:22', },
    { id: '4', autor: 'Ana G.', avatar: '✨', nivel: 'Nivel 42', texto: 'Pablo, totalmente normal. El piloto automático lleva años entrenado. Dale tiempo. Yo no noté cambio real hasta la semana 4.', hora: '07:25', },
    { id: '5', autor: 'Carlos V.', avatar: '🧘', nivel: 'Nivel 33', texto: '¿Alguien ha probado la meditación nueva de "Observar sin nombre"? Es brutal. 15 minutos que se pasan volando.', hora: '07:31', },
    { id: '6', autor: 'Marina S.', avatar: '🌙', nivel: 'Nivel 19', texto: 'Día 12 de racha. Hoy tuve un momento de estrés en el trabajo y automáticamente usé el R.E.U.R.O.: detectar, nombrar, elegir. Funcionó.', hora: '08:02', },
    { id: '7', autor: 'Dr. Berzosa', avatar: '🔬', nivel: 'Guía', texto: 'Marina, eso es transferencia: lo que entrenas en silencio aparece cuando hay estrés. Ahí sabes que no es teoría. Enhorabuena.', hora: '08:05', esGuia: true },
  ],
  dudas: [
    { id: '1', autor: 'Javier L.', avatar: '🤔', nivel: 'Nivel 8', texto: '¿Cuál es la diferencia entre la N (neutralizar) y la O (observar)? Me parecen similares.', hora: '09:12', },
    { id: '2', autor: 'Dr. Berzosa', avatar: '🔬', nivel: 'Guía', texto: 'Buena pregunta Javier. La N es ver el pensamiento como pensamiento, sin engancharse. La O es dar un paso más: notar quién mira ese pensamiento sin confundirse con él. Primero etiquetas, luego sueltas la identificación.', hora: '09:18', esGuia: true },
    { id: '3', autor: 'Elena R.', avatar: '💡', nivel: 'Nivel 22', texto: '¿El escaneo corporal (la U) se puede hacer con los ojos abiertos? En el trabajo no puedo cerrar los ojos.', hora: '10:45', },
    { id: '4', autor: 'Ana G.', avatar: '✨', nivel: 'Nivel 42', texto: 'Elena, sí. Yo lo hago en reuniones aburridas: pies en el suelo, manos, respiración. Nadie se entera y tú vuelves al presente.', hora: '10:52', },
  ],
  logros: [
    { id: '1', autor: 'Diego M.', avatar: '🏆', nivel: 'Nivel 50', texto: '¡50 días de racha! Nunca pensé que llegaría. Mi NeuroScore lleva 2 semanas por encima de 85.', hora: '06:30', },
    { id: '2', autor: 'Sara P.', avatar: '🎯', nivel: 'Nivel 31', texto: 'Primer día que completo los 5 pilares del score: meditación + ejercicio + test + despertar + diario. 100/100. Se puede.', hora: '11:20', },
    { id: '3', autor: 'Marcos T.', avatar: '🧬', nivel: 'Nivel 27', texto: 'Mi test de ruido mental bajó de 78 a 34 en 6 semanas. Constancia sí se nota.', hora: '14:05', },
  ],
  silencio: [
    { id: '1', autor: 'Sistema', avatar: '🔇', nivel: '', texto: 'Esta sala es para practicar presencia compartida. Sin conversación. Solo estar.', hora: '', },
    { id: '2', autor: 'Sistema', avatar: '🧘', nivel: '', texto: '12 personas están en silencio consciente ahora mismo.', hora: '', },
  ],
}

type SesionGrupal = {
  id: string
  titulo: string
  guia: string
  fecha: string
  hora: string
  duracion: string
  participantes: number
  maxParticipantes: number
  tipo: 'meditacion' | 'charla' | 'taller' | 'retiro'
  enVivo: boolean
}

const SESIONES_GRUPALES: SesionGrupal[] = [
  {
    id: '1', titulo: 'Meditación grupal: El observador', guia: 'Dr. Berzosa',
    fecha: '2026-02-25', hora: '20:00', duracion: '30 min',
    participantes: 47, maxParticipantes: 100, tipo: 'meditacion', enVivo: true,
  },
  {
    id: '2', titulo: 'Charla: Hábitos que sí se quedan', guia: 'Equipo Berzosa Neuro',
    fecha: '2026-02-26', hora: '19:00', duracion: '45 min',
    participantes: 23, maxParticipantes: 50, tipo: 'charla', enVivo: false,
  },
  {
    id: '3', titulo: 'Taller: Disolución del ego práctico', guia: 'Dr. Berzosa',
    fecha: '2026-02-28', hora: '18:00', duracion: '60 min',
    participantes: 15, maxParticipantes: 30, tipo: 'taller', enVivo: false,
  },
  {
    id: '4', titulo: 'Retiro digital: 4h de silencio consciente', guia: 'Comunidad',
    fecha: '2026-03-01', hora: '10:00', duracion: '4h',
    participantes: 8, maxParticipantes: 20, tipo: 'retiro', enVivo: false,
  },
]

function timeAgo(dateStr: string): string {
  const now = new Date()
  const date = new Date(dateStr)
  const diff = Math.floor((now.getTime() - date.getTime()) / 1000)
  if (diff < 60) return 'ahora'
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`
  return `hace ${Math.floor(diff / 86400)}d`
}

const tipoConfig = {
  meditacion: { color: 'text-purple-400', bg: 'bg-purple-500/10', icon: Radio },
  charla: { color: 'text-accent-blue', bg: 'bg-accent-blue/10', icon: MessageCircle },
  taller: { color: 'text-green-400', bg: 'bg-green-500/10', icon: Award },
  retiro: { color: 'text-cyan-400', bg: 'bg-cyan-500/10', icon: Globe },
}

const tagConfig: Record<string, { color: string; bg: string }> = {
  experiencia: { color: 'text-green-400', bg: 'bg-green-500/10' },
  pregunta: { color: 'text-accent-blue', bg: 'bg-accent-blue/10' },
  enseñanza: { color: 'text-teal-400', bg: 'bg-teal-500/10' },
  progreso: { color: 'text-purple-400', bg: 'bg-purple-500/10' },
}

export default function ComunidadPage() {
  const [posts, setPosts] = useState<Post[]>([])
  const [mounted, setMounted] = useState(false)
  const [tab, setTab] = useState<'foro' | 'sesiones' | 'sala'>('foro')
  const [nuevoPost, setNuevoPost] = useState('')
  const [showNuevoPost, setShowNuevoPost] = useState(false)
  const [posting, setPosting] = useState(false)
  const [salaActiva, setSalaActiva] = useState('general')
  const [chatMsg, setChatMsg] = useState('')
  const [chatMsgs, setChatMsgs] = useState<Record<string, ChatMsg[]>>(CHAT_INICIAL)
  const chatEndRef = useRef<HTMLDivElement>(null)

  const loadPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/community')
      if (res.ok) {
        const data = await res.json()
        setPosts(data.map((p: Post) => ({ ...p, liked: false })))
      }
    } catch {
      // Silently fail
    }
  }, [])

  useEffect(() => {
    setMounted(true)
    loadPosts()
  }, [loadPosts])

  const toggleLike = async (id: string) => {
    const post = posts.find((p) => p.id === id)
    if (!post) return
    const newLikes = post.liked ? post.likes - 1 : post.likes + 1
    const updated = posts.map((p) => {
      if (p.id !== id) return p
      return { ...p, liked: !p.liked, likes: newLikes }
    })
    setPosts(updated)

    try {
      await fetch('/api/community', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, likes: newLikes }),
      })
    } catch {
      setPosts((prev) => prev.map((p) => (p.id === id ? { ...p, liked: post.liked, likes: post.likes } : p)))
    }
  }

  const addPost = async () => {
    if (!nuevoPost.trim()) return
    setPosting(true)

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          autor: 'Tú',
          avatar: '🌟',
          nivel: 'Observador',
          texto: nuevoPost.trim(),
          tag: 'experiencia',
        }),
      })

      if (res.ok) {
        const newPost = await res.json()
        setPosts((prev) => [{ ...newPost, liked: false }, ...prev])
      }
    } catch {
      // Silently fail
    }

    setNuevoPost('')
    setShowNuevoPost(false)
    setPosting(false)
  }

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMsgs, salaActiva])

  const sendChatMsg = () => {
    if (!chatMsg.trim() || salaActiva === 'silencio') return
    const now = new Date()
    const hora = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
    const newMsg: ChatMsg = {
      id: Date.now().toString(),
      autor: 'Tú',
      avatar: '🌟',
      nivel: 'Observador',
      texto: chatMsg.trim(),
      hora,
    }
    setChatMsgs((prev) => ({
      ...prev,
      [salaActiva]: [...(prev[salaActiva] || []), newMsg],
    }))
    setChatMsg('')
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-80 h-80 bg-accent-blue top-10 -right-24" />
      <div className="orb w-64 h-64 bg-purple-600 top-[600px] -left-32" />

      {/* Header */}
      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <div className="flex items-center justify-between mb-1">
            <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white animate-fade-in">
              Comunidad
            </h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 glass rounded-full">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">247 online</span>
              </div>
            </div>
          </div>
          <p className="text-text-secondary text-sm animate-fade-in-up">
            Crece junto a otros que están despertando.
          </p>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-4">
        <Container>
          <FadeInSection>
            <div className="grid grid-cols-3 gap-2">
              {[
                { icon: Users, value: '2.4K', label: 'Miembros', color: 'text-accent-blue' },
                { icon: Flame, value: '89%', label: 'Activos', color: 'text-orange-400' },
                { icon: Video, value: '4', label: 'Sesiones/sem', color: 'text-purple-400' },
              ].map((s) => (
                <div key={s.label} className="glass rounded-2xl p-3 text-center">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-1`} />
                  <p className={`font-heading text-xl font-bold ${s.color}`}>{s.value}</p>
                  <p className="text-text-muted text-[10px]">{s.label}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Tabs */}
      <section className="pb-4">
        <Container>
          <div className="flex gap-1 glass rounded-xl p-1">
            {[
              { id: 'foro' as const, label: 'Foro', icon: MessageCircle },
              { id: 'sala' as const, label: 'Sala', icon: Zap },
              { id: 'sesiones' as const, label: 'En vivo', icon: Video },
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-lg text-xs font-medium transition-all ${
                  tab === t.id ? 'bg-white/10 text-white' : 'text-text-muted'
                }`}
              >
                <t.icon className="w-3.5 h-3.5" />
                {t.label}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Content */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            {tab === 'foro' && (
              <div className="space-y-3">
                {/* New post button */}
                <button
                  onClick={() => setShowNuevoPost(true)}
                  className="w-full glass rounded-2xl p-4 flex items-center gap-3 text-left card-hover"
                >
                  <div className="w-10 h-10 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                    <Send className="w-4 h-4 text-accent-blue" />
                  </div>
                  <span className="text-text-muted text-sm">Comparte tu experiencia...</span>
                </button>

                {/* Posts */}
                {posts.map((post) => {
                  const tConfig = tagConfig[post.tag] || tagConfig.experiencia
                  return (
                    <div key={post.id} className="glass rounded-2xl p-4">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-lg">
                          {post.avatar}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <span className="text-white text-sm font-medium">{post.autor}</span>
                            {post.autor === 'Dr. Berzosa' && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-medium">Guía</span>
                            )}
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-text-muted text-[10px]">{post.nivel}</span>
                            <span className="text-text-muted text-[10px]">·</span>
                            <span className="text-text-muted text-[10px]">{timeAgo(post.created_at)}</span>
                          </div>
                        </div>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${tConfig.bg} ${tConfig.color}`}>
                          {post.tag}
                        </span>
                      </div>

                      <p className="text-white text-sm leading-relaxed mb-3">{post.texto}</p>

                      <div className="flex items-center gap-4">
                        <button
                          onClick={() => toggleLike(post.id)}
                          className={`flex items-center gap-1.5 text-xs transition-all active:scale-90 ${
                            post.liked ? 'text-red-400' : 'text-text-muted'
                          }`}
                        >
                          <Heart className={`w-4 h-4 ${post.liked ? 'fill-red-400' : ''}`} />
                          {post.likes}
                        </button>
                        <button className="flex items-center gap-1.5 text-xs text-text-muted">
                          <MessageCircle className="w-4 h-4" />
                          {post.replies}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}

            {tab === 'sala' && (
              <div>
                {/* Selector de salas */}
                <div className="flex gap-2 overflow-x-auto pb-3 scrollbar-hide mb-3">
                  {SALAS.map((sala) => (
                    <button
                      key={sala.id}
                      onClick={() => setSalaActiva(sala.id)}
                      className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all shrink-0 ${
                        salaActiva === sala.id
                          ? 'bg-accent-blue text-white shadow-lg shadow-accent-blue/20'
                          : 'glass text-text-muted'
                      }`}
                    >
                      <sala.icon className="w-3.5 h-3.5" />
                      {sala.nombre}
                    </button>
                  ))}
                </div>

                {/* Info de sala */}
                <div className="flex items-center justify-between px-1 mb-3">
                  <p className="text-text-muted text-xs">
                    {SALAS.find((s) => s.id === salaActiva)?.desc}
                  </p>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-green-400 text-[10px] font-medium">
                      {salaActiva === 'silencio' ? '12' : salaActiva === 'general' ? '34' : salaActiva === 'dudas' ? '18' : '9'} online
                    </span>
                  </div>
                </div>

                {/* Mensajes */}
                <div className="glass rounded-2xl overflow-hidden">
                  <div className="h-[420px] overflow-y-auto p-4 space-y-4 scrollbar-hide">
                    {(chatMsgs[salaActiva] || []).map((msg) => (
                      <div key={msg.id} className={`flex gap-3 ${msg.autor === 'Sistema' ? 'justify-center' : ''}`}>
                        {msg.autor === 'Sistema' ? (
                          <div className="px-4 py-2 rounded-full bg-cyan-500/5 border border-cyan-500/10">
                            <p className="text-cyan-400 text-xs text-center">
                              {msg.avatar} {msg.texto}
                            </p>
                          </div>
                        ) : (
                          <>
                            <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm shrink-0 ${
                              msg.esGuia ? 'bg-violet-500/10 border border-violet-500/20' : 'bg-white/5'
                            }`}>
                              {msg.avatar}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-0.5">
                                <span className={`text-xs font-medium ${msg.esGuia ? 'text-violet-400' : 'text-white'}`}>
                                  {msg.autor}
                                </span>
                                {msg.esGuia && (
                                  <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-violet-500/10 text-violet-400 font-medium">
                                    Guía
                                  </span>
                                )}
                                <span className="text-text-muted text-[10px]">{msg.nivel}</span>
                                {msg.hora && <span className="text-text-muted text-[10px]">{msg.hora}</span>}
                              </div>
                              <p className={`text-sm leading-relaxed ${
                                msg.esGuia ? 'text-white/90 bg-violet-500/5 rounded-xl rounded-tl-none p-3 border border-violet-500/10' : 'text-text-secondary'
                              }`}>
                                {msg.texto}
                              </p>
                            </div>
                          </>
                        )}
                      </div>
                    ))}
                    <div ref={chatEndRef} />
                  </div>

                  {/* Input */}
                  {salaActiva !== 'silencio' ? (
                    <div className="border-t border-dark-border/50 p-3">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={chatMsg}
                          onChange={(e) => setChatMsg(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && sendChatMsg()}
                          placeholder="Escribe un mensaje..."
                          className="flex-1 px-4 py-2.5 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50"
                        />
                        <button
                          onClick={sendChatMsg}
                          disabled={!chatMsg.trim()}
                          className="px-4 py-2.5 bg-accent-blue rounded-xl text-white active:scale-95 transition-transform disabled:opacity-30"
                        >
                          <Send className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="border-t border-dark-border/50 p-4 text-center">
                      <p className="text-cyan-400/60 text-xs">Esta sala es solo para presencia compartida en silencio</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {tab === 'sesiones' && (
              <div className="space-y-3">
                {SESIONES_GRUPALES.map((s) => {
                  const cfg = tipoConfig[s.tipo]
                  const plazas = s.maxParticipantes - s.participantes
                  return (
                    <div key={s.id} className={`glass rounded-2xl p-4 ${s.enVivo ? 'border border-green-500/20' : ''}`}>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${cfg.bg}`}>
                          <cfg.icon className={`w-5 h-5 ${cfg.color}`} />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="text-white text-sm font-medium">{s.titulo}</p>
                            {s.enVivo && (
                              <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-500/10 text-green-400 font-medium flex items-center gap-1">
                                <div className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                                EN VIVO
                              </span>
                            )}
                          </div>
                          <p className="text-text-muted text-xs">
                            {s.guia} · {s.fecha} · {s.hora} · {s.duracion}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1.5">
                            <Users className="w-3.5 h-3.5 text-text-muted" />
                            <span className="text-text-muted text-xs">{s.participantes}/{s.maxParticipantes}</span>
                          </div>
                          <span className={`text-xs ${plazas < 10 ? 'text-orange-400' : 'text-text-muted'}`}>
                            {plazas} plazas
                          </span>
                        </div>
                        <button
                          className={`px-4 py-2 rounded-xl text-xs font-medium active:scale-95 transition-transform ${
                            s.enVivo
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-accent-blue/10 text-accent-blue'
                          }`}
                        >
                          {s.enVivo ? 'Unirse ahora' : 'Reservar plaza'}
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </FadeInSection>
        </Container>
      </section>

      {/* New post modal */}
      {showNuevoPost && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowNuevoPost(false)} />
          <div className="relative glass rounded-t-3xl sm:rounded-3xl w-full sm:max-w-lg p-6 animate-slide-up">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-heading text-lg font-bold text-white">Compartir con la comunidad</h2>
              <button onClick={() => setShowNuevoPost(false)} className="p-2 rounded-xl bg-white/5 active:scale-90 transition-transform">
                <X className="w-5 h-5 text-text-muted" />
              </button>
            </div>
            <textarea
              value={nuevoPost}
              onChange={(e) => setNuevoPost(e.target.value)}
              placeholder="Comparte tu experiencia, pregunta o reflexión..."
              rows={4}
              className="w-full px-4 py-3 glass-light rounded-xl text-white text-sm placeholder:text-text-muted focus:outline-none focus:ring-1 focus:ring-accent-blue/50 resize-none mb-3"
            />
            <button
              onClick={addPost}
              disabled={!nuevoPost.trim() || posting}
              className="w-full py-3 bg-accent-blue rounded-xl text-white font-medium text-sm active:scale-95 transition-transform disabled:opacity-40"
            >
              {posting ? (
                <Loader2 className="w-4 h-4 inline mr-2 animate-spin" />
              ) : (
                <Send className="w-4 h-4 inline mr-2" />
              )}
              {posting ? 'Publicando...' : 'Publicar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
