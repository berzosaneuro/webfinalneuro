import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data || [])
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}

export async function POST(request: Request) {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  let body: { email?: string; nombre?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { email, nombre } = body
  if (!email || typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'email es obligatorio' }, { status: 400 })
  }
  const emailNorm = email.trim().toLowerCase()
  const nameVal = (nombre && typeof nombre === 'string' ? nombre.trim() : '') || emailNorm.split('@')[0] || 'Usuario'

  try {
    const { data: existing } = await supabase
      .from('users')
      .select('id, nombre')
      .eq('email', emailNorm)
      .single()

    if (existing) {
      await supabase
        .from('users')
        .update({ nombre: nameVal, last_login_at: new Date().toISOString() })
        .eq('id', existing.id)
      return NextResponse.json({ ok: true, created: false })
    }
    const { error } = await supabase.from('users').insert({
      email: emailNorm,
      nombre: nameVal,
    })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json({ ok: true, created: true })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
