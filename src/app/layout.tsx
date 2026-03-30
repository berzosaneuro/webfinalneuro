import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomTabBar from '@/components/BottomTabBar'
import PWARegister from '@/components/PWARegister'
import AudioRouteHandler from '@/components/AudioRouteHandler'
import EliasAssistant from '@/components/elias-assistant/EliasAssistant'
import { PremiumProvider } from '@/context/PremiumContext'
import { AdminProvider } from '@/context/AdminContext'
import { UserProvider } from '@/context/UserContext'

export const metadata: Metadata = {
  title: 'Berzosa Neuro — Método N.E.U.R.O.',
  description: 'Menos ruido en la cabeza, más claridad en el día a día. Método N.E.U.R.O.: pasos prácticos nacidos de experiencia real, en tu móvil.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Berzosa Neuro',
  },
  openGraph: {
    title: 'Berzosa Neuro — Menos ruido, más presencia',
    description: 'No soy científico: soy alguien que pasó por esto y encontró una salida. El Método N.E.U.R.O. te guía paso a paso, sin postureo.',
    siteName: 'Berzosa Neuro',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berzosa Neuro — Menos ruido, más presencia',
    description: 'Método N.E.U.R.O.: claridad y calma con práctica real, en tu móvil. Sin promesas mágicas.',
    creator: '@berzosaneuro',
  },
  keywords: ['ruido mental', 'ansiedad', 'meditación', 'presencia', 'método neuro', 'calma', 'hábitos', 'berzosa neuro', 'bienestar'],
  authors: [{ name: 'Berzosa Neuro' }],
  creator: 'Berzosa Neuro',
}

export const viewport: Viewport = {
  themeColor: '#080B16',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/icons/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
      </head>
      <body className="overflow-x-hidden min-h-screen">
        <AdminProvider>
          <UserProvider>
          <PremiumProvider>
            <PWARegister />
            <AudioRouteHandler />
            <Navbar />
            <main className="min-h-screen pb-20 md:pb-0">{children}</main>
            <Footer />
            <BottomTabBar />
            <EliasAssistant />
          </PremiumProvider>
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
