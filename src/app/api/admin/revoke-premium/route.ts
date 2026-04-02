import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOr401 } from '@/lib/api-auth'
import { getSupabaseServiceRole } from '@/lib/supabase'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Email inválido' }, { status: 400 })
  }

  const email = parsed.data.email.trim().toLowerCase()
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data, error } = await supabase
    .from('users')
    .update({ is_premium: false, subscription_status: 'manual' })
    .eq('email', email)
    .select('id, email, is_premium, subscription_status')

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data || data.length === 0) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  return NextResponse.json({ ok: true, user: data[0] })
}
