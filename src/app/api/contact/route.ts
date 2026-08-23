import { NextResponse } from 'next/server'
import { z } from 'zod'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'
import { sendNotification } from '@/lib/mailer'

const contactSchema = z.object({
  name: z.string().min(1).max(200),
  email: z.string().email().max(320),
  message: z.string().min(1).max(5000),
})

export async function GET() {
  const authError = await requireAdminOr401()
  if (authError) return authError

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar contactos' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: unknown
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const parsed = contactSchema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Datos inválidos', details: parsed.error.flatten().fieldErrors }, { status: 400 })
  }

  const { name, email, message } = parsed.data

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { error } = await supabase.from('contacts').insert({ name, email, message })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar el mensaje' }, { status: 500 })
  }

  await sendNotification(
    `Nuevo mensaje de contacto — ${name}`,
    `<h2>Nuevo mensaje de la web</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="border-left:3px solid #0066FF;padding-left:12px;color:#555">${message.replace(/\n/g, '<br>')}</blockquote>`
  ).catch(() => {})

  return NextResponse.json({ success: true })
}
