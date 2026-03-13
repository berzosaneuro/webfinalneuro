'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import { Menu, X, Crown, Shield, ChevronDown, Wind, BookOpen, Users, LayoutDashboard, Briefcase } from 'lucide-react'
import { usePremium } from '@/context/PremiumContext'
import { useAdmin } from '@/context/AdminContext'

const mainLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/meditacion', label: 'Meditación' },
  { href: '/retos', label: 'Retos' },
  { href: '/biblioteca', label: 'Biblioteca' },
  { href: '/masterclass', label: 'Masterclass' },
  { href: '/comunidad', label: 'Comunidad' },
  { href: '/podcast', label: 'Podcast' },
]

const moreLinks = [
  { href: '/plan-7-dias', label: '7 Días' },
  { href: '/programa', label: '21 Días' },
  { href: '/ia-coach', label: 'IA Coach' },
  { href: '/circulos', label: 'Círculos' },
  { href: '/leaderboard', label: 'Ranking' },
  { href: '/certificacion', label: 'Certificación' },
  { href: '/metodo', label: 'El Método' },
  { href: '/sobre', label: 'Sobre Berzosa' },
]

const mobileCategoryIcons: Record<string, typeof Wind> = {
  Practicar: Wind,
  Aprender: BookOpen,
  Comunidad: Users,
  Herramientas: LayoutDashboard,
  Profesional: Briefcase,
}

const mobileLinks = [
  { category: 'Practicar', items: [
    { href: '/', label: 'Inicio' },
    { href: '/meditacion', label: 'Meditar' },
    { href: '/sonidos', label: 'Sonidos' },
    { href: '/ejercicios', label: 'Ejercicios' },
    { href: '/sos', label: 'SOS' },
    { href: '/plan-7-dias', label: '7 Días Gratis' },
    { href: '/programa', label: '21 Días' },
    { href: '/retos', label: 'Retos' },
  ]},
  { category: 'Aprender', items: [
    { href: '/masterclass', label: 'Masterclass' },
    { href: '/podcast', label: 'NeuroPodcast' },
    { href: '/biblioteca', label: 'Biblioteca' },
    { href: '/despertar', label: 'Despertar' },
    { href: '/ia-coach', label: 'IA Coach' },
    { href: '/metodo', label: 'El Método' },
  ]},
  { category: 'Comunidad', items: [
    { href: '/comunidad', label: 'Foro' },
    { href: '/circulos', label: 'Círculos' },
    { href: '/leaderboard', label: 'Ranking' },
    { href: '/historias', label: 'Historias' },
    { href: '/referidos', label: 'Referidos' },
  ]},
  { category: 'Herramientas', items: [
    { href: '/diario', label: 'Diario' },
    { href: '/neuroscore', label: 'NeuroScore' },
    { href: '/mapa', label: 'Mapa' },
    { href: '/notificaciones', label: 'Notificaciones' },
  ]},
  { category: 'Profesional', items: [
    { href: '/captacion', label: 'Captación' },
    { href: '/certificacion', label: 'Certificación' },
    { href: '/corporativo', label: 'Empresas' },
    { href: '/retiro', label: 'Retiro' },
    { href: '/marketplace', label: 'Marketplace' },
  ]},
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [moreOpen, setMoreOpen] = useState(false)
  const { isPremium } = usePremium()
  const { isAdmin } = useAdmin()
  const pathname = usePathname()

  return (
    <>
      {/* Desktop navbar */}
      <nav className="hidden md:block sticky top-0 z-50 ios-header">
        <div className="max-w-7xl mx-auto px-4 lg:px-6">
          <div className="flex items-center justify-between h-14">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group shrink-0">
              <Image src="/icons/logo.png" alt="Berzosa Neuro" width={28} height={28} className="rounded-lg" />
              <span className="font-heading font-bold text-base text-white">Berzosa Neuro</span>
            </Link>

            {/* Main links */}
            <div className="flex items-center gap-0.5">
              {mainLinks.map((link) => {
                const isActive = pathname === link.href
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isActive
                        ? 'text-white bg-white/10'
                        : 'text-text-secondary hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {link.label}
                  </Link>
                )
              })}

              {/* Más dropdown */}
              <div className="relative">
                <button
                  onClick={() => setMoreOpen(!moreOpen)}
                  onBlur={() => setTimeout(() => setMoreOpen(false), 150)}
                  className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    moreOpen ? 'text-white bg-white/10' : 'text-text-secondary hover:text-white hover:bg-white/5'
                  }`}
                >
                  Más <ChevronDown className={`w-3 h-3 transition-transform ${moreOpen ? 'rotate-180' : ''}`} />
                </button>
                {moreOpen && (
                  <div className="absolute top-full left-0 mt-1 w-44 rounded-xl border border-white/10 overflow-hidden z-50" style={{ background: '#050505' }}>
                    {moreLinks.map((link) => {
                      const isActive = pathname === link.href
                      return (
                        <Link
                          key={link.href}
                          href={link.href}
                          onClick={() => setMoreOpen(false)}
                          className={`block px-4 py-2 text-xs transition-all ${
                            isActive ? 'text-white bg-white/10 font-medium' : 'text-text-secondary hover:text-white hover:bg-white/5'
                          }`}
                        >
                          {link.label}
                        </Link>
                      )
                    })}
                  </div>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-2 shrink-0">
              <Link
                href="/acceder"
                className="px-3 py-1.5 text-text-secondary hover:text-white text-xs font-medium transition-all active:scale-95"
              >
                Acceder
              </Link>
              {isPremium ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-accent-blue/15 text-accent-blue text-xs font-semibold rounded-full border border-accent-blue/20">
                  <Crown className="w-3 h-3" />
                  Premium
                </span>
              ) : (
                <Link
                  href="/registro"
                  className="px-4 py-1.5 bg-white text-black text-xs font-semibold rounded-full hover:bg-white/90 transition-all active:scale-95"
                >
                  Empezar gratis
                </Link>
              )}
              <Link
                href={isAdmin ? '/admin' : '/admin/login'}
                className={`p-1.5 rounded-lg transition-all ${
                  pathname.startsWith('/admin')
                    ? 'text-white bg-white/10'
                    : 'text-text-muted hover:text-white hover:bg-white/5'
                }`}
                title="Panel Admin"
              >
                <Shield className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile top bar */}
      <div className="md:hidden sticky top-0 z-50 ios-header">
        <div className="flex items-center justify-between px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/icons/logo.png" alt="Berzosa Neuro" width={32} height={32} className="rounded-xl" />
            <span className="font-heading font-semibold text-white">Berzosa Neuro</span>
          </Link>
          <button
            onClick={() => setOpen(!open)}
            className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/8 text-white active:scale-90 transition-transform border border-white/10"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile dropdown */}
        {open && (
          <div className="absolute top-full left-0 right-0 z-40 animate-slide-up max-h-[85vh] overflow-y-auto overscroll-contain pb-8" style={{ scrollbarWidth: 'none', background: 'linear-gradient(180deg, #080B16 0%, #0a0e1a 100%)', borderBottom: '1px solid rgba(124,58,237,0.15)', boxShadow: '0 20px 60px -20px rgba(0,0,0,0.6)' }}>
            <div className="p-4 space-y-5">
              {mobileLinks.map((group) => {
                const CatIcon = mobileCategoryIcons[group.category]
                return (
                  <div key={group.category} className="glass rounded-2xl p-3 overflow-hidden">
                    <div className="flex items-center gap-2 px-2 py-1.5 mb-2">
                      {CatIcon && (
                        <div className="w-7 h-7 rounded-lg bg-accent-blue/15 flex items-center justify-center shrink-0">
                          <CatIcon className="w-3.5 h-3.5 text-accent-blue" />
                        </div>
                      )}
                      <p className="text-accent-blue/90 text-[11px] uppercase tracking-widest font-semibold">{group.category}</p>
                    </div>
                    <div className="space-y-0.5">
                      {group.items.map((link) => {
                        const isActive = pathname === link.href
                        return (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setOpen(false)}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all active:scale-[0.98] ${
                              isActive
                                ? 'text-white bg-accent-blue/15 font-medium border border-accent-blue/20'
                                : 'text-text-secondary active:text-white active:bg-white/5'
                            }`}
                          >
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-accent-blue shrink-0" />}
                            <span className={isActive ? '' : 'pl-1'}>{link.label}</span>
                          </Link>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
              <div className="flex gap-3 pt-1">
                <Link
                  href="/acceder"
                  onClick={() => setOpen(false)}
                  className="py-3 px-5 rounded-xl text-sm font-medium text-text-secondary active:text-white glass"
                >
                  Acceder
                </Link>
                <Link
                  href="/registro"
                  onClick={() => setOpen(false)}
                  className="flex-1 py-3 bg-accent-blue text-white text-sm font-bold rounded-xl text-center active:scale-[0.98] shadow-[0_0_20px_rgba(124,58,237,0.3)]"
                >
                  Empezar gratis
                </Link>
                <Link
                  href={isAdmin ? '/admin' : '/admin/login'}
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm text-text-secondary active:text-white glass"
                >
                  <Shield className="w-4 h-4" />
                  Admin
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
