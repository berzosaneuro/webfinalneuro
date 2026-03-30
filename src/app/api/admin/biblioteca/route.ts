import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

export async function GET(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json([])
  const { data } = await supabase.from('biblioteca_posts').select('*').order('date', { ascending: false })
  return NextResponse.json(data || [])
}

export async function POST(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'BD no configurada' }, { status: 503 })
  let body: { slug: string; title: string; date?: string; summary?: string; content?: string; exercise?: string; free?: boolean }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  if (!body.slug?.trim() || !body.title?.trim()) return NextResponse.json({ error: 'slug y title obligatorios' }, { status: 400 })
  const { error } = await supabase.from('biblioteca_posts').insert({
    slug: body.slug.trim().toLowerCase().replace(/\s+/g, '-'),
    title: body.title.trim(),
    date: body.date || new Date().toISOString().split('T')[0],
    summary: body.summary || '',
    content: body.content || '',
    exercise: body.exercise || '',
    free: !!body.free,
  })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'BD no configurada' }, { status: 503 })
  let body: { id: string; slug?: string; title?: string; date?: string; summary?: string; content?: string; exercise?: string; free?: boolean }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  if (!body.id) return NextResponse.json({ error: 'id obligatorio' }, { status: 400 })
  const updates: Record<string, unknown> = {}
  if (body.slug != null) updates.slug = String(body.slug).trim().toLowerCase().replace(/\s+/g, '-')
  if (body.title != null) updates.title = String(body.title)
  if (body.date != null) updates.date = String(body.date)
  if (body.summary != null) updates.summary = String(body.summary)
  if (body.content != null) updates.content = String(body.content)
  if (body.exercise != null) updates.exercise = String(body.exercise)
  if (body.free != null) updates.free = !!body.free
  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Sin campos' }, { status: 400 })
  const { error } = await supabase.from('biblioteca_posts').update(updates).eq('id', body.id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ ok: true })
}
