import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

export async function POST(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  let body: { userEmail?: string; score?: number; level?: string; answers?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { score, level, answers } = body

  if (score == null || !level) {
    return NextResponse.json({ error: 'score y level requeridos' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  try {
    const { error } = await supabase.from('test_results').insert({
      user_email: auth.email,
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
