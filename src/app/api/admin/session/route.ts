import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/server-auth'

export async function GET() {
  const user = await getAuthUser()
  return NextResponse.json({ isAdmin: user?.role === 'admin' || user?.role === 'master' })
}

export async function POST() {
  return NextResponse.json({ error: 'Usa /acceder con credenciales de admin' }, { status: 410 })
}

export async function DELETE() {
  return NextResponse.json({ ok: true })
}
