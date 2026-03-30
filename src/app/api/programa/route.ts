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
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  let body: { email?: string; startDate?: string; completedDays?: number[] }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { startDate, completedDays } = body

  const email = auth.email

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data: existing } = await supabase
    .from('programa_progress')
    .select('id')
    .eq('user_email', email)
    .single()

  if (existing) {
    const { error } = await supabase
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

  const { error } = await supabase.from('programa_progress').insert({
    user_email: email,
    start_date: startDate,
    completed_days: completedDays,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
