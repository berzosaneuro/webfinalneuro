import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

/** Solo tracks que existen en public/ — evita 404 y fallback a synth ruidoso */
const KNOWN_VALID_TRACKS = [
  '/Calm-ambient-music-ocean-waves-for-sleep-and-relaxation.mp3',
  '/Calm-ambient-music-ocean-waves-for-sleep-and-relaxation (1).mp3',
  '/Free-meditation-music.mp3',
  '/Free-meditation-music (1).mp3',
  '/Relaxing-analog-synth-piano-music.mp3',
  '/Warm-ambient-relaxing-synth-pad-music.mp3',
]
const DEFAULT_URLS: Record<string, string> = Object.fromEntries(KNOWN_VALID_TRACKS.map((url, i) => [`track${i}`, url]))

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json(DEFAULT_URLS)
  try {
    const { data } = await supabase.from('audio_config').select('slot, url')
    const map: Record<string, string> = { ...DEFAULT_URLS }
    ;(data || []).forEach((r: { slot: string; url: string }) => {
      if (r.url?.trim()) map[r.slot] = r.url.trim()
    })
    return NextResponse.json(map)
  } catch {
    return NextResponse.json(DEFAULT_URLS)
  }
}
