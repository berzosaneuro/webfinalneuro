import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'
import { isEmailNotificationConfigured, sendNotification } from '@/lib/mailer'

const leadSchema = z.object({
  email: z.string().email().max(320),
  name: z.string().max(200).optional(),
  nombre: z.string().max(200).optional(),
  source: z.string().max(100).optional(),
  fuente: z.string().max(100).optional(),
})

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError

  const supabase = getSupabaseServiceRole()
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
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = leadSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { email, name, nombre, source, fuente } = parsed.data
  const origen = fuente || source || 'web'
  const nombreFinal = name ?? nombre ?? ''

  const supabase = getSupabaseServiceRole()
  if (!supabase) {
    const emailBody = `<h2>Nuevo lead (modo respaldo email)</h2>
    <p><strong>Email:</strong> ${email}</p>
    ${nombreFinal ? `<p><strong>Nombre:</strong> ${nombreFinal}</p>` : ''}
    <p><strong>Origen:</strong> ${origen}</p>
    <p><strong>Almacenamiento:</strong> EMAIL_FALLBACK (sin Supabase)</p>`
    const emailed = await sendNotification(`Nuevo lead — ${email}`, emailBody)
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

  await sendNotification(
    `Nuevo lead — ${email}`,
    `<h2>Nuevo lead en la web</h2>
    <p><strong>Email:</strong> ${email}</p>
    ${nombreFinal ? `<p><strong>Nombre:</strong> ${nombreFinal}</p>` : ''}
    <p><strong>Origen:</strong> ${origen}</p>`
  )

  return NextResponse.json({ success: true })
}
