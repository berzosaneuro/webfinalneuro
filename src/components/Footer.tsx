import { Brain, Instagram, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="hidden md:block border-t border-dark-border/50 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-blue" />
            <span className="text-text-muted text-sm">
              Berzosa Neuro · Método N.E.U.R.O. · {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex items-center gap-6">
            <a
              href="https://instagram.com/berzosa.neuro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors"
            >
              <Instagram className="w-4 h-4" />
              @berzosa.neuro
            </a>
            <a
              href="mailto:ceo@berzosa.neuro.com"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              Contacto
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
