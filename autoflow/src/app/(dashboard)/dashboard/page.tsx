import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Zap, MessageCircle, TrendingUp, Plus, Instagram, ArrowRight, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { formatNumber, formatDate } from '@/lib/utils'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const [user, flows, contacts, accounts] = await Promise.all([
    prisma.user.findUnique({ where: { id: userId } }),
    prisma.flow.findMany({
      where: { userId },
      include: { stats: true, account: { select: { username: true } } },
      orderBy: { updatedAt: 'desc' },
      take: 5,
    }),
    prisma.contact.count({ where: { userId } }),
    prisma.instagramAccount.findMany({
      where: { userId, isActive: true },
      select: { id: true, username: true, name: true, profilePicUrl: true },
    }),
  ])

  const activeFlows = flows.filter((f) => f.isActive).length
  const totalTriggered = flows.reduce((sum, f) => sum + (f.stats?.triggered ?? 0), 0)

  const stats = [
    { label: 'Total Contacts', value: formatNumber(contacts), icon: Users, color: 'text-brand' },
    { label: 'Active Flows', value: String(activeFlows), icon: Zap, color: 'text-success' },
    { label: 'Messages Sent', value: formatNumber(totalTriggered), icon: MessageCircle, color: 'text-instagram' },
    { label: 'Conversion Rate', value: '—', icon: TrendingUp, color: 'text-warning' },
  ]

  return (
    <div className="p-8 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">
            Good morning, {session.user?.name?.split(' ')[0] ?? 'there'} 👋
          </h1>
          <p className="text-text-secondary mt-1">Here's what's happening with your automations.</p>
        </div>
        <Link href="/flows/new">
          <Button>
            <Plus className="w-4 h-4" />
            New Flow
          </Button>
        </Link>
      </div>

      {/* No Instagram account warning */}
      {accounts.length === 0 && (
        <div className="bg-instagram/10 border border-instagram/20 rounded-2xl p-5 mb-6 flex items-center gap-4">
          <AlertCircle className="w-5 h-5 text-instagram flex-shrink-0" />
          <div className="flex-1">
            <p className="font-medium">Connect your Instagram account to get started</p>
            <p className="text-sm text-text-secondary">You need at least one Instagram Business account to create automations.</p>
          </div>
          <Link href="/settings">
            <Button variant="instagram" size="sm">
              <Instagram className="w-4 h-4" />
              Connect Instagram
            </Button>
          </Link>
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <div className="flex items-center justify-between mb-3">
              <span className="text-text-muted text-sm">{s.label}</span>
              <s.icon className={`w-4 h-4 ${s.color}`} />
            </div>
            <p className="text-3xl font-bold">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Connected accounts */}
      {accounts.length > 0 && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider mb-3">Connected Accounts</h2>
          <div className="flex gap-3 flex-wrap">
            {accounts.map((acc) => (
              <div key={acc.id} className="flex items-center gap-2.5 bg-dark-card border border-dark-border rounded-xl px-4 py-2.5">
                <div className="w-7 h-7 instagram-gradient rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {acc.username[0].toUpperCase()}
                </div>
                <div>
                  <p className="text-sm font-medium">@{acc.username}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Flows */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-text-muted uppercase tracking-wider">Recent Flows</h2>
          <Link href="/flows" className="text-sm text-brand hover:text-brand-hover flex items-center gap-1">
            View all <ArrowRight className="w-3 h-3" />
          </Link>
        </div>

        {flows.length === 0 ? (
          <div className="bg-dark-card border border-dashed border-dark-border rounded-2xl p-12 text-center">
            <Zap className="w-8 h-8 text-text-muted mx-auto mb-3" />
            <p className="font-medium mb-1">No flows yet</p>
            <p className="text-text-muted text-sm mb-4">Create your first automation flow to start capturing leads.</p>
            <Link href="/flows/new">
              <Button variant="secondary" size="sm">
                <Plus className="w-4 h-4" />
                Create a flow
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {flows.map((flow) => (
              <Link key={flow.id} href={`/flows/${flow.id}`}>
                <div className="bg-dark-card border border-dark-border hover:border-brand/30 rounded-2xl p-5 flex items-center gap-4 transition-all group">
                  <div className="w-9 h-9 bg-brand/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:bg-brand/20 transition-colors">
                    <Zap className="w-4 h-4 text-brand" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{flow.name}</p>
                    <p className="text-sm text-text-muted">
                      {flow.account ? `@${flow.account.username}` : 'No account'} · Updated {formatDate(flow.updatedAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right hidden sm:block">
                      <p className="text-sm font-semibold">{formatNumber(flow.stats?.triggered ?? 0)}</p>
                      <p className="text-xs text-text-muted">triggered</p>
                    </div>
                    <Badge variant={flow.isActive ? 'success' : 'default'}>
                      {flow.isActive ? 'Active' : 'Draft'}
                    </Badge>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
