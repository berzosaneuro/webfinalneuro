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
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  const bodyType = {} as {
    email?: string; date?: string; meditated?: boolean; exerciseDone?: boolean
    testDone?: boolean; despertarDone?: boolean; journalDone?: boolean; trainingDone?: boolean
  }
  let body: typeof bodyType
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { date, meditated, exerciseDone, testDone, despertarDone, journalDone, trainingDone } = body

  if (!date) {
    return NextResponse.json({ error: 'Fecha requerida' }, { status: 400 })
  }
  const email = auth.email

  let score = 0
  if (meditated) score += 30
  if (exerciseDone) score += 25
  if (testDone) score += 15
  if (despertarDone) score += 15
  if (journalDone) score += 15
  if (trainingDone) score += 10

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data: existing } = await supabase
    .from('neuroscore_entries')
    .select('id')
    .eq('user_email', email)
    .eq('date', date)
    .single()

  const entry: Record<string, unknown> = {
    meditated: meditated ?? false,
    exercise_done: exerciseDone ?? false,
    test_done: testDone ?? false,
    despertar_done: despertarDone ?? false,
    journal_done: journalDone ?? false,
    score,
  }
  if (typeof trainingDone === 'boolean') entry.training_done = trainingDone

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
