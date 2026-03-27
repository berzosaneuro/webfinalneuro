import { Metadata } from 'next'
import Container from '@/components/Container'
import SectionTitle from '@/components/SectionTitle'
import Card from '@/components/Card'
import FadeInSection from '@/components/FadeInSection'
import { ShieldOff, Target, User, Heart, Eye, Clock, Brain, Zap, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Método N.E.U.R.O. — Berzosa Neuro',
  description: 'Accede a tu supraconciencia, entrena metacognición y produce cambios cerebrales reales mediante neuroplasticidad. El framework científico del Método N.E.U.R.O.',
}

const steps = [
  {
    letter: 'N',
    title: 'Neutraliza el pensamiento',
    icon: ShieldOff,
    explanation: 'El pensamiento no es tu enemigo, pero tampoco es la realidad. La mayoría de lo que piensas son proyecciones, repeticiones y narrativas automáticas. Neutralizar no es suprimir: es quitar al pensamiento su poder de arrastre. Cuando observas un pensamiento sin engancharte, pierde fuerza. Se convierte en lo que realmente es: actividad mental, no verdad absoluta.',
    neuro: 'Tu cerebro tiene una red llamada Red Neuronal por Defecto (DMN) que se activa cuando no estás haciendo nada consciente. Es la responsable de la rumiación, el diálogo interno automático y el "modo piloto automático". Estudios de neuroimagen demuestran que la práctica de observación del pensamiento reduce la actividad de la DMN. Literalmente apagas el generador de ruido mental. Eso no es filosofía: es neurociencia medible con un escáner cerebral.',
    exercise: 'Siéntate 3 minutos en silencio. Cada vez que aparezca un pensamiento, etiquétalo mentalmente como "pensamiento" sin importar su contenido. No lo sigas, no lo analices. Solo etiqueta y suelta. Repite hasta que notes que los pensamientos pierden intensidad.',
  },
  {
    letter: 'E',
    title: 'Entrena la atención',
    icon: Target,
    explanation: 'La atención es la herramienta más poderosa que tienes y la menos entrenada. Sin atención, no hay presencia. Sin presencia, no hay control sobre tu experiencia. La atención se entrena como un músculo: con repeticiones. Cada vez que notas que tu mente se ha ido y la traes de vuelta, estás haciendo una repetición.',
    neuro: 'La corteza prefrontal es el "director ejecutivo" de tu cerebro. Controla la atención, la toma de decisiones y la inhibición de impulsos. Cada vez que entrenas la atención sostenida, fortaleces las conexiones neuronales de esta zona. Investigaciones en neuroplasticidad han demostrado que meditadores con práctica regular tienen una corteza prefrontal más gruesa. El cerebro cambia físicamente de estructura. Más materia gris donde más la necesitas.',
    exercise: 'Enfócate en tu respiración durante 5 minutos. No la modifiques, solo obsérvala. Cada vez que tu mente se desvíe, nótalo y vuelve a la respiración. Cuenta cuántas veces vuelves: ese es tu entrenamiento del día.',
  },
  {
    letter: 'U',
    title: 'Ubícate en el cuerpo',
    icon: User,
    explanation: 'Tu cuerpo siempre está en el presente. Tu mente casi nunca. Cuando llevas la atención al cuerpo, sales del bucle mental automático y aterrizas en el ahora. Las sensaciones corporales son un ancla perfecta porque son inmediatas, tangibles y siempre disponibles.',
    neuro: 'La ínsula es la región cerebral encargada de la interocepción: la capacidad de percibir lo que pasa dentro de tu cuerpo. Cuando practicas conciencia corporal, activas y fortaleces la ínsula. Personas con mayor actividad insular tienen mejor regulación emocional, mayor empatía y más capacidad de tomar decisiones acertadas. El neurocientífico Antonio Damasio demostró que las señales del cuerpo (marcadores somáticos) guían nuestras decisiones antes de que la mente consciente intervenga. Escuchar al cuerpo no es metáfora: es neurociencia.',
    exercise: 'Haz un escaneo corporal rápido: empieza por los pies y sube lentamente hasta la cabeza. En cada zona, nota qué sientes: tensión, calor, hormigueo, nada. No intentes cambiar nada, solo observa. Dedica 2 minutos a este recorrido.',
  },
  {
    letter: 'R',
    title: 'Regula la emoción',
    icon: Heart,
    explanation: 'Las emociones no son el problema. El problema es la reactividad automática. Regular no es reprimir ni controlar: es crear un espacio entre el estímulo y tu respuesta. En ese espacio está tu libertad. La regulación emocional se basa en tres pasos: detectar, nombrar y elegir.',
    neuro: 'La amígdala es tu sistema de alarma cerebral. Cuando detecta una amenaza (real o imaginada), dispara una respuesta emocional en milisegundos, antes de que puedas pensar. Eso es el "secuestro amigdalino". Pero la corteza prefrontal puede frenar esa reacción. El neurocientífico Matthew Lieberman descubrió que el simple acto de nombrar una emoción ("affect labeling") reduce la activación de la amígdala hasta un 50%. Detectar, nombrar, elegir: cada paso tiene su correlato neuronal. Cada vez que lo practicas, refuerzas el circuito prefrontal que frena la reactividad automática.',
    exercise: 'La próxima vez que sientas una emoción intensa (irritación, ansiedad, frustración), para y haz esto: 1) Detecta dónde sientes la emoción en tu cuerpo. 2) Nómbrala mentalmente. 3) Respira tres veces antes de responder o actuar. Nota la diferencia.',
  },
  {
    letter: 'O',
    title: 'Observa sin identificarte',
    icon: Eye,
    explanation: 'Este es el nivel más profundo. Observar sin identificarte significa ser consciente de tus pensamientos, emociones y sensaciones sin creer que eres ellos. Tú no eres tu ansiedad. No eres tu autocrítica. No eres tu miedo. Eres la conciencia que puede observar todo eso. Cuando te identificas con un pensamiento, te arrastra. Cuando lo observas, eres libre.',
    neuro: 'La metacognición (pensar sobre el propio pensamiento) es una capacidad exclusiva de la corteza prefrontal humana. Cuando observas tus propios procesos mentales sin identificarte con ellos, activas una red cerebral diferente a la DMN: la red de atención ejecutiva. Estudios con meditadores avanzados muestran una desactivación significativa de la corteza prefrontal medial (la zona del "yo" narrativo) durante la observación pura. En otras palabras: el ego tiene una dirección física en el cerebro, y puedes aprender a apagarlo temporalmente. La conciencia testigo no es espiritualidad: es tu cerebro funcionando en su modo más evolucionado.',
    exercise: 'Durante 5 minutos, adopta la posición del observador. Imagina que estás sentado en la orilla de un río y tus pensamientos son hojas que flotan en el agua. Obsérvalos pasar sin subirte a ninguno. Si te enganchas, nótalo y vuelve a la orilla.',
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
              Supraconciencia, metacognición y neuroplasticidad. El framework científico para eliminar el ruido mental.
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
                    Porque cada letra de este método tiene un correlato directo en tu cerebro. No es un nombre comercial. No es marketing. Es lo que es.
                  </p>
                  <p>
                    Cuando neutralizas un pensamiento, estás reduciendo la actividad de la Red Neuronal por Defecto. Cuando entrenas la atención, estás engrosando tu corteza prefrontal. Cuando te ubicas en el cuerpo, estás fortaleciendo la ínsula. Cuando regulas una emoción, estás frenando la amígdala con tu corteza prefrontal. Cuando observas sin identificarte, estás practicando metacognición real: la capacidad de ver tus propios procesos mentales como objetos, no como tu identidad.
                  </p>
                  <p className="text-white font-medium">
                    El resultado acumulado de esa práctica es acceder a la supraconciencia: el estado en que observas la mente sin ser arrastrado por ella. Cada ejercicio cambia físicamente la estructura de tu cerebro. Eso es neuroplasticidad. Y por eso se llama NEURO.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Brain className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Supraconciencia activa</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Activity className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Metacognición aplicada</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Zap className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Neuroplasticidad real</span>
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
            {steps.map((step, i) => (
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
                  <p className="text-text-secondary leading-relaxed mb-6">
                    {step.explanation}
                  </p>

                  {/* Base neurocientífica */}
                  <div className="rounded-xl border border-purple-500/20 bg-purple-500/5 p-5 mb-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Brain className="w-4 h-4 text-purple-400" />
                      <h3 className="text-purple-400 font-semibold text-sm uppercase tracking-wider">Qué pasa en tu cerebro</h3>
                    </div>
                    <p className="text-text-secondary text-sm leading-relaxed">{step.neuro}</p>
                  </div>

                  <Card className="bg-dark-surface">
                    <h3 className="text-accent-blue font-semibold text-sm uppercase tracking-wider mb-3">Ejercicio práctico</h3>
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
