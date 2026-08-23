import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const patchUserSchema = z.object({
  id: z.string().uuid(),
  is_premium: z.boolean().optional(),
  subscription_status: z.string().max(50).optional(),
}).strict()

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}

/**
 * PATCH /api/admin/users — update premium fields only.
 * Role changes go through /api/admin/manage-role (master-only).
 */
export async function PATCH(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = patchUserSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { id, ...fields } = parsed.data
  const patch: Record<string, unknown> = {}
  if (fields.is_premium !== undefined) patch.is_premium = fields.is_premium
  if (fields.subscription_status !== undefined) patch.subscription_status = fields.subscription_status.trim()

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select('id, email, is_premium, subscription_status, role')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  if (!data) return NextResponse.json({ error: 'Usuario no encontrado' }, { status: 404 })

  return NextResponse.json({ success: true, message: 'Usuario actualizado', user: data })
}
