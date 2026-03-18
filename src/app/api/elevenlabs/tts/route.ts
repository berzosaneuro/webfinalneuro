import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API = 'https://api.elevenlabs.io'
const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n))
const ELEVENLABS_MODEL_ID = process.env.ELEVENLABS_MODEL_ID || 'eleven_multilingual_v2'
const ELEVENLABS_STABILITY = clamp(Number.isFinite(Number(process.env.ELEVENLABS_STABILITY)) ? Number(process.env.ELEVENLABS_STABILITY) : 0.5, 0, 1)
const ELEVENLABS_SIMILARITY = clamp(Number.isFinite(Number(process.env.ELEVENLABS_SIMILARITY_BOOST)) ? Number(process.env.ELEVENLABS_SIMILARITY_BOOST) : 0.85, 0, 1)
const ELEVENLABS_STYLE = clamp(Number.isFinite(Number(process.env.ELEVENLABS_STYLE)) ? Number(process.env.ELEVENLABS_STYLE) : 0.3, 0, 1)
const ELEVENLABS_SPEAKER_BOOST = (process.env.ELEVENLABS_SPEAKER_BOOST || 'true') !== 'false'

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

  try {
    const res = await fetch(`${ELEVENLABS_API}/v1/text-to-speech/${voiceId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'xi-api-key': apiKey,
      },
      body: JSON.stringify({
        text: text.slice(0, 5000),
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
    return new NextResponse(audio, {
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'private, max-age=3600',
      },
    })
  } catch {
    return NextResponse.json(
      { error: 'No se pudo conectar con ElevenLabs' },
      { status: 502 }
    )
  }
}
