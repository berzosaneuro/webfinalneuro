import { NextResponse } from 'next/server'
import { getSupabaseServiceRole } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'
export { dynamic } from '@/lib/api-route-dynamic'

export async function GET(request: Request) {
  const auth = await requireUserOr401()
  if (auth.error) return auth.error

  const supabase = getSupabaseServiceRole()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const emailNorm = auth.email.trim().toLowerCase()
  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .eq('user_email', emailNorm)
    .order('paid_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
