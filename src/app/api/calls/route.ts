import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('calls')
    .select('*')
    .order('fecha', { ascending: true })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar llamadas' }, { status: 500 })
  }

  const mapped = (data || []).map((l) => ({
    id: l.id,
    clienteNombre: l.cliente_nombre,
    telefono: l.telefono,
    tipo: l.tipo,
    fecha: l.fecha,
    hora: l.hora,
    duracion: l.duracion,
    notas: l.notas,
    recordatorio: l.recordatorio,
    motivo: l.motivo,
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { clienteNombre, telefono, fecha, hora, notas, motivo } = body

  if (!clienteNombre || !fecha || !hora) {
    return NextResponse.json({ error: 'Nombre, fecha y hora son obligatorios' }, { status: 400 })
  }

  const { data, error } = await getSupabase().from('calls').insert({
    cliente_nombre: clienteNombre,
    telefono: telefono || '',
    fecha,
    hora,
    notas: notas || '',
    motivo: motivo || 'Sesión',
    tipo: 'programada',
    recordatorio: true,
  }).select().single()

  if (error) {
    return NextResponse.json({ error: 'Error al crear llamada' }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    clienteNombre: data.cliente_nombre,
    telefono: data.telefono,
    tipo: data.tipo,
    fecha: data.fecha,
    hora: data.hora,
    duracion: data.duracion,
    notas: data.notas,
    recordatorio: data.recordatorio,
    motivo: data.motivo,
  })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, tipo, duracion } = body

  if (!id) {
    return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })
  }

  const updates: Record<string, unknown> = {}
  if (tipo) updates.tipo = tipo
  if (duracion !== undefined) updates.duracion = duracion

  const { error } = await getSupabase()
    .from('calls')
    .update(updates)
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
