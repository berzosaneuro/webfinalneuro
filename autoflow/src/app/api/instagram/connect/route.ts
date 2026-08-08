import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getOAuthUrl } from '@/lib/instagram'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const state = Buffer.from((session.user as any).id).toString('base64')
  const url = getOAuthUrl(state)

  return NextResponse.redirect(url)
}
