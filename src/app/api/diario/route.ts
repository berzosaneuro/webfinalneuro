import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

export async function GET(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const email = auth.email

  const { data, error } = await supabase
    .from('diary_entries')
    .select('*')
    .eq('user_email', email)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar diario' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  let body: { email?: string; date?: string; presenceLevel?: number; mood?: string; insight?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { date, presenceLevel, mood, insight } = body

  if (!date) {
    return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  }
  const email = auth.email

  const supabase = getSupabase()
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
      .update({
        presence_level: presenceLevel,
        mood,
        insight,
      })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
    return NextResponse.json({ success: true, updated: true })
  }

  const { error } = await supabase.from('diary_entries').insert({
    user_email: email,
    date,
    presence_level: presenceLevel,
    mood,
    insight,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ success: true, created: true })
}
