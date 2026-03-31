import { getSupabaseServiceRole } from '@/lib/supabase'

type HealthReport = {
  ok: boolean
  db: { ok: boolean; latency_ms: number; threshold_ms: number }
  env: { ok: boolean; missing: string[] }
  webhooks: { ok: boolean; last_event_id: string | null; last_event_type: string | null; last_processed_at: string | null }
  checked_at: string
}

const REQUIRED_ENV = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'STRIPE_SECRET_KEY',
  'STRIPE_WEBHOOK_SECRET',
  'STRIPE_PRICE_ID',
  'APP_SESSION_SECRET',
  'ADMIN_PASSWORD',
] as const

export async function runHealthCheck(): Promise<HealthReport> {
  const thresholdMs = 500
  const t0 = Date.now()
  const supabase = getSupabaseServiceRole()

  if (!supabase) {
    return {
      ok: false,
      db: { ok: false, latency_ms: Date.now() - t0, threshold_ms: thresholdMs },
      env: {
        ok: false,
        missing: REQUIRED_ENV.filter((k) => !process.env[k]),
      },
      webhooks: { ok: false, last_event_id: null, last_event_type: null, last_processed_at: null },
      checked_at: new Date().toISOString(),
    }
  }

  const { error: dbError } = await supabase.from('users').select('id').limit(1)
  const latencyMs = Date.now() - t0

  const { data: lastEvent, error: eventErr } = await supabase
    .from('stripe_events')
    .select('stripe_event_id, event_type, processed_at')
    .order('processed_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const missing = REQUIRED_ENV.filter((k) => !process.env[k])
  const dbOk = !dbError && latencyMs < thresholdMs
  const webhookOk = !eventErr && Boolean(lastEvent?.stripe_event_id)

  return {
    ok: dbOk && missing.length === 0 && webhookOk,
    db: { ok: dbOk, latency_ms: latencyMs, threshold_ms: thresholdMs },
    env: { ok: missing.length === 0, missing },
    webhooks: {
      ok: webhookOk,
      last_event_id: lastEvent?.stripe_event_id ?? null,
      last_event_type: lastEvent?.event_type ?? null,
      last_processed_at: lastEvent?.processed_at ?? null,
    },
    checked_at: new Date().toISOString(),
  }
}
