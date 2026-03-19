/**
 * Shared audio helpers for fade-in, fade-out, ambient pad, and ElevenLabs TTS.
 * Used by meditation, podcast, masterclass, and SOS.
 */

export const FADE_IN_MS = 120
export const FADE_OUT_MS = 120

const FADE_IN_DURATION = FADE_IN_MS / 1000
const FADE_OUT_DURATION = FADE_OUT_MS / 1000
const TTS_CACHE_MAX_ITEMS = 40
const STATIC_AUDIO_CACHE_MAX_ITEMS = 250
const STATIC_AUDIO_EXTENSIONS = ['mp3', 'm4a', 'wav', 'ogg'] as const

export type VoiceRefs = {
  ctx: AudioContext
  gain: GainNode
}

const ttsBlobCache = new Map<string, Blob>()
const staticAudioExistsCache = new Map<string, boolean>()

function normalizeTtsText(text: string): string {
  return text.trim().slice(0, 5000)
}

function getCachedTTS(key: string): Blob | null {
  const cached = ttsBlobCache.get(key)
  if (!cached) return null
  // LRU simple: refresh insertion order on hit
  ttsBlobCache.delete(key)
  ttsBlobCache.set(key, cached)
  return cached
}

function setCachedTTS(key: string, blob: Blob): void {
  if (ttsBlobCache.has(key)) ttsBlobCache.delete(key)
  ttsBlobCache.set(key, blob)
  while (ttsBlobCache.size > TTS_CACHE_MAX_ITEMS) {
    const oldest = ttsBlobCache.keys().next().value as string | undefined
    if (!oldest) break
    ttsBlobCache.delete(oldest)
  }
}

function getCachedStaticAudioAvailability(key: string): boolean | null {
  if (!staticAudioExistsCache.has(key)) return null
  const value = staticAudioExistsCache.get(key) === true
  staticAudioExistsCache.delete(key)
  staticAudioExistsCache.set(key, value)
  return value
}

function setCachedStaticAudioAvailability(key: string, exists: boolean): void {
  if (staticAudioExistsCache.has(key)) staticAudioExistsCache.delete(key)
  staticAudioExistsCache.set(key, exists)
  while (staticAudioExistsCache.size > STATIC_AUDIO_CACHE_MAX_ITEMS) {
    const oldest = staticAudioExistsCache.keys().next().value as string | undefined
    if (!oldest) break
    staticAudioExistsCache.delete(oldest)
  }
}

function stripAccents(value: string): string {
  return value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

function toHumanAudioKey(value: string): string {
  return value
    .trim()
    .replace(/[^\w\s\u00C0-\u024F-]/g, '')
    .replace(/\s+/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120)
}

export function toAudioSlug(value: string): string {
  return stripAccents(value)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 120)
}

export function getStaticAudioCandidates(section: 'meditacion' | 'podcast' | 'masterclass', key: string): string[] {
  const humanKey = toHumanAudioKey(key)
  const slug = toAudioSlug(key)
  const keyCandidates = Array.from(new Set([
    slug,
    humanKey,
    humanKey.toLowerCase(),
    stripAccents(humanKey),
    stripAccents(humanKey).toLowerCase(),
  ].filter(Boolean)))
  return keyCandidates.flatMap((candidate) => STATIC_AUDIO_EXTENSIONS.map((ext) => `/audio/${section}/${candidate}.${ext}`))
}

export function getGlobalVoiceStaticCandidates(): string[] {
  const baseNames = [
    'mi_voz',
    'mi_voz_base',
    'voz_base',
    'voz_principal',
    'narradora',
    'luisa_narradora',
  ]
  return baseNames.flatMap((name) => STATIC_AUDIO_EXTENSIONS.map((ext) => `/audio/voz/${name}.${ext}`))
}

async function probeStaticAudio(url: string): Promise<boolean> {
  const cached = getCachedStaticAudioAvailability(url)
  if (cached !== null) return cached
  try {
    const head = await fetch(url, { method: 'HEAD', cache: 'force-cache' })
    if (head.ok) {
      setCachedStaticAudioAvailability(url, true)
      return true
    }
    // Algunos entornos no resuelven HEAD para estáticos; probamos GET como respaldo.
    const get = await fetch(url, {
      method: 'GET',
      cache: 'force-cache',
      headers: { Range: 'bytes=0-0' },
    })
    const exists = get.ok
    setCachedStaticAudioAvailability(url, exists)
    return exists
  } catch {
    setCachedStaticAudioAvailability(url, false)
    return false
  }
}

export async function resolveStaticAudioUrl(candidates: string[]): Promise<string | null> {
  for (const candidate of candidates) {
    if (await probeStaticAudio(candidate)) return candidate
  }
  return null
}

export function primeStaticAudioLookup(candidates: string[]): void {
  void resolveStaticAudioUrl(candidates).catch(() => {})
}

/** Pre-warm cache without throwing (best-effort). */
export function primeElevenLabsTTS(text: string): void {
  void fetchElevenLabsTTS(text).catch(() => {})
}

/** Play HTMLAudioElement with smooth fade-in via Web Audio API. Returns refs for fade-out. Compatible con Safari/Chrome. */
export async function playAudioWithFadeIn(audio: HTMLAudioElement): Promise<VoiceRefs> {
  const CtxClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
  if (!CtxClass) throw new Error('Web Audio API no soportada')
  const ctx = new CtxClass()
  const source = ctx.createMediaElementSource(audio)
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  source.connect(gain)
  gain.connect(ctx.destination)
  if (ctx.state === 'suspended') await ctx.resume()
  gain.gain.setTargetAtTime(1, ctx.currentTime, FADE_IN_DURATION * 0.4)
  await audio.play()
  return { ctx, gain }
}

/** Fade out voice and run cleanup after fade completes */
export function stopVoiceWithFadeOut(
  audio: HTMLAudioElement | null,
  voiceRefs: VoiceRefs | null,
  url: string | undefined,
  onCleanup: () => void
): void {
  if (!audio) {
    onCleanup()
    return
  }
  if (voiceRefs) {
    voiceRefs.gain.gain.setTargetAtTime(0, voiceRefs.ctx.currentTime, FADE_OUT_DURATION * 0.4)
    setTimeout(() => {
      audio.pause()
      audio.currentTime = 0
      audio.src = ''
      if (url) URL.revokeObjectURL(url)
      try { voiceRefs.ctx.close() } catch { /* ignore */ }
      onCleanup()
    }, FADE_OUT_MS + 20)
  } else {
    audio.pause()
    audio.currentTime = 0
    audio.src = ''
    if (url) URL.revokeObjectURL(url)
    onCleanup()
  }
}

/** Create ambient synth pad with smooth fade-in. Volume 0.15–0.25. Evita clicks en Safari/Chrome. */
export function createAmbientPad(ctx: AudioContext, volume = 0.2): { gain: GainNode; oscs: OscillatorNode[]; stop: () => void } {
  const gain = ctx.createGain()
  gain.gain.setValueAtTime(0, ctx.currentTime)
  gain.connect(ctx.destination)
  const freqs = [65.41, 82.41, 98, 130.81, 164.81]
  const oscs: OscillatorNode[] = []
  freqs.forEach((f, i) => {
    const osc = ctx.createOscillator()
    osc.type = 'triangle'
    osc.frequency.setValueAtTime(f, ctx.currentTime)
    const g = ctx.createGain()
    g.gain.setValueAtTime((0.3 / (i + 1)) * (volume / 0.28), ctx.currentTime)
    osc.connect(g)
    g.connect(gain)
    osc.start(ctx.currentTime + 0.02)
    oscs.push(osc)
  })
  gain.gain.setTargetAtTime(volume, ctx.currentTime + 0.05, 0.2)

  const stop = () => {
    gain.gain.setTargetAtTime(0, ctx.currentTime, FADE_OUT_DURATION * 0.4)
    setTimeout(() => {
      oscs.forEach(o => { try { o.stop(ctx.currentTime) } catch { /* ignore */ } })
      try { ctx.close() } catch { /* ignore */ }
    }, FADE_OUT_MS + 20)
  }
  return { gain, oscs, stop }
}

/** ElevenLabs TTS fetch with abort and timeout. Throws on failure/abort. */
const ELEVENLABS_TIMEOUT_MS = 45000

export async function fetchElevenLabsTTS(
  text: string,
  options?: { signal?: AbortSignal; timeoutMs?: number }
): Promise<Blob> {
  const normalizedText = normalizeTtsText(text)
  if (!normalizedText) throw new Error('Texto vacío para ElevenLabs')

  const cached = getCachedTTS(normalizedText)
  if (cached) return cached

  const controller = new AbortController()
  const timeoutMs = options?.timeoutMs ?? ELEVENLABS_TIMEOUT_MS
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
  const signal = options?.signal
  const onAbort = () => {
    controller.abort()
  }
  if (signal?.aborted) throw new Error('Solicitud cancelada')
  signal?.addEventListener('abort', onAbort, { once: true })

  try {
    const res = await fetch('/api/elevenlabs/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: normalizedText }),
      signal: controller.signal,
    })
    if (!res.ok) {
      const detail = await res.text()
      throw new Error(`ElevenLabs no disponible (${res.status}): ${detail || 'sin detalle'}`)
    }
    const contentType = res.headers.get('content-type') || ''
    if (!contentType.includes('audio')) {
      throw new Error(`Respuesta inválida de ElevenLabs (${contentType || 'sin content-type'})`)
    }
    const blob = await res.blob()
    setCachedTTS(normalizedText, blob)
    return blob
  } catch (error) {
    if (controller.signal.aborted) {
      throw new Error('Timeout o cancelación al obtener audio de ElevenLabs')
    }
    if (error instanceof Error) {
      throw error
    }
    throw new Error('Error de red al obtener audio de ElevenLabs')
  } finally {
    clearTimeout(timeoutId)
    signal?.removeEventListener('abort', onAbort)
  }
}
