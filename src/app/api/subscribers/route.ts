import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isEmailNotificationConfigured, sendNotification } from '@/lib/mailer'

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes("could not find the table 'public.subscribers'") || lower.includes('relation "subscribers" does not exist')
}

function isMissingColumnError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('does not exist') && lower.includes('column')
}

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase
    .from('subscribers')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar suscriptores' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: { email?: string; nombre?: string; source?: string; data?: unknown }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { email, nombre, source, data: extraData } = body
  const sourceFinal = source || 'registro'

  if (!email || typeof email !== 'string' || !email.trim()) {
    return NextResponse.json({ error: 'Email es obligatorio' }, { status: 400 })
  }
  const emailNorm = email.trim().toLowerCase()
  const supabase = getSupabase()
  if (!supabase) {
    const emailed = await sendNotification(
      `📬 Nuevo subscriber — ${emailNorm}`,
      `<h2>Nuevo suscriptor (modo respaldo email)</h2>
      <p><strong>Email:</strong> ${emailNorm}</p>
      ${nombre ? `<p><strong>Nombre:</strong> ${nombre}</p>` : ''}
      <p><strong>Origen:</strong> ${sourceFinal}</p>
      <p><strong>Data:</strong> <code>${JSON.stringify(extraData || {})}</code></p>
      <p><strong>Almacenamiento:</strong> EMAIL_FALLBACK (sin Supabase)</p>`
    )
    if (emailed) {
      return NextResponse.json({ success: true, fallback: 'email' })
    }
    const detail = isEmailNotificationConfigured()
      ? 'No se pudo enviar el respaldo por email'
      : 'Base de datos no configurada y SMTP no configurado'
    return NextResponse.json({ error: detail }, { status: 503 })
  }

  const saveInLeadsFallback = async (sourceLabel: string): Promise<boolean> => {
    const { error } = await supabase.from('leads').insert({
      email: emailNorm,
      name: nombre || '',
      source: `subscriber-${sourceLabel}`,
    })
    return !error
  }

  // Upsert: if email exists, update source and data
  const { data: existing, error: lookupError } = await supabase
    .from('subscribers')
    .select('id, sources')
    .ilike('email', emailNorm)
    .maybeSingle()

  if (lookupError) {
    if (isMissingTableError(lookupError.message)) {
      if (await saveInLeadsFallback('missing-table')) {
        return NextResponse.json({ success: true, fallback: 'leads' })
      }
    }
    return NextResponse.json({ error: lookupError.message }, { status: 500 })
  }

  if (existing) {
    // Add new source to existing sources array
    const currentSources: string[] = existing.sources || []
    const updatedSources = currentSources.includes(sourceFinal)
      ? currentSources
      : [...currentSources, sourceFinal]

    const { error } = await supabase
      .from('subscribers')
      .update({
        nombre: nombre || undefined,
        sources: updatedSources,
        extra_data: extraData || {},
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)

    if (error) {
      if ((isMissingColumnError(error.message) || isMissingTableError(error.message)) && await saveInLeadsFallback('update-fallback')) {
        return NextResponse.json({ success: true, fallback: 'leads' })
      }
      return NextResponse.json({ error: 'Error al actualizar suscriptor' }, { status: 500 })
    }

    return NextResponse.json({ success: true, updated: true })
  }

  // New subscriber
  const { error } = await supabase.from('subscribers').insert({
    email: emailNorm,
    nombre: nombre || '',
    sources: [sourceFinal],
    extra_data: extraData || {},
  })

  if (error) {
    if ((isMissingColumnError(error.message) || isMissingTableError(error.message)) && await saveInLeadsFallback('insert-fallback')) {
      return NextResponse.json({ success: true, fallback: 'leads' })
    }
    return NextResponse.json({ error: 'Error al guardar suscriptor' }, { status: 500 })
  }

  return NextResponse.json({ success: true, created: true })
}
