import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const ESTADOS = ['activo', 'inactivo', 'nuevo', 'potencial'] as const
const PLANES = ['free', 'premium', 'ninguno'] as const

const createClientSchema = z.object({
  nombre: z.string().min(1).max(200),
  email: z.string().max(320).optional(),
  telefono: z.string().max(30).optional(),
  notas: z.string().max(5000).optional(),
})

const patchClientSchema = z.object({
  id: z.string().uuid(),
  estado: z.enum(ESTADOS).optional(),
  plan: z.enum(PLANES).optional(),
  nombre: z.string().min(1).max(200).optional(),
  email: z.string().max(320).optional(),
  telefono: z.string().max(30).optional(),
  notas: z.string().max(5000).optional(),
})

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false })

  if (error) return NextResponse.json({ error: 'Error al cargar clientes' }, { status: 500 })

  const mapped = (data || []).map((c) => ({
    id: c.id, nombre: c.nombre, email: c.email, telefono: c.telefono,
    estado: c.estado, plan: c.plan, notas: c.notas,
    ultimaSesion: c.ultima_sesion, proximaSesion: c.proxima_sesion,
    sesionesTotales: c.sesiones_totales, fechaAlta: c.fecha_alta, tags: c.tags || [],
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = createClientSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data, error } = await supabase.from('clients').insert({
    nombre: parsed.data.nombre,
    email: parsed.data.email || '',
    telefono: parsed.data.telefono || '',
    notas: parsed.data.notas || '',
    estado: 'potencial',
    plan: 'ninguno',
    fecha_alta: new Date().toISOString().split('T')[0],
    tags: ['nuevo'],
  }).select().single()

  if (error) return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })

  return NextResponse.json({
    id: data.id, nombre: data.nombre, email: data.email, telefono: data.telefono,
    estado: data.estado, plan: data.plan, notas: data.notas,
    ultimaSesion: data.ultima_sesion, proximaSesion: data.proxima_sesion,
    sesionesTotales: data.sesiones_totales, fechaAlta: data.fecha_alta, tags: data.tags || [],
  })
}

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = patchClientSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { id, ...fields } = parsed.data
  const updates: Record<string, unknown> = {}
  if (fields.estado !== undefined) updates.estado = fields.estado
  if (fields.plan !== undefined) updates.plan = fields.plan
  if (fields.nombre !== undefined) updates.nombre = fields.nombre
  if (fields.email !== undefined) updates.email = fields.email
  if (fields.telefono !== undefined) updates.telefono = fields.telefono
  if (fields.notas !== undefined) updates.notas = fields.notas

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Sin campos a actualizar' }, { status: 400 })

  const { error } = await supabase.from('clients').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
