import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'brand' | 'instagram'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  const variants = {
    default:   'bg-dark-surface text-text-secondary border border-dark-border',
    success:   'bg-success/10 text-success border border-success/20',
    warning:   'bg-warning/10 text-warning border border-warning/20',
    danger:    'bg-danger/10 text-danger border border-danger/20',
    brand:     'bg-brand/10 text-brand border border-brand/20',
    instagram: 'bg-instagram/10 text-instagram border border-instagram/20',
  }

  return (
    <span className={cn('inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full', variants[variant], className)}>
      {children}
    </span>
  )
}
