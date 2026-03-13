import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const email = searchParams.get('email')

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const { data, error } = await getSupabase()
    .from('programa_progress')
    .select('*')
    .eq('user_email', email)
    .single()

  if (error && error.code !== 'PGRST116') {
    return NextResponse.json({ error: 'Error al cargar programa' }, { status: 500 })
  }

  return NextResponse.json(data || { start_date: null, completed_days: [] })
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email, startDate, completedDays } = body

  if (!email) {
    return NextResponse.json({ error: 'Email requerido' }, { status: 400 })
  }

  const { data: existing } = await getSupabase()
    .from('programa_progress')
    .select('id')
    .eq('user_email', email)
    .single()

  if (existing) {
    const { error } = await getSupabase()
      .from('programa_progress')
      .update({
        start_date: startDate,
        completed_days: completedDays,
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  }

  const { error } = await getSupabase().from('programa_progress').insert({
    user_email: email,
    start_date: startDate,
    completed_days: completedDays,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
