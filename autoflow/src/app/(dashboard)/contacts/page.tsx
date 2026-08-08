import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { redirect } from 'next/navigation'
import { Users, Search } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { formatDate } from '@/lib/utils'

export default async function ContactsPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect('/login')

  const userId = (session.user as any).id

  const contacts = await prisma.contact.findMany({
    where: { userId },
    include: { account: { select: { username: true } } },
    orderBy: { subscribedAt: 'desc' },
    take: 100,
  })

  const total = await prisma.contact.count({ where: { userId } })

  return (
    <div className="p-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Contacts</h1>
          <p className="text-text-secondary mt-1">{total.toLocaleString()} subscribers total</p>
        </div>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-dark-card border border-dashed border-dark-border rounded-2xl p-16 text-center">
          <Users className="w-8 h-8 text-text-muted mx-auto mb-3" />
          <p className="font-medium mb-1">No contacts yet</p>
          <p className="text-text-muted text-sm">
            Contacts appear here when someone interacts with your active flows.
          </p>
        </div>
      ) : (
        <div className="bg-dark-card border border-dark-border rounded-2xl overflow-hidden">
          {/* Search bar */}
          <div className="p-4 border-b border-dark-border">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                placeholder="Search contacts..."
                className="w-full bg-dark-surface border border-dark-border rounded-xl pl-9 pr-4 py-2 text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-brand"
              />
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-dark-border">
                  {['Contact', 'Account', 'Tags', 'Subscribed', 'Status'].map((h) => (
                    <th key={h} className="text-left text-xs font-semibold text-text-muted uppercase tracking-wider px-5 py-3">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.map((c) => (
                  <tr key={c.id} className="border-b border-dark-border/50 hover:bg-dark-surface/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-brand/10 rounded-full flex items-center justify-center text-xs font-bold text-brand">
                          {(c.username ?? c.igUserId)[0]?.toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{c.name ?? c.username ?? 'Unknown'}</p>
                          <p className="text-xs text-text-muted">@{c.username ?? c.igUserId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">
                      @{c.account.username}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex gap-1 flex-wrap">
                        {c.tags.length > 0
                          ? c.tags.map((tag) => <Badge key={tag} variant="brand">{tag}</Badge>)
                          : <span className="text-xs text-text-muted">—</span>
                        }
                      </div>
                    </td>
                    <td className="px-5 py-4 text-sm text-text-muted">
                      {formatDate(c.subscribedAt)}
                    </td>
                    <td className="px-5 py-4">
                      <Badge variant={c.isSubscribed ? 'success' : 'danger'}>
                        {c.isSubscribed ? 'Subscribed' : 'Unsubscribed'}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
