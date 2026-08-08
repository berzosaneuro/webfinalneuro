import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect, notFound } from 'next/navigation'
import { FlowBuilder } from '@/components/flow-builder/FlowBuilder'

export default async function FlowPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  // "new" route
  if (params.id === 'new') {
    const accounts = await prisma.instagramAccount.findMany({
      where: { userId, isActive: true },
      select: { id: true, username: true },
    })
    return <FlowBuilder flow={null} accounts={accounts} />
  }

  const flow = await prisma.flow.findFirst({
    where: { id: params.id, userId },
    include: {
      account: { select: { id: true, username: true } },
      stats: true,
    },
  })

  if (!flow) notFound()

  const accounts = await prisma.instagramAccount.findMany({
    where: { userId, isActive: true },
    select: { id: true, username: true },
  })

  return <FlowBuilder flow={flow as any} accounts={accounts} />
}
