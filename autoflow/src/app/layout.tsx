import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AutoFlow — Instagram Automation',
  description: 'Automate your Instagram DMs, comments and grow your audience on autopilot.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
