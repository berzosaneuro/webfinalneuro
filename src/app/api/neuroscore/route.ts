import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
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
  const body = await request.json()
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

  const { data: existing } = await getSupabase()
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
    const { error } = await getSupabase()
      .from('neuroscore_entries')
      .update(entry)
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  const { error } = await getSupabase().from('neuroscore_entries').insert({
    user_email: email,
    date,
    ...entry,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
