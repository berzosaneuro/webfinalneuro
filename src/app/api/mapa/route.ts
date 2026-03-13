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
    .from('mapa_entries')
    .select('*')
    .eq('user_email', email)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar mapa' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  let body: { email?: string; date?: string; dimensions?: Record<string, number>; nota?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { email, date, dimensions, nota } = body

  if (!email || !date) {
    return NextResponse.json({ error: 'Email y fecha requeridos' }, { status: 400 })
  }

  const dims = dimensions && typeof dimensions === 'object'
    ? {
        presencia: Number(dimensions.presencia) || 5,
        calma: Number(dimensions.calma) || 5,
        claridad: Number(dimensions.claridad) || 5,
        energia: Number(dimensions.energia) || 5,
        conexion: Number(dimensions.conexion) || 5,
      }
    : { presencia: 5, calma: 5, claridad: 5, energia: 5, conexion: 5 }
  const nivel = (dims.presencia + dims.calma + dims.claridad + dims.energia + dims.conexion) / 5

  const { data: existing } = await supabase
    .from('mapa_entries')
    .select('id')
    .eq('user_email', email)
    .eq('date', date)
    .single()

  const entry = {
    presencia: dims.presencia,
    calma: dims.calma,
    claridad: dims.claridad,
    energia: dims.energia,
    conexion: dims.conexion,
    nivel: Math.round(nivel * 10) / 10,
    nota: nota || '',
  }

  if (existing) {
    const { error } = await supabase
      .from('mapa_entries')
      .update(entry)
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  const { error } = await supabase.from('mapa_entries').insert({
    user_email: email,
    date,
    ...entry,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
