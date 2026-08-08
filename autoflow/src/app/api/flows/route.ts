import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const flows = await prisma.flow.findMany({
    where: { userId },
    include: { stats: true, account: { select: { username: true } } },
    orderBy: { updatedAt: 'desc' },
  })
  return NextResponse.json(flows)
}

export async function POST(req: Request) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const body = await req.json()

  const flow = await prisma.flow.create({
    data: {
      userId,
      name:          body.name ?? 'Untitled Flow',
      triggerType:   body.triggerType ?? 'dm_keyword',
      triggerConfig: body.triggerConfig ?? {},
      accountId:     body.accountId ?? null,
      nodes:         body.nodes ?? [],
      edges:         body.edges ?? [],
      isActive:      body.isActive ?? false,
    },
  })

  await prisma.flowStats.create({ data: { flowId: flow.id } })

  return NextResponse.json(flow, { status: 201 })
}
