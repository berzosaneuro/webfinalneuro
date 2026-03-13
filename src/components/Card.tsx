import { ReactNode } from 'react'

type CardProps = {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return (
    <div className={`glass rounded-2xl p-5 card-hover ${className}`}>
      {children}
    </div>
  )
}
