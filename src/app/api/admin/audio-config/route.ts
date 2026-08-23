import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const SLOTS = ['ambient1', 'ambient2', 'ambient3', 'ambient4', 'ambient5', 'ambient'] as const

const audioItemSchema = z.object({
  slot: z.enum(SLOTS),
  url: z.string().max(2000).optional(),
})

const patchAudioSchema = z.object({
  slot: z.enum(SLOTS).optional(),
  url: z.string().max(2000).optional(),
  items: z.array(audioItemSchema).max(10).optional(),
})

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json([])
  const { data } = await supabase.from('audio_config').select('slot, url').in('slot', [...SLOTS])
  const map = new Map((data || []).map((r: { slot: string; url: string }) => [r.slot, r.url]))
  return NextResponse.json([...SLOTS].map(slot => ({ slot, url: map.get(slot) ?? '' })))
}

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = patchAudioSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const items = parsed.data.items ?? (parsed.data.slot ? [{ slot: parsed.data.slot, url: parsed.data.url ?? '' }] : [])
  for (const { slot, url } of items) {
    await supabase.from('audio_config').upsert({ slot, url: (url || '').trim() }, { onConflict: 'slot' })
  }
  return NextResponse.json({ ok: true })
}
