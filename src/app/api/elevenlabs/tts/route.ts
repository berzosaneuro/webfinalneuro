import { NextRequest, NextResponse } from 'next/server'

const ELEVENLABS_API = 'https://api.elevenlabs.io'

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

  const res = await fetch(`${ELEVENLABS_API}/v1/text-to-speech/${voiceId}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'xi-api-key': apiKey,
    },
    body: JSON.stringify({
      text: text.slice(0, 5000),
      model_id: 'eleven_multilingual_v2',
      voice_settings: { stability: 0.75, similarity_boost: 0.8 },
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
}
