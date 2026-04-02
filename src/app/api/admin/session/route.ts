import { NextResponse } from 'next/server'
import { getUserSessionFromHeaders } from '@/lib/server-auth'

export async function GET(request: Request) {
  const session = await getUserSessionFromHeaders(request.headers)
  return NextResponse.json({ isAdmin: session?.role === 'master' })
}

export async function POST() {
  return NextResponse.json({ error: 'Usa /acceder con credenciales master' }, { status: 410 })
}

export async function DELETE() {
  return NextResponse.json({ ok: true })
}
