import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { BarChart2, TrendingUp, MessageCircle, Users, Zap } from 'lucide-react'
import { formatNumber } from '@/lib/utils'

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const [flowStats, contacts, flows] = await Promise.all([
    prisma.flowStats.findMany({
      where: { flow: { userId } },
      include: { flow: { select: { name: true, isActive: true } } },
      orderBy: { triggered: 'desc' },
    }),
    prisma.contact.count({ where: { userId } }),
    prisma.flow.count({ where: { userId, isActive: true } }),
  ])

  const totals = flowStats.reduce(
    (acc, s) => ({
      triggered:  acc.triggered  + s.triggered,
      completed:  acc.completed  + s.completed,
      replied:    acc.replied    + s.replied,
      converted:  acc.converted  + s.converted,
    }),
    { triggered: 0, completed: 0, replied: 0, converted: 0 }
  )

  const convRate = totals.triggered > 0
    ? ((totals.converted / totals.triggered) * 100).toFixed(1)
    : '0'

  const stats = [
    { label: 'Total Triggered', value: formatNumber(totals.triggered), icon: Zap,           color: 'text-brand' },
    { label: 'Messages Sent',   value: formatNumber(totals.replied),   icon: MessageCircle, color: 'text-instagram' },
    { label: 'Contacts',        value: formatNumber(contacts),          icon: Users,         color: 'text-success' },
    { label: 'Conversion Rate', value: `${convRate}%`,                 icon: TrendingUp,    color: 'text-warning' },
  ]

  return (
    <div className="p-8 animate-fade-in">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Analytics</h1>
        <p className="text-text-secondary mt-1">Performance overview of all your flows</p>
      </div>

      {/* Overview */}
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

      {/* Flow breakdown */}
      <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
        <div className="p-5 border-b border-dark-border">
          <h2 className="font-semibold flex items-center gap-2">
            <BarChart2 className="w-4 h-4 text-brand" />
            Flow Performance
          </h2>
        </div>

        {flowStats.length === 0 ? (
          <div className="p-12 text-center text-text-muted">
            No data yet. Activate a flow to start seeing stats.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Flow', 'Status', 'Triggered', 'Completed', 'Replies', 'Converted'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {flowStats.map((s) => {
                  const rate = s.triggered > 0 ? ((s.converted / s.triggered) * 100).toFixed(0) : '0'
                  return (
                    <tr key={s.id} className="border-b border-dark-border/50 hover:bg-dark-surface/30 transition-colors">
                      <td className="px-5 py-4">
                        <p className="text-sm font-medium">{s.flow.name}</p>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                          s.flow.isActive
                            ? 'bg-success/10 text-success'
                            : 'bg-dark-surface text-text-muted'
                        }`}>
                          {s.flow.isActive ? 'Active' : 'Draft'}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-sm">{formatNumber(s.triggered)}</td>
                      <td className="px-5 py-4 text-sm">{formatNumber(s.completed)}</td>
                      <td className="px-5 py-4 text-sm">{formatNumber(s.replied)}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{formatNumber(s.converted)}</span>
                          <span className="text-xs text-text-muted">({rate}%)</span>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
