import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API = 'https://api.elevenlabs.io'
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
const ELEVENLABS_STABILITY = clamp(Number.isFinite(Number(process.env.ELEVENLABS_STABILITY)) ? Number(process.env.ELEVENLABS_STABILITY) : 0.5, 0, 1)
const ELEVENLABS_SIMILARITY = clamp(Number.isFinite(Number(process.env.ELEVENLABS_SIMILARITY_BOOST)) ? Number(process.env.ELEVENLABS_SIMILARITY_BOOST) : 0.85, 0, 1)
const ELEVENLABS_STYLE = clamp(Number.isFinite(Number(process.env.ELEVENLABS_STYLE)) ? Number(process.env.ELEVENLABS_STYLE) : 0.3, 0, 1)
const ELEVENLABS_SPEAKER_BOOST = (process.env.ELEVENLABS_SPEAKER_BOOST || 'true') !== 'false'
const TTS_SERVER_CACHE_LIMIT = 50
const ttsServerCache = new Map<string, ArrayBuffer>()

function getCacheKey(voiceId: string, text: string): string {
  return [
    voiceId,
    ELEVENLABS_MODEL_ID,
    ELEVENLABS_STABILITY,
    ELEVENLABS_SIMILARITY,
    ELEVENLABS_STYLE,
    ELEVENLABS_SPEAKER_BOOST ? 1 : 0,
    text.slice(0, 5000),
  ].join('|')
}

function getCachedAudio(key: string): ArrayBuffer | null {
  const cached = ttsServerCache.get(key)
  if (!cached) return null
  ttsServerCache.delete(key)
  ttsServerCache.set(key, cached)
  return cached
}

function setCachedAudio(key: string, bytes: ArrayBuffer): void {
  if (ttsServerCache.has(key)) ttsServerCache.delete(key)
  ttsServerCache.set(key, bytes)
  while (ttsServerCache.size > TTS_SERVER_CACHE_LIMIT) {
    const oldest = ttsServerCache.keys().next().value as string | undefined
    if (!oldest) break
    ttsServerCache.delete(oldest)
  }
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ELEVENLABS_API_KEY
  const voiceId = process.env.ELEVENLABS_VOICE_ID

  if (!apiKey || !voiceId) {
    return NextResponse.json(
      { error: 'ElevenLabs no configurado. Añade ELEVENLABS_API_KEY y ELEVENLABS_VOICE_ID en .env.local' },
      { status: 503 }
    )
  }

  let body: { text?: string }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Body JSON inválido' }, { status: 400 })
  }

  const text = (body.text || '').trim()
  if (!text) {
    return NextResponse.json({ error: 'text es obligatorio' }, { status: 400 })
  }
  const trimmedText = text.slice(0, 5000)
  const cacheKey = getCacheKey(voiceId, trimmedText)
  const cached = getCachedAudio(cacheKey)
  if (cached) {
    const cachedAudio = cached.slice(0)
    return new NextResponse(cachedAudio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
        'X-TTS-Cache': 'HIT',
      },
    })
  }

  try {
    const res = await fetch(`${ELEVENLABS_API}/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: trimmedText,
        model_id: ELEVENLABS_MODEL_ID,
        voice_settings: {
          stability: ELEVENLABS_STABILITY,
          similarity_boost: ELEVENLABS_SIMILARITY,
          style: ELEVENLABS_STYLE,
          use_speaker_boost: ELEVENLABS_SPEAKER_BOOST,
        },
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      return NextResponse.json(
        { error: `ElevenLabs error: ${res.status} - ${err}` },
        { status: res.status >= 500 ? 502 : res.status }
      )
    }

    const audio = await res.arrayBuffer()
    setCachedAudio(cacheKey, audio.slice(0))
    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
        'X-TTS-Cache': 'MISS',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'No se pudo conectar con ElevenLabs' },
      { status: 502 }
    )
  }
}
