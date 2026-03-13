import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar suscriptores' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const body = await request.json()
  const { email, nombre, source, data: extraData } = body
  const sourceFinal = source || 'registro'

  if (!email) {
    return NextResponse.json({ error: 'Email es obligatorio' }, { status: 400 })
  }

  // Upsert: if email exists, update source and data
  const { data: existing } = await getSupabase()
    .from('subscribers')
    .select('id, sources')
    .eq('email', email)
    .single()

  if (existing) {
    // Add new source to existing sources array
    const currentSources: string[] = existing.sources || []
    const updatedSources = currentSources.includes(sourceFinal)
      ? currentSources
      : [...currentSources, sourceFinal]

    const { error } = await getSupabase()
      .from('subscribers')
      .update({
        nombre: nombre || undefined,
        sources: updatedSources,
        extra_data: extraData || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      return NextResponse.json({ error: 'Error al actualizar suscriptor' }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: true })
  }

  // New subscriber
  const { error } = await getSupabase().from('subscribers').insert({
    email,
    nombre: nombre || '',
    sources: [sourceFinal],
    extra_data: extraData || {},
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar suscriptor' }, { status: 500 })
  }

  return NextResponse.json({ success: true, created: true })
}
