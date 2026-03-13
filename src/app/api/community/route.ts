import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar posts' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: { autor?: string; avatar?: string; nivel?: string; texto?: string; tag?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { autor, avatar, nivel, texto, tag } = body

  if (!texto) {
    return NextResponse.json({ error: 'El texto es obligatorio' }, { status: 400 })
  }

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase.from('community_posts').insert({
    autor: autor || 'Anónimo',
    avatar: avatar || '🌟',
    nivel: nivel || 'Observador',
    texto,
    tag: tag || 'experiencia',
  }).select().single()

  if (error) {
    return NextResponse.json({ error: 'Error al crear post' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  let body: { id?: string; likes?: number; autor?: string; avatar?: string; nivel?: string; texto?: string; tag?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { id, likes, autor, avatar, nivel, texto, tag } = body

  if (!id) return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })

  const updates: Record<string, unknown> = {}
  if (typeof likes === 'number') updates.likes = likes
  if (autor != null) updates.autor = String(autor)
  if (avatar != null) updates.avatar = String(avatar)
  if (nivel != null) updates.nivel = String(nivel)
  if (texto != null) updates.texto = String(texto)
  if (tag != null) updates.tag = String(tag)

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Sin campos a actualizar' }, { status: 400 })

  const { error } = await supabase.from('community_posts').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
