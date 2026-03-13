import Link from 'next/link'

type ButtonProps = {
  href?: string
  variant?: 'primary' | 'secondary' | 'outline'
  children: React.ReactNode
  className?: string
  onClick?: () => void
  type?: 'button' | 'submit'
}

export default function Button({ href, variant = 'primary', children, className = '', onClick, type = 'button' }: ButtonProps) {
  const base = 'inline-flex items-center justify-center px-6 py-3 rounded-lg font-medium text-sm transition-all duration-300 cursor-pointer'

  const variants = {
    primary: 'bg-accent-blue text-white hover:bg-accent-blue-hover glow-blue glow-blue-hover',
    secondary: 'bg-dark-surface text-text-primary border border-dark-border hover:border-accent-blue/50',
    outline: 'border border-dark-border text-text-secondary hover:text-white hover:border-accent-blue/50',
  }

  const classes = `${base} ${variants[variant]} ${className}`

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button type={type} onClick={onClick} className={classes}>
      {children}
    </button>
  )
}
