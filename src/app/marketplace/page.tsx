import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import EmailCapture from '@/components/EmailCapture'
import { Store, Headphones, Upload, Star, Users, DollarSign, Shield, Check } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Marketplace — Berzosa Neuro',
  description: 'Marketplace de meditaciones guiadas. Crea, sube y comparte tus meditaciones con la comunidad.',
}

const topCreators = [
  { name: 'Dr. Elena Rivas', specialty: 'Neuropsicóloga', meditations: 12, rating: 4.9, listeners: '2.3K' },
  { name: 'Marco Zen', specialty: 'Instructor Mindfulness', meditations: 8, rating: 4.8, listeners: '1.8K' },
  { name: 'Sara Calm', specialty: 'Terapeuta Gestalt', meditations: 15, rating: 4.7, listeners: '3.1K' },
  { name: 'Luis Respira', specialty: 'Coach de Respiración', meditations: 6, rating: 4.9, listeners: '1.2K' },
]

const categories = [
  { name: 'Ansiedad & Estrés', count: 34, color: 'bg-cyan-500/15 text-cyan-400' },
  { name: 'Sueño', count: 21, color: 'bg-indigo-500/15 text-indigo-400' },
  { name: 'Foco & Productividad', count: 18, color: 'bg-teal-500/15 text-teal-400' },
  { name: 'Emociones', count: 27, color: 'bg-rose-500/15 text-rose-400' },
  { name: 'Consciencia', count: 15, color: 'bg-violet-500/15 text-violet-400' },
  { name: 'Cuerpo & Movimiento', count: 9, color: 'bg-emerald-500/15 text-emerald-400' },
]

export default function MarketplacePage() {
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent-blue top-20 -left-20" />

      <section className="pt-12 md:pt-20 pb-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
              <Store className="w-4 h-4 text-accent-blue" />
              <span className="text-accent-blue text-sm font-medium">Marketplace</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              El Spotify de la<br /><span className="gradient-text">consciencia</span>
            </h1>
            <p className="text-text-secondary text-lg animate-fade-in-up">
              Meditaciones guiadas de profesionales verificados. Escucha, valora y descubre nuevas voces.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-8">
        <Container>
          <div className="grid grid-cols-3 gap-3">
            <div className="glass rounded-2xl p-4 text-center">
              <Headphones className="w-5 h-5 text-accent-blue mx-auto mb-1.5" />
              <span className="text-white font-bold text-xl">124</span>
              <p className="text-text-muted text-[10px]">Meditaciones</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <Users className="w-5 h-5 text-emerald-400 mx-auto mb-1.5" />
              <span className="text-white font-bold text-xl">23</span>
              <p className="text-text-muted text-[10px]">Creadores</p>
            </div>
            <div className="glass rounded-2xl p-4 text-center">
              <Star className="w-5 h-5 text-cyan-400 mx-auto mb-1.5" />
              <span className="text-white font-bold text-xl">4.8</span>
              <p className="text-text-muted text-[10px]">Media</p>
            </div>
          </div>
        </Container>
      </section>

      {/* Categories */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Explorar por categoría</h2>
            <div className="grid grid-cols-2 gap-3">
              {categories.map((c) => (
                <div key={c.name} className="glass rounded-2xl p-4 card-hover cursor-pointer">
                  <div className={`inline-flex px-2.5 py-1 rounded-full text-[10px] font-medium ${c.color} mb-2`}>{c.count} sesiones</div>
                  <p className="text-white text-sm font-medium">{c.name}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Top creators */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-4">Creadores destacados</h2>
            <div className="space-y-3">
              {topCreators.map((c) => (
                <div key={c.name} className="glass rounded-2xl p-4 flex items-center gap-3 card-hover">
                  <div className="w-12 h-12 rounded-full bg-accent-blue/15 flex items-center justify-center text-accent-blue font-bold text-sm shrink-0">
                    {c.name.split(' ').map(w => w[0]).join('')}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-white text-sm font-medium">{c.name}</p>
                      <Shield className="w-3.5 h-3.5 text-accent-blue" />
                    </div>
                    <p className="text-text-muted text-xs">{c.specialty} · {c.meditations} meditaciones</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 text-cyan-400 fill-cyan-400" />
                      <span className="text-white text-xs font-bold">{c.rating}</span>
                    </div>
                    <p className="text-text-muted text-[10px]">{c.listeners}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Become a creator */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 border border-accent-blue/20">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-accent-blue/15 flex items-center justify-center">
                  <Upload className="w-6 h-6 text-accent-blue" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-white">¿Eres guía o terapeuta?</h3>
                  <p className="text-text-muted text-xs">Sube tus meditaciones y monetiza tu conocimiento</p>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {[
                  'Sube meditaciones en formato audio',
                  'Llega a miles de practicantes',
                  'Gana el 70% de cada suscripción generada',
                  'Verificación profesional incluida',
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="text-text-secondary text-xs">{b}</span>
                  </div>
                ))}
              </div>

              <button className="w-full py-3 bg-accent-blue text-white rounded-xl text-sm font-medium active:scale-95 transition-transform">
                Solicitar acceso de creador
              </button>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Waitlist */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="max-w-lg mx-auto">
              <EmailCapture
                source="marketplace"
                title="El Marketplace llega pronto"
                subtitle="Regístrate para acceso anticipado."
                buttonText="Quiero acceso"
              />
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
