'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { claimAndPlay, unregister } from '@/lib/audio-manager'
import {
  playAudioWithFadeIn,
  stopVoiceWithFadeOut,
  createAmbientPad,
  fetchElevenLabsTTS,
  primeElevenLabsTTS,
  getStaticAudioCandidates,
  getGlobalVoiceStaticCandidates,
  resolveStaticAudioUrl,
  primeStaticAudioLookup,
} from '@/lib/audio-utils'
import { trackSessionStart, trackSessionComplete, trackSessionInterrupted } from '@/lib/session-tracking'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { Play, Pause, Headphones, Clock, Square } from 'lucide-react'

type AmbientRef = { ctx: AudioContext; gain: GainNode; oscs: OscillatorNode[]; stop: () => void } | null

type Episode = {
  id: number
  title: string
  description: string
  duration: string
  date: string
  category: string
  script: string
}

const episodes: Episode[] = [
  { id: 1, title: '¿Por qué te quedas en lo malo que ya conoces?', description: 'Lo incómodo familiar a veces gana al cambio bueno: así lo he visto en mí y en otros.', duration: '5:30', date: '2024-12-01', category: 'Vida cotidiana',
    script: 'NeuroPodcast. ¿Por qué te quedas en lo malo que ya conoces? Porque lo nuevo asusta aunque sea mejor. La mente prefiere el guion viejo. Cuando lo ves claro, puedes elegir: un paso pequeño hoy vale más que otro día fingiendo que no pasa nada.' },
  { id: 2, title: 'La adicción al pensamiento', description: 'Repites las mismas vueltas y ni te das cuenta. No eres tonto: es un hábito.', duration: '6:15', date: '2024-12-08', category: 'Consciencia',
    script: 'NeuroPodcast. La adicción al pensamiento. La cabeza repite para ahorrar esfuerzo, pero eso te encierra en bucles. No se trata de callar la mente: se trata de mirar el pensamiento sin subirte a cada tren. Ese hueco es libertad real.' },
  { id: 3, title: 'No eres tus pensamientos', description: 'Hay una parte que piensa y otra que puede notar que piensa. Eso lo viví antes que entenderlo.', duration: '7:00', date: '2024-12-15', category: 'Consciencia',
    script: 'NeuroPodcast. No eres tus pensamientos. Puedes verlos pasar como si fueran clima: molestos a veces, pero no eres tú entero. Cuando lo experimentas, el drama baja de volumen. No hace falta creencia rara: hace falta práctica honesta.' },
  { id: 4, title: '¿Meditar o medicar?', description: 'Dos herramientas distintas. Ninguna te hace mejor persona por elegirla sola.', duration: '5:45', date: '2024-12-22', category: 'Vida cotidiana',
    script: 'NeuroPodcast. ¿Meditar o medicar? En crisis fuerte a veces hace falta ayuda médica, y está bien. La meditación es entrenamiento diario para no vivir siempre en alarma. Lo sano es decidir con un profesional, sin ideología ni culpa.' },
  { id: 5, title: 'La trampa del "debería"', description: 'Lo que “toca” choca con lo que sientes. Ahí vive el conflicto.', duration: '4:50', date: '2025-01-05', category: 'Emociones',
    script: 'NeuroPodcast. La trampa del debería. Una voz exige, otra siente. Las dos son tuyas. No se trata de obedecer a una sola: se trata de escuchar y elegir con claridad, sin autopunitivo ni huir de lo que toca.' },
  { id: 6, title: 'Cuando todo te pide más estímulo', description: 'Redes, series, azúcar: más dosis, menos satisfacción. Lo he vivido en carne propia.', duration: '6:30', date: '2025-01-12', category: 'Vida cotidiana',
    script: 'NeuroPodcast. Cuando todo te pide más estímulo. No eres débil: estás saturado. Bajar ritmo no es aburrimiento forzado: es recuperar gusto por lo simple. Menos ruido, más presencia.' },
  { id: 7, title: '¿Por qué recordamos lo malo?', description: 'Un comentario feo pesa más que diez halagos. Así funciona la mente cansada.', duration: '5:10', date: '2025-01-19', category: 'Vida cotidiana',
    script: 'NeuroPodcast. ¿Por qué recordamos lo malo? Porque la mente alerta se queda con el golpe. No significa que lo malo sea más verdad. Significa que hay que entrenar la mirada también hacia lo que sí va bien.' },
  { id: 8, title: 'El piloto automático te roba la vida', description: 'Mitad del día en la luna y ni te enteras. La presencia se entrena.', duration: '6:00', date: '2025-01-26', category: 'Presencia',
    script: 'NeuroPodcast. El piloto automático te roba la vida. Cuando no estás, el día pasa en gris. Cada vez que notas que te fuiste y vuelves al cuerpo o a la respiración, recuperas un trozo real. No es postureo: es práctica.' },
  { id: 9, title: 'Tu cuerpo sabe lo que tu mente ignora', description: 'Tensión, cansancio, nudo: señales antes que el discurso.', duration: '5:20', date: '2025-02-02', category: 'Cuerpo',
    script: 'NeuroPodcast. Tu cuerpo sabe lo que tu mente ignora. Si lo tapas con pantallas, el cuerpo sube el volumen. Escucharlo no es mística: es bajar al presente antes de que explote todo.' },
  { id: 10, title: 'Despertar sin necesidad de drama', description: 'No hace falta un golpe extremo para soltar lo que ya no sirve.', duration: '7:30', date: '2025-02-09', category: 'Despertar',
    script: 'NeuroPodcast. Despertar sin necesidad de drama. Mucha gente cambia tras un susto grande; yo prefiero el camino pausado. Práctica diaria, honestidad y dejar de confundirte con el ruido. Eso también transforma.' },
  { id: 11, title: 'Estrés crónico: cuando la alarma no se apaga', description: 'Vives en urgencia aunque no pase nada grave. Primero hay que ver el inventario mental.', duration: '5:50', date: '2025-02-16', category: 'Vida cotidiana',
    script: 'NeuroPodcast. Estrés crónico. El cuerpo no distingue entre peligro real y escenario en la cabeza. Por eso puedes estar fundido sin motivo visible. Nombrar qué es real y qué es guion ayuda. Luego respirar, caminar, bajar ritmo: sin heroísmos, con constancia.' },
  { id: 12, title: 'Qué cambia cuando meditas de verdad', description: 'No te prometo milagros: te prometo menos reactivar y más espacio.', duration: '6:10', date: '2025-02-23', category: 'Vida cotidiana',
    script: 'NeuroPodcast. Qué cambia cuando meditas de verdad. Notas antes el embiste, respiras antes de contestar, sueltas antes el drama. No es anatomía de manual: es vida con un poco más de margen.' },
  { id: 13, title: 'La emoción no es tuya, es información', description: 'Lo que sientes pasa; lo que cuentas sobre ello se queda.', duration: '5:00', date: '2025-03-02', category: 'Emociones',
    script: 'NeuroPodcast. La emoción no es tuya, es información. La ola sube y baja; el sufrimiento largo suele ser la historia que le añades. Escucha el cuerpo, nombra sin drama, y no alimentes el bucle con más miedo.' },
  { id: 14, title: 'El mito de la fuerza de voluntad', description: 'Agotarte decidiendo no te hace flojo: te hace humano.', duration: '5:35', date: '2025-03-09', category: 'Consciencia',
    script: 'NeuroPodcast. El mito de la fuerza de voluntad. Si todo el día peleas contra tentaciones, al final pierdes. Mejor diseña el entorno: que lo fácil sea lo que te cuida. Así ganas sin guerra interior constante.' },
  { id: 15, title: 'Sueño: el mantenimiento que ignoras', description: 'Sin dormir bien todo lo demás se encarece: ánimo, paciencia, foco.', duration: '6:20', date: '2025-03-16', category: 'Cuerpo',
    script: 'NeuroPodcast. Sueño. No es flojera: es cuando el sistema se resetea. Si lo robas todas las noches, pagas intereses al día siguiente. Protege el ritual, baja pantallas, y trátalo como parte del método.' },
  { id: 16, title: 'Ansiedad social: miedo a quedar fuera', description: 'El rechazo duele porque importas; no porque estés roto.', duration: '5:15', date: '2025-03-23', category: 'Emociones',
    script: 'NeuroPodcast. Ansiedad social. Sentirse observado o juzgado pica fuerte. No eres el problema: es un sistema de alerta viejo. Nombrarlo ya afloja; practicar exposición suave con compasión afloja más.' },
  { id: 17, title: 'Cómo el habla interna te construye o te destruye', description: 'El tono con el que te hablas importa tanto como las palabras.', duration: '5:40', date: '2025-03-30', category: 'Consciencia',
    script: 'NeuroPodcast. Habla interna. Si te tratas peor que a un desconocido, el cuerpo obedece esa señal. Prueba un tono más humano: el mismo mensaje, menos látigo. Eso también se entrena.' },
  { id: 18, title: 'Gratitud sin postureo', description: 'Agradecer lo bueno sin negar lo que duele.', duration: '4:55', date: '2025-04-06', category: 'Presencia',
    script: 'NeuroPodcast. Gratitud sin postureo. No es tapar el dolor con pegatinas. Es decir: esto cuesta, y aun así hay algo que valoro. Esa mezcla es adulta y sostiene más que el “piensa positivo” de cartel.' },
  { id: 19, title: 'Lo que crees cambia cómo te sientes', description: 'Expectativas y cuidado importan; no te vendas humo tampoco.', duration: '6:05', date: '2025-04-13', category: 'Vida cotidiana',
    script: 'NeuroPodcast. Lo que crees cambia cómo te sientes. Confiar en un proceso ayuda; mentirte no. Busca creencias útiles y honestas: “puedo dar un paso hoy” suele ser más real que “todo está perfecto”.' },
  { id: 20, title: 'El aburrimiento como superpoder', description: 'Sin huecos sin pantalla, la cabeza no ordena nada.', duration: '4:45', date: '2025-04-20', category: 'Presencia',
    script: 'NeuroPodcast. El aburrimiento como superpoder. Si cada segundo tiene estímulo, no integras nada. Deja espacio en blanco: caminar sin podcast, esperar sin móvil. Ahí vuelven ideas y calma.' },
]

const categories = ['Todos', 'Vida cotidiana', 'Consciencia', 'Emociones', 'Presencia', 'Cuerpo', 'Despertar']

function getPodcastContentStaticCandidates(ep: Episode): string[] {
  return [
    ...getStaticAudioCandidates('podcast', ep.title),
    ...getStaticAudioCandidates('podcast', `episodio_${ep.id}`),
    ...getStaticAudioCandidates('podcast', `podcast_${ep.id}`),
  ]
}

export default function PodcastPage() {
  const [playing, setPlaying] = useState<number | null>(null)
  const [loadingEpisode, setLoadingEpisode] = useState<number | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const genRef = useRef(0)
  const abortControllerRef = useRef<AbortController | null>(null)
  const playStartTimeRef = useRef<number>(0)
  const playingEpisodeRef = useRef<Episode | null>(null)
  const ttsAudioRef = useRef<{ audio: HTMLAudioElement; url?: string; voiceRefs?: import('@/lib/audio-utils').VoiceRefs } | null>(null)
  const ambientRef = useRef<AmbientRef>(null)

  const filtered = filter === 'Todos' ? episodes : episodes.filter(e => e.category === filter)

  const stopPodcast = useCallback(() => {
    genRef.current += 1
    abortControllerRef.current?.abort()
    abortControllerRef.current = null
    const ref = ttsAudioRef.current
    ttsAudioRef.current = null
    if (ambientRef.current) {
      ambientRef.current.stop()
      ambientRef.current = null
    }
    const ep = playingEpisodeRef.current
    if (ep && playStartTimeRef.current > 0) {
      trackSessionInterrupted('podcast', ep.title, Math.floor((Date.now() - playStartTimeRef.current) / 1000))
    }
    playingEpisodeRef.current = null
    playStartTimeRef.current = 0
    setPlaying(null)
    setLoadingEpisode(null)
    setIsPaused(false)
    if (ref) {
      stopVoiceWithFadeOut(ref.audio, ref.voiceRefs ?? null, ref.url, () => {})
    }
  }, [])

  useEffect(() => {
    episodes.slice(0, 2).forEach((episode) => {
      primeStaticAudioLookup([
        ...getPodcastContentStaticCandidates(episode),
        ...getGlobalVoiceStaticCandidates(),
      ])
      primeElevenLabsTTS(episode.script)
    })
  }, [])

  useEffect(() => {
    return () => {
      unregister('podcast')
      stopPodcast()
    }
  }, [stopPodcast])

  const handlePlay = useCallback(async (ep: Episode) => {
    if (typeof window === 'undefined') return
    stopPodcast()
    claimAndPlay('podcast', stopPodcast)
    const thisGen = ++genRef.current
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal
    playingEpisodeRef.current = ep
    playStartTimeRef.current = Date.now()
    trackSessionStart('podcast', ep.title)
    setPlaying(ep.id)
    setLoadingEpisode(ep.id)
    setIsPaused(false)

    const CtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (CtxClass) {
      const ctx = new CtxClass()
      if (ctx.state === 'suspended') await ctx.resume()
      const pad = createAmbientPad(ctx, 0.2)
      ambientRef.current = { ...pad, ctx }
    }

    try {
      const contentStaticUrl = await resolveStaticAudioUrl(getPodcastContentStaticCandidates(ep))
      const staticUrl = contentStaticUrl ?? await resolveStaticAudioUrl(getGlobalVoiceStaticCandidates())
      if (genRef.current !== thisGen || signal.aborted) return

      let audioSourceUrl: string | undefined
      let audio: HTMLAudioElement

      if (staticUrl) {
        audio = new Audio(staticUrl)
      } else {
        const blob = await fetchElevenLabsTTS(ep.script, { signal })
        if (genRef.current !== thisGen || signal.aborted) return
        audioSourceUrl = URL.createObjectURL(blob)
        audio = new Audio(audioSourceUrl)
      }

      audio.onended = () => {
        trackSessionComplete('podcast', ep.title, Math.floor((Date.now() - playStartTimeRef.current) / 1000))
        playingEpisodeRef.current = null
        playStartTimeRef.current = 0
        stopPodcast()
      }
      audio.onerror = () => stopPodcast()
      setLoadingEpisode(null)
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
      console.error('Fallo al reproducir podcast con ElevenLabs:', error)
      stopPodcast()
    }
  }, [stopPodcast])

  const handleStop = useCallback(() => {
    stopPodcast()
  }, [stopPodcast])

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

  const handleEpisodeClick = (ep: Episode) => {
    if (loadingEpisode === ep.id) return
    const isActive = playing === ep.id
    if (isActive && !isPaused) handlePause()
    else if (isActive && isPaused) handleResume()
    else handlePlay(ep)
  }

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-accent-purple top-10 -left-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 rounded-2xl bg-accent-blue/15 flex items-center justify-center">
              <Headphones className="w-6 h-6 text-accent-blue" />
            </div>
            <div>
              <h1 className="font-heading text-2xl font-bold text-white animate-fade-in">NeuroPodcast</h1>
              <p className="text-text-secondary text-sm animate-fade-in-up">Capsules cortas: vida real, sin postureo</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Filters */}
      <section className="pb-5">
        <Container>
          <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
            {categories.map(c => (
              <button
                key={c}
                onClick={() => setFilter(c)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                  filter === c ? 'bg-accent-blue text-white' : 'bg-white/5 text-text-secondary'
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </Container>
      </section>

      {/* Episodes */}
      <section className="pb-12">
        <Container>
          <div className="space-y-3">
            {filtered.map((ep) => {
              const isActive = playing === ep.id
              const isPausedEp = isActive && isPaused
              return (
                <FadeInSection key={ep.id}>
                  <div className="glass rounded-2xl p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleEpisodeClick(ep)}
                        aria-label={
                          loadingEpisode === ep.id
                            ? `Preparando episodio ${ep.title}`
                            : !isActive
                              ? `Reproducir episodio ${ep.title}`
                              : isPausedEp
                                ? `Reanudar episodio ${ep.title}`
                                : `Pausar episodio ${ep.title}`
                        }
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 ${
                          isActive ? 'bg-accent-blue text-white' : 'bg-accent-blue/15 text-accent-blue'
                        }`}
                      >
                        {!isActive ? <Play className="w-4 h-4 ml-0.5" /> : isPausedEp ? <Play className="w-4 h-4 ml-0.5" /> : <Pause className="w-4 h-4" />}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-0.5">{ep.title}</p>
                        <p className="text-text-muted text-xs line-clamp-2 mb-2">{ep.description}</p>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-text-muted" />
                            <span className="text-text-muted text-[10px]">{ep.duration}</span>
                          </div>
                          <span className="px-2 py-0.5 bg-white/5 rounded text-text-muted text-[10px]">{ep.category}</span>
                        </div>
                      </div>
                    </div>

                    {isActive && (
                      <div className="mt-3 pt-3 border-t border-white/5 space-y-2">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-accent-blue text-[10px] font-medium">
                            {loadingEpisode === ep.id ? 'Preparando audio...' : isPausedEp ? 'En pausa' : 'Reproduciendo...'}
                          </span>
                          <button
                            onClick={handleStop}
                            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-rose-500/20 text-rose-400 text-[10px] font-medium active:scale-95"
                          >
                            <Square className="w-3 h-3" /> Parar
                          </button>
                        </div>
                        <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className={`h-1 bg-accent-blue rounded-full ${isPausedEp ? 'w-1/3' : 'w-1/3 animate-pulse'}`} />
                        </div>
                      </div>
                    )}
                  </div>
                </FadeInSection>
              )
            })}
          </div>
        </Container>
      </section>
    </div>
  )
}
