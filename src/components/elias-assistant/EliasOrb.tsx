'use client'

import Image from 'next/image'

const ORB_SIZE = 56

export default function EliasOrb({ onClick }: { onClick: () => void }) {
  return (
    <div
      className="fixed bottom-[5.9rem] md:bottom-8 right-4 md:right-6 z-[60]"
      style={{
        paddingRight: 'max(0px, env(safe-area-inset-right))',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
      }}
    >
      <button
        type="button"
        onClick={onClick}
        aria-label="Habla con Elías"
        className="elias-orb-glow rounded-full overflow-hidden shadow-lg transition-transform active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-2 focus:ring-offset-dark-primary"
        style={{
          width: ORB_SIZE,
          height: ORB_SIZE,
          boxShadow: '0 0 20px rgba(0, 102, 255, 0.3), 0 4px 12px rgba(0,0,0,0.4)',
        }}
      >
        <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/20">
          <Image
            src="/elias-1.jpg"
            alt="Elías Berzosa"
            width={ORB_SIZE}
            height={ORB_SIZE}
            className="h-full w-full object-cover scale-[1.05]"
            style={{ objectPosition: 'center 22%' }}
            unoptimized
          />
        </div>
      </button>
      <button
        type="button"
        onClick={onClick}
        className="absolute left-1/2 -translate-x-1/2 top-full mt-1.5 px-2.5 py-1 rounded-lg glass text-[10px] font-medium text-white/95 border border-white/15 active:scale-95 transition-transform whitespace-nowrap"
        aria-label="Abrir chat de Elías"
      >
        Pregúntame
      </button>
    </div>
  )
}
