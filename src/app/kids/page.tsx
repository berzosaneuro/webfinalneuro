import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import EmailCapture from '@/components/EmailCapture'
import { Sparkles, Heart, Brain, Gamepad2, Star, Shield, CloudRain, Sun, Trees, Smile } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Berzosa Neuro Kids — Mindfulness para niños',
  description: 'Meditaciones, juegos de atención y regulación emocional adaptados para niños de 6 a 12 años.',
}

const features = [
  { title: 'Meditaciones con personajes', desc: 'Luna la lechuza y Cosmo el cerebro guían las sesiones de 3-8 min.', icon: Sparkles, color: 'bg-violet-500/15 text-violet-400' },
  { title: 'Juegos de atención', desc: 'Ejercicios interactivos que parecen juegos pero entrenan el foco.', icon: Gamepad2, color: 'bg-emerald-500/15 text-emerald-400' },
  { title: 'Regulación emocional', desc: 'Técnicas adaptadas para gestionar enfado, miedo y tristeza.', icon: Heart, color: 'bg-rose-500/15 text-rose-400' },
  { title: 'Respiración divertida', desc: 'Soplar la vela, inflar el globo, respirar como un dragón.', icon: CloudRain, color: 'bg-cyan-500/15 text-cyan-400' },
  { title: 'Diario de emociones', desc: 'Stickers y colores para que los niños expresen cómo se sienten.', icon: Sun, color: 'bg-emerald-500/15 text-emerald-400' },
  { title: 'Sonidos de la naturaleza', desc: 'Bosque, lluvia, pájaros y cuencos adaptados para niños.', icon: Trees, color: 'bg-green-500/15 text-green-400' },
]

const ages = [
  { range: '6-8 años', desc: 'Sesiones cortas (3 min), muy visuales, con personajes animados.' },
  { range: '9-10 años', desc: 'Sesiones de 5 min, juegos simples para notar pensamientos y emociones.' },
  { range: '11-12 años', desc: 'Sesiones de 8 min, concepto de observador, diario de emociones.' },
]

export default function KidsPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-violet-600 top-20 left-1/2 -translate-x-1/2" />

      <section className="pt-12 md:pt-20 pb-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
              <Smile className="w-4 h-4 text-emerald-400" />
              <span className="text-emerald-400 text-sm font-medium">Para niños de 6-12 años</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Berzosa Neuro<br /><span className="gradient-text">Kids</span>
            </h1>
            <p className="text-text-secondary text-lg animate-fade-in-up">
              Enséñales a gestionar emociones, enfocar la atención y conocer su mente. Antes de que el mundo les enseñe a distraerse.
            </p>
          </div>
        </Container>
      </section>

      {/* Why */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 text-center">
              <Brain className="w-10 h-10 text-accent-blue mx-auto mb-3" />
              <h2 className="font-heading font-bold text-white text-lg mb-2">¿Por qué mindfulness para niños?</h2>
              <p className="text-text-secondary text-sm leading-relaxed max-w-xl mx-auto">
                El cerebro de un niño es 10x más neuroplástico que el de un adulto. Lo que aprenden ahora sobre atención y regulación emocional les acompañará toda la vida. Estudios de Harvard muestran que niños que meditan 5 min/día mejoran un 30% en concentración escolar.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Features */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">¿Qué incluye?</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {features.map((f) => (
                <div key={f.title} className="glass rounded-2xl p-4 card-hover">
                  <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-3`}>
                    <f.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-heading font-semibold text-white text-sm mb-1">{f.title}</h3>
                  <p className="text-text-muted text-xs">{f.desc}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Age groups */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">Adaptado por edad</h2>
            <div className="space-y-3">
              {ages.map((a) => (
                <div key={a.range} className="glass rounded-2xl p-5 flex items-center gap-4">
                  <div className="w-14 h-14 rounded-xl bg-accent-blue/15 flex items-center justify-center shrink-0">
                    <span className="text-accent-blue font-bold text-sm">{a.range.split(' ')[0]}</span>
                  </div>
                  <div>
                    <p className="text-white font-medium text-sm">{a.range}</p>
                    <p className="text-text-secondary text-xs">{a.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Coming soon */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-8 text-center border border-accent-blue/20">
              <div className="w-16 h-16 rounded-2xl bg-accent-blue/15 flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-accent-blue" />
              </div>
              <h3 className="font-heading text-xl font-bold text-white mb-2">Próximamente</h3>
              <p className="text-text-secondary text-sm mb-2">Berzosa Neuro Kids se lanza en primavera 2025.</p>
              <p className="text-text-muted text-xs">Precio especial para familias Premium: incluido en tu suscripción.</p>
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
                source="kids-waitlist"
                title="Avísame cuando esté listo"
                subtitle="Serás de los primeros en acceder a Berzosa Neuro Kids."
                buttonText="Apuntarme"
              />
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
