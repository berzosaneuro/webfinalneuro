import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isEmailNotificationConfigured, sendNotification } from '@/lib/mailer'

export async function GET() {
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase
    .from('leads')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar leads' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: { email?: string; name?: string; nombre?: string; source?: string; fuente?: string }
  try { body = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }
  const { email, name, nombre, source, fuente } = body

  if (!email) {
    return NextResponse.json({ error: 'Email es obligatorio' }, { status: 400 })
  }

  const origen = fuente || source || 'web'
  const nombreFinal = name ?? nombre ?? ''

  const supabase = getSupabase()
  if (!supabase) {
    const emailBody = `<h2>Nuevo lead (modo respaldo email)</h2>
    <p><strong>Email:</strong> ${email}</p>
    ${nombreFinal ? `<p><strong>Nombre:</strong> ${nombreFinal}</p>` : ''}
    <p><strong>Origen:</strong> ${origen}</p>
    <p><strong>Almacenamiento:</strong> EMAIL_FALLBACK (sin Supabase)</p>`
    const emailed = await sendNotification(`🔔 Nuevo lead — ${email}`, emailBody)
    if (emailed) {
      return NextResponse.json({ success: true, fallback: 'email' })
    }
    const detail = isEmailNotificationConfigured()
      ? 'No se pudo enviar el respaldo por email'
      : 'Base de datos no configurada y SMTP no configurado'
    return NextResponse.json({ error: detail }, { status: 503 })
  }
  const { error } = await supabase.from('leads').insert({
    email,
    name: nombreFinal,
    source: origen,
  })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar el lead' }, { status: 500 })
  }

  // Email notification (only if SMTP configured)
  await sendNotification(
    `🔔 Nuevo lead — ${email}`,
    `<h2>Nuevo lead en la web</h2>
    <p><strong>Email:</strong> ${email}</p>
    ${nombreFinal ? `<p><strong>Nombre:</strong> ${nombreFinal}</p>` : ''}
    <p><strong>Origen:</strong> ${origen}</p>`
  )

  return NextResponse.json({ success: true })
}
