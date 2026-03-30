import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const SLOTS = ['ambient1', 'ambient2', 'ambient3', 'ambient4', 'ambient5', 'ambient']

export async function GET(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json([])
  const { data } = await supabase.from('audio_config').select('slot, url').in('slot', SLOTS)
  const map = new Map((data || []).map((r: { slot: string; url: string }) => [r.slot, r.url]))
  return NextResponse.json(SLOTS.map(slot => ({ slot, url: map.get(slot) ?? '' })))
}

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  let body: { slot?: string; url?: string; items?: { slot: string; url: string }[] }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const items = body.items ?? (body.slot ? [{ slot: body.slot, url: body.url ?? '' }] : [])
  for (const { slot, url } of items) {
    if (!slot || !SLOTS.includes(slot)) continue
    await supabase.from('audio_config').upsert({ slot, url: (url || '').trim() }, { onConflict: 'slot' })
  }
  return NextResponse.json({ ok: true })
}
