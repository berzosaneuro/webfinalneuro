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
    .from('neuroscore_entries')
    .select('*')
    .eq('user_email', email)
    .order('date', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar neuroscore' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: { email?: string; date?: string; meditated?: boolean; exerciseDone?: boolean; testDone?: boolean; despertarDone?: boolean; journalDone?: boolean }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { email, date, meditated, exerciseDone, testDone, despertarDone, journalDone } = body

  if (!email || !date) {
    return NextResponse.json({ error: 'Email y fecha requeridos' }, { status: 400 })
  }

  let score = 0
  if (meditated) score += 30
  if (exerciseDone) score += 25
  if (testDone) score += 15
  if (despertarDone) score += 15
  if (journalDone) score += 15

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data: existing } = await supabase
    .from('neuroscore_entries')
    .select('id')
    .eq('user_email', email)
    .eq('date', date)
    .single()

  const entry = {
    meditated,
    exercise_done: exerciseDone,
    test_done: testDone,
    despertar_done: despertarDone,
    journal_done: journalDone,
    score,
  }

  if (existing) {
    const { error } = await supabase
      .from('neuroscore_entries')
      .update(entry)
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  const { error } = await supabase.from('neuroscore_entries').insert({
    user_email: email,
    date,
    ...entry,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
