'use client'
import { SessionProvider } from 'next-auth/react'
import { useSession, signOut } from 'next-auth/react'
import { useRouter, usePathname } from 'next/navigation'
import { useEffect } from 'react'
import Link from 'next/link'
import {
  LayoutDashboard, Zap, Users, BarChart2, Settings,
  Instagram, LogOut, Plus
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV = [
  { href: '/dashboard',  label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/flows',      label: 'Flows',       icon: Zap },
  { href: '/contacts',   label: 'Contacts',    icon: Users },
  { href: '/analytics',  label: 'Analytics',   icon: BarChart2 },
  { href: '/settings',   label: 'Settings',    icon: Settings },
]

function Sidebar() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  if (status === 'loading') return null

  return (
    <aside className="w-60 border-r border-dark-border bg-dark-surface flex flex-col fixed h-full z-30">
      <div className="p-5 border-b border-dark-border">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <div className="w-8 h-8 instagram-gradient rounded-lg flex items-center justify-center">
            <Instagram className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-base">AutoFlow</span>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-0.5 overflow-y-auto">
        {NAV.map(({ href, label, icon: Icon }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
              pathname === href
                ? 'bg-brand/10 text-brand'
                : 'text-text-secondary hover:text-text-primary hover:bg-dark-card'
            )}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {label}
          </Link>
        ))}
      </nav>

      <div className="p-3 border-t border-dark-border">
        <Link href="/flows/new">
          <button className="w-full flex items-center justify-center gap-2 bg-brand hover:bg-brand-hover text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            <Plus className="w-4 h-4" />
            New Flow
          </button>
        </Link>
      </div>

      <div className="p-3 border-t border-dark-border">
        <div className="flex items-center gap-3 px-3 py-2">
          <div className="w-7 h-7 bg-brand/20 rounded-full flex items-center justify-center text-xs font-bold text-brand">
            {session?.user?.name?.[0]?.toUpperCase() ?? 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">{session?.user?.name ?? 'User'}</p>
            <p className="text-xs text-text-muted truncate">{session?.user?.email}</p>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="text-text-muted hover:text-danger transition-colors"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </aside>
  )
}

function DashboardContent({ children }: { children: React.ReactNode }) {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-dark-bg flex">
      <Sidebar />
      <main className="flex-1 ml-60 min-h-screen">{children}</main>
    </div>
  )
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardContent>{children}</DashboardContent>
    </SessionProvider>
  )
}
