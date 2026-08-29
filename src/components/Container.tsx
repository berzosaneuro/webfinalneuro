import { ReactNode } from 'react'

/** maxWidthClass es opcional y por defecto no cambia nada (max-w-6xl, igual
 *  que siempre) — solo lo usan paneles concretos que necesitan más ancho,
 *  como un dashboard embebido lleno de gráficas. */
export default function Container({
  children,
  className = '',
  maxWidthClass = 'max-w-6xl',
}: {
  children: ReactNode
  className?: string
  maxWidthClass?: string
}) {
  return (
    <div className={`${maxWidthClass} mx-auto px-4 sm:px-6 lg:px-8 ${className}`}>
      {children}
    </div>
  )
}
