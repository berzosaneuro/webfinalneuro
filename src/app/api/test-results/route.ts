import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

const testResultSchema = z.object({
  score: z.number().int().min(0).max(200),
  level: z.string().min(1).max(50),
  answers: z.array(z.number()).optional(),
})

export async function POST(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = testResultSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  try {
    const { error } = await supabase.from('test_results').insert({
      user_email: auth.email,
      score: parsed.data.score,
      level: parsed.data.level,
      answers: parsed.data.answers ?? [],
    })

    if (error) return NextResponse.json({ error: 'Error al guardar resultado' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
