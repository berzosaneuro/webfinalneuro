'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import { CloudRain, Wind, Waves, Flame, TreePine, Bird, Volume2, VolumeX, Moon, Zap, Coffee, Music } from 'lucide-react'

type SoundConfig = {
  id: string
  label: string
  emoji: string
  icon: typeof CloudRain
  color: string
  desc: string
}

const sounds: SoundConfig[] = [
  { id: 'rain', label: 'Lluvia suave', emoji: '🌧', icon: CloudRain, color: 'text-blue-400 bg-blue-500/15', desc: 'Lluvia relajante sobre el tejado' },
  { id: 'heavyrain', label: 'Tormenta', emoji: '⛈', icon: CloudRain, color: 'text-indigo-400 bg-indigo-500/15', desc: 'Lluvia intensa con truenos lejanos' },
  { id: 'wind', label: 'Viento', emoji: '💨', icon: Wind, color: 'text-cyan-400 bg-cyan-500/15', desc: 'Brisa suave entre árboles' },
  { id: 'waves', label: 'Olas del mar', emoji: '🌊', icon: Waves, color: 'text-sky-400 bg-sky-500/15', desc: 'Olas rompiendo en la orilla' },
  { id: 'fire', label: 'Chimenea', emoji: '🔥', icon: Flame, color: 'text-orange-400 bg-orange-500/15', desc: 'Crepitar del fuego' },
  { id: 'forest', label: 'Bosque', emoji: '🌲', icon: TreePine, color: 'text-green-400 bg-green-500/15', desc: 'Sonidos del bosque en calma' },
  { id: 'birds', label: 'Pájaros', emoji: '🐦', icon: Bird, color: 'text-emerald-400 bg-emerald-500/15', desc: 'Canto de pájaros al amanecer' },
  { id: 'bowl', label: 'Cuenco tibetano', emoji: '🔔', icon: Moon, color: 'text-violet-400 bg-violet-500/15', desc: 'Vibración a 432 Hz' },
  { id: 'binaural', label: 'Binaural 40Hz', emoji: '🧠', icon: Zap, color: 'text-rose-400 bg-rose-500/15', desc: 'Ondas gamma para el foco' },
  { id: 'cafe', label: 'Café', emoji: '☕', icon: Coffee, color: 'text-orange-400 bg-orange-500/15', desc: 'Ambiente de cafetería tranquila' },
  { id: 'white', label: 'Ruido blanco', emoji: '〰', icon: Music, color: 'text-gray-400 bg-gray-500/15', desc: 'Ruido blanco para concentrarse' },
  { id: 'brown', label: 'Ruido marrón', emoji: '🌫', icon: Wind, color: 'text-stone-400 bg-stone-500/15', desc: 'Graves profundos y relajantes' },
]

type StoppableNode = AudioBufferSourceNode | OscillatorNode

type ActiveNode = {
  nodes: AudioNode[]
  stoppable: StoppableNode[]
  gain: GainNode
  volume: number
  intervalId?: ReturnType<typeof setInterval>
}

function buildSound(ctx: AudioContext, id: string): { nodes: AudioNode[]; stoppable: StoppableNode[]; gain: GainNode } {
  const masterGain = ctx.createGain()
  masterGain.gain.value = 0
  masterGain.connect(ctx.destination)

  const nodes: AudioNode[] = [masterGain]
  const stoppable: StoppableNode[] = []

  const makeNoise = (color: 'white' | 'brown' | 'pink' = 'brown', freq?: number, q?: number) => {
    const bufferSize = ctx.sampleRate * 3
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
    const data = buffer.getChannelData(0)
    let last = 0
    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1
      if (color === 'brown') {
        data[i] = (last + 0.02 * white) / 1.02 * 3.5
        last = data[i]
      } else if (color === 'pink') {
        data[i] = white * 0.5 + last * 0.5
        last = data[i]
      } else {
        data[i] = white
      }
    }
    const src = ctx.createBufferSource()
    src.buffer = buffer
    src.loop = true
    nodes.push(src)

    if (freq) {
      const filter = ctx.createBiquadFilter()
      filter.type = 'bandpass'
      filter.frequency.value = freq
      if (q) filter.Q.value = q
      src.connect(filter)
      filter.connect(masterGain)
      nodes.push(filter)
    } else {
      src.connect(masterGain)
    }
    src.start()
    stoppable.push(src)
    return src
  }

  switch (id) {
    case 'rain': {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 3, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource()
      src.buffer = buf; src.loop = true; nodes.push(src)
      stoppable.push(src)
      const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = 1200; nodes.push(hp)
      const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 8000; nodes.push(lp)
      src.connect(hp); hp.connect(lp); lp.connect(masterGain); src.start()
      break
    }
    case 'heavyrain': {
      // Heavy rain: white noise + low rumble
      makeNoise('white')
      makeNoise('brown', 80, 0.5)
      break
    }
    case 'wind': {
      makeNoise('brown', 300, 1)
      makeNoise('pink', 150, 2)
      break
    }
    case 'waves': {
      makeNoise('brown', 200, 0.8)
      const lfo = ctx.createOscillator()
      lfo.frequency.value = 0.15
      stoppable.push(lfo)
      const lfoGain = ctx.createGain()
      lfoGain.gain.value = 0.08
      lfo.connect(lfoGain); lfoGain.connect(masterGain.gain)
      lfo.start(); nodes.push(lfo, lfoGain)
      break
    }
    case 'fire': {
      // Fire: low brown noise with subtle crackle
      makeNoise('brown', 250, 1.5)
      makeNoise('pink', 1500, 8)
      break
    }
    case 'forest': {
      makeNoise('pink', 400, 1)
      makeNoise('brown', 120, 2)
      break
    }
    case 'birds': {
      // Birds: periodic sine chirps at bird frequencies
      const chirp = () => {
        const freq = 2000 + Math.random() * 2000
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.setValueAtTime(freq, ctx.currentTime)
        osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.08)
        osc.frequency.exponentialRampToValueAtTime(freq * 0.9, ctx.currentTime + 0.15)
        const env = ctx.createGain()
        env.gain.setValueAtTime(0, ctx.currentTime)
        env.gain.linearRampToValueAtTime(0.15, ctx.currentTime + 0.03)
        env.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2)
        osc.connect(env); env.connect(masterGain)
        osc.start(); osc.stop(ctx.currentTime + 0.25)
      }
      // Also add ambient forest background
      makeNoise('pink', 400, 0.8)
      const interval = setInterval(() => {
        if (Math.random() > 0.3) chirp()
        if (Math.random() > 0.7) setTimeout(chirp, 150 + Math.random() * 200)
      }, 800 + Math.random() * 600)
      // Store interval reference in a special way
      ;(masterGain as any).__interval = interval
      break
    }
    case 'bowl': {
      const freqs = [432, 864, 1296]
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = f
        stoppable.push(osc)
        const g = ctx.createGain()
        g.gain.value = 0.15 / (i + 1)
        osc.connect(g); g.connect(masterGain)
        osc.start(); nodes.push(osc, g)
      })
      break
    }
    case 'binaural': {
      const left = ctx.createOscillator()
      left.frequency.value = 200
      const right = ctx.createOscillator()
      right.frequency.value = 240
      stoppable.push(left, right)
      const merger = ctx.createChannelMerger(2)
      const gl = ctx.createGain(); gl.gain.value = 0.12
      const gr = ctx.createGain(); gr.gain.value = 0.12
      left.connect(gl); gl.connect(merger, 0, 0)
      right.connect(gr); gr.connect(merger, 0, 1)
      merger.connect(masterGain)
      left.start(); right.start()
      nodes.push(left, right, merger, gl, gr)
      break
    }
    case 'cafe': {
      // Cafe: pink noise at mid freq (murmur) + occasional higher clicks
      makeNoise('pink', 600, 2)
      makeNoise('brown', 100, 1)
      break
    }
    case 'white': {
      const buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate)
      const d = buf.getChannelData(0)
      for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1
      const src = ctx.createBufferSource(); src.buffer = buf; src.loop = true
      stoppable.push(src); nodes.push(src)
      src.connect(masterGain); src.start()
      break
    }
    case 'brown': {
      makeNoise('brown')
      break
    }
  }

  return { nodes, stoppable, gain: masterGain }
}

function stopSound(active: ActiveNode, ctx: AudioContext) {
  try {
    if ((active.gain as any).__interval) clearInterval((active.gain as any).__interval)
    active.gain.gain.setTargetAtTime(0, ctx.currentTime, 0.05)
    active.stoppable.forEach(n => {
      try { n.stop(ctx.currentTime + 0.1) } catch {}
    })
  } catch {}
}

const DEFAULT_VOLUME = 0.7
const VOLUME_MULT = 0.85

export default function SonidosPage() {
  const [volumes, setVolumes] = useState<Record<string, number>>({})
  const [muted, setMuted] = useState(false)
  const [activeSounds, setActiveSounds] = useState<Record<string, ActiveNode>>({})
  const activeSoundsRef = useRef<Record<string, ActiveNode>>({})
  const audioCtxRef = useRef<AudioContext | null>(null)

  activeSoundsRef.current = activeSounds

  const getOrCreateCtx = useCallback(() => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new AudioContext()
    }
    if (audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume()
    }
    return audioCtxRef.current
  }, [])

  useEffect(() => {
    return () => {
      const ctx = audioCtxRef.current
      if (ctx) {
        Object.values(activeSoundsRef.current).forEach(s => stopSound(s, ctx))
        ctx.close()
      }
      audioCtxRef.current = null
    }
  }, [])

  const toggleSound = (sound: SoundConfig) => {
    const ctx = getOrCreateCtx()

    if (activeSounds[sound.id]) {
      stopSound(activeSounds[sound.id], ctx)
      setActiveSounds(prev => {
        const next = { ...prev }
        delete next[sound.id]
        return next
      })
      setVolumes(prev => {
        const next = { ...prev }
        delete next[sound.id]
        return next
      })
      return
    }

    const { nodes, stoppable, gain } = buildSound(ctx, sound.id)
    gain.gain.setTargetAtTime(muted ? 0 : DEFAULT_VOLUME * VOLUME_MULT, ctx.currentTime, 0.2)

    const intervalId = (gain as any).__interval
    setActiveSounds(prev => ({
      ...prev,
      [sound.id]: { nodes, stoppable, gain, volume: DEFAULT_VOLUME, intervalId }
    }))
    setVolumes(prev => ({ ...prev, [sound.id]: DEFAULT_VOLUME }))
  }

  const updateVolume = (soundId: string, value: number) => {
    setVolumes(prev => ({ ...prev, [soundId]: value }))
    if (activeSounds[soundId] && !muted) {
      const ctx = getOrCreateCtx()
      activeSounds[soundId].gain.gain.setTargetAtTime(value * VOLUME_MULT, ctx.currentTime, 0.1)
    }
  }

  const toggleMute = () => {
    const ctx = getOrCreateCtx()
    const newMuted = !muted
    setMuted(newMuted)
    Object.entries(activeSounds).forEach(([id, sound]) => {
      sound.gain.gain.setTargetAtTime(
        newMuted ? 0 : (volumes[id] || DEFAULT_VOLUME) * VOLUME_MULT,
        ctx.currentTime,
        0.1
      )
    })
  }

  const stopAll = () => {
    const ctx = audioCtxRef.current
    if (!ctx) return
    Object.values(activeSounds).forEach(s => stopSound(s, ctx))
    setActiveSounds({})
    setVolumes({})
  }

  const activeCount = Object.keys(activeSounds).length

  return (
    <div className="relative overflow-hidden">
      <div className="orb w-72 h-72 bg-blue-600 top-10 -left-24" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Sonidos</h1>
              <p className="text-text-secondary text-sm animate-fade-in-up">Mezcla tu ambiente perfecto. Toca para activar.</p>
            </div>
            {activeCount > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={stopAll}
                  className="px-3 py-1.5 rounded-lg bg-rose-500/20 text-rose-400 text-xs font-medium active:scale-95"
                >
                  Parar todo
                </button>
                <button
                  onClick={toggleMute}
                  className="w-10 h-10 flex items-center justify-center rounded-xl bg-white/5 text-text-secondary active:scale-90 transition-transform"
                >
                  {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
              </div>
            )}
          </div>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="grid grid-cols-2 gap-3">
              {sounds.map((sound) => {
                const isActive = !!activeSounds[sound.id]
                return (
                  <div key={sound.id} className={`glass rounded-2xl p-4 transition-all ${isActive ? 'ring-1 ring-white/20' : ''}`}>
                    <button
                      onClick={() => toggleSound(sound)}
                      className="w-full flex flex-col items-center gap-2.5 mb-3 active:scale-95 transition-transform"
                    >
                      <div className={`w-14 h-14 rounded-2xl ${sound.color} flex items-center justify-center transition-all ${
                        isActive ? 'scale-110 ring-2 ring-white/15' : ''
                      }`}>
                        <span className="text-2xl" role="img" aria-label={sound.label}>{sound.emoji}</span>
                      </div>
                      <div className="text-center">
                        <p className={`text-sm font-semibold ${isActive ? 'text-white' : 'text-text-secondary'}`}>
                          {sound.label}
                        </p>
                        <p className="text-text-muted text-[10px]">{sound.desc}</p>
                      </div>
                    </button>
                    {isActive && (
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={(volumes[sound.id] ?? DEFAULT_VOLUME) * 100}
                        onChange={(e) => updateVolume(sound.id, parseInt(e.target.value) / 100)}
                        className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                        style={{
                          background: `linear-gradient(to right, rgba(255,255,255,0.4) ${(volumes[sound.id] ?? DEFAULT_VOLUME) * 100}%, rgba(255,255,255,0.06) ${(volumes[sound.id] ?? DEFAULT_VOLUME) * 100}%)`,
                        }}
                      />
                    )}
                  </div>
                )
              })}
            </div>

            {activeCount > 0 ? (
              <div className="mt-6 glass rounded-2xl p-4 text-center">
                <div className="flex items-center justify-center gap-2 mb-1">
                  <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  <p className="text-white text-sm font-medium">
                    {activeCount} sonido{activeCount > 1 ? 's' : ''} reproduciéndose
                  </p>
                </div>
                <p className="text-text-muted text-xs">Puedes combinar varios sonidos a la vez</p>
              </div>
            ) : (
              <div className="mt-6 glass rounded-2xl p-4 text-center">
                <p className="text-text-muted text-sm">Toca cualquier sonido para activarlo</p>
                <p className="text-text-muted text-xs mt-1">Puedes combinar varios a la vez para tu mezcla perfecta</p>
              </div>
            )}
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
