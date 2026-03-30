import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

/** Lectura de premium desde BD (misma clave anónima que el resto de API). */
export async function GET(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error
  const raw = auth.email

  const supabase = getSupabase()
  if (!supabase) {
    return NextResponse.json({ is_premium: false, subscription_status: null as string | null })
  }

  const { data, error } = await supabase
    .from('users')
    .select('is_premium, subscription_status')
    .ilike('email', raw)
    .maybeSingle()

  if (error) {
    console.error('[premium-status]', error.message)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const isPremium = Boolean(data?.is_premium)
  return NextResponse.json({
    is_premium: isPremium,
    subscription_status: (data?.subscription_status as string | null) ?? null,
  })
}
