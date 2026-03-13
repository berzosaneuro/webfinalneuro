import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('community_posts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar posts' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { autor, avatar, nivel, texto, tag } = body

  if (!texto) {
    return NextResponse.json({ error: 'El texto es obligatorio' }, { status: 400 })
  }

  const { data, error } = await getSupabase().from('community_posts').insert({
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
  const body = await request.json()
  const { id, likes } = body

  if (!id) {
    return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })
  }

  const { error } = await getSupabase()
    .from('community_posts')
    .update({ likes })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
