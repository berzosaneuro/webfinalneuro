import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const accounts = await prisma.instagramAccount.findMany({
    where: { userId },
    select: { id: true, username: true, name: true, profilePicUrl: true, isActive: true, createdAt: true },
    orderBy: { createdAt: 'desc' },
  })

  return NextResponse.json(accounts)
}
