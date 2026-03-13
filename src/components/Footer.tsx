import Link from 'next/link'
import { Brain, Instagram, Mail, MessageCircle } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="block border-t border-dark-border/50 py-8 mt-16">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-center justify-center md:justify-between gap-4 text-center md:text-left">
          <div className="flex items-center gap-2">
            <Brain className="w-4 h-4 text-accent-blue" />
            <span className="text-text-muted text-sm">
              Berzosa Neuro · Método N.E.U.R.O. · {new Date().getFullYear()}
            </span>
          </div>
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-4 md:gap-6">
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
              href="mailto:contacto@berzosaneuro.com"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
              contacto@berzosaneuro.com
            </a>
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP || 'https://chat.whatsapp.com/HNIjzZ6DlspF4FVTIn3DfA'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors"
            >
              <MessageCircle className="w-4 h-4" />
              Comunidad WhatsApp
            </a>
            <Link
              href="/contacto"
              className="flex items-center gap-1.5 text-sm text-text-muted hover:text-white transition-colors"
            >
              Contacto
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
