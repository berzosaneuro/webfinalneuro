import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const ALLOWED_TABLES = [
  'clients', 'leads', 'contacts', 'calls', 'community_posts', 'subscribers', 'users',
  'diary_entries', 'mapa_entries', 'neuroscore_entries', 'programa_progress', 'test_results', 'biblioteca_posts',
] as const

const deleteSchema = z.object({
  table: z.enum(ALLOWED_TABLES),
  id: z.string().uuid(),
})

export async function DELETE(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = deleteSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  try {
    const { error } = await supabase.from(parsed.data.table).delete().eq('id', parsed.data.id)
    if (error) return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
