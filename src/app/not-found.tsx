import Link from 'next/link'
import { Compass } from 'lucide-react'
import Container from '@/components/Container'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <Container>
        <div className="text-center max-w-sm mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-accent-blue/15 flex items-center justify-center mx-auto mb-5">
            <Compass className="w-8 h-8 text-accent-blue" />
          </div>
          <h1 className="font-heading font-black text-white text-2xl mb-3">Esta página no existe</h1>
          <p className="text-text-secondary text-sm mb-6">
            El enlace puede estar roto o la página se ha movido. Vuelve al inicio y sigue desde ahí.
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-6 py-3.5 rounded-2xl bg-accent-blue text-white font-bold text-sm active:scale-95 transition-all hover:bg-accent-blue-hover"
          >
            Volver al inicio
          </Link>
        </div>
      </Container>
    </div>
  )
}
