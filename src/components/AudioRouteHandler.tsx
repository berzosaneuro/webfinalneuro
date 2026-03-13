'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'
import { stopAll } from '@/lib/audio-manager'

export default function AudioRouteHandler() {
  const pathname = usePathname()

  useEffect(() => {
    stopAll()
  }, [pathname])

  return null
}
