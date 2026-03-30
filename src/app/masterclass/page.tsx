'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { claimAndPlay, unregister } from '@/lib/audio-manager'
import {
  stopVoiceWithFadeOut,
  createAmbientPad,
  fetchElevenLabsTTS,
  playAudioWithFadeIn,
  primeElevenLabsTTS,
  getStaticAudioCandidates,
  getGlobalVoiceStaticCandidates,
  resolveStaticAudioUrl,
  primeStaticAudioLookup,
} from '@/lib/audio-utils'
import { trackSessionStart, trackSessionComplete, trackSessionInterrupted } from '@/lib/session-tracking'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import PremiumLock from '@/components/PremiumLock'
import { Play, Pause, Square, Clock, Brain, Eye, Zap, Heart, Shield, Flame, X } from 'lucide-react'

type MasterClass = {
  id: string
  title: string
  subtitle: string
  duration: string
  icon: React.ElementType
  color: string
  topics: string[]
  free: boolean
  script: string
}

const masterclasses: MasterClass[] = [
  {
    id: 'ego',
    title: 'El ego que te cuenta una historia',
    subtitle: 'Por qué te crees todo lo que piensas sobre ti',
    duration: '18 min',
    icon: Brain,
    color: 'bg-violet-500/15 text-violet-400',
    topics: ['La historia automática en la cabeza', 'Ego como hábito, no como verdad', 'Tres pasos: mirar, nombrar, volver al cuerpo'],
    free: true,
    script: 'El ego que te cuenta una historia. Yo pasé años creyendo cada narrativa sobre quién era y qué fallaba. Luego aprendí a ver el pensamiento como ruido que pasa, no como sentencia. El ejercicio es simple: observas el pensamiento, lo nombras sin seguirlo y llevas la atención al cuerpo. Con práctica, la historia pierde fuelle.',
  },
  {
    id: 'amigdala',
    title: 'Cuando el miedo manda antes que tú',
    subtitle: 'Qué hacer en esos segundos en los que reaccionas solo',
    duration: '15 min',
    icon: Shield,
    color: 'bg-rose-500/15 text-rose-400',
    topics: ['Por qué explotas o te bloqueas tan rápido', 'Una pausa que sí puedes entrenar', 'Respirar, nombrar, elegir'],
    free: true,
    script: 'Cuando el miedo manda antes que tú. A veces el cuerpo dispara alerta y la cabeza aún no ha procesado nada. A mí me pasó mil veces. Lo que ayuda no es discutir con el miedo: es parar, respirar hondo y poner palabra a lo que sientes. Ese mini ritual devuelve espacio entre el golpe y la respuesta.',
  },
  {
    id: 'dmn',
    title: 'El piloto automático mental',
    subtitle: 'Cuando la cabeza va sola y tú vas detrás',
    duration: '22 min',
    icon: Eye,
    color: 'bg-cyan-500/15 text-cyan-400',
    topics: ['Rumiar sin querer', 'Diferencia entre enredarse y crear', 'Cómo cortar el bucle con atención simple'],
    free: false,
    script: 'El piloto automático mental. Cuando no hay tarea clara, la mente se pone a revivir el pasado o inventar futuros. Yo lo llamo el modo bucle. La meditación no es magia: es entrenar volver una y otra vez al aquí. Cada vuelta cuenta. Con el tiempo el bucle deja de ser tu jefe.',
  },
  {
    id: 'neuroplasticidad',
    title: 'Los hábitos se pueden cambiar',
    subtitle: 'Lo que repetís se queda; lo que repetís distinto, también',
    duration: '20 min',
    icon: Zap,
    color: 'bg-emerald-500/15 text-emerald-400',
    topics: ['Por qué cuesta tanto soltar un patrón', 'Disparador, respuesta, repetición', 'Elegir qué quieres reforzar'],
    free: false,
    script: 'Los hábitos se pueden cambiar. No hace falta un discurso técnico: lo que haces todos los días te define más que lo que piensas una vez al año. Identifica el disparador, practica otra respuesta pequeña y repite. Malos y buenos hábitos se entrenan igual; elige de verdad qué quieres alimentar.',
  },
  {
    id: 'observador',
    title: 'El observador: quién eres realmente',
    subtitle: 'Más allá del pensamiento, más allá de la emoción',
    duration: '25 min',
    icon: Eye,
    color: 'bg-teal-500/15 text-teal-400',
    topics: ['La voz que cuenta la película vs. quien la mira', 'Sentarte a ver pasar el pensamiento', 'Soltar sin convertirlo en teatro'],
    free: false,
    script: 'El observador: quién eres realmente. Hay una parte que piensa y otra que puede notar que piensa. El drama es creer que eres solo la primera. Te sientas, ves los pensamientos como tráfico que pasa, y dejas de subir a cada coche. Eso no es frialdad: es libertad práctica.',
  },
  {
    id: 'emociones',
    title: 'Emociones: la guía que ignoras',
    subtitle: 'No las reprimas. No las sigas. Escúchalas.',
    duration: '17 min',
    icon: Heart,
    color: 'bg-pink-500/15 text-pink-400',
    topics: ['Cuerpo primero, historia después', 'Nombrar sin dramatizar', 'Respiración larga cuando todo aprieta'],
    free: false,
    script: 'Emociones: la guía que ignoras. Las emociones son señales del cuerpo antes que discursos de la cabeza. Cuando las ignoras, gritan más fuerte. Nombrar lo que sientes, respirar exhalar largo y sentir dónde está en el cuerpo te devuelve el suelo. No es positivismo: es honestidad.',
  },
  {
    id: 'cortisol',
    title: 'Vivir en modo alarma',
    subtitle: 'Estrés aunque “no pase nada grave”',
    duration: '16 min',
    icon: Flame,
    color: 'bg-orange-500/15 text-orange-400',
    topics: ['Cuando el cuerpo no apaga el interruptor', 'Respiración que baja el ritmo', 'Cinco minutos que sí puedes robar'],
    free: false,
    script: 'Vivir en modo alarma. Tu cuerpo reacciona a pensamientos como si fueran amenazas reales. Por eso puedes estar hecho polvo sin un tigre delante. La respiración lenta es la palanca más directa que conozco: inhala cuatro, exhala ocho, tres veces. No soluciona la vida, pero te saca del modo emergencia.',
  },
]

function MasterClassCard({ mc, onSelect }: { mc: MasterClass; onSelect: () => void }) {
  return (
    <div className="glass rounded-2xl p-5 card-hover">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl ${mc.color} flex items-center justify-center shrink-0`}>
          <mc.icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-white text-sm">{mc.title}</h3>
          <p className="text-text-muted text-xs mt-0.5">{mc.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-muted text-xs">{mc.duration}</span>
      </div>

      <ul className="space-y-1.5 mb-4">
        {mc.topics.map((t, i) => (
          <li key={i} className="text-text-secondary text-xs flex items-start gap-2">
            <span className="text-accent-blue mt-0.5">·</span> {t}
          </li>
        ))}
      </ul>

      <button
        onClick={onSelect}
        className="w-full py-2.5 rounded-xl bg-white/5 text-white text-xs font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform hover:bg-white/10"
      >
        <Play className="w-3.5 h-3.5" /> Escuchar masterclass
      </button>
    </div>
  )
}

type AmbientRef = { ctx: AudioContext; gain: GainNode; oscs: OscillatorNode[]; stop: () => void } | null

function getMasterclassContentStaticCandidates(mc: MasterClass): string[] {
  return [
    ...getStaticAudioCandidates('masterclass', mc.id),
    ...getStaticAudioCandidates('masterclass', mc.title),
  ]
}

export default function MasterclassPage() {
  const [selected, setSelected] = useState<MasterClass | null>(null)
  const [playing, setPlaying] = useState(false)
  const [loadingMasterclass, setLoadingMasterclass] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const genRef = useRef(0)
  const ttsAudioRef = useRef<{ audio: HTMLAudioElement; url?: string; voiceRefs?: import('@/lib/audio-utils').VoiceRefs } | null>(null)
  const ambientRef = useRef<AmbientRef>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const playingMcRef = useRef<MasterClass | null>(null)
  const playStartTimeRef = useRef<number>(0)

  const stopMasterclass = useCallback(() => {
    genRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    const ref = ttsAudioRef.current
    ttsAudioRef.current = null
    if (ambientRef.current) {
      ambientRef.current.stop()
      ambientRef.current = null
    }
    const mc = playingMcRef.current
    if (mc && playStartTimeRef.current > 0) {
      trackSessionInterrupted('masterclass', mc.title, Math.floor((Date.now() - playStartTimeRef.current) / 1000))
    }
    playingMcRef.current = null
    playStartTimeRef.current = 0
    setPlaying(false)
    setLoadingMasterclass(null)
    setIsPaused(false)
    if (ref) {
      stopVoiceWithFadeOut(ref.audio, ref.voiceRefs ?? null, ref.url, () => {})
    }
  }, [])

  useEffect(() => {
    masterclasses.slice(0, 1).forEach((masterclass) => {
      primeStaticAudioLookup([
        ...getMasterclassContentStaticCandidates(masterclass),
        ...getGlobalVoiceStaticCandidates(),
      ])
      primeElevenLabsTTS(masterclass.script)
    })
  }, [])

  useEffect(() => {
    return () => {
      unregister('masterclass')
      stopMasterclass()
    }
  }, [stopMasterclass])

  const handlePlay = useCallback(async (mc: MasterClass) => {
    if (typeof window === 'undefined') return
    stopMasterclass()
    claimAndPlay('masterclass', stopMasterclass)
    const thisGen = ++genRef.current
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    playingMcRef.current = mc
    playStartTimeRef.current = Date.now()
    trackSessionStart('masterclass', mc.title)
    setSelected(mc)
    setPlaying(true)
    setIsPaused(false)
    setLoadingMasterclass(mc.id)

    const CtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (CtxClass) {
      const ctx = new CtxClass()
      if (ctx.state === 'suspended') await ctx.resume()
      const pad = createAmbientPad(ctx, 0.2)
      ambientRef.current = { ...pad, ctx }
    }

    try {
      const contentStaticUrl = await resolveStaticAudioUrl(getMasterclassContentStaticCandidates(mc))
      const staticUrl = contentStaticUrl ?? await resolveStaticAudioUrl(getGlobalVoiceStaticCandidates())
      if (genRef.current !== thisGen || signal.aborted) return

      let audioSourceUrl: string | undefined
      let audio: HTMLAudioElement

      if (staticUrl) {
        audio = new Audio(staticUrl)
      } else {
        const blob = await fetchElevenLabsTTS(mc.script, { signal })
        if (genRef.current !== thisGen || signal.aborted) return
        audioSourceUrl = URL.createObjectURL(blob)
        audio = new Audio(audioSourceUrl)
      }

      audio.onended = () => {
        trackSessionComplete('masterclass', mc.title, Math.floor((Date.now() - playStartTimeRef.current) / 1000))
        stopMasterclass()
      }
      audio.onerror = () => stopMasterclass()
      setLoadingMasterclass(null)
      if (genRef.current !== thisGen || signal.aborted) {
        if (audioSourceUrl) URL.revokeObjectURL(audioSourceUrl)
        return
      }

      if (CtxClass) {
        const voiceRefs = await playAudioWithFadeIn(audio)
        if (genRef.current !== thisGen || signal.aborted) {
          if (audioSourceUrl) URL.revokeObjectURL(audioSourceUrl)
          try { voiceRefs.ctx.close() } catch {}
          return
        }
        ttsAudioRef.current = { audio, url: audioSourceUrl, voiceRefs }
      } else {
        await audio.play()
        if (genRef.current !== thisGen || signal.aborted) {
          audio.pause()
          if (audioSourceUrl) URL.revokeObjectURL(audioSourceUrl)
          return
        }
        ttsAudioRef.current = { audio, url: audioSourceUrl }
      }
    } catch (error) {
      if (genRef.current !== thisGen || signal.aborted) return
      console.error('Fallo al reproducir masterclass con ElevenLabs:', error)
      stopMasterclass()
    } finally {
      if (genRef.current === thisGen && !signal.aborted) setLoadingMasterclass(null)
    }
  }, [stopMasterclass])

  const handlePause = useCallback(() => {
    if (ttsAudioRef.current) ttsAudioRef.current.audio.pause()
    if (ambientRef.current) ambientRef.current.gain.gain.setTargetAtTime(0, ambientRef.current.ctx.currentTime, 0.1)
    setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    if (ttsAudioRef.current) ttsAudioRef.current.audio.play().catch(() => {})
    if (ambientRef.current) ambientRef.current.gain.gain.setTargetAtTime(0.2, ambientRef.current.ctx.currentTime, 0.1)
    setIsPaused(false)
  }, [])

  const handleSelect = useCallback((mc: MasterClass) => {
    if (loadingMasterclass === mc.id) return
    if (playing && selected?.id === mc.id && !isPaused) {
      handlePause()
    } else if (playing && selected?.id === mc.id && isPaused) {
      handleResume()
    } else {
      handlePlay(mc)
    }
  }, [playing, selected, isPaused, loadingMasterclass, handlePlay, handlePause, handleResume])

  const handleStop = useCallback(() => {
    stopMasterclass()
    setSelected(null)
  }, [stopMasterclass])

  const handleClose = useCallback(() => {
    stopMasterclass()
    setSelected(null)
  }, [stopMasterclass])

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-violet-600 top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-6">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 animate-fade-in">
            Masterclasses
          </h1>
          <p className="text-text-secondary text-base animate-fade-in-up">
            Ideas del método en audio claro. Toca para escuchar.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="grid md:grid-cols-2 gap-4">
            {masterclasses.map((mc) => (
              <FadeInSection key={mc.id}>
                {mc.free ? (
                  <MasterClassCard mc={mc} onSelect={() => handleSelect(mc)} />
                ) : (
                  <PremiumLock label={mc.title}>
                    <MasterClassCard mc={mc} onSelect={() => handleSelect(mc)} />
                  </PremiumLock>
                )}
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Modal de reproducción */}
      {selected && (
        <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center p-4 md:p-6 bg-black/70 backdrop-blur-sm">
          <div className="glass rounded-2xl w-full max-w-lg p-6 animate-scale-in">
            <div className="flex items-start justify-between gap-3 mb-4">
              <div className={`w-12 h-12 rounded-xl ${selected.color} flex items-center justify-center shrink-0`}>
                <selected.icon className="w-6 h-6" />
              </div>
              <button onClick={handleClose} className="p-2 -m-2 rounded-lg text-text-muted hover:text-white hover:bg-white/10">
                <X className="w-5 h-5" />
              </button>
            </div>
            <h2 className="font-heading font-bold text-white text-lg mb-1">{selected.title}</h2>
            <p className="text-text-muted text-sm mb-4">{selected.subtitle}</p>
            <div className="flex gap-2">
              <button
                onClick={() => handleSelect(selected)}
                disabled={loadingMasterclass === selected.id}
                className="flex-1 py-3 rounded-xl bg-accent-blue text-white font-semibold flex items-center justify-center gap-2 active:scale-95 disabled:opacity-70"
              >
                {loadingMasterclass === selected.id ? (
                  <>Preparando...</>
                ) : playing && !isPaused ? (
                  <>
                    <Pause className="w-5 h-5" /> Pausar
                  </>
                ) : (
                  <>
                    <Play className="w-5 h-5" /> {isPaused ? 'Reanudar' : 'Escuchar'}
                  </>
                )}
              </button>
              <button
                onClick={handleStop}
                className="py-3 px-4 rounded-xl bg-rose-500/20 text-rose-400 font-medium active:scale-95"
              >
                <Square className="w-5 h-5 inline mr-1" /> Parar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
