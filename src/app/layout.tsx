import type { Metadata, Viewport } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import BottomTabBar from '@/components/BottomTabBar'
import PWARegister from '@/components/PWARegister'
import FirebaseMessagingRegister from '@/components/FirebaseMessagingRegister'
import AudioRouteHandler from '@/components/AudioRouteHandler'
import EliasAssistant from '@/components/elias-assistant/EliasAssistant'
import { PremiumProvider } from '@/context/PremiumContext'
import { AdminProvider } from '@/context/AdminContext'
import { UserProvider } from '@/context/UserContext'
import { LoveModeProvider } from '@/context/LoveModeContext'
import { LOVE_THEME_HINT_STORAGE_KEY, LOVE_THEME_HINT_VALUE } from '@/lib/personalized-ui'

/** Ejecuta antes del paint para evitar flash de tema si hay sesión Love previa (hint en localStorage). */
const loveThemeBootScript = `(function(){try{var k=localStorage.getItem(${JSON.stringify(LOVE_THEME_HINT_STORAGE_KEY)});if(k===${JSON.stringify(LOVE_THEME_HINT_VALUE)}){document.documentElement.setAttribute("data-theme","love");}}catch(e){}})();`

export const metadata: Metadata = {
  title: 'Berzosa Neuro — Método N.E.U.R.O.',
  description: 'Menos ruido mental, más claridad cada día. Método N.E.U.R.O.: pasos que uso y enseño, en el móvil, sin rodeos.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Berzosa Neuro',
  },
  openGraph: {
    title: 'Berzosa Neuro — Menos ruido, más presencia',
    description: 'Funciona en el día a día: Método N.E.U.R.O. con práctica guiada. Lo uso. Lo comparto. Tú pruebas y ves.',
    siteName: 'Berzosa Neuro',
    locale: 'es_ES',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Berzosa Neuro — Menos ruido, más presencia',
    description: 'Claridad con método: práctica diaria en el móvil. Directo, repetible, comprobable.',
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
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: loveThemeBootScript }} />
        <link rel="icon" href="/icons/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icons/logo.png" />
      </head>
      <body className="overflow-x-hidden min-h-screen">
        <UserProvider>
          <LoveModeProvider>
            <AdminProvider>
              <PremiumProvider>
                <PWARegister />
                <FirebaseMessagingRegister />
                <AudioRouteHandler />
                <Navbar />
                <main className="min-h-screen pb-20 md:pb-0">{children}</main>
                <Footer />
                <BottomTabBar />
                <EliasAssistant />
              </PremiumProvider>
            </AdminProvider>
          </LoveModeProvider>
        </UserProvider>
      </body>
    </html>
  )
}
