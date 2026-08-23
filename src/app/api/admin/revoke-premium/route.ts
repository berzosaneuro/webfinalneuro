import { NextResponse } from 'next/server'
import { z } from 'zod'
import { requireAdminOr401 } from '@/lib/api-auth'
import { getSupabaseServiceRole } from '@/lib/supabase'

const schema = z.object({
  email: z.string().email(),
})

export async function POST(request: Request) {
  const authError = await requireAdminOr401()
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

  const inputEmail = parsed.data.email.trim().toLowerCase()
  console.info(`[revoke-premium] Solicitud para email: ${inputEmail}`)

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data: userRow, error: findError } = await supabase
    .from('users')
    .select('id, email')
    .ilike('email', inputEmail)
    .maybeSingle()

  if (findError) {
    console.error(`[revoke-premium] Error buscando usuario: ${findError.message}`)
    return NextResponse.json({ error: findError.message }, { status: 500 })
  }

  if (!userRow) {
    console.warn(`[revoke-premium] Usuario no encontrado: ${inputEmail}`)
    return NextResponse.json(
      { success: false, message: `No se encontró usuario con email ${inputEmail}` },
      { status: 404 },
    )
  }

  const { data, error } = await supabase
    .from('users')
    .update({ is_premium: false, subscription_status: 'manual' })
    .eq('id', userRow.id)
    .select('id, email, is_premium, subscription_status')
    .single()

  if (error) {
    console.error(`[revoke-premium] Error actualizando: ${error.message}`)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  console.info(`[revoke-premium] Premium revocado a ${data.email} (id: ${data.id})`)

  return NextResponse.json({
    success: true,
    message: `Premium revocado a ${data.email}`,
    user: data,
  })
}
