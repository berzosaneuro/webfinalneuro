import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

export async function GET(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
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

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  let body: { id?: string; is_premium?: boolean; subscription_status?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const id = typeof body.id === 'string' ? body.id.trim() : ''
  if (!id) return NextResponse.json({ error: 'id es obligatorio' }, { status: 400 })

  const patch: Record<string, unknown> = {}
  if (typeof body.is_premium === 'boolean') patch.is_premium = body.is_premium
  if (typeof body.subscription_status === 'string' && body.subscription_status.trim()) {
    patch.subscription_status = body.subscription_status.trim()
  }
  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'No hay campos para actualizar' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('users')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
