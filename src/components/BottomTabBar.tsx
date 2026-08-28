'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Brain, Headphones, Flame, Sparkles } from 'lucide-react'

const tabs = [
  { href: '/', label: 'Inicio', icon: Brain },
  { href: '/meditacion', label: 'Meditar', icon: Headphones },
  { href: '/plan-7-dias', label: 'Reto 7 Días', icon: Sparkles },
  { href: '/retos', label: 'Retos', icon: Flame },
]

export default function BottomTabBar() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 tab-bar md:hidden">
      <div className="flex items-center justify-around px-2 pt-2">
        {tabs.map((tab) => {
          const isActive = pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-200 active:scale-90 min-w-[56px] ${
                isActive ? 'text-accent-blue' : 'text-text-secondary'
              }`}
            >
              <div className={`relative p-1.5 rounded-xl transition-all duration-200 ${
                isActive ? 'bg-accent-blue/10' : ''
              }`}>
                <tab.icon className="w-5 h-5" strokeWidth={isActive ? 2.2 : 1.5} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-semibold' : ''}`}>
                {tab.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
