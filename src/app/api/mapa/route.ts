import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

const dim = z.number().min(0).max(10)
const mapaSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  dimensions: z.object({
    presencia: dim.optional(),
    calma: dim.optional(),
    claridad: dim.optional(),
    energia: dim.optional(),
    conexion: dim.optional(),
  }).optional(),
  nota: z.string().max(2000).optional(),
})

export async function GET() {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data, error } = await supabase
    .from('mapa_entries')
    .select('*')
    .eq('user_email', auth.email)
    .order('date', { ascending: true })

  if (error) return NextResponse.json({ error: 'Error al cargar mapa' }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = mapaSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { date, dimensions, nota } = parsed.data
  const email = auth.email
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const dims = {
    presencia: dimensions?.presencia ?? 5,
    calma: dimensions?.calma ?? 5,
    claridad: dimensions?.claridad ?? 5,
    energia: dimensions?.energia ?? 5,
    conexion: dimensions?.conexion ?? 5,
  }
  const nivel = Math.round(((dims.presencia + dims.calma + dims.claridad + dims.energia + dims.conexion) / 5) * 10) / 10

  const { data: existing } = await supabase
    .from('mapa_entries')
    .select('id')
    .eq('user_email', email)
    .eq('date', date)
    .single()

  const entry = { ...dims, nivel, nota: nota || '' }

  if (existing) {
    const { error } = await supabase.from('mapa_entries').update(entry).eq('id', existing.id)
    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    return NextResponse.json({ success: true })
  }

  const { error } = await supabase.from('mapa_entries').insert({ user_email: email, date, ...entry })
  if (error) return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
