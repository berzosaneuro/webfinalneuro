import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { sendNotification } from '@/lib/mailer'

export async function GET() {
  const { data, error } = await getSupabase()
    .from('contacts')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Error al cargar contactos' }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  let body: { name?: string; email?: string; message?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }
  const { name, email, message } = body

  if (!name || !email || !message) {
    return NextResponse.json({ error: 'Todos los campos son obligatorios' }, { status: 400 })
  }

  const { error } = await getSupabase().from('contacts').insert({ name, email, message })

  if (error) {
    return NextResponse.json({ error: 'Error al guardar el mensaje' }, { status: 500 })
  }

  // Email notification (only if SMTP configured)
  await sendNotification(
    `📩 Nuevo mensaje de contacto — ${name}`,
    `<h2>Nuevo mensaje de la web</h2>
    <p><strong>Nombre:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Mensaje:</strong></p>
    <blockquote style="border-left:3px solid #0066FF;padding-left:12px;color:#555">${message.replace(/\n/g, '<br>')}</blockquote>`
  ).catch(() => {}) // Never fail the request if email fails

  return NextResponse.json({ success: true })
}
