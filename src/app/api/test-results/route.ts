import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function POST(request: Request) {
  let body: { userEmail?: string; score?: number; level?: string; answers?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { userEmail, score, level, answers } = body

  if (score == null || !level) {
    return NextResponse.json({ error: 'score y level requeridos' }, { status: 400 })
  }

  try {
    const supabase = getSupabase()
    const { error } = await supabase.from('test_results').insert({
      user_email: userEmail || '',
      score: Number(score),
      level: String(level),
      answers: Array.isArray(answers) ? answers : [],
    })

    if (error) {
      return NextResponse.json({ error: 'Error al guardar resultado' }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
