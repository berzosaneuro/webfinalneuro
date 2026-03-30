import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'
import { requireAdminOr401 } from '@/lib/api-auth'

export async function GET(request: Request) {
  const authError = await requireAdminOr401(request)
  if (authError) return authError
  const supabase = getSupabase()
  if (!supabase) return NextResponse.json({ error: 'Base de datos no configurada' }, { status: 503 })
  const { data, error } = await supabase
    .from('mapa_entries')
    .select('*')
    .order('date', { ascending: false })
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data || [])
}
