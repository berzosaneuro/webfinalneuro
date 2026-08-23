import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

const diarioSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  presenceLevel: z.number().int().min(0).max(100).optional(),
  mood: z.string().max(200).optional(),
  insight: z.string().max(5000).optional(),
})

export async function GET() {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_email', auth.email)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar diario' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = diarioSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { date, presenceLevel, mood, insight } = parsed.data
  const email = auth.email

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data: existing } = await supabase
    .from('diary_entries')
    .select('id')
    .eq('user_email', email)
    .eq('date', date)
    .single()

  if (existing) {
    const { error } = await supabase
      .from('diary_entries')
      .update({ presence_level: presenceLevel, mood, insight })
      .eq('id', existing.id)

    if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    return NextResponse.json({ success: true, updated: true })
  }

  const { error } = await supabase.from('diary_entries').insert({
    user_email: email,
    date,
    presence_level: presenceLevel,
    mood,
    insight,
  })

  if (error) return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  return NextResponse.json({ success: true, created: true })
}
