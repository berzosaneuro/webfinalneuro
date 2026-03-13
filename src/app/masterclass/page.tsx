import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import PremiumLock from '@/components/PremiumLock'
import { Play, Clock, Brain, Eye, Zap, Heart, Shield, Flame } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Masterclasses — Berzosa Neuro',
  description: 'Masterclasses en video sobre neurociencia de la consciencia, el ego, la atención y la regulación emocional.',
}

type MasterClass = {
  title: string
  subtitle: string
  duration: string
  icon: React.ElementType
  color: string
  topics: string[]
  free: boolean
}

const masterclasses: MasterClass[] = [
  {
    title: 'La neurociencia del ego',
    subtitle: 'Por qué tu cerebro construye una identidad falsa',
    duration: '18 min',
    icon: Brain,
    color: 'bg-violet-500/15 text-violet-400',
    topics: ['Red Neuronal por Defecto (DMN)', 'Cómo el ego es un constructo neurológico', 'Ejercicio: desidentificación en 3 pasos'],
    free: true,
  },
  {
    title: 'Cómo tu amígdala te secuestra',
    subtitle: 'El mecanismo del miedo y cómo desactivarlo',
    duration: '15 min',
    icon: Shield,
    color: 'bg-rose-500/15 text-rose-400',
    topics: ['Amygdala hijack: qué es y por qué ocurre', 'La ventana de 6 segundos', 'Técnica de regulación prefrontal'],
    free: true,
  },
  {
    title: 'DMN: La red que te mantiene dormido',
    subtitle: 'Tu mente tiene un modo por defecto que te atrapa',
    duration: '22 min',
    icon: Eye,
    color: 'bg-cyan-500/15 text-cyan-400',
    topics: ['Qué es la DMN y por qué importa', 'Rumiación vs. creatividad', 'Cómo la meditación apaga la DMN'],
    free: false,
  },
  {
    title: 'Neuroplasticidad: recablea tu cerebro',
    subtitle: 'Tu cerebro cambia. Literalmente. Úsalo a tu favor.',
    duration: '20 min',
    icon: Zap,
    color: 'bg-emerald-500/15 text-emerald-400',
    topics: ['Hebbian learning: neuronas que disparan juntas', '8 semanas para cambiar estructura cerebral', 'Protocolo de cambio de hábitos'],
    free: false,
  },
  {
    title: 'El observador: quién eres realmente',
    subtitle: 'Más allá del pensamiento, más allá de la emoción',
    duration: '25 min',
    icon: Eye,
    color: 'bg-teal-500/15 text-teal-400',
    topics: ['Consciencia testigo vs. ego narrativo', 'Experimento del espejo interior', 'La paradoja de observar al observador'],
    free: false,
  },
  {
    title: 'Emociones: la guía que ignoras',
    subtitle: 'No las reprimas. No las sigas. Entiéndelas.',
    duration: '17 min',
    icon: Heart,
    color: 'bg-pink-500/15 text-pink-400',
    topics: ['Mapa neural de las emociones', 'Interocepción: escuchar al cuerpo', 'Regulación emocional basada en evidencia'],
    free: false,
  },
  {
    title: 'El cortisol y tú: vivir en modo lucha',
    subtitle: 'Por qué estás estresado incluso cuando no pasa nada',
    duration: '16 min',
    icon: Flame,
    color: 'bg-orange-500/15 text-orange-400',
    topics: ['Eje HPA y estrés crónico', 'Cómo la respiración regula cortisol', 'Protocolo anti-cortisol de 5 min'],
    free: false,
  },
]

function MasterClassCard({ mc }: { mc: MasterClass }) {
  return (
    <div className="glass rounded-2xl p-5 card-hover">
      <div className="flex items-start gap-3 mb-3">
        <div className={`w-12 h-12 rounded-xl ${mc.color} flex items-center justify-center shrink-0`}>
          <mc.icon className="w-6 h-6" />
        </div>
        <div className="flex-1">
          <h3 className="font-heading font-semibold text-white text-sm">{mc.title}</h3>
          <p className="text-text-muted text-xs mt-0.5">{mc.subtitle}</p>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-3.5 h-3.5 text-text-muted" />
        <span className="text-text-muted text-xs">{mc.duration}</span>
      </div>

      <ul className="space-y-1.5 mb-4">
        {mc.topics.map((t, i) => (
          <li key={i} className="text-text-secondary text-xs flex items-start gap-2">
            <span className="text-accent-blue mt-0.5">·</span> {t}
          </li>
        ))}
      </ul>

      <button className="w-full py-2.5 rounded-xl bg-white/5 text-white text-xs font-medium flex items-center justify-center gap-2 active:scale-95 transition-transform">
        <Play className="w-3.5 h-3.5" /> Ver masterclass
      </button>
    </div>
  )
}

export default function MasterclassPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-violet-600 top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-6">
        <Container>
          <h1 className="font-heading text-3xl md:text-5xl font-bold tracking-tight text-white mb-2 animate-fade-in">
            Masterclasses
          </h1>
          <p className="text-text-secondary text-base animate-fade-in-up">
            Neurociencia de la consciencia en formato documental. 15-25 min.
          </p>
        </Container>
      </section>

      <section className="pb-12">
        <Container>
          <div className="grid md:grid-cols-2 gap-4">
            {masterclasses.map((mc) => (
              <FadeInSection key={mc.title}>
                {mc.free ? (
                  <MasterClassCard mc={mc} />
                ) : (
                  <PremiumLock label={mc.title}>
                    <MasterClassCard mc={mc} />
                  </PremiumLock>
                )}
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>
    </div>
  )
}
