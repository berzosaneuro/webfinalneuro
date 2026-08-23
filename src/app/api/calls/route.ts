import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

const TIPOS = ['programada', 'completada', 'perdida', 'cancelada'] as const

const createCallSchema = z.object({
  clienteNombre: z.string().min(1).max(200),
  telefono: z.string().max(30).optional(),
  fecha: z.string().min(1).max(30),
  hora: z.string().min(1).max(10),
  notas: z.string().max(5000).optional(),
  motivo: z.string().max(200).optional(),
})

const patchCallSchema = z.object({
  id: z.string().uuid(),
  tipo: z.enum(TIPOS).optional(),
  duracion: z.number().int().min(0).optional(),
})

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError
  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase.from('calls').select('*').order('fecha', { ascending: true })

  if (error) return NextResponse.json({ error: 'Error al cargar llamadas' }, { status: 500 })

  const mapped = (data || []).map((l) => ({
    id: l.id, clienteNombre: l.cliente_nombre, telefono: l.telefono, tipo: l.tipo,
    fecha: l.fecha, hora: l.hora, duracion: l.duracion, notas: l.notas,
    recordatorio: l.recordatorio, motivo: l.motivo,
  }))
  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = createCallSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data, error } = await supabase.from('calls').insert({
    cliente_nombre: parsed.data.clienteNombre,
    telefono: parsed.data.telefono || '',
    fecha: parsed.data.fecha,
    hora: parsed.data.hora,
    notas: parsed.data.notas || '',
    motivo: parsed.data.motivo || 'Sesión',
    tipo: 'programada',
    recordatorio: true,
  }).select().single()

  if (error) return NextResponse.json({ error: 'Error al crear llamada' }, { status: 500 })

  return NextResponse.json({
    id: data.id, clienteNombre: data.cliente_nombre, telefono: data.telefono,
    tipo: data.tipo, fecha: data.fecha, hora: data.hora, duracion: data.duracion,
    notas: data.notas, recordatorio: data.recordatorio, motivo: data.motivo,
  })
}

export async function PATCH(request: Request) {
  const authError = await requireAdminOr401()
  if (authError) return authError

  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = patchCallSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { id, ...fields } = parsed.data
  const updates: Record<string, unknown> = {}
  if (fields.tipo !== undefined) updates.tipo = fields.tipo
  if (fields.duracion !== undefined) updates.duracion = fields.duracion

  if (Object.keys(updates).length === 0) return NextResponse.json({ error: 'Sin campos a actualizar' }, { status: 400 })

  const { error } = await supabase.from('calls').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  return NextResponse.json({ success: true })
}
