#!/usr/bin/env node
const base = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\/$/, '')
if (!base) {
  console.error('Set NEXT_PUBLIC_SUPABASE_URL')
  process.exit(1)
}
const paths = ['/auth/v1/health', '/rest/v1/']
for (const p of paths) {
  const full = base + p
  try {
    const r = await fetch(full, { method: 'GET' })
    console.log(p, '→', r.status)
  } catch (e) {
    console.log(p, '→', e.cause?.code || e.cause || e.name, e.message)
  }
}
