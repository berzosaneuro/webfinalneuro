'use client'

import Image from 'next/image'

const AVATAR_PX = 56

/**
 * FAB del coach: fijo en viewport, derecha, centrado vertical sin depender de ancestros (ideal con portal a body).
 */
export default function EliasOrb({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="pointer-events-none flex flex-col items-center gap-1.5"
      style={{
        position: 'fixed',
        zIndex: 95,
        right: 'max(0.75rem, env(safe-area-inset-right, 0px))',
        top: 0,
        bottom: 0,
        height: 'fit-content',
        marginTop: 'auto',
        marginBottom: 'auto',
        width: 'max-content',
        maxWidth: 'min(100vw - 1rem, 5.5rem)',
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Abrir IA Coach — pregúntame"
        className="pointer-events-auto shrink-0 rounded-full overflow-hidden transition-transform duration-200 active:scale-95 hover:scale-[1.04] focus:outline-none focus-visible:ring-2 focus-visible:ring-accent-blue/70 focus-visible:ring-offset-2 focus-visible:ring-offset-[#080B16] touch-manipulation"
        style={{
          width: AVATAR_PX,
          height: AVATAR_PX,
          boxShadow:
            '0 10px 28px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.14), 0 0 20px rgba(124,58,237,0.2)',
        }}
      >
        <div className="relative h-full w-full rounded-full overflow-hidden ring-2 ring-white/30">
          <Image
            src="/elias-1.jpg"
            alt=""
            width={AVATAR_PX}
            height={AVATAR_PX}
            className="h-full w-full object-cover"
            style={{ objectPosition: 'center 25%' }}
            unoptimized
            priority
          />
        </div>
      </button>
      <span
        className="pointer-events-none select-none whitespace-nowrap text-center text-[11px] font-semibold leading-tight tracking-tight text-white"
        style={{
          textShadow: '0 1px 3px rgba(0,0,0,0.95), 0 0 12px rgba(0,0,0,0.6)',
        }}
      >
        pregúntame
      </span>
    </div>
  )
}
