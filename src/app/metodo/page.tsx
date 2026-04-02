import { Metadata } from 'next'
import Container from '@/components/Container'
import SectionTitle from '@/components/SectionTitle'
import Card from '@/components/Card'
import FadeInSection from '@/components/FadeInSection'
import { ShieldOff, Target, User, Heart, Eye, Clock, Brain, Zap, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Método N.E.U.R.O. — Berzosa Neuro',
  description:
    'Cinco pasos para bajar el ruido mental y ganar claridad. Práctica diaria, lenguaje claro, resultados que notas.',
}

const steps = [
  {
    letter: 'N',
    title: 'Neutraliza el pensamiento',
    icon: ShieldOff,
    explanation:
      'La mente repite y proyecta. Neutralizar no es callarla: es ver el pensamiento como pensamiento y dejar de seguirlo. Cuando no le das el mando, pierde intensidad.',
    neuro:
      'Etiquetar “pensamiento” y soltar el hilo me devolvió el día entero. Con práctica, el mismo asunto ocupa menos cabeza.',
    exercise:
      '3 minutos en silencio. Cada pensamiento que aparezca, etiquétalo como “pensamiento”. No lo sigas ni lo analices. Repite hasta notar que afloja.',
  },
  {
    letter: 'E',
    title: 'Entrena la atención',
    icon: Target,
    explanation:
      'La atención se entrena con repeticiones: notas que te fuiste y vuelves al foco. Sin eso, no hay presencia ni elección consciente.',
    neuro:
      'Dejé de castigarme por distraerme. Volver al foco es la repetición que cuenta. Unos minutos al día bastan para notar que tú eliges dónde miras.',
    exercise:
      '5 minutos mirando la respiración sin cambiarla. Cada desvío, vuelves. Cuenta las vueltas: ese es tu entrenamiento de hoy.',
  },
  {
    letter: 'U',
    title: 'Ubícate en el cuerpo',
    icon: User,
    explanation:
      'El cuerpo está en el presente; la mente vuela. Llevar la atención a sensaciones concretas corta el piloto automático.',
    neuro:
      'Pies, hombros, respiración: lo más simple fue lo que más me estabilizó cuando la cabeza no paraba.',
    exercise:
      'Escaneo rápido de pies a cabeza. En cada zona, nota lo que hay. Sin corregir nada. Dos minutos.',
  },
  {
    letter: 'R',
    title: 'Regula la emoción',
    icon: Heart,
    explanation:
      'La emoción no es el problema: la reacción automática sí. Regulación = espacio entre lo que sientes y lo que haces: detectar, nombrar, respirar, elegir.',
    neuro:
      'Nombrar antes de hablar me ahorró respuestas que ya no quiero repetir. Ese hueco pequeño es donde mandas tú.',
    exercise:
      'Ante una emoción fuerte: localízala en el cuerpo, nómbrala, tres respiraciones, luego actúas (o no). Compara antes y después.',
  },
  {
    letter: 'O',
    title: 'Observa sin identificarte',
    icon: Eye,
    explanation:
      'No eres cada pensamiento ni cada emoción: eres quien puede mirarlos. Observar sin confundirte con el contenido es libertad práctica.',
    neuro:
      'Dejar de ser el drama de la cabeza bajó el volumen sin fingir que todo va bien. El día se enfrenta distinto.',
    exercise:
      '5 minutos: orilla del río, pensamientos como hojas. No subas a ninguna. Si te enganchas, vuelves a la orilla.',
  },
]

const routine = [
  { time: '2 min', activity: 'Respiración consciente' },
  { time: '2 min', activity: 'Observar el pensamiento' },
  { time: '3 min', activity: 'Foco en la respiración' },
  { time: '3 min', activity: 'Conciencia corporal' },
]

export default function MetodoPage() {
  return (
    <>
      <section className="pt-24 pb-16">
        <Container>
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="font-heading text-4xl md:text-6xl font-bold tracking-tight text-white mb-6 animate-fade-in">
              MÉTODO N.E.U.R.O.
            </h1>
            <p className="text-text-secondary text-lg md:text-xl animate-fade-in-up">
              Nació de la necesidad real: mente a mil, salida clara. Cinco pasos que repites cada día.
            </p>
          </div>
        </Container>
      </section>

      {/* ¿Por qué NEURO? */}
      <section className="pb-20">
        <Container>
          <FadeInSection>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-accent-blue/20 bg-accent-blue/5 p-8 md:p-10">
                <div className="flex items-center gap-3 mb-6">
                  <Brain className="w-7 h-7 text-accent-blue" />
                  <h2 className="font-heading text-2xl md:text-3xl font-bold text-white">¿Por qué «Neuro»?</h2>
                </div>
                <div className="space-y-4 text-text-secondary leading-relaxed">
                  <p>
                    Salió de agotamiento, sobrepensamiento y la fachada de &quot;estoy bien&quot;. Estas cinco letras son la
                    brújula que fui probando hasta tener orden cuando la cabeza no para.
                  </p>
                  <p>
                    Aquí tienes pasos claros para bajar el ruido y recuperar criterio en el día. Sin humo, sin discurso de laboratorio.
                  </p>
                  <p className="text-white font-medium">
                    Con práctica honesta cambia cómo vives lo que te pasa. No porque el mundo se arregle solo: porque tú atraviesas distinto.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Brain className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Menos ruido, más claridad</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Activity className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Pasos repetibles cada día</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Zap className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Resultados que ves tú</span>
                  </div>
                </div>
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>

      <section className="pb-20">
        <Container>
          <div className="space-y-16">
            {steps.map((step) => (
              <FadeInSection key={step.letter}>
                <div className="max-w-3xl mx-auto">
                  <div className="flex items-center gap-4 mb-6">
                    <span className="w-14 h-14 flex items-center justify-center bg-accent-blue/10 text-accent-blue font-heading font-bold text-2xl rounded-xl border border-accent-blue/20">
                      {step.letter}
                    </span>
                    <div className="flex items-center gap-3">
                      <step.icon className="w-5 h-5 text-accent-blue" />
                      <h2 className="font-heading text-2xl font-bold text-white">{step.title}</h2>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed mb-6">{step.explanation}</p>

                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wider">
                        En la práctica
                      </h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.neuro}</p>
                  </div>

                  <Card className="bg-dark-surface">
                    <h3 className="text-accent-blue font-semibold text-sm uppercase tracking-wider mb-3">
                      Ejercicio práctico
                    </h3>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.exercise}</p>
                  </Card>
                </div>
              </FadeInSection>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-20 border-t border-dark-border">
        <Container>
          <FadeInSection>
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-10">
                <Clock className="w-8 h-8 text-accent-blue mx-auto mb-4" />
                <SectionTitle title="Rutina N.E.U.R.O. (10 minutos)" />
              </div>
              <div className="space-y-3">
                {routine.map((r, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 rounded-lg bg-dark-surface border border-dark-border">
                    <span className="text-accent-blue font-mono font-bold text-sm w-16">{r.time}</span>
                    <span className="text-white">{r.activity}</span>
                  </div>
                ))}
              </div>
            </div>
          </FadeInSection>
        </Container>
      </section>
    </>
  )
}
