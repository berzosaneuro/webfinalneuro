import { cn } from '@/lib/utils'
import { HTMLAttributes } from 'react'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  glass?: boolean
}

export function Card({ className, glass, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-dark-border',
        glass
          ? 'bg-dark-card/60 backdrop-blur-sm'
          : 'bg-dark-card',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5 border-b border-dark-border', className)} {...props}>
      {children}
    </div>
  )
}

export function CardContent({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('p-5', className)} {...props}>
      {children}
    </div>
  )
}
