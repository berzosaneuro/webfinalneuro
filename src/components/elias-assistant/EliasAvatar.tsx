'use client'

import Image from 'next/image'

const AVATAR_SIZE = 40

export default function EliasAvatar({ size = AVATAR_SIZE, className = '' }: { size?: number; className?: string }) {
  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full bg-dark-surface-2 ring-1 ring-white/10 ${className}`}
      style={{ width: size, height: size }}
    >
      <Image
        src="/elias-1.jpg"
        alt="Elías Berzosa"
        width={size}
        height={size}
        className="h-full w-full object-cover"
        style={{ objectPosition: 'center 25%' }}
        unoptimized
      />
    </div>
  )
}
