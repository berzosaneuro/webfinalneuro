import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  const body = await req.json()

  const flow = await prisma.flow.updateMany({
    where: { id: params.id, userId },
    data: {
      ...(body.name        !== undefined && { name:          body.name }),
      ...(body.triggerType !== undefined && { triggerType:   body.triggerType }),
      ...(body.accountId   !== undefined && { accountId:     body.accountId }),
      ...(body.nodes       !== undefined && { nodes:         body.nodes }),
      ...(body.edges       !== undefined && { edges:         body.edges }),
      ...(body.isActive    !== undefined && { isActive:      body.isActive }),
    },
  })

  return NextResponse.json({ ok: true, count: flow.count })
}

export async function DELETE(_req: Request, { params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const userId = (session.user as any).id
  await prisma.flow.deleteMany({ where: { id: params.id, userId } })
  return NextResponse.json({ ok: true })
}
