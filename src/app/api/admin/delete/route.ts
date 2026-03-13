import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

const ALLOWED_TABLES = ['clients', 'leads', 'contacts', 'calls', 'community_posts', 'subscribers']

export async function DELETE(request: Request) {
  let body: { table?: string; id?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { table, id } = body

  if (!table || !id) {
    return NextResponse.json({ error: 'table e id son obligatorios' }, { status: 400 })
  }

  if (!ALLOWED_TABLES.includes(table)) {
    return NextResponse.json({ error: 'Tabla no permitida' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  try {
    const { error } = await supabase.from(table).delete().eq('id', id)
    if (error) {
      return NextResponse.json({ error: 'Error al eliminar' }, { status: 500 })
    }
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
