'use client'

import Image from 'next/image'

const ORB_SIZE = 56

export default function EliasOrb({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Habla con Elías"
      className="elias-orb-glow fixed bottom-24 md:bottom-8 right-4 md:right-6 z-[60] rounded-full overflow-hidden shadow-lg transition-transform active:scale-95 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:ring-offset-2 focus:ring-offset-dark-primary"
      style={{
        width: ORB_SIZE,
        height: ORB_SIZE,
        boxShadow: '0 0 20px rgba(0, 102, 255, 0.3), 0 4px 12px rgba(0,0,0,0.4)',
        paddingRight: 'max(0px, env(safe-area-inset-right))',
        paddingBottom: 'max(0px, env(safe-area-inset-bottom))',
      }}
    >
      <div className="relative w-full h-full rounded-full overflow-hidden ring-2 ring-white/20">
        <Image
          src="/elias-1.jpg"
          alt="Elías Berzosa"
          width={ORB_SIZE}
          height={ORB_SIZE}
          className="h-full w-full object-cover"
          style={{ objectPosition: 'center 25%' }}
          unoptimized
        />
      </div>
    </button>
  )
}
