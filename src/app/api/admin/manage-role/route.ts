import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getAuthUser } from '@/lib/server-auth'
import { requireMasterOr401 } from '@/lib/api-auth'
import { getSupabaseServiceRole } from '@/lib/supabase'

const grantSchema = z.object({
  userId: z.string().uuid('userId debe ser un UUID válido'),
  role: z.enum(['admin', 'user'], {
    message: 'role debe ser "admin" o "user"',
  }),
})

/**
 * PATCH /api/admin/manage-role
 * Only 'master' can assign or revoke admin roles.
 * Cannot assign 'master' via API. Cannot demote yourself.
 */
export async function PATCH(request: Request) {
  const authError = await requireMasterOr401()
  if (authError) return authError

  const currentUser = await getAuthUser()
  if (!currentUser) {
    return NextResponse.json({ error: 'Sesión inválida' }, { status: 401 })
  }

  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = grantSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors },
      { status: 400 },
    )
  }

  const { userId, role } = parsed.data

  const supabase = getSupabaseServiceRole()
  if (!supabase) {
    return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  }

  const { data: targetUser, error: findError } = await supabase
    .from('users')
    .select('id, email, role')
    .eq('id', userId)
    .maybeSingle()

  if (findError) {
    console.error(`[manage-role] Error buscando usuario: ${findError.message}`)
    return NextResponse.json({ error: findError.message }, { status: 500 })
  }

  if (!targetUser) {
    return NextResponse.json(
      { success: false, message: 'Usuario no encontrado' },
      { status: 404 },
    )
  }

  if (targetUser.role === 'master') {
    return NextResponse.json(
      { success: false, message: 'No se puede modificar el rol de un master' },
      { status: 403 },
    )
  }

  if (targetUser.id === currentUser.id) {
    return NextResponse.json(
      { success: false, message: 'No puedes cambiar tu propio rol' },
      { status: 403 },
    )
  }

  if (targetUser.role === role) {
    return NextResponse.json({
      success: true,
      message: `El usuario ya tiene el rol "${role}"`,
      user: { id: targetUser.id, email: targetUser.email, role: targetUser.role },
    })
  }

  const { data, error } = await supabase
    .from('users')
    .update({ role })
    .eq('id', userId)
    .select('id, email, role')
    .single()

  if (error) {
    console.error(`[manage-role] Error actualizando: ${error.message}`)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }

  const action = role === 'admin' ? 'concedido' : 'revocado'
  console.info(`[manage-role] Rol admin ${action} a ${data.email} (id: ${data.id})`)

  return NextResponse.json({
    success: true,
    message: `Rol "${role}" asignado a ${data.email}`,
    user: data,
  })
}
