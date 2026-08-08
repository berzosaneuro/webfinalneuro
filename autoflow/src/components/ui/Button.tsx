'use client'
import { cn } from '@/lib/utils'
import { ButtonHTMLAttributes, forwardRef } from 'react'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'instagram'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', loading, children, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed'

    const variants = {
      primary:   'bg-brand text-white hover:bg-brand-hover active:scale-95 shadow-lg shadow-brand/20',
      secondary: 'bg-dark-card border border-dark-border text-text-primary hover:bg-dark-surface active:scale-95',
      ghost:     'text-text-secondary hover:text-text-primary hover:bg-dark-card active:scale-95',
      danger:    'bg-danger text-white hover:bg-red-600 active:scale-95',
      instagram: 'bg-gradient-to-r from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white hover:opacity-90 active:scale-95',
    }

    const sizes = {
      sm: 'text-xs px-3 py-1.5',
      md: 'text-sm px-4 py-2',
      lg: 'text-base px-6 py-3',
    }

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
        )}
        {children}
      </button>
    )
  }
)
Button.displayName = 'Button'
