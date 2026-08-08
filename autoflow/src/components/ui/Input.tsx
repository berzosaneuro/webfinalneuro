import { cn } from '@/lib/utils'
import { InputHTMLAttributes, forwardRef } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-text-secondary">{label}</label>}
      <input
        ref={ref}
        className={cn(
          'w-full bg-dark-surface border border-dark-border rounded-xl px-4 py-2.5 text-sm text-text-primary placeholder:text-text-muted',
          'focus:outline-none focus:ring-2 focus:ring-brand/50 focus:border-brand transition-colors',
          error && 'border-danger focus:ring-danger/50',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
