'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Headphones, Flame, Sparkles, Wand2 } from 'lucide-react'
import { usePremium } from '@/context/PremiumContext'

const tabs = [
  { href: '/', label: 'Inicio', icon: Brain },
  { href: '/meditacion', label: 'Meditar', icon: Headphones },
  { href: '/plan-7-dias', label: '7 Días', icon: Sparkles },
  { href: '/retos', label: 'Retos', icon: Flame },
  { href: '/ia-coach', label: 'IA Coach', icon: Wand2 },
]

export default function BottomTabBar() {
  const pathname = usePathname()
  const { isPremium } = usePremium()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 tab-bar md:hidden">
      <div className="flex items-center justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          const isProTab = tab.href === '/planes'

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 min-w-[56px] ${
                isActive
                  ? isProTab && isPremium
                    ? 'text-violet-400'
                    : 'text-accent-blue'
                  : 'text-text-secondary'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? isProTab && isPremium ? 'bg-violet-400/10' : 'bg-accent-blue/10' : ''
              }`}>
                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.5} />
                {isProTab && isPremium && (
                  <div className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-violet-400 rounded-full" />
                )}
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {isProTab && isPremium ? 'Activo' : tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
