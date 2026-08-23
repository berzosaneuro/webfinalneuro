import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { isEmailNotificationConfigured, sendNotification } from '@/lib/mailer'
import { requireAdminOr401 } from '@/lib/api-auth'

const createUserSchema = z.object({
  email: z.string().email().max(320),
  nombre: z.string().max(200).optional(),
})

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes("could not find the table 'public.users'") || lower.includes('relation "users" does not exist')
}

function isMissingColumnError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('does not exist') && lower.includes('column')
}

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError
  const supabase = getSupabaseServiceRole()
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
  let raw: unknown
  try { raw = await request.json() } catch { return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 }) }

  const parsed = createUserSchema.safeParse(raw)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const emailNorm = parsed.data.email.trim().toLowerCase()
  const nameVal = (parsed.data.nombre?.trim()) || emailNorm.split('@')[0] || 'Usuario'

  const supabase = getSupabaseServiceRole()
  if (!supabase) {
    const emailed = await sendNotification(
      `Nuevo usuario/acceso — ${emailNorm}`,
      `<h2>Nuevo usuario (modo respaldo email)</h2>
      <p><strong>Email:</strong> ${emailNorm}</p>
      <p><strong>Nombre:</strong> ${nameVal}</p>
      <p><strong>Almacenamiento:</strong> EMAIL_FALLBACK (sin Supabase)</p>`
    )
    if (emailed) return NextResponse.json({ ok: true, created: true, table: 'email_fallback' })
    const detail = isEmailNotificationConfigured()
      ? 'No se pudo enviar el respaldo por email'
      : 'Base de datos no configurada y SMTP no configurado'
    return NextResponse.json({ error: detail }, { status: 503 })
  }

  try {
    const { data: existing, error: lookupError } = await supabase
      .from('users')
      .select('id')
      .ilike('email', emailNorm)
      .maybeSingle()

    if (lookupError) {
      if (isMissingTableError(lookupError.message)) {
        const { error: leadFallbackError } = await supabase.from('leads').insert({
          email: emailNorm, name: nameVal, source: 'users-fallback-missing-table',
        })
        if (!leadFallbackError) return NextResponse.json({ ok: true, created: true, table: 'leads_fallback' })
      }
      return NextResponse.json({ error: lookupError.message }, { status: 500 })
    }

    if (existing) {
      const { error: updateError } = await supabase
        .from('users')
        .update({ nombre: nameVal, last_login_at: new Date().toISOString() })
        .eq('id', existing.id)

      if (updateError) {
        if (isMissingColumnError(updateError.message)) {
          await supabase.from('users').update({ last_login_at: new Date().toISOString() }).eq('id', existing.id)
        }
      }
      return NextResponse.json({ ok: true, created: false, table: 'users' })
    }

    const { error: insertError } = await supabase.from('users').insert({ email: emailNorm, nombre: nameVal })
    if (insertError) {
      if (isMissingTableError(insertError.message) || isMissingColumnError(insertError.message)) {
        const { error: leadFallbackError } = await supabase.from('leads').insert({
          email: emailNorm, name: nameVal, source: 'users-fallback-schema',
        })
        if (!leadFallbackError) return NextResponse.json({ ok: true, created: true, table: 'leads_fallback' })
      }
      return NextResponse.json({ error: insertError.message }, { status: 500 })
    }
    return NextResponse.json({ ok: true, created: true, table: 'users' })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
