import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('clients')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar clientes' }, { status: 500 })
  }

  const mapped = (data || []).map((c) => ({
    id: c.id,
    nombre: c.nombre,
    email: c.email,
    telefono: c.telefono,
    estado: c.estado,
    plan: c.plan,
    notas: c.notas,
    ultimaSesion: c.ultima_sesion,
    proximaSesion: c.proxima_sesion,
    sesionesTotales: c.sesiones_totales,
    fechaAlta: c.fecha_alta,
    tags: c.tags || [],
  }))

  return NextResponse.json(mapped)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { nombre, email, telefono, notas } = body

  if (!nombre) {
    return NextResponse.json({ error: 'Nombre es obligatorio' }, { status: 400 })
  }

  const { data, error } = await getSupabase().from('clients').insert({
    nombre,
    email: email || '',
    telefono: telefono || '',
    notas: notas || '',
    estado: 'potencial',
    plan: 'ninguno',
    fecha_alta: new Date().toISOString().split('T')[0],
    tags: ['nuevo'],
  }).select().single()

  if (error) {
    return NextResponse.json({ error: 'Error al crear cliente' }, { status: 500 })
  }

  return NextResponse.json({
    id: data.id,
    nombre: data.nombre,
    email: data.email,
    telefono: data.telefono,
    estado: data.estado,
    plan: data.plan,
    notas: data.notas,
    ultimaSesion: data.ultima_sesion,
    proximaSesion: data.proxima_sesion,
    sesionesTotales: data.sesiones_totales,
    fechaAlta: data.fecha_alta,
    tags: data.tags || [],
  })
}

export async function PATCH(request: Request) {
  const body = await request.json()
  const { id, estado } = body

  if (!id) {
    return NextResponse.json({ error: 'ID es obligatorio' }, { status: 400 })
  }

  const { error } = await getSupabase()
    .from('clients')
    .update({ estado })
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: 'Error al actualizar' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
