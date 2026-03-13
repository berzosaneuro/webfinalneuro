import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

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
  let body: { email?: string; date?: string; presenceLevel?: number; mood?: string; insight?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { email, date, presenceLevel, mood, insight } = body

  if (!email || !date) {
    return NextResponse.json({ error: 'Email y fecha requeridos' }, { status: 400 })
  }

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
