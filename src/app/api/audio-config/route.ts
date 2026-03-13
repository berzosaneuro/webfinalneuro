import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const DEFAULT_URLS: Record<string, string> = {
  ambient1: '/ambient1.mp3',
  ambient2: '/ambient2.mp3',
  ambient3: '/ambient3.mp3',
  ambient4: '/ambient4.mp3',
  ambient5: '/ambient5.mp3',
  ambient: '/ambient.mp3',
}

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
