import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Plus, Zap, MessageCircle, Hash, AtSign, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatNumber, formatDate } from '@/lib/utils'

const TRIGGER_ICONS: Record<string, React.ElementType> = {
  dm_keyword:      MessageCircle,
  comment_keyword: Hash,
  story_mention:   AtSign,
  first_dm:        Sparkles,
}

const TRIGGER_LABELS: Record<string, string> = {
  dm_keyword:      'DM Keyword',
  comment_keyword: 'Comment Keyword',
  story_mention:   'Story Mention',
  first_dm:        'First DM',
}

export default async function FlowsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const flows = await prisma.flow.findMany({
    where: { userId },
    include: {
      stats: true,
      account: { select: { username: true } },
    },
    orderBy: { updatedAt: 'desc' },
  })

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Flows</h1>
          <p className="text-text-secondary mt-1">
            {flows.length} flow{flows.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <Link href="/flows/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Flow
          </Button>
        </Link>
      </div>

      {flows.length === 0 ? (
        <div className="bg-dark-card border border-dashed border-dark-border rounded-2xl p-16 text-center">
          <div className="w-12 h-12 bg-brand/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-6 h-6 text-brand" />
          </div>
          <h3 className="text-lg font-semibold mb-2">Create your first flow</h3>
          <p className="text-text-muted mb-6 max-w-sm mx-auto">
            Flows automate your Instagram conversations. Set a trigger, build your response sequence, and let it run 24/7.
          </p>
          <Link href="/flows/new">
            <Button>
              <Plus className="w-4 h-4" />
              Create a flow
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {flows.map((flow) => {
            const Icon = TRIGGER_ICONS[flow.triggerType] ?? Zap
            return (
              <Link key={flow.id} href={`/flows/${flow.id}`}>
                <div className="bg-dark-card border border-dark-border hover:border-brand/30 rounded-2xl p-5 transition-all group cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors">
                      <Icon className="w-5 h-5 text-brand" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="font-semibold truncate">{flow.name}</h3>
                        <Badge variant={flow.isActive ? 'success' : 'default'}>
                          {flow.isActive ? 'Active' : 'Draft'}
                        </Badge>
                        <Badge variant="default">{TRIGGER_LABELS[flow.triggerType]}</Badge>
                      </div>
                      <p className="text-sm text-text-muted mt-0.5">
                        {flow.account ? `@${flow.account.username}` : 'No account assigned'} ·{' '}
                        Updated {formatDate(flow.updatedAt)}
                      </p>
                    </div>

                    <div className="flex gap-6 flex-shrink-0 hidden sm:flex">
                      {[
                        { label: 'Triggered', v: flow.stats?.triggered ?? 0 },
                        { label: 'Completed', v: flow.stats?.completed ?? 0 },
                        { label: 'Replies', v: flow.stats?.replied ?? 0 },
                      ].map(({ label, v }) => (
                        <div key={label} className="text-right">
                          <p className="font-semibold text-sm">{formatNumber(v)}</p>
                          <p className="text-xs text-text-muted">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
