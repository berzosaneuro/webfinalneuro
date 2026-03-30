import { Metadata } from 'next'
import Container from '@/components/Container'
import SectionTitle from '@/components/SectionTitle'
import Card from '@/components/Card'
import FadeInSection from '@/components/FadeInSection'
import { ShieldOff, Target, User, Heart, Eye, Clock, Brain, Zap, Activity } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Método N.E.U.R.O. — Berzosa Neuro',
  description:
    'Cinco pasos prácticos nacidos de experiencia real: menos ruido en la cabeza, más claridad en el día a día. Sin tecnicismos, sin postureo.',
}

const steps = [
  {
    letter: 'N',
    title: 'Neutraliza el pensamiento',
    icon: ShieldOff,
    explanation:
      'El pensamiento no es tu enemigo, pero tampoco es la realidad. La mayoría de lo que piensas son proyecciones, repeticiones y narrativas automáticas. Neutralizar no es suprimir: es quitar al pensamiento su poder de arrastre. Cuando observas un pensamiento sin engancharte, pierde fuerza. Se convierte en lo que realmente es: actividad mental, no verdad absoluta.',
    neuro:
      'Cuando dejo de seguir cada idea hasta el final, el día cambia de textura. Lo aprendí a fuerza de noches en vela: etiquetar el pensamiento y soltarlo no es debilidad; es recuperar el mando. Si lo practicas, notas que el mismo problema ocupa menos espacio.',
    exercise:
      'Siéntate 3 minutos en silencio. Cada vez que aparezca un pensamiento, etiquétalo mentalmente como "pensamiento" sin importar su contenido. No lo sigas, no lo analices. Solo etiqueta y suelta. Repite hasta que notes que los pensamientos pierden intensidad.',
  },
  {
    letter: 'E',
    title: 'Entrena la atención',
    icon: Target,
    explanation:
      'La atención es la herramienta más poderosa que tienes y la menos entrenada. Sin atención, no hay presencia. Sin presencia, no hay control sobre tu experiencia. La atención se entrena como un músculo: con repeticiones. Cada vez que notas que tu mente se ha ido y la traes de vuelta, estás haciendo una repetición.',
    neuro:
      'Antes me castigaba cada vez que me distraía. Con el tiempo entendí que volver al foco es el entrenamiento. No hace falta ser monje: unos minutos al día bastan para sentir que eliges dónde pones la mirada, en lugar de que ella te arrastre.',
    exercise:
      'Enfócate en tu respiración durante 5 minutos. No la modifiques, solo obsérvala. Cada vez que tu mente se desvíe, nótalo y vuelve a la respiración. Cuenta cuántas veces vuelves: ese es tu entrenamiento del día.',
  },
  {
    letter: 'U',
    title: 'Ubícate en el cuerpo',
    icon: User,
    explanation:
      'Tu cuerpo siempre está en el presente. Tu mente casi nunca. Cuando llevas la atención al cuerpo, sales del bucle mental automático y aterrizas en el ahora. Las sensaciones corporales son un ancla perfecta porque son inmediatas, tangibles y siempre disponibles.',
    neuro:
      'Cuando bajo del ruido a lo que siento físicamente, la tormenta baja sola. No es mística: es lo más simple que probé y lo que más me estabilizó en momentos feos. El cuerpo no discute; solo está.',
    exercise:
      'Haz un escaneo corporal rápido: empieza por los pies y sube lentamente hasta la cabeza. En cada zona, nota qué sientes: tensión, calor, hormigueo, nada. No intentes cambiar nada, solo observa. Dedica 2 minutos a este recorrido.',
  },
  {
    letter: 'R',
    title: 'Regula la emoción',
    icon: Heart,
    explanation:
      'Las emociones no son el problema. El problema es la reactividad automática. Regular no es reprimir ni controlar: es crear un espacio entre el estímulo y tu respuesta. En ese espacio está tu libertad. La regulación emocional se basa en tres pasos: detectar, nombrar y elegir.',
    neuro:
      'Nombrar lo que siento antes de abrir la boca me ahorró discusiones que ya no quiero repetir. Ese microespacio entre el golpe y la respuesta es donde dejas de reaccionar y empiezas a elegir. Nadie te lo enseña en el instituto; aquí lo entrenas en frío.',
    exercise:
      'La próxima vez que sientas una emoción intensa (irritación, ansiedad, frustración), para y haz esto: 1) Detecta dónde sientes la emoción en tu cuerpo. 2) Nómbrala mentalmente. 3) Respira tres veces antes de responder o actuar. Nota la diferencia.',
  },
  {
    letter: 'O',
    title: 'Observa sin identificarte',
    icon: Eye,
    explanation:
      'Este es el nivel más profundo. Observar sin identificarte significa ser consciente de tus pensamientos, emociones y sensaciones sin creer que eres ellos. Tú no eres tu ansiedad. No eres tu autocrítica. No eres tu miedo. Eres la conciencia que puede observar todo eso. Cuando te identificas con un pensamiento, te arrastra. Cuando lo observas, eres libre.',
    neuro:
      'Cuando dejo de confundirme con el drama de la cabeza, el volumen baja. No me volví frío: simplemente vi que el ruido no era todo lo que soy. Eso cambia cómo enfrentas el día sin fingir que todo está perfecto.',
    exercise:
      'Durante 5 minutos, adopta la posición del observador. Imagina que estás sentado en la orilla de un río y tus pensamientos son hojas que flotan en el agua. Obsérvalos pasar sin subirte a ninguno. Si te enganchas, nótalo y vuelve a la orilla.',
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
              No nació en un paper. Nació de vivir la mente a mil y necesitar una salida simple, repetible y honesta.
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
                    No soy científico. Soy alguien que estuvo agotado, sobrepensando y fingiendo que &quot;estaba bien&quot;.
                    Estas cinco letras son la brújula que fui probando hasta que hubo orden: qué hacer cuando la cabeza
                    no para.
                  </p>
                  <p>
                    No te vendo escáneres ni promesas de laboratorio. Te ofrezco lo que a mí me funcionó: pasos claros,
                    sin humo, para bajar el ruido y volver a elegir cómo vives el día.
                  </p>
                  <p className="text-white font-medium">
                    Si lo practicas con constancia honesta—notando, sin engañarte—la vida se siente distinta. No porque
                    la realidad cambie sola, sino porque tú cambias cómo la atraviesas.
                  </p>
                </div>
                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Brain className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Menos ruido, más claridad</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Activity className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Pasos que puedes repetir</span>
                  </div>
                  <div className="flex items-center gap-3 p-3 rounded-xl bg-dark-bg/50">
                    <Zap className="w-5 h-5 text-accent-blue shrink-0" />
                    <span className="text-sm text-white">Cambios que se notan</span>
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
                        Lo que esto cambia cuando lo practicas
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
