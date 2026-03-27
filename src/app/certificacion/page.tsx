import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'
import EmailCapture from '@/components/EmailCapture'
import { GraduationCap, Check, Star, Users, Clock, Video, BookOpen, Award, ChevronRight, Brain } from 'lucide-react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Certificación Guía Berzosa Neuro',
  description: 'Formación de 3 meses para convertirte en Guía certificado del Método N.E.U.R.O. Supraconciencia, metacognición y neuroplasticidad aplicada.',
}

const modules = [
  { week: '1-4', title: 'Fundamentos de Neurociencia Contemplativa', topics: ['Neuroanatomía funcional', 'Red Neuronal por Defecto', 'Neuroplasticidad y meditación', 'Regulación emocional'] },
  { week: '5-8', title: 'Técnicas de Meditación y Facilitación', topics: ['Meditaciones guiadas (diseño y guión)', 'Respiración y sistema nervioso', 'Body scan y propriocepción', 'Facilitación de grupos'] },
  { week: '9-12', title: 'Práctica Supervisada y Certificación', topics: ['Facilitar tu propio círculo', 'Supervisión con mentor', 'Caso práctico final', 'Examen y certificación'] },
]

const benefits = [
  'Certificado oficial de Guía Berzosa Neuro',
  'Acceso Premium de por vida',
  'Permiso para facilitar Círculos de Consciencia',
  'Listado en el directorio oficial de guías',
  'Kit de materiales y meditaciones guiadas',
  'Comunidad exclusiva de guías certificados',
  'Comisión del 30% por referidos al programa',
  'Formación continua mensual',
]

export default function CertificacionPage() {
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-96 h-96 bg-violet-600 top-20 -right-20" />

      <section className="pt-12 md:pt-20 pb-8">
        <Container>
          <div className="text-center max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 glass rounded-full mb-6">
              <GraduationCap className="w-4 h-4 text-violet-400" />
              <span className="text-violet-400 text-sm font-medium">Certificación profesional</span>
            </div>
            <h1 className="font-heading text-4xl md:text-5xl font-bold text-white mb-4 animate-fade-in">
              Conviértete en Guía<br /><span className="gradient-text">Berzosa Neuro</span>
            </h1>
            <p className="text-text-secondary text-lg animate-fade-in-up">
              3 meses de formación intensiva en supraconciencia, metacognición y neuroplasticidad aplicada. Conviértete en guía certificado del Método N.E.U.R.O. y crea tu propio negocio de bienestar mental.
            </p>
          </div>
        </Container>
      </section>

      {/* Quick stats */}
      <section className="pb-8">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { value: '12', label: 'Semanas', icon: Clock },
              { value: '24', label: 'Sesiones live', icon: Video },
              { value: '6', label: 'Módulos', icon: BookOpen },
              { value: '47', label: 'Graduados', icon: Award },
            ].map((s) => (
              <div key={s.label} className="glass rounded-2xl p-4 text-center">
                <s.icon className="w-5 h-5 text-violet-400 mx-auto mb-1.5" />
                <span className="text-white font-bold text-xl">{s.value}</span>
                <p className="text-text-muted text-xs">{s.label}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      {/* Modules */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">Plan de estudios</h2>
            <div className="space-y-4">
              {modules.map((m, i) => (
                <div key={i} className="glass rounded-2xl p-5">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-500/15 flex items-center justify-center shrink-0">
                      <span className="text-violet-400 font-bold text-sm">{i + 1}</span>
                    </div>
                    <div>
                      <h3 className="font-heading font-semibold text-white text-sm">{m.title}</h3>
                      <p className="text-text-muted text-xs">Semanas {m.week}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {m.topics.map((t, j) => (
                      <div key={j} className="flex items-center gap-2">
                        <Check className="w-3.5 h-3.5 text-violet-400 shrink-0" />
                        <span className="text-text-secondary text-xs">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Benefits */}
      <section className="pb-8">
        <Container>
          <FadeInSection>
            <h2 className="font-heading text-2xl font-bold text-white text-center mb-8">¿Qué obtienes?</h2>
            <div className="glass rounded-3xl p-6">
              <div className="space-y-3">
                {benefits.map((b, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="text-text-primary text-sm">{b}</span>
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
            <div className="glass rounded-3xl p-8 text-center border border-violet-500/20">
              <GraduationCap className="w-12 h-12 text-violet-400 mx-auto mb-4" />
              <h3 className="font-heading text-2xl font-bold text-white mb-2">Inversión</h3>
              <div className="mb-2">
                <span className="text-4xl font-bold text-white">997 &euro;</span>
              </div>
              <p className="text-text-secondary text-sm mb-1">Pago único o 3 cuotas de 349 &euro;</p>
              <p className="text-text-muted text-xs mb-6">Próxima convocatoria: Marzo 2025</p>
              <button className="w-full max-w-sm mx-auto py-4 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-2xl font-semibold active:scale-95 transition-transform">
                Reservar mi plaza
              </button>
              <p className="text-text-muted text-xs mt-3">Plazas limitadas a 15 alumnos por convocatoria</p>
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Early access */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="max-w-lg mx-auto">
              <EmailCapture
                source="certificacion"
                title="Lista de espera"
                subtitle="Te avisamos cuando abramos la próxima convocatoria."
                buttonText="Apuntarme"
              />
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
