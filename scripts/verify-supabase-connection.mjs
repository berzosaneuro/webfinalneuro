#!/usr/bin/env node
const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL
if (!BASE) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}
const u = new URL('/auth/v1/health', BASE)
try {
  const r = await fetch(u, { method: 'GET' })
  const t = await r.text()
  console.log('GET', u.href, '→', r.status, t.slice(0, 120))
  process.exit(r.status >= 200 && r.status < 500 ? 0 : 1)
} catch (e) {
  console.error('FALLO', e.cause?.code || e.cause, e.message)
  process.exit(1)
}
