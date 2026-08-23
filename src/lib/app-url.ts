/**
 * Base pública: dominio con https (emails, auth/callback, `emailRedirectTo`).
 * Prioridad: `NEXT_PUBLIC_APP_URL` (producción con dominio propio).
 * Si falta y estamos en Vercel, `VERCEL_URL` (inyectada) evita 503 en `/auth/callback` y
 * “no entro tras pagar/confirmar”. Sigue siendo recomendable fijar `NEXT_PUBLIC_APP_URL` al dominio final.
 */
export function getCanonicalAppBaseUrl(): string | null {
  const u = process.env.NEXT_PUBLIC_APP_URL?.trim()
  if (u) return u.replace(/\/$/, '')
  const vercel = process.env.VERCEL_URL?.trim()
  if (vercel) {
    return `https://${vercel}`.replace(/\/$/, '')
  }
  return null
}
