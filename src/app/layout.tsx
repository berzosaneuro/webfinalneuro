import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomTabBar from '@/components/BottomTabBar'
import PWARegister from '@/components/PWARegister'
import { PremiumProvider } from '@/context/PremiumContext'
import { AdminProvider } from '@/context/AdminContext'
import { UserProvider } from '@/context/UserContext'

export const metadata: Metadata = {
  title: 'Berzosa Neuro — Método N.E.U.R.O.',
  description: 'Entrena tu cerebro. Apaga el ruido mental. Vive desde el presente. Neurociencia aplicada a la conciencia.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Berzosa Neuro',
  },
  openGraph: {
    title: 'Berzosa Neuro — Entrena tu cerebro',
    description: 'Neuroplasticidad, metacognición y presencia. El método N.E.U.R.O. para apagar el ruido mental y vivir despierto. Sin misticismo.',
    siteName: 'Berzosa Neuro',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berzosa Neuro — Entrena tu cerebro',
    description: 'Neuroplasticidad, metacognición y presencia. El método N.E.U.R.O. para apagar el ruido mental.',
    creator: '@berzosaneuro',
  },
  keywords: ['neurociencia', 'meditación', 'neuroplasticidad', 'metacognición', 'conciencia', 'método neuro', 'ruido mental', 'presencia', 'berzosa neuro'],
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
      <body>
        <AdminProvider>
          <UserProvider>
          <PremiumProvider>
            <PWARegister />
            <Navbar />
            <main className="min-h-screen pb-20 md:pb-0">{children}</main>
            <Footer />
            <BottomTabBar />
          </PremiumProvider>
          </UserProvider>
        </AdminProvider>
      </body>
    </html>
  )
}
