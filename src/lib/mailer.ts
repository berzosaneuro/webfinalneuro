import nodemailer from 'nodemailer'

// Configured via env vars in .env.local:
// EMAIL_SMTP_HOST   = mail.berzosaneuro.com  (o el que provea Dondominio)
// EMAIL_SMTP_PORT   = 465
// EMAIL_SMTP_USER   = contacto@berzosaneuro.com
// EMAIL_SMTP_PASS   = tu contraseña de correo
// EMAIL_NOTIFY_TO   = admin@berzosaneuro.com  (donde recibir avisos)

function getTransporter() {
  const host = process.env.EMAIL_SMTP_HOST
  const user = process.env.EMAIL_SMTP_USER
  const pass = process.env.EMAIL_SMTP_PASS
  if (!host || !user || !pass) return null

  return nodemailer.createTransport({
    host,
    port: parseInt(process.env.EMAIL_SMTP_PORT || '465'),
    secure: (process.env.EMAIL_SMTP_PORT || '465') === '465',
    auth: { user, pass },
  })
}

export function isEmailNotificationConfigured(): boolean {
  return Boolean(process.env.EMAIL_SMTP_HOST && process.env.EMAIL_SMTP_USER && process.env.EMAIL_SMTP_PASS)
}

export async function sendNotification(subject: string, html: string): Promise<boolean> {
  const transporter = getTransporter()
  if (!transporter) return false

  try {
    const to = process.env.EMAIL_NOTIFY_TO || process.env.EMAIL_SMTP_USER
    await transporter.sendMail({
      from: `"Berzosa Neuro Web" <${process.env.EMAIL_SMTP_USER}>`,
      to,
      subject,
      html,
    })
    return true
  } catch {
    return false
  }
}
