import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const createPostSchema = z.object({
  slug: z.string().min(1).max(200),
  title: z.string().min(1).max(500),
  date: z.string().max(30).optional(),
  summary: z.string().max(2000).optional(),
  content: z.string().max(50000).optional(),
  exercise: z.string().max(10000).optional(),
  free: z.boolean().optional(),
})

const patchPostSchema = z.object({
  id: z.string().uuid(),
  slug: z.string().min(1).max(200).optional(),
  title: z.string().min(1).max(500).optional(),
  date: z.string().max(30).optional(),
  summary: z.string().max(2000).optional(),
  content: z.string().max(50000).optional(),
  exercise: z.string().max(10000).optional(),
  free: z.boolean().optional(),
})

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json([])
  const { data } = await supabase.from('biblioteca_posts').select('*').order('date', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = createPostSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'BD no configurada' }, { status: 503 })

  const { error } = await supabase.from('biblioteca_posts').insert({
    slug: parsed.data.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    title: parsed.data.title.trim(),
    date: parsed.data.date || new Date().toISOString().split('T')[0],
    summary: parsed.data.summary || '',
    content: parsed.data.content || '',
    exercise: parsed.data.exercise || '',
    free: !!parsed.data.free,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = patchPostSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'BD no configurada' }, { status: 503 })

  const { id, ...fields } = parsed.data
  const updates: Record<string, unknown> = {}
  if (fields.slug !== undefined) updates.slug = fields.slug.trim().toLowerCase().replace(/\s+/g, '-')
  if (fields.title !== undefined) updates.title = fields.title
  if (fields.date !== undefined) updates.date = fields.date
  if (fields.summary !== undefined) updates.summary = fields.summary
  if (fields.content !== undefined) updates.content = fields.content
  if (fields.exercise !== undefined) updates.exercise = fields.exercise
  if (fields.free !== undefined) updates.free = fields.free

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Sin campos' }, { status: 400 })

  const { error } = await supabase.from('biblioteca_posts').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
