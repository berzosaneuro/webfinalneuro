'use client'

import { useState, useEffect, lazy, Suspense } from 'react'
import EliasOrb from './EliasOrb'

const EliasChatPanel = lazy(() => import('./EliasChatPanel'))

export default function EliasAssistant() {
  const [open, setOpen] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 767px)')
    setIsMobile(mq.matches)
    const fn = () => setIsMobile(mq.matches)
    mq.addEventListener('change', fn)
    return () => mq.removeEventListener('change', fn)
  }, [])

  return (
    <>
      <EliasOrb onClick={() => setOpen(true)} />
      {open && (
        <>
          <div
            className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden
          />
          <div className="fixed inset-0 z-[101] pointer-events-none flex items-end justify-center md:items-center md:justify-end md:pr-8 md:pb-8">
            <div className="pointer-events-auto w-full max-w-lg" onClick={(e) => e.stopPropagation()}>
              <Suspense fallback={null}>
                <EliasChatPanel
                  onClose={() => setOpen(false)}
                  isMobile={isMobile}
                />
              </Suspense>
            </div>
          </div>
        </>
      )}
    </>
  )
}
