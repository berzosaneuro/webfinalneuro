import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { isEmailNotificationConfigured, sendNotification } from '@/lib/mailer'

function isMissingTableError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes("could not find the table 'public.users'") || lower.includes('relation "users" does not exist')
}

function isMissingColumnError(message: string): boolean {
  const lower = message.toLowerCase()
  return lower.includes('does not exist') && lower.includes('column')
}

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
  const supabase = getSupabase()
  if (!supabase) {
    const emailed = await sendNotification(
      `👤 Nuevo usuario/acceso — ${emailNorm}`,
      `<h2>Nuevo usuario (modo respaldo email)</h2>
      <p><strong>Email:</strong> ${emailNorm}</p>
      <p><strong>Nombre:</strong> ${nameVal}</p>
      <p><strong>Almacenamiento:</strong> EMAIL_FALLBACK (sin Supabase)</p>`
    )
    if (emailed) {
      return NextResponse.json({ ok: true, created: true, table: 'email_fallback' })
    }
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
          email: emailNorm,
          name: nameVal,
          source: 'users-fallback-missing-table',
        })
        if (!leadFallbackError) {
          return NextResponse.json({ ok: true, created: true, table: 'leads_fallback' })
        }
      }
      return NextResponse.json({ error: lookupError.message }, { status: 500 })
    }

    if (existing) {
      const nowIso = new Date().toISOString()
      const updatePayloads: Array<Record<string, string>> = [
        { nombre: nameVal, last_login_at: nowIso },
        { name: nameVal, last_login_at: nowIso },
        { nombre: nameVal },
        { name: nameVal },
        { last_login_at: nowIso },
      ]
      let updated = false
      let lastUpdateError = ''
      for (const payload of updatePayloads) {
        const { error: updateError } = await supabase
          .from('users')
          .update(payload)
          .eq('id', existing.id)
        if (!updateError) {
          updated = true
          break
        }
        lastUpdateError = updateError.message
        if (!isMissingColumnError(updateError.message)) break
      }
      if (!updated) {
        return NextResponse.json({ error: lastUpdateError || 'No se pudo actualizar usuario' }, { status: 500 })
      }
      return NextResponse.json({ ok: true, created: false, table: 'users' })
    }
    const insertPayloads: Array<Record<string, string>> = [
      { email: emailNorm, nombre: nameVal },
      { email: emailNorm, name: nameVal },
      { email: emailNorm },
    ]
    let inserted = false
    let lastInsertError = ''
    for (const payload of insertPayloads) {
      const { error } = await supabase.from('users').insert(payload)
      if (!error) {
        inserted = true
        break
      }
      lastInsertError = error.message
      if (!isMissingColumnError(error.message)) {
        if (isMissingTableError(error.message)) break
      }
    }
    if (inserted) {
      return NextResponse.json({ ok: true, created: true, table: 'users' })
    }

    const { error: leadFallbackError } = await supabase.from('leads').insert({
      email: emailNorm,
      name: nameVal,
      source: 'users-fallback-schema',
    })
    if (!leadFallbackError) {
      return NextResponse.json({ ok: true, created: true, table: 'leads_fallback' })
    }
    return NextResponse.json({ error: lastInsertError || leadFallbackError.message }, { status: 500 })
  } catch {
    return NextResponse.json({ error: 'Servicio no disponible' }, { status: 503 })
  }
}
