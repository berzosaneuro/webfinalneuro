import { Metadata } from 'next'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import ClarityExercise from './ClarityExercise'
import { Sparkles, Heart, Eye, Sun, Flame, ArrowDown } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Despertar en Vida — Berzosa Neuro',
  description: 'La misma claridad que muchos asocian a una crisis, aquí la entrenas con método y sin riesgos.',
}

const revelations = [
  {
    icon: Heart,
    ecm: 'En una ECM sientes amor incondicional',
    neuro: 'Compasión guiada: abrir el pecho con práctica, sin drama ni forzar nada.',
    color: 'text-rose-400',
    bg: 'bg-rose-500/10',
  },
  {
    icon: Eye,
    ecm: 'En una ECM ves tu vida pasar ante tus ojos',
    neuro: 'Revisión consciente: la misma perspectiva, en el sofá, cada vez que la practicas.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Sun,
    ecm: 'En una ECM desaparece el miedo',
    neuro: 'Mirar el miedo con distancia corta el piloto automático. Se entrena igual que un músculo.',
    color: 'text-violet-400',
    bg: 'bg-violet-500/10',
  },
  {
    icon: Sparkles,
    ecm: 'En una ECM sientes unidad con todo',
    neuro: 'La presencia profunda deja de alimentar el modo rumia. El ruido del “yo” afloja. Sin peligro.',
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10',
  },
  {
    icon: Flame,
    ecm: 'En una ECM cambias tus prioridades',
    neuro: 'Claridad vital: prioridades al día, sin esperar a que algo grave pase.',
    color: 'text-orange-400',
    bg: 'bg-orange-500/10',
  },
]

export default function DespertarPage() {
  return (
    <div className="relative overflow-hidden">
      {/* Ambient */}
      <div className="orb w-80 h-80 bg-violet-600 top-10 -left-32" />
      <div className="orb w-64 h-64 bg-rose-600 top-[600px] -right-24" />

      {/* Hero */}
      <section className="relative pt-10 pb-8 md:pt-20 md:pb-16">
        <Container>
          <div className="max-w-2xl md:mx-auto md:text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 mb-5 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5 text-violet-400" />
              <span className="text-violet-400 text-xs font-semibold uppercase tracking-wider">Exclusivo Berzosa Neuro</span>
            </div>
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-4 animate-fade-in leading-[1.1]">
              No hace falta morir<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-rose-400">para despertar.</span>
            </h1>
            <p className="text-text-secondary text-base md:text-lg animate-fade-in-up leading-relaxed">
              Mucha gente describe claridad extrema tras una experiencia límite. Aquí vas a lo mismo con <strong className="text-white">entrenamiento de mente</strong>, sin ponerte en peligro.
            </p>
            <div className="flex justify-center mt-8 animate-fade-in-up">
              <ArrowDown className="w-5 h-5 text-text-muted animate-bounce" />
            </div>
          </div>
        </Container>
      </section>

      {/* The contrast */}
      <section className="relative pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-3xl p-6 md:p-8 relative overflow-hidden">
              <div className="absolute top-0 right-0 w-40 h-40 bg-violet-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="relative">
                <h2 className="font-heading font-bold text-white text-xl md:text-2xl mb-2">
                  Qué se repite en experiencias límite
                </h2>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed">
                  En relatos de experiencia cercana a la muerte vuelven los mismos temas: menos miedo, más conexión, prioridades claras, ego en segundo plano. Miles de casos están documentados.
                </p>
                <p className="text-white text-sm md:text-base leading-relaxed mt-3 font-medium">
                  Esos estados tienen equivalentes entrenables en la vida normal. Aquí trabajas eso con ejercicio, no con riesgo.
                </p>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Revelations comparison */}
      <section className="relative py-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-5">Lo que revelan vs. lo que entrenamos</h2>
          </FadeInSection>
          <div className="space-y-4">
            {revelations.map((r, i) => (
              <FadeInSection key={i}>
                <div className="glass rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${r.bg} flex items-center justify-center shrink-0`}>
                      <r.icon className={`w-5 h-5 ${r.color}`} />
                    </div>
                    <div className="flex-1 space-y-2.5">
                      <p className="text-text-muted text-xs font-medium uppercase tracking-wide">Experiencia cercana a la muerte</p>
                      <p className="text-text-secondary text-sm italic">&ldquo;{r.ecm}&rdquo;</p>
                      <div className="w-8 h-px bg-white/10" />
                      <p className="text-text-muted text-xs font-medium uppercase tracking-wide">Berzosa Neuro</p>
                      <p className="text-white text-sm font-medium">{r.neuro}</p>
                    </div>
                  </div>
                </div>
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Manifesto */}
      <section className="relative py-8">
        <Container>
          <FadeInSection>
            <div className="rounded-3xl p-6 md:p-10 relative overflow-hidden text-center"
              style={{ background: 'linear-gradient(135deg, rgba(139,92,246,0.12), rgba(244,63,94,0.08), rgba(124,58,237,0.08))' }}>
              <div className="absolute inset-0 border border-white/5 rounded-3xl" />
              <div className="relative max-w-xl mx-auto">
                <Flame className="w-8 h-8 text-orange-400 mx-auto mb-4" />
                <h2 className="font-heading font-bold text-white text-2xl md:text-3xl mb-4 leading-tight">
                  Otros te preparan para morir.<br />
                  Nosotros te entrenamos para <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-purple-400">vivir despierto</span>.
                </h2>
                <p className="text-text-secondary text-sm md:text-base leading-relaxed mb-6">
                  No hace falta trauma para saber qué importa. Hace falta atención entrenada y herramientas que ya tienes en la app.
                </p>
                <p className="text-white/70 text-xs uppercase tracking-widest font-medium">
                  Método, práctica, cero postureo.
                </p>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Interactive exercise */}
      <section className="relative py-6">
        <Container>
          <FadeInSection>
            <h2 className="font-heading font-semibold text-white text-lg mb-2">Ejercicio: Claridad vital</h2>
            <p className="text-text-secondary text-sm mb-5">
              Misma pregunta que muchos hacen tras una crisis: qué importa de verdad. Respuesta por escrito, hoy.
            </p>
            <ClarityExercise />
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
