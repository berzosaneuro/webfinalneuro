import Link from 'next/link'
import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import SectionTitle from '@/components/SectionTitle'
import Button from '@/components/Button'
import Card from '@/components/Card'
import {
  Brain,
  ChevronRight,
  Check,
  Sparkles,
  Crown,
  Wind,
  Target,
  Heart,
  Shield,
  Eye,
  ArrowRight,
} from 'lucide-react'

const neuroSteps = [
  { letter: 'N', text: 'Neutraliza el pensamiento' },
  { letter: 'E', text: 'Entrena la atención' },
  { letter: 'U', text: 'Ubícate en el cuerpo' },
  { letter: 'R', text: 'Regula la emoción' },
  { letter: 'O', text: 'Observa sin identificarte' },
]

const benefits = [
  { title: 'Menos ruido mental', desc: 'Observa el piloto automático sin pelear con él.' },
  { title: 'Atención entrenable', desc: 'Prácticas cortas, diseñadas para el día a día.' },
  { title: 'Cuerpo como ancla', desc: 'Regulación emocional desde la interocepción.' },
  { title: 'Hábitos medibles', desc: 'NeuroScore, diario y retos para sostener el cambio.' },
]

export default function EmpiezaPage() {
  return (
    <div className="relative overflow-hidden bg-dark-primary pb-16 md:pb-24">
      <div className="orb w-72 h-72 bg-accent-blue top-16 -left-20" />
      <div className="orb w-56 h-56 bg-accent-teal/40 top-[420px] -right-16 opacity-80" />

      {/* Hero */}
      <section className="relative pt-8 pb-10 md:pt-14 md:pb-14">
        <Container>
          <FadeInSection>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-accent-blue/10 border border-accent-blue/20 mb-4">
              <span className="w-1.5 h-1.5 rounded-full bg-accent-blue animate-pulse" />
              <span className="text-accent-blue text-[11px] font-semibold tracking-wide uppercase">
                Berzosa Neuro · Método N.E.U.R.O.
              </span>
            </div>
            <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-black tracking-tight text-white mb-4 max-w-2xl">
              Empieza a entrenar tu mente con <span className="gradient-text">neurociencia</span>
            </h1>
            <p className="text-text-secondary text-sm sm:text-base max-w-xl mb-6 leading-relaxed">
              Deja de reaccionar en piloto automático. Una ruta clara —gratis para comenzar— para ganar claridad,
              calma y presencia con prácticas basadas en evidencia.
            </p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <Button href="/registro" className="!py-3.5 !rounded-xl !font-bold shadow-[0_0_24px_rgba(124,58,237,0.35)]">
                Crear cuenta gratis <ChevronRight className="w-4 h-4 ml-1 inline" />
              </Button>
              <Link
                href="/metodo"
                className="inline-flex items-center justify-center px-6 py-3 rounded-xl glass-light text-text-secondary text-sm font-medium hover:text-white transition-colors"
              >
                Cómo funciona el método
              </Link>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Problema */}
      <section className="relative py-10 md:py-12">
        <Container>
          <FadeInSection>
            <SectionTitle
              title="¿Te suena este bucle?"
              subtitle="No estás roto: tu cerebro está haciendo exactamente lo que aprendió a hacer."
            />
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              <Card className="!rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-rose-500/15 flex items-center justify-center shrink-0">
                    <Wind className="w-5 h-5 text-rose-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-sm mb-1">Rumia sin parar</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Misma historia mental en bucle: pasado, futuro, juicios. Cuesta aterrizar en el ahora.
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="!rounded-2xl">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/15 flex items-center justify-center shrink-0">
                    <Brain className="w-5 h-5 text-amber-400" />
                  </div>
                  <div>
                    <h3 className="font-heading font-bold text-white text-sm mb-1">Hiperreactividad</h3>
                    <p className="text-text-secondary text-sm leading-relaxed">
                      Notificaciones, ansiedad y estrés que secuestran la atención antes de que elijas.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Solución */}
      <section className="relative py-10 md:py-12">
        <Container>
          <FadeInSection>
            <SectionTitle
              title="Un método, cinco pasos"
              subtitle="El Método N.E.U.R.O. ordena lo que la ciencia ya sabe sobre atención, emoción y neuroplasticidad."
            />
            <div className="glass rounded-3xl p-5 sm:p-8 max-w-3xl mx-auto border border-white/[0.06]">
              <ul className="space-y-4">
                {neuroSteps.map((step) => (
                  <li key={step.letter} className="flex items-start gap-4">
                    <span className="w-10 h-10 rounded-xl bg-accent-blue/15 text-accent-blue font-heading font-black text-lg flex items-center justify-center shrink-0">
                      {step.letter}
                    </span>
                    <p className="text-text-primary text-sm sm:text-base pt-1.5 leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ul>
              <p className="text-text-muted text-xs mt-6 text-center">
                No necesitas creencias especiales: solo práctica honesta y constancia suave.
              </p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Beneficios */}
      <section className="relative py-10 md:py-12">
        <Container>
          <FadeInSection>
            <SectionTitle
              title="Qué ganas al practicar"
              subtitle="Herramientas concretas dentro de la app, pensadas para móvil."
            />
            <div className="grid sm:grid-cols-2 gap-4 max-w-3xl mx-auto">
              {benefits.map((b) => (
                <div
                  key={b.title}
                  className="rounded-2xl p-5 border border-dark-border bg-dark-surface/40 hover:border-white/10 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <h3 className="font-heading font-bold text-white text-sm">{b.title}</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed pl-6">{b.desc}</p>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Precios: Gratis + Premium */}
      <section className="relative py-10 md:py-12">
        <Container>
          <FadeInSection>
            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-4">
                <Sparkles className="w-4 h-4 text-accent-blue" />
                <span className="text-accent-blue text-sm font-medium">Empieza sin tarjeta</span>
              </div>
              <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-2">
                Gratis para siempre · Premium cuando quieras más
              </h2>
              <p className="text-text-secondary text-sm max-w-lg mx-auto">
                Explora el ecosistema completo en modo gratuito y sube de nivel cuando quieras profundizar.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
              {/* Gratis */}
              <div className="rounded-3xl p-6 md:p-8 border border-dark-border bg-dark-surface/50 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-accent-blue/10 flex items-center justify-center">
                    <Brain className="w-6 h-6 text-accent-blue" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white">Gratis</h3>
                    <p className="text-text-secondary text-xs">Para empezar hoy</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">0 €</span>
                  <span className="text-text-secondary ml-1 text-sm">/ siempre</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1 text-sm">
                  {[
                    'Test de ruido mental',
                    'Método N.E.U.R.O. explicado',
                    '10 meditaciones gratuitas',
                    'Timer de presencia y SOS básico',
                    'Biblioteca (contenido base)',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-text-primary">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/registro"
                  className="w-full py-3.5 rounded-xl bg-accent-blue text-white font-bold text-sm text-center hover:bg-accent-blue/90 active:scale-[0.98] transition-all shadow-[0_0_20px_rgba(124,58,237,0.35)]"
                >
                  Registrarme gratis
                </Link>
              </div>

              {/* Premium destacado */}
              <div className="relative rounded-3xl p-6 md:p-8 border border-[#0066FF]/40 bg-dark-surface ring-1 ring-[#0066FF]/20 flex flex-col h-full">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-[#0066FF] text-white text-xs font-semibold rounded-full whitespace-nowrap">
                  Más completo
                </div>
                <div className="flex items-center gap-3 mb-4 mt-1">
                  <div className="w-12 h-12 rounded-xl bg-[#0066FF]/10 flex items-center justify-center">
                    <Crown className="w-6 h-6 text-[#60a5fa]" />
                  </div>
                  <div>
                    <h3 className="font-heading text-xl font-bold text-white">Premium</h3>
                    <p className="text-text-secondary text-xs">Todo el potencial de la app</p>
                  </div>
                </div>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-white">4,99 €</span>
                  <span className="text-text-secondary ml-1 text-sm">/ mes</span>
                </div>
                <ul className="space-y-2.5 mb-8 flex-1 text-sm">
                  {[
                    'Todo lo incluido en Gratis',
                    '15 meditaciones premium',
                    'Programa 21 días y retos',
                    'Masterclasses, podcast e IA Coach',
                    'Diario, NeuroScore y comunidad',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                      <span className="text-text-primary">{item}</span>
                    </li>
                  ))}
                </ul>
                <Link
                  href="/planes"
                  className="w-full py-3.5 rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 active:scale-[0.98] transition-transform"
                  style={{ background: 'rgba(0,102,255,0.12)', border: '1px solid rgba(0,102,255,0.25)', color: '#93c5fd' }}
                >
                  Ver planes y lista de espera <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* CTA final */}
      <section className="relative py-8 md:py-10">
        <Container>
          <FadeInSection>
            <div
              className="rounded-3xl p-6 sm:p-8 md:p-10 relative overflow-hidden text-center"
              style={{ background: 'linear-gradient(135deg, rgba(124,58,237,0.22), rgba(16,185,129,0.12))' }}
            >
              <div className="absolute inset-0 border border-accent-blue/25 rounded-3xl pointer-events-none" />
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-emerald-500/10 rounded-full blur-2xl" />
              <div className="relative max-w-xl mx-auto">
                <div className="flex justify-center gap-2 mb-4 text-accent-blue">
                  <Target className="w-5 h-5" />
                  <Heart className="w-5 h-5" />
                  <Shield className="w-5 h-5" />
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="font-heading text-2xl sm:text-3xl font-black text-white mb-3">
                  Tu próximo estado mental empieza con un clic
                </h2>
                <p className="text-text-secondary text-sm mb-6 leading-relaxed">
                  Crea tu cuenta gratis, haz el test de ruido mental y elige tu primera práctica. Sin tarjeta.
                </p>
                <Button href="/registro" className="!px-8 !py-3.5 !rounded-xl !text-base !font-bold">
                  Empezar ahora — gratis <ChevronRight className="w-5 h-5 ml-1 inline" />
                </Button>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
