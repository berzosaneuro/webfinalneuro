'use client'

import { useState, useEffect, useLayoutEffect } from 'react'
import { createPortal } from 'react-dom'
import { usePathname } from 'next/navigation'
import EliasOrb from './EliasOrb'
import EliasChatPanel from './EliasChatPanel'

export default function EliasAssistant() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mounted, setMounted] = useState(false)
  const pathname = usePathname()

  useLayoutEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const fn = () => setIsMobile(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  const hideLauncher =
    pathname.startsWith('/admin') ||
    pathname.startsWith('/ia-coach')

  const tree = (
    <>
      {!hideLauncher && <EliasOrb onClick={() => setOpen(true)} />}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm"
            style={{ zIndex: 100 }}
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div
            className="fixed inset-0 pointer-events-none flex items-end justify-center md:items-center md:justify-end md:pr-6 md:pb-6 md:pt-6"
            style={{ zIndex: 101 }}
          >
            <div
              className="pointer-events-auto w-full max-w-lg max-h-[100dvh] md:max-h-none"
              onClick={(e) => e.stopPropagation()}
            >
              <EliasChatPanel onClose={() => setOpen(false)} isMobile={isMobile} />
            </div>
          </div>
        </>
      )}
    </>
  )

  if (!mounted) return null

  return createPortal(tree, document.body)
}
