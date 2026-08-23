/**
 * Solo comprobación de service role (las públicas ya avisa `getPublicSupabaseEnv`).
 * No lanza. globalThis evita repetir en el mismo proceso.
 */
export function validateSupabaseEnv(): void {
  const g = globalThis as { __sbServiceCheckDone?: boolean }
  if (g.__sbServiceCheckDone) return
  g.__sbServiceCheckDone = true
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()) {
    console.error(
      '❌ [env-check] SUPABASE_SERVICE_ROLE_KEY ausente: APIs con rol / admin / webhooks no funcionan.',
    )
  }
}
