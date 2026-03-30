import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireUserOr401 } from '@/lib/api-auth'

export async function GET(request: Request) {
  const auth = await requireUserOr401(request)
  if (auth.error) return auth.error

  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })

  const { data, error } = await supabase
    .from('payments')
    .select('*')
    .ilike('user_email', auth.email)
    .order('paid_at', { ascending: false })
    .limit(50)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
