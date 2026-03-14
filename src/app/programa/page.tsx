'use client'

import { useState, useEffect } from 'react'
import Container from '@/components/Container'
import { useUser } from '@/context/UserContext'
import FadeInSection from '@/components/FadeInSection'
import EmailCapture from '@/components/EmailCapture'
import Link from 'next/link'
import { Lock, Check, Play, ChevronRight, ArrowLeft, Brain, Eye, Wind, Heart, Zap, Target, Shield, Flame, Sun, Moon, Sparkles, Crown, Leaf, Users } from 'lucide-react'
import { recordActivity } from '@/lib/streak'

const STORAGE_KEY = 'programa21_data'

const days = [
  // ─── SEMANA 1: DESPERTAR ─ Fundamentos N.E.U.R.O. ───
  {
    day: 1, week: 1,
    title: 'N — Neutraliza: observa el ruido',
    desc: 'Antes de cambiar nada hay que ver qué hay. Hoy mides cuánto ruido mental tienes. Sin juzgar, sin cambiar. Solo contar.',
    exercise: 'Siéntate en silencio con los ojos cerrados. Cada vez que aparezca un pensamiento —cualquiera— cuenta uno en silencio. Hazlo 3 minutos. Al terminar, anota el número. Ese es tu índice de ruido mental inicial: tu punto de partida.',
    neuro: 'Al observar el propio pensamiento activas la corteza prefrontal dorsolateral, la sede de la metacognición. La Red Neuronal por Defecto (DMN), responsable del rumiar mental, se desactiva parcialmente cuando la observas con intención. Es el mismo mecanismo que la meditación vipassana: la observación consciente interrumpe el bucle automático.',
    category: 'N — Neutraliza', icon: Brain, exercise_link: 'counter', duration: '3 min',
  },
  {
    day: 2, week: 1,
    title: 'E — Entrena: primer foco sostenido',
    desc: 'La atención es un músculo. Hoy haces tu primera serie. Sencillo en teoría, difícil en práctica. Eso es exactamente lo que lo hace efectivo.',
    exercise: 'Pon un temporizador de 5 minutos. Elige un punto fijo: la llama de una vela, un punto en la pared, el sonido del ambiente. Mantén tu atención ahí. Cada vez que tu mente se desvíe, di mentalmente "distracción" y vuelve. Cuenta cuántas veces regresas. Ese número es tu marcador de entrenamiento del día.',
    neuro: 'Cada redirección de la atención fortalece las conexiones entre la corteza cingulada anterior y la corteza prefrontal. Con práctica repetida se aumenta la densidad sináptica en estas regiones, lo que se traduce en mayor control del foco, menor impulsividad y mejor filtrado de distractores. Literalmente haces pesas con la corteza prefrontal.',
    category: 'E — Entrena', icon: Target, exercise_link: 'meditation', duration: '5 min',
  },
  {
    day: 3, week: 1,
    title: 'U — Ubícate: aterriza en el cuerpo',
    desc: 'Tu mente viaja al pasado y al futuro constantemente. Tu cuerpo nunca se mueve del presente. Hoy aprendes a usarlo como ancla.',
    exercise: 'Escaneo corporal de 5 minutos. Empieza por los pies: ¿calor, frío, presión, hormigueo, nada? Sube despacio: pantorrillas, rodillas, muslos, cadera, vientre, pecho, manos, brazos, hombros, cuello, cara. 20-30 segundos por zona. No intentes cambiar nada. Solo observa lo que hay.',
    neuro: 'El escaneo corporal activa la ínsula, la región encargada de la interocepción. A mayor desarrollo insular, mejor regulación emocional y mejores decisiones (marcadores somáticos de Damasio). También reduce la actividad de la amígdala al cambiar el foco de la amenaza percibida a las sensaciones corporales neutras.',
    category: 'U — Ubícate', icon: Heart, exercise_link: 'bodyscan', duration: '5 min',
  },
  {
    day: 4, week: 1,
    title: 'R — Regula: etiqueta lo que sientes',
    desc: 'Las emociones no son el problema. El problema es reaccionar desde ellas sin elegirlo. Hoy aprendes a poner nombre a lo que sientes para reducir su intensidad.',
    exercise: 'Durante todo el día, cada vez que notes una emoción intensa: 1) Para. 2) Pregúntate: ¿qué siento exactamente? Nómbralo: "hay ansiedad", "hay irritación", "hay tristeza". 3) Localiza dónde lo sientes en el cuerpo. 4) Respira: inhala 4s, exhala 8s. Tres veces. Después actúa o no. Practica mínimo 3 veces hoy.',
    neuro: 'El etiquetado emocional (affect labeling) reduce la actividad de la amígdala hasta un 50% según estudios de Lieberman et al. (2007). Al poner nombre a un estado emocional activas la corteza prefrontal ventrolateral, que actúa como freno neurológico del sistema límbico. No es supresión: es regulación descendente consciente.',
    category: 'R — Regula', icon: Shield, exercise_link: 'labeler', duration: 'Todo el día',
  },
  {
    day: 5, week: 1,
    title: 'O — Observa: el espacio entre tú y tus pensamientos',
    desc: 'El más importante de los 5 pasos. No eres tus pensamientos. No eres tus emociones. Eres quien los observa. Hoy lo experimentas por primera vez.',
    exercise: 'Cierra los ojos 5 minutos. Imagina que estás sentado en la orilla de un río. Tus pensamientos son hojas que flotan en el agua. Tu trabajo es solo observar las hojas desde la orilla, sin subirte a ninguna. Cuando notes que te enganchaste a un pensamiento —que ya estás dentro de él— simplemente di "enganchado" y vuelve a la orilla. Cada vuelta es una repetición.',
    neuro: 'Adoptar la posición del observador desactiva la corteza prefrontal medial (el "yo narrativo") y activa la red de salience y atención ejecutiva. Los estudios de neuroimagen en meditadores muestran reducción de grosor en el córtex prefrontal medial —menos "yo" ruidoso— y aumento en zonas de atención sostenida. El ego no es eterno: tiene un sustrato neural modificable.',
    category: 'O — Observa', icon: Eye, exercise_link: 'meditation', duration: '5 min',
  },
  {
    day: 6, week: 1,
    title: 'Primera integración N.E.U.R.O.',
    desc: 'Hoy juntas las 5 letras por primera vez. No como un repaso: como un flujo continuo. Así es como el método funciona en la vida real.',
    exercise: '1) N (2 min): cuenta pensamientos — ¿cuántos tienes hoy vs. el día 1? 2) E (2 min): foco en un punto fijo, cuenta regresos. 3) U (2 min): escaneo corporal rápido de pies a cabeza. 4) R (1 min): nombra 3 emociones que notes en este momento. 5) O (3 min): observador puro, deja pasar todo. Total: 10 min. Anota qué ha cambiado esta semana.',
    neuro: 'Al integrar los 5 pasos activas simultáneamente: corteza prefrontal (N), cíngulo anterior (E), ínsula (U), sistema límbico regulado (R) y red ejecutiva (O). Es el entrenamiento cerebral más completo posible sin equipamiento. Los estudios de mindfulness intensivo muestran cambios en conectividad funcional ya en la primera semana.',
    category: 'Integración', icon: Zap, exercise_link: 'meditation', duration: '10 min',
  },
  {
    day: 7, week: 1,
    title: 'Cierre semana 1: mide tu cambio',
    desc: 'Fin de la primera semana. Hoy mides. Compara con el día 1 y decides si quieres continuar. Los datos no mienten.',
    exercise: '1) Cuenta pensamientos 3 minutos. Compara con el día 1. 2) Haz el Test de Ruido Mental en /test. Guarda tu puntuación. 3) Escribe en el diario: ¿qué momento de esta semana recuerdas más? ¿Cuándo notaste el mayor cambio? ¿Qué quieres seguir entrenando? 4) Meditación libre de 5 minutos: sin guía, solo tú y tu mente.',
    neuro: '7 días de práctica consistente generan cambios medibles en la conectividad funcional entre la corteza prefrontal y la amígdala. No son cambios estructurales (eso requiere 6-8 semanas), pero sí el inicio del nuevo cableado. La semana 2 consolida lo aprendido y lleva la práctica a situaciones reales de mayor dificultad.',
    category: 'Cierre semana', icon: Sparkles, exercise_link: 'test', duration: '15 min',
  },

  // ─── SEMANA 2: ENTRENAMIENTO ─ Consolidación en la vida real ───
  {
    day: 8, week: 2,
    title: 'Atención selectiva: escucha sin distracción',
    desc: 'La atención no solo se entrena en silencio. Hoy la llevas a una situación real: escuchar. Solo escuchar.',
    exercise: 'Elige un sonido del entorno —lluvia, coches, música, silencio— y escúchalo durante 3 minutos sin hacer nada más. Luego, en tu próxima conversación real del día, practica escuchar sin preparar tu respuesta mientras el otro habla. Solo recibe. Anota cómo te resultó.',
    neuro: 'La atención auditiva activa el córtex auditivo primario junto con la corteza prefrontal. Escuchar sin preparar respuesta reduce la actividad del "yo" narrativo y aumenta la empatía neural: las neuronas espejo se activan mejor cuando no hay interferencia del monólogo interno.',
    category: 'Entrenamiento', icon: Target, exercise_link: 'meditation', duration: '3 min + práctica',
  },
  {
    day: 9, week: 2,
    title: 'Regulación avanzada: el protocolo STOP',
    desc: 'Hoy aprendes el protocolo de emergencia para regular cualquier emoción intensa en cualquier momento y lugar.',
    exercise: 'Memoriza y practica hoy el protocolo STOP: S — Para (Stop). T — Respira profundo (Take a breath). O — Observa: ¿qué piensas? ¿Qué sientes? ¿Qué está pasando en tu cuerpo? P — Procede con intención. Úsalo al menos 3 veces hoy, preferiblemente ante una situación de estrés real.',
    neuro: 'El protocolo STOP crea un espacio de 3-6 segundos entre estímulo y respuesta. En ese espacio la corteza prefrontal tiene tiempo de activarse antes de que la amígdala dicte la respuesta. Es la diferencia entre reactividad automática y respuesta elegida. Viktor Frankl lo llamó "espacio de libertad". La neurociencia lo llama inhibición de respuesta prefrontal.',
    category: 'Regulación', icon: Shield, exercise_link: 'labeler', duration: 'Todo el día',
  },
  {
    day: 10, week: 2,
    title: 'Meditación caminando: presencia en movimiento',
    desc: 'La meditación no es solo quedarse quieto. Hoy llevas la atención al movimiento. Al caminar como práctica.',
    exercise: 'Camina 10 minutos en solitario, sin teléfono, sin música. Presta atención completa a cada paso: la planta del pie tocando el suelo, el cambio de peso, el movimiento de los brazos, la temperatura del aire. Cuando tu mente se vaya a pensamientos, di "pensamiento" y vuelve al paso. Camina despacio si ayuda.',
    neuro: 'La meditación caminando integra la red somatosensorial (sensaciones del movimiento), la red de atención y el sistema vestibular. Reduce la actividad de la DMN sin requerir postura estática. Estudios con meditadores muestran que la práctica en movimiento mejora la generalización de la atención a la vida cotidiana más que la práctica sedentaria exclusiva.',
    category: 'Presencia', icon: Wind, exercise_link: 'timer', duration: '10 min',
  },
  {
    day: 11, week: 2,
    title: 'Mente del principiante: ver sin filtros',
    desc: 'Tu cerebro economiza energía usando atajos y etiquetas. Hoy lo engañas para ver la realidad directamente, sin filtros del pasado.',
    exercise: 'Elige un objeto cotidiano: una taza, una fruta, tus propias manos. Obsérvalo durante 3 minutos como si fuera la primera vez que lo ves en tu vida. Fíjate en los colores, texturas, formas, sombras que normalmente ignoras. Anota 10 detalles que no habías notado antes. Luego, durante el resto del día, aplica la misma mirada a una situación o persona.',
    neuro: 'La mente del principiante (shoshin) desactiva el procesamiento top-down —el sistema de predicciones y atajos del cerebro— y activa el procesamiento bottom-up: percepción directa sin filtro conceptual. Esto reduce el sesgo de confirmación y aumenta la creatividad al forzar nuevas conexiones en la corteza asociativa.',
    category: 'Presencia', icon: Eye, exercise_link: 'journal', duration: '3 min + observación',
  },
  {
    day: 12, week: 2,
    title: 'Control de impulsos: la pausa de 10 segundos',
    desc: 'Los impulsos no son inevitables. Son señales que llegan antes de que la corteza prefrontal tenga tiempo de responder. Hoy le das ese tiempo.',
    exercise: 'Regla del día: antes de cualquier acción impulsiva —abrir el móvil sin motivo, comer sin hambre, mandar un mensaje reactivo, decir algo de golpe— espera 10 segundos. Cuenta los 10 en tu cabeza. Luego decide conscientemente si lo haces o no. Al final del día anota cuántos impulsos interceptaste y cuántos seguiste de todas formas.',
    neuro: 'El córtex prefrontal dorsolateral tarda aproximadamente 300-500ms en activarse tras un estímulo. Los impulsos se generan antes: en el sistema límbico y los ganglios basales. La pausa de 10 segundos da tiempo a la corteza prefrontal para inhibir la respuesta automática. Es el fundamento neurológico del autocontrol: no fuerza de voluntad, sino tiempo de procesamiento.',
    category: 'Autocontrol', icon: Brain, exercise_link: 'counter', duration: 'Todo el día',
  },
  {
    day: 13, week: 2,
    title: 'Compasión activa: metta',
    desc: 'La compasión no es debilidad. Es una de las funciones cerebrales más avanzadas. Y se entrena exactamente igual que la atención.',
    exercise: 'Siéntate 8 minutos. Visualiza a estas personas en orden y envía mentalmente estas palabras a cada una: "Que estés bien. Que estés en paz. Que seas feliz." 1) Tú mismo. 2) Alguien a quien quieres. 3) Una persona neutral (el cajero, un vecino). 4) Alguien con quien tengas dificultad. Nota qué sientes en el cuerpo con cada persona.',
    neuro: 'La práctica de metta (loving-kindness) activa la ínsula anterior y la corteza cingulada anterior, regiones clave para la empatía. Estudios de Lutz et al. muestran que incluso principiantes generan estados neurales similares a los meditadores expertos con esta práctica. Aumenta la sensación de conexión social y reduce los marcadores inflamatorios de estrés.',
    category: 'Emoción', icon: Heart, exercise_link: 'meditation', duration: '8 min',
  },
  {
    day: 14, week: 2,
    title: 'Revisión media: mide tu progreso real',
    desc: 'Día 14. La mitad del camino. Hoy mides, comparas y ajustas. Los datos son tu brújula.',
    exercise: '1) Haz el Test de Ruido Mental en /test. Compara con tu puntuación del día 7. 2) Cuenta pensamientos 3 minutos: ¿cuántos tienes ahora vs. el día 1? 3) Revisa tu diario de esta semana: ¿qué patrones ves? ¿Qué ha mejorado? ¿Qué sigue siendo difícil? 4) Escribe 3 compromisos específicos para la semana 3.',
    neuro: 'A las dos semanas de práctica consistente ya se observan cambios medibles en el grosor cortical de regiones prefrontales mediante neuroimagen. La conectividad entre prefrontal y amígdala se fortalece, reduciendo la reactividad emocional. Lo que mides hoy ya no es la misma mente que empezó el día 1.',
    category: 'Evaluación', icon: Zap, exercise_link: 'test', duration: '20 min',
  },

  // ─── SEMANA 3: MAESTRÍA ─ Integración permanente ───
  {
    day: 15, week: 3,
    title: 'Desconexión digital: presencia sin pantallas',
    desc: 'Las pantallas interrumpen el foco atencional de media cada 2 minutos. Hoy descubres cómo se siente tu cerebro sin esa interferencia constante.',
    exercise: 'Durante 2 horas consecutivas hoy, desconéctate de todas las pantallas: móvil, ordenador, televisión. Puedes leer en papel, caminar, cocinar, observar, hablar en persona. Al terminar, registra en el diario: ¿qué sentiste durante las primeras dos horas? ¿Qué impulsos notaste? ¿Cómo te sientes ahora vs. antes?',
    neuro: 'Las notificaciones digitales activan el sistema de recompensa dopaminérgico con recompensas variables de baja calidad, generando un patrón similar a la adicción. La desconexión forzada activa inicialmente el sistema de estrés (FOMO, inquietud) pero en 20-30 minutos el córtex prefrontal recupera su capacidad de funcionamiento en modo profundo. El cerebro necesita periodos sin interrupciones para consolidar memoria y generar insight.',
    category: 'Autocontrol', icon: Shield, exercise_link: 'journal', duration: '2 horas',
  },
  {
    day: 16, week: 3,
    title: 'Presencia en relaciones: escucha total',
    desc: 'La presencia no es un estado solitario. Es también cómo te relacionas. Hoy llevas la práctica a la conexión humana.',
    exercise: 'En tu próxima conversación importante del día: 1) Silencia mentalmente tu propio monólogo interno. 2) Escucha para entender, no para responder. 3) Mantén contacto visual sin forzarlo. 4) Cuando la otra persona termine, espera 3 segundos antes de responder. Anota después: ¿qué notaste de la otra persona que no sueles notar? ¿Cómo fue para ti?',
    neuro: 'Escuchar con plena atención activa las neuronas espejo y la ínsula anterior, las bases neurales de la empatía. Cuando el monólogo interno se silencia, el cerebro puede procesar las microexpresiones y el tono emocional del otro con mucho mayor fidelidad. La calidad de las relaciones mejora directamente con la calidad de la atención que traes a ellas.',
    category: 'Presencia', icon: Users, exercise_link: 'journal', duration: 'Práctica real',
  },
  {
    day: 17, week: 3,
    title: 'Restauración: Yoga Nidra',
    desc: 'El descanso profundo no es solo dormir. Hoy aprendes a acceder al estado entre vigilia y sueño donde el cerebro se restaura.',
    exercise: 'Justo antes de dormir, o en cualquier momento del día: túmbate cómodamente con los ojos cerrados. Recorre mentalmente tu cuerpo de pies a cabeza con esta instrucción: "Soy consciente de mis pies... soy consciente de mis pantorrillas..." (nombra cada parte). Después, visualiza estos contrastes en rápida sucesión: frío-calor, luz-oscuridad, pesado-ligero. Mantente en el umbral entre sueño y vigilia 10 minutos. Si te quedas dormido, también sirve.',
    neuro: 'El Yoga Nidra induce el estado hipnagógico (ondas theta: 4-8 Hz), justo entre vigilia (alfa) y sueño (delta). En este estado, la consolidación de memoria episódica se acelera y el córtex prefrontal se restaura. Investigaciones del Army Research Laboratory muestran que 20 minutos de Yoga Nidra equivalen en recuperación cognitiva a 4 horas de sueño ligero.',
    category: 'Restauración', icon: Moon, exercise_link: 'meditation', duration: '10 min',
  },
  {
    day: 18, week: 3,
    title: 'Claridad vital: la pregunta que lo cambia todo',
    desc: 'La mayoría de las personas viven sin haber elegido conscientemente cómo vivir. Hoy te detienes a mirar.',
    exercise: 'Busca 15 minutos de soledad y silencio. Responde por escrito, sin censura: 1) Si te quedara 1 año de vida, ¿qué dejarías de hacer mañana? 2) ¿Qué harías más? 3) ¿Hay algo que nunca le has dicho a alguien importante? 4) ¿Cuál es el miedo que más está frenando tu vida? No busques las respuestas "correctas". Escribe lo primero que llegue.',
    neuro: 'Este ejercicio activa la corteza prefrontal medial (autorreferencia) y el cíngulo posterior (perspectiva temporal). La confrontación con la finitud —incluso hipotética— desactiva temporalmente el modo "modo automático" y fuerza una evaluación desde la corteza prefrontal en lugar de los circuitos del hábito. Es uno de los ejercicios de claridad cognitiva más potentes conocidos.',
    category: 'Claridad', icon: Sparkles, exercise_link: 'despertar', duration: '15 min',
  },
  {
    day: 19, week: 3,
    title: 'Rastreo emocional: diario de estados',
    desc: 'Lo que no se nombra no se puede cambiar. Hoy mapeas tu paisaje emocional real con precisión.',
    exercise: 'Cada 2-3 horas durante el día, para 30 segundos y registra en el diario: 1) ¿Qué emoción predomina ahora? (sé específico: no "mal", sino "frustrado", "ansioso", "aburrido", "tranquilo"...) 2) ¿A qué situación corresponde? 3) ¿Dónde lo sientes en el cuerpo? Mínimo 4 registros. Al final del día, revisa el mapa: ¿qué patrones ves?',
    neuro: 'El vocabulario emocional preciso (granularidad emocional, Lisa Feldman Barrett) está directamente correlacionado con la regulación emocional. Las personas con mayor granularidad emocional toman mejores decisiones, tienen menos días de baja laboral y responden mejor a situaciones de estrés. Nombrar con precisión es una forma de regulación descendente.',
    category: 'Emoción', icon: Heart, exercise_link: 'journal', duration: 'Todo el día',
  },
  {
    day: 20, week: 3,
    title: 'Estado de flujo: atención total',
    desc: 'El flujo (flow) no es suerte ni talento. Es el resultado de la atención sin fisuras. Hoy lo induces deliberadamente.',
    exercise: 'Elige una actividad que te suponga un reto moderado (no demasiado fácil, no imposible). Puede ser trabajo, música, escritura, deporte, cocina, cualquier cosa. Elimina todas las distracciones posibles. Sumérgete durante 20 minutos con atención completa. Si tu mente se va, vuelve a la tarea. Anota después: ¿lograste el estado de flujo? ¿Cuánto tiempo tardaste en entrar?',
    neuro: 'El estado de flujo se caracteriza por la desactivación de la corteza prefrontal medial (desaparece el "yo") y la máxima sincronización entre regiones cerebrales relevantes para la tarea. Csikszentmihalyi lo identificó como el estado de mayor bienestar y rendimiento humano. Se accede cuando el nivel de reto está justo por encima de la habilidad actual.',
    category: 'Maestría', icon: Flame, exercise_link: 'timer', duration: '20 min',
  },
  {
    day: 21, week: 3,
    title: 'Graduación N.E.U.R.O.',
    desc: 'Día 21. Has llegado. Hoy no es el final: es el punto de partida de una nueva forma de relacionarte con tu mente.',
    exercise: '1) Test de Ruido Mental en /test: compara con los días 7 y 14. 2) Cuenta pensamientos 3 minutos: ¿cuántos vs. el día 1? 3) Meditación del observador de 10 minutos: integra todo lo aprendido. 4) Escribe tu declaración personal: ¿qué ha cambiado en estos 21 días? ¿Qué quieres seguir entrenando? ¿Cuál es tu próximo paso?',
    neuro: 'A las 3 semanas de práctica consistente, los estudios de neuroimagen muestran cambios estructurales medibles: aumento del grosor cortical prefrontal, reducción del volumen de la amígdala y mayor conectividad entre las redes de atención y regulación emocional. No es metáfora: tu cerebro ha cambiado. El siguiente nivel es hacer de esto un estilo de vida permanente.',
    category: 'Graduación', icon: Sun, exercise_link: 'graduation', duration: '30 min',
  },
]

type ProgramData = {
  startDate: string | null
  completedDays: number[]
}

function loadProgram(): ProgramData {
  if (typeof window === 'undefined') return { startDate: null, completedDays: [] }
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw)
  } catch {}
  return { startDate: null, completedDays: [] }
}

function saveProgram(data: ProgramData) {
  if (typeof window === 'undefined') return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
}

export default function ProgramaPage() {
  const { user } = useUser()
  const [data, setData] = useState<ProgramData>({ startDate: null, completedDays: [] })
  const [selectedDay, setSelectedDay] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const load = async () => {
      if (user?.email) {
        try {
          const res = await fetch(`/api/programa?email=${encodeURIComponent(user.email)}`)
          if (res.ok) {
            const json = await res.json()
            const loaded: ProgramData = {
              startDate: json.start_date || null,
              completedDays: Array.isArray(json.completed_days) ? json.completed_days : [],
            }
            setData(loaded)
            return
          }
        } catch {}
      }
      setData(loadProgram())
    }
    load()
  }, [user?.email])

  const syncToApi = async (newData: ProgramData) => {
    if (!user?.email) return
    try {
      await fetch('/api/programa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: user.email,
          startDate: newData.startDate,
          completedDays: newData.completedDays,
        }),
      })
    } catch {
      saveProgram(newData)
    }
  }

  const startProgram = () => {
    const newData = { startDate: new Date().toISOString().split('T')[0], completedDays: [] }
    setData(newData)
    saveProgram(newData)
    syncToApi(newData)
  }

  const completeDay = (dayNum: number) => {
    if (data.completedDays.includes(dayNum)) return
    const newData = { ...data, completedDays: [...data.completedDays, dayNum] }
    setData(newData)
    saveProgram(newData)
    syncToApi(newData)
    recordActivity()
    setSelectedDay(null)
  }

  const getCurrentUnlockedDay = (): number => {
    if (!data.startDate) return 21
    const startD = new Date(data.startDate)
    const today = new Date()
    startD.setHours(0, 0, 0, 0)
    today.setHours(0, 0, 0, 0)
    const diffMs = today.getTime() - startD.getTime()
    const diffDays = Math.floor(diffMs / (24 * 60 * 60 * 1000))
    return Math.min(21, Math.max(1, diffDays + 1))
  }

  const getDayStatus = (dayNum: number): 'completed' | 'current' | 'locked' => {
    if (data.completedDays.includes(dayNum)) return 'completed'
    const unlocked = getCurrentUnlockedDay()
    if (data.startDate) {
      if (dayNum <= unlocked) return 'current'
      return 'locked'
    }
    if (dayNum === 1 || data.completedDays.includes(dayNum - 1)) return 'current'
    return 'locked'
  }

  const progress = (data.completedDays.length / 21) * 100
  const selected = selectedDay ? days.find(d => d.day === selectedDay) : null

  const exerciseLinks: Record<string, string> = {
    counter: '/ejercicios',
    breathing: '/sos',
    labeler: '/ejercicios',
    bodyscan: '/ejercicios',
    meditation: '/meditacion',
    journal: '/diario',
    focus: '/meditacion',
    timer: '/meditacion',
    test: '/test',
    despertar: '/despertar',
    graduation: '/neuroscore',
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent-blue border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  // Detail view
  if (selected) {
    const status = getDayStatus(selected.day)
    return (
      <div className="relative overflow-hidden">
        <div className="orb w-64 h-64 bg-accent-blue top-20 -right-20" />
        <section className="pt-8 pb-6">
          <Container>
            <button onClick={() => setSelectedDay(null)} className="flex items-center gap-2 text-text-secondary text-sm mb-6 active:opacity-70">
              <ArrowLeft className="w-4 h-4" /> Volver al programa
            </button>
            <div className="glass rounded-3xl p-6">
              <div className="flex items-center gap-2 mb-4 flex-wrap">
                <span className="px-2.5 py-1 rounded-full bg-accent-blue/10 text-accent-blue text-xs font-semibold">{selected.category}</span>
                <span className="text-text-muted text-xs">Día {selected.day} de 21</span>
                {selected.duration && <span className="text-text-muted text-xs">· {selected.duration}</span>}
              </div>
              <div className="w-14 h-14 rounded-2xl bg-accent-blue/15 flex items-center justify-center mb-4">
                <selected.icon className="w-7 h-7 text-accent-blue" />
              </div>
              <h2 className="font-heading font-bold text-white text-2xl mb-3">{selected.title}</h2>
              <p className="text-text-secondary text-base leading-relaxed mb-5">{selected.desc}</p>

              {selected.exercise && (
                <div className="glass-light rounded-xl p-4 mb-4">
                  <h3 className="text-accent-blue text-xs font-semibold uppercase tracking-wider mb-2">Ejercicio de hoy</h3>
                  <p className="text-text-secondary text-sm leading-relaxed">{selected.exercise}</p>
                </div>
              )}

              {selected.neuro && (
                <div className="rounded-xl border border-accent-blue/15 bg-accent-blue/5 p-4 mb-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Brain className="w-4 h-4 text-accent-blue" />
                    <h3 className="text-accent-blue text-xs font-semibold uppercase tracking-wider">Qué pasa en tu cerebro</h3>
                  </div>
                  <p className="text-text-secondary text-sm leading-relaxed">{selected.neuro}</p>
                </div>
              )}

              {status === 'locked' ? (
                <div className="py-3 px-4 bg-white/5 rounded-xl text-center">
                  <p className="text-text-muted text-sm">Completa el día {selected.day - 1} para desbloquear</p>
                </div>
              ) : status === 'completed' ? (
                <div className="py-3 px-4 bg-green-500/10 rounded-xl text-center">
                  <p className="text-green-400 text-sm font-medium">Completado</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href={exerciseLinks[selected.exercise_link] || '/meditacion'}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-accent-blue text-white rounded-xl font-medium text-sm active:scale-95 transition-transform"
                  >
                    <Play className="w-4 h-4" /> Ir al ejercicio
                  </Link>
                  <button
                    onClick={() => completeDay(selected.day)}
                    className="flex items-center justify-center gap-2 w-full py-3 bg-green-500/15 text-green-400 rounded-xl font-medium text-sm active:scale-95 transition-transform"
                  >
                    <Check className="w-4 h-4" /> Marcar como completado
                  </button>
                </div>
              )}
            </div>
          </Container>
        </section>
      </div>
    )
  }

  // Not started
  if (!data.startDate) {
    return (
      <div className="relative overflow-hidden">
        <div className="orb w-80 h-80 bg-accent-blue top-20 -left-32" />
        <section className="pt-10 pb-8 md:pt-20">
          <Container>
            <div className="max-w-md mx-auto text-center">
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-accent-blue/20 to-violet-500/20 flex items-center justify-center mx-auto mb-6">
                <Flame className="w-9 h-9 text-accent-blue" />
              </div>
              <h1 className="font-heading text-3xl font-bold text-white mb-3">21 días para apagar el ruido</h1>
              <p className="text-text-secondary text-base mb-2">Un ejercicio diario de metacognición, atención y presencia.</p>
              <p className="text-text-muted text-sm mb-8">Cada día desbloquea el siguiente. Sin atajos.</p>
              <button
                onClick={startProgram}
                className="w-full py-4 bg-accent-blue text-white rounded-2xl font-semibold text-lg active:scale-95 transition-transform mb-4"
                style={{ boxShadow: '0 0 25px rgba(124,58,237,0.3)' }}
              >
                Empezar el programa
              </button>

              <EmailCapture
                source="programa-21-dias"
                title="Recibe recordatorios diarios"
                subtitle="Te enviamos un recordatorio cada día para que no pierdas el ritmo."
                buttonText="Activar"
                compact
              />
            </div>
          </Container>
        </section>
      </div>
    )
  }

  // Main view
  return (
    <div className="relative overflow-hidden">
      <div className="orb w-64 h-64 bg-accent-blue top-10 -right-20" />

      <section className="pt-8 md:pt-16 pb-4">
        <Container>
          <h1 className="font-heading text-3xl font-bold text-white mb-1 animate-fade-in">Curso 21 Días</h1>
          <p className="text-text-secondary text-sm animate-fade-in-up">Día {data.completedDays.length + 1} de 21</p>
        </Container>
      </section>

      {/* Progress */}
      <section className="pb-6">
        <Container>
          <FadeInSection>
            <div className="glass rounded-2xl p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-text-secondary text-xs font-medium">Progreso</span>
                <span className="text-white text-xs font-bold">{data.completedDays.length}/21</span>
              </div>
              <div className="w-full h-2 bg-white/5 rounded-full">
                <div className="h-2 bg-accent-blue rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
              </div>
              {data.completedDays.length === 21 && (
                <div className="mt-3 flex items-center gap-2 justify-center">
                  <Crown className="w-4 h-4 text-violet-400" />
                  <span className="text-violet-400 text-sm font-semibold">Programa completado</span>
                </div>
              )}
            </div>
          </FadeInSection>
        </Container>
      </section>

      {/* Days list */}
      <section className="pb-12">
        <Container>
          <FadeInSection>
            <div className="space-y-2.5">
              {days.map((d, i) => {
                const status = getDayStatus(d.day)
                const prevDay = days[i - 1]
                const showWeekHeader = !prevDay || prevDay.week !== d.week
                const weekLabels: Record<number, string> = {
                  1: 'Semana 1 — Despertar',
                  2: 'Semana 2 — Entrenamiento',
                  3: 'Semana 3 — Maestría',
                }
                return (
                  <div key={d.day}>
                    {showWeekHeader && (
                      <p className="text-text-muted text-[10px] uppercase tracking-widest font-semibold px-1 pt-2 pb-1">
                        {weekLabels[d.week]}
                      </p>
                    )}
                    <button
                      onClick={() => status !== 'locked' && setSelectedDay(d.day)}
                      disabled={status === 'locked'}
                      className={`w-full glass rounded-2xl p-4 flex items-center gap-3 text-left transition-all active:scale-[0.98] ${
                        status === 'locked' ? 'opacity-40' : ''
                      }`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        status === 'completed' ? 'bg-green-500/20' :
                        status === 'current' ? 'bg-accent-blue/15' :
                        'bg-white/5'
                      }`}>
                        {status === 'completed' ? (
                          <Check className="w-5 h-5 text-green-400" />
                        ) : status === 'locked' ? (
                          <Lock className="w-4 h-4 text-text-muted" />
                        ) : (
                          <d.icon className="w-5 h-5 text-accent-blue" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium truncate ${status === 'completed' ? 'text-green-400' : 'text-white'}`}>
                          Día {d.day}: {d.title}
                        </p>
                        <p className="text-text-muted text-xs">{d.category} · {d.duration}</p>
                      </div>
                      {status !== 'locked' && (
                        <ChevronRight className="w-4 h-4 text-text-muted shrink-0" />
                      )}
                    </button>
                  </div>
                )
              })}
            </div>
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
