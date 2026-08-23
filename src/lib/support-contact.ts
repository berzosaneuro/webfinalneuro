/** Email de soporte visible en login/registro (transparencia con usuarios; configurable en Vercel). */
export function getPublicSupportEmail(): string {
  const e = process.env.NEXT_PUBLIC_SUPPORT_EMAIL?.trim()
  if (e) return e
  return 'contacto@berzosaneuro.com'
}
