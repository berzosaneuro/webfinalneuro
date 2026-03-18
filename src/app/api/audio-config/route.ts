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
const TRACK_COUNT = KNOWN_VALID_TRACKS.length
const ADMIN_SLOTS = ['ambient1', 'ambient2', 'ambient3', 'ambient4', 'ambient5', 'ambient']
const LEGACY_SLOTS = Array.from({ length: TRACK_COUNT }, (_, i) => `track${i}`)
const SLOT_WHITELIST = Array.from(new Set([...ADMIN_SLOTS, ...LEGACY_SLOTS]))
const DEFAULT_URLS: Record<string, string> = Object.fromEntries(KNOWN_VALID_TRACKS.map((url, i) => [`track${i}`, url]))

function normalizeTrackUrl(url: string | null | undefined): string | null {
  const cleaned = (url ?? '').trim()
  if (!cleaned) return null
  if (cleaned.startsWith('/')) return cleaned
  if (/^https?:\/\//i.test(cleaned)) return cleaned
  return null
}

function uniqueUrls(urls: Array<string | null | undefined>): string[] {
  const seen = new Set<string>()
  const deduped: string[] = []
  for (const url of urls) {
    if (!url || seen.has(url)) continue
    seen.add(url)
    deduped.push(url)
  }
  return deduped
}

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json(DEFAULT_URLS)
  try {
    const { data } = await supabase.from('audio_config').select('slot, url').in('slot', SLOT_WHITELIST)
    const slotMap = new Map<string, string>()
    ;(data || []).forEach((row: { slot: string; url: string }) => {
      const normalized = normalizeTrackUrl(row.url)
      if (normalized) slotMap.set(row.slot, normalized)
    })

    const adminUrls = ADMIN_SLOTS.map(slot => slotMap.get(slot))
    const legacyUrls = LEGACY_SLOTS.map(slot => slotMap.get(slot))
    const ordered = uniqueUrls([...adminUrls, ...legacyUrls, ...KNOWN_VALID_TRACKS]).slice(0, TRACK_COUNT)
    const response: Record<string, string> = Object.fromEntries(ordered.map((url, i) => [`track${i}`, url]))

    return NextResponse.json(response)
  } catch {
    return NextResponse.json(DEFAULT_URLS)
  }
}
