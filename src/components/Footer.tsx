import Link from 'next/link'
import { Brain, Instagram, Mail, MessageCircle } from 'lucide-react'


export default function Footer() {
  return (
    <footer className="block border-t border-dark-border/50 mt-12 md:mt-16 pt-10 pb-[max(6.5rem,calc(5rem+env(safe-area-inset-bottom,0px)))] md:py-10 md:pb-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-center md:justify-between gap-8 md:gap-6 text-center md:text-left">
          <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-2 sm:gap-3">
            <Brain className="w-4 h-4 text-accent-blue shrink-0" />
            <span className="text-text-muted text-sm leading-relaxed max-w-xs md:max-w-none">
              Berzosa Neuro · Método N.E.U.R.O. · {new Date().getFullYear()}
            </span>
          </div>
          <nav
            aria-label="Enlaces del pie"
            className="flex flex-col sm:flex-row flex-wrap items-center justify-center md:justify-end gap-y-3 gap-x-5 sm:gap-x-6"
          >
            <a
              href="https://instagram.com/berzosa.neuro"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm text-text-muted hover:text-white transition-colors min-h-[44px] md:min-h-0 py-1"
            >
              <Instagram className="w-4 h-4 shrink-0" />
              <span>@berzosa.neuro</span>
            </a>
            <a
              href="mailto:contacto@berzosaneuro.com"
              className="inline-flex items-center justify-center gap-2 text-sm text-text-muted hover:text-white transition-colors min-h-[44px] md:min-h-0 py-1 break-all sm:break-normal"
            >
              <Mail className="w-4 h-4 shrink-0" />
              <span>contacto@berzosaneuro.com</span>
            </a>
            <a
              href={process.env.NEXT_PUBLIC_WHATSAPP_GROUP || 'https://chat.whatsapp.com/HNIjzZ6DlspF4FVTIn3DfA'}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 text-sm text-text-muted hover:text-white transition-colors min-h-[44px] md:min-h-0 py-1 text-center"
            >
              <MessageCircle className="w-4 h-4 shrink-0" />
              <span>Comunidad WhatsApp</span>
            </a>
            <Link
              href="/contacto"
              className="inline-flex items-center justify-center gap-2 text-sm text-text-muted hover:text-white transition-colors min-h-[44px] md:min-h-0 py-1"
            >
              Contacto
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  )
}
