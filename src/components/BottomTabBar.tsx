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
      <ul className="flex items-stretch">
        {tabs.map((tab) => {
          const isActive =
            pathname === tab.href || (tab.href !== '/' && pathname.startsWith(tab.href))
          const Icon = tab.icon

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                aria-current={isActive ? 'page' : undefined}
                className="group flex h-full flex-col items-center justify-center gap-1 px-1 py-2 min-h-[52px] tap-transparent"
              >
                <span
                  className={`flex items-center justify-center rounded-full px-4 py-1 transition-colors duration-200 ${
                    isActive ? 'bg-accent-blue/15' : 'bg-transparent group-active:bg-white/5'
                  }`}
                >
                  <Icon
                    className={`w-[22px] h-[22px] transition-colors duration-200 ${
                      isActive ? 'text-accent-blue' : 'text-text-secondary'
                    }`}
                    strokeWidth={isActive ? 2.3 : 1.8}
                  />
                </span>
                <span
                  className={`text-[10.5px] leading-none tracking-tight transition-colors duration-200 ${
                    isActive
                      ? 'font-semibold text-accent-blue'
                      : 'font-medium text-text-secondary'
                  }`}
                >
                  {tab.label}
                </span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
