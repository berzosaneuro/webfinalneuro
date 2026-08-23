import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

const ALLOWED_TAGS = ['experiencia', 'pregunta', 'enseñanza', 'progreso', 'recurso'] as const
const ALLOWED_NIVELES = ['Dormido', 'Inquieto', 'Curioso', 'Buscador', 'Aprendiz', 'Practicante', 'Observador', 'Consciente', 'Despiert@', 'Maestr@'] as const

const postSchema = z.object({
  autor: z.string().max(100).optional(),
  avatar: z.string().max(10).optional(),
  nivel: z.string().max(30).optional(),
  texto: z.string().min(1).max(5000),
  tag: z.enum(ALLOWED_TAGS).optional(),
})

const patchSchema = z.object({
  id: z.string().uuid(),
  likes: z.number().int().min(0).optional(),
  autor: z.string().max(100).optional(),
  avatar: z.string().max(10).optional(),
  nivel: z.enum(ALLOWED_NIVELES).optional(),
  texto: z.string().min(1).max(5000).optional(),
  tag: z.enum(ALLOWED_TAGS).optional(),
})

export async function GET() {
  const supabase = getSupabaseServiceRole()
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
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = postSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const displayAutor = (parsed.data.autor?.trim()) || auth.nombre || 'Usuario'
  const { data, error } = await supabase.from('community_posts').insert({
    autor: displayAutor,
    avatar: parsed.data.avatar || '🌟',
    nivel: parsed.data.nivel || 'Observador',
    texto: parsed.data.texto,
    tag: parsed.data.tag || 'experiencia',
  }).select().single()

  if (error) {
    return NextResponse.json({ error: 'Error al crear post' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function PATCH(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = patchSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { id, ...fields } = parsed.data
  const updates: Record<string, unknown> = {}
  if (fields.likes !== undefined) updates.likes = fields.likes
  if (fields.autor !== undefined) updates.autor = fields.autor
  if (fields.avatar !== undefined) updates.avatar = fields.avatar
  if (fields.nivel !== undefined) updates.nivel = fields.nivel
  if (fields.texto !== undefined) updates.texto = fields.texto
  if (fields.tag !== undefined) updates.tag = fields.tag

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Sin campos a actualizar' }, { status: 400 })

  const { error } = await supabase.from('community_posts').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
