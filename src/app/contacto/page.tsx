import { Metadata } from 'next'
import Image from 'next/image'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import ContactForm from './ContactForm'
import { Instagram, Phone, Mail, MessageCircle } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto — Berzosa Neuro',
  description: 'Ponte en contacto con el Dr. Berzosa. Instagram, teléfono o formulario.',
}

const contactInfo = [
  {
    icon: Instagram,
    label: 'Instagram',
    value: '@berzosa.neuro',
    href: 'https://www.instagram.com/berzosa.neuro',
    color: 'text-pink-400 bg-pink-500/15',
  },
  {
    icon: Phone,
    label: 'Teléfono / WhatsApp',
    value: '643 525 906',
    href: 'https://wa.me/34643525906',
    color: 'text-green-400 bg-green-500/15',
  },
  {
    icon: Mail,
    label: 'Email',
    value: 'contacto@berzosaneuro.com',
    href: 'mailto:contacto@berzosaneuro.com',
    color: 'text-blue-400 bg-blue-500/15',
  },
]

export default function ContactoPage() {
  return (
    <>
      <section className="relative pt-16 pb-6 overflow-hidden">
        {/* Foto de fondo con marca de agua */}
        <div className="absolute inset-0 pointer-events-none select-none">
          <Image
            src="/elias-1.jpg"
            alt=""
            fill
            className="object-cover object-top opacity-[0.07]"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-dark-primary/60 via-transparent to-dark-primary/80" />
        </div>
        <Container>
          <div className="relative max-w-2xl mx-auto">
            <FadeInSection>
              <div className="text-center mb-10">
                <h1 className="font-heading text-4xl md:text-5xl font-bold tracking-tight text-white mb-3 animate-fade-in">
                  Contacto
                </h1>
                <p className="text-text-secondary animate-fade-in-up">
                  ¿Tienes alguna pregunta? Escríbeme por donde prefieras.
                </p>
              </div>
            </FadeInSection>

            {/* Direct contact cards */}
            <FadeInSection>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
                {contactInfo.map((item) => (
                  <a
                    key={item.label}
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="glass rounded-2xl p-4 flex flex-col items-center text-center gap-2 active:scale-95 transition-transform hover:border-white/10"
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${item.color}`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <p className="text-text-muted text-xs">{item.label}</p>
                    <p className="text-white text-sm font-medium">{item.value}</p>
                  </a>
                ))}
              </div>
            </FadeInSection>

            {/* WhatsApp CTA */}
            <FadeInSection>
              <a
                href="https://wa.me/34643525906"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 w-full py-4 rounded-2xl mb-8 active:scale-95 transition-transform font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)' }}
              >
                <MessageCircle className="w-5 h-5" />
                Escribir por WhatsApp
              </a>
            </FadeInSection>

            {/* Form */}
            <FadeInSection>
              <p className="text-text-muted text-sm text-center mb-5">O déjame un mensaje y te respondo lo antes posible:</p>
              <ContactForm />
            </FadeInSection>
          </div>
        </Container>
      </section>
    </>
  )
}
