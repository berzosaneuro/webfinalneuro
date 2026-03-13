import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import EmailCapture from '@/components/EmailCapture'
import { Building2, Users, BarChart3, Brain, Shield, TrendingDown, TrendingUp, Check, ChevronRight } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Berzosa Neuro for Teams — Bienestar corporativo',
  description: 'Programa de bienestar mental para empresas basado en neurociencia. Reduce estrés, mejora foco y retiene talento.',
}

const stats = [
  { value: '-43%', label: 'Estrés laboral', icon: TrendingDown, color: 'text-emerald-400' },
  { value: '+37%', label: 'Productividad', icon: TrendingUp, color: 'text-accent-blue' },
  { value: '-28%', label: 'Absentismo', icon: TrendingDown, color: 'text-cyan-400' },
  { value: '+52%', label: 'Retención', icon: TrendingUp, color: 'text-rose-400' },
]

const features = [
  'Licencias Premium para todos los empleados',
  'Dashboard de RRHH con métricas anónimas de bienestar',
  'Sesiones grupales semanales en directo',
  'Retos de equipo con gamificación',
  'Protocolo de crisis (SOS) corporativo',
  'Reportes mensuales de impacto',
  'Onboarding personalizado por departamento',
  'Soporte prioritario y account manager',
]

const plans = [
  { name: 'Starter', employees: 'Hasta 25', price: '3,99', features: 4 },
  { name: 'Business', employees: 'Hasta 100', price: '2,99', features: 6, popular: true },
  { name: 'Enterprise', employees: 'Ilimitado', price: 'Personalizado', features: 8 },
]

export default function CorporativoPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-accent-blue top-20 left-1/2 -translate-x-1/2" />

      <section className="pt-12 md:pt-20 pb-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
              <Building2 className="w-4 h-4 text-accent-blue" />
              <span className="text-accent-blue text-sm font-medium">Para empresas</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Mentes sanas,<br />empresas que <span className="gradient-text">crecen</span>
            </h1>
            <p className="text-text-secondary text-lg animate-fade-in-up">
              El 76% de empleados reportan estrés crónico. Berzosa Neuro lo reduce con neurociencia, no con pizza los viernes.
            </p>
          </div>
        </Container>
      </section>

      {/* Stats */}
      <section className="pb-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s) => (
              <FadeInSection key={s.label}>
                <div className="glass rounded-2xl p-5 text-center">
                  <s.icon className={`w-5 h-5 ${s.color} mx-auto mb-2`} />
                  <span className={`text-2xl font-bold ${s.color}`}>{s.value}</span>
                  <p className="text-text-muted text-xs mt-1">{s.label}</p>
                </div>
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>

      {/* Features */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">¿Qué incluye?</h2>
            <div className="glass rounded-3xl p-6 md:p-8">
              <div className="grid md:grid-cols-2 gap-3">
                {features.map((f, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-text-primary text-sm">{f}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Pricing */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">Planes corporativos</h2>
            <div className="grid md:grid-cols-3 gap-4">
              {plans.map((p) => (
                <div key={p.name} className={`glass rounded-2xl p-6 text-center ${p.popular ? 'border border-accent-blue/30 ring-1 ring-accent-blue/20' : ''}`}>
                  {p.popular && <span className="inline-block px-3 py-1 bg-accent-blue text-white text-xs font-semibold rounded-full mb-3">Más popular</span>}
                  <h3 className="font-heading font-bold text-white text-xl mb-1">{p.name}</h3>
                  <p className="text-text-muted text-sm mb-4">{p.employees} empleados</p>
                  <div className="mb-4">
                    <span className="text-3xl font-bold text-white">{p.price}</span>
                    {p.price !== 'Personalizado' && <span className="text-text-secondary text-sm"> &euro;/usuario/mes</span>}
                  </div>
                  <p className="text-text-muted text-xs mb-4">{p.features} de {features.length} funcionalidades</p>
                  <button className={`w-full py-3 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                    p.popular ? 'bg-accent-blue text-white' : 'bg-white/5 text-white'
                  }`}>
                    Contactar ventas
                  </button>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Contact */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="max-w-lg mx-auto">
              <EmailCapture
                source="corporativo"
                title="Solicita una demo"
                subtitle="Te contactamos en 24h para enseñarte la plataforma corporativa."
                buttonText="Solicitar demo"
              />
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
