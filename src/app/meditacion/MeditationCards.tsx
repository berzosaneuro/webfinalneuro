'use client'

import { useState, useRef, useCallback, useEffect } from 'react'
import PremiumLock from '@/components/PremiumLock'
import PremiumBadge from '@/components/PremiumBadge'
import { Brain, Timer, Moon, Crosshair, Play, Pause, Heart, Shield, Wind, Eye, Sun, Zap, Target, Clock, Tag, Leaf, Sparkles, Hand, Lightbulb } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

type Meditation = {
  title: string
  minutes: number
  icon: LucideIcon
  description: string
  free: boolean
  theme: string
  script?: string
}

const meditations: Meditation[] = [
  // ── GRATIS (10) ──────────────────────────────────────────────────

  // Ansiedad
  { title: 'Calma rápida', minutes: 3, icon: Wind, description: 'Respiración guiada para cortar ansiedad en 3 minutos. Activa el nervio vago al instante y frena el sistema simpático.', free: true, theme: 'Ansiedad', script: 'Busca una posición cómoda y cierra los ojos con suavidad.\nVamos a activar el nervio vago para frenar la respuesta de estrés ahora mismo.\nPon una mano sobre el pecho y siente el calor de tu propia mano.\nInhala lentamente por la nariz... uno... dos... tres... cuatro.\nAhora exhala despacio por la boca... uno... dos... tres... cuatro... cinco... seis.\nLa exhalación larga activa el sistema nervioso parasimpático. Tu freno natural.\nDe nuevo. Inhala... uno... dos... tres... cuatro.\nExhala... uno... dos... tres... cuatro... cinco... seis.\nNota cómo el cuerpo empieza a ceder. Los hombros bajan. La mandíbula se afloja.\nOtra respiración. Inhala profundo...\nY exhala, vaciando completamente los pulmones.\nEl cortisol baja. La frecuencia cardíaca se normaliza.\nUna última vez. Inhala...\nY exhala todo, sin prisa.\nQuédate aquí unos segundos. Sintiendo el cuerpo más pesado, más en calma.\nLa ansiedad es química. Y la respiración es el antídoto más rápido que existe.\nCuando estés listo, abre los ojos.' },
  { title: 'Reinicio mental', minutes: 5, icon: Brain, description: 'Limpia el caché mental y empieza de cero. Ideal cuando sientes saturación o bloqueo cognitivo.', free: true, theme: 'Ansiedad', script: 'Cierra los ojos. Pon la espalda recta y las manos sobre los muslos.\nImagina que tu mente es un ordenador con demasiadas pestañas abiertas.\nCorreos pendientes. Conversaciones sin terminar. Preocupaciones del futuro. Recuerdos del pasado.\nTodo eso consume recursos. Todo eso genera ruido.\nAhora vamos a cerrar esas pestañas, una a una.\nToma una respiración profunda. Inhala... y exhala lentamente.\nPiensa en la primera pestaña abierta. Una preocupación, una tarea pendiente.\nObsérvala sin juzgarla. Y visualiza cómo la cierras. Click. Cerrada.\nOtra respiración. Inhala... exhala.\nQué otra pestaña hay. Qué más te ocupa la mente ahora mismo.\nObsérvala. Y ciérrala. Click.\nSigue respirando con calma. Inhala... exhala.\nOtra pestaña más. Obsérvala. Ciérrala.\nNota cómo el espacio mental se despeja.\nComo cuando el ordenador va más fluido después de cerrar programas.\nAhora el escritorio está más limpio.\nHaz una última respiración profunda y consciente.\nCuando abras los ojos, la mente estará más disponible. Lista para empezar de cero.' },

  // Presencia
  { title: 'Micro-presencia', minutes: 3, icon: Crosshair, description: '3 minutos para salir del piloto automático y volver al aquí y ahora. Interrumpe la DMN al instante.', free: true, theme: 'Presencia', script: 'Detente. Exactamente donde estás.\nVamos a interrumpir el piloto automático ahora mismo.\nPrimero, nombra mentalmente cinco cosas que puedes ver ahora mismo.\nNo las evalúes, solo nómbralas. Una... dos... tres... cuatro... cinco.\nAhora cuatro cosas que puedes escuchar en este momento.\nUno... dos... tres... cuatro.\nTres cosas que puedes sentir físicamente.\nEl peso del cuerpo. La temperatura del aire. La textura de lo que tocas.\nDos cosas que puedes oler. O si no hay olor, nota la ausencia.\nY una sola cosa que sientes ahora mismo. Una emoción o sensación interna.\nRespira una vez, profundo.\nAcabas de interrumpir la red neuronal por defecto. El modo rumia.\nEn este momento estás aquí. No en el pasado ni en el futuro.\nAquí es donde sucede la vida.' },

  // Sueño
  { title: 'Pre-sueño', minutes: 5, icon: Moon, description: 'Relajación rápida que prepara el cerebro para el descanso. Reduce el tiempo de latencia del sueño.', free: true, theme: 'Sueño', script: 'Túmbate y cierra los ojos. El día ha terminado. Ya no hay nada que hacer.\nVamos a preparar el sistema nervioso para el descanso.\nRespira profundo. Inhala lentamente... y exhala soltando todo.\nSiente el peso de tu cuerpo sobre la cama. Deja que la gravedad haga el trabajo.\nLleva la atención a los pies. Nota cualquier tensión. Y con la próxima exhalación, déjala ir.\nLas pantorrillas. Nota si hay rigidez. Exhala y relaja.\nLas rodillas, los muslos. Pesados y sueltos.\nLas caderas y la parte baja de la espalda. Esa zona que carga todo el día. Exhala y libera.\nEl abdomen. Que se mueva libremente con la respiración.\nEl pecho. Cada exhalación afloja el pecho un poco más.\nLos hombros. Con la siguiente exhalación, bájalos y suéltalos.\nLos brazos, los codos, las manos. Cada dedo se afloja.\nEl cuello y la mandíbula. Esa tensión silenciosa que acumulamos sin saber.\nLa frente y los ojos. Que descansen completamente.\nTodo el cuerpo, pesado y relajado. Como si te hundieras suavemente.\nLas ondas cerebrales se hacen más lentas. El sueño se acerca.\nSolo soltar.' },

  // Emociones
  { title: 'Autocompasión', minutes: 5, icon: Heart, description: 'Conecta con la bondad hacia ti mismo. Activa la ínsula y reduce el autocrítico interno.', free: true, theme: 'Emociones', script: 'Siéntate cómodamente. Cierra los ojos.\nPon una mano sobre tu corazón. Siente el calor de tu propia mano sobre el pecho.\nNota los latidos. Tu corazón lleva toda tu vida latiendo por ti.\nAhora piensa en algo que te haya costado últimamente.\nNo para analizarlo. Solo para reconocerlo.\nY di mentalmente: esto es difícil. Es normal que esto sea difícil.\nEl sufrimiento es parte de la experiencia humana. No solo para ti. Para todos.\nAhora, como si le hablaras a un buen amigo que estuviera pasando por lo mismo...\nQué le dirías. Con qué palabras le consolarías.\nDite esas mismas palabras a ti mismo. Con la misma amabilidad.\nInhala... sintiendo el calor de tu mano en el pecho.\nExhala... soltando el juicio hacia ti mismo.\nNo tienes que ser perfecto. Solo tienes que seguir siendo humano.\nCon cada respiración, permítete recibir esa amabilidad.\nCuando estés listo, abre los ojos.' },

  // Energía
  { title: 'Despertar consciente', minutes: 5, icon: Sun, description: 'Empieza el día con intención y claridad mental. Define quién quieres ser hoy antes de que el mundo te lo diga.', free: true, theme: 'Energía', script: 'Buenos días. Siéntate con la espalda recta. Cierra los ojos un momento.\nEste es el momento más importante del día.\nAntes de que el mundo te diga quién tienes que ser hoy.\nRespira profundo. Inhala... y exhala.\nPregúntate: cómo quiero estar hoy. No qué quiero hacer. Cómo quiero estar.\nQuieres estar más presente. Más tranquilo. Más conectado.\nElige una cualidad. Y ponle una palabra.\nAhora visualiza tu día con esa cualidad.\nCómo sería tu primera conversación con esa actitud.\nCómo serías en el momento más difícil del día.\nLa corteza prefrontal puede programarse a primera hora para responder diferente durante el día.\nEsto se llama intención priming. Preparar el circuito antes de que lo necesites.\nRespira hondo. Sintiendo esa cualidad ya en tu cuerpo.\nCómo se siente en el pecho. En los hombros.\nHoy tienes la oportunidad de ser quien quieres ser.\nUn momento a la vez. Una respiración a la vez.\nAbre los ojos. El día comienza.' },

  // Respiración
  { title: 'Respiración 4-7-8', minutes: 3, icon: Wind, description: 'Técnica del Dr. Weil: inhala 4s, retén 7s, exhala 8s. Activa el sistema parasimpático en segundos.', free: true, theme: 'Respiración', script: 'Siéntate con la espalda recta. Cierra los ojos.\nVamos a practicar la técnica del Doctor Andrew Weil. Cuatro, siete, ocho.\nPrimero exhala completamente por la boca, vaciando los pulmones.\nAhora cierra la boca y comienza.\nInhala por la nariz. Uno... dos... tres... cuatro.\nRetén la respiración. Uno... dos... tres... cuatro... cinco... seis... siete.\nExhala completamente por la boca. Uno... dos... tres... cuatro... cinco... seis... siete... ocho.\nEso es un ciclo. Vamos con el segundo.\nInhala... uno... dos... tres... cuatro.\nRetén... uno... dos... tres... cuatro... cinco... seis... siete.\nExhala lentamente... uno... dos... tres... cuatro... cinco... seis... siete... ocho.\nEl sistema nervioso parasimpático se activa. El ritmo cardíaco baja.\nTercer ciclo.\nInhala... uno... dos... tres... cuatro.\nRetén... uno... dos... tres... cuatro... cinco... seis... siete.\nExhala... uno... dos... tres... cuatro... cinco... seis... siete... ocho.\nSiente la profunda calma en el cuerpo.\nRepite este ciclo siempre que necesites calmar la mente.' },
  { title: 'Respiración cuadrada', minutes: 5, icon: Shield, description: 'Técnica de los Navy SEALs: 4-4-4-4. Regula el sistema nervioso bajo presión extrema.', free: true, theme: 'Respiración', script: 'Siéntate erguido. Imagina un cuadrado perfecto. Cuatro lados iguales.\nEsta es la técnica de los Navy SEALs para regular el sistema nervioso bajo presión extrema.\nCuatro segundos en cada fase. Cuatro fases.\nExhala todo el aire. Vacía los pulmones completamente.\nPrimer lado: inhala por la nariz. Uno... dos... tres... cuatro.\nSegundo lado: retén con los pulmones llenos. Uno... dos... tres... cuatro.\nTercer lado: exhala lentamente. Uno... dos... tres... cuatro.\nCuarto lado: retén con los pulmones vacíos. Uno... dos... tres... cuatro.\nEso es un cuadrado completo. Vamos con otro.\nInhala... uno... dos... tres... cuatro.\nRetén lleno... uno... dos... tres... cuatro.\nExhala... uno... dos... tres... cuatro.\nRetén vacío... uno... dos... tres... cuatro.\nEl sistema nervioso se regula. La mente se enfoca.\nOtro ciclo más.\nInhala... uno... dos... tres... cuatro.\nRetén... uno... dos... tres... cuatro.\nExhala... uno... dos... tres... cuatro.\nRetén... uno... dos... tres... cuatro.\nPuedes usar esta técnica en cualquier momento de tensión.' },

  // Gratitud
  { title: 'Gratitud express', minutes: 3, icon: Leaf, description: '3 minutos para activar los circuitos de recompensa con gratitud genuina. Cambia el estado cerebral.', free: true, theme: 'Gratitud', script: 'Cierra los ojos. Pon una mano sobre el corazón.\nVamos a activar los circuitos de recompensa con gratitud genuina.\nNo gratitud de lista. Gratitud sentida.\nPiensa en una persona en tu vida por la que sientas agradecimiento real.\nNo la idea de esa persona. Esa persona de verdad.\nTráela a la mente. Recuerda un momento específico con ella.\nSiente eso en el pecho. Nota la calidez.\nEso es dopamina. Eso es serotonina. Cambiando tu estado cerebral ahora mismo.\nAhora piensa en algo simple que tienes hoy.\nSalud, un lugar donde dormir, un café por la mañana.\nAlgo que dabas por sentado pero que no tiene por qué estar ahí.\nSiente el valor real de eso.\nY por último, algo de hoy. Un pequeño momento positivo de hoy.\nAunque haya sido breve. Una pequeña cosa.\nSiente los tres. La persona, lo que tienes, el momento de hoy.\nRespira.\nEl cerebro tiene un sesgo hacia lo negativo por defecto. Esto lo reequilibra.\nCuando abras los ojos, llevas ese estado contigo.' },

  // Cuerpo
  { title: 'Chequeo corporal rápido', minutes: 3, icon: Hand, description: 'Escaneo corporal ultrarrápido para reconectar con sensaciones físicas y salir de la trampa mental.', free: true, theme: 'Cuerpo', script: 'Siéntate o túmbate. Cierra los ojos.\nTu cuerpo habla constantemente. La mayoría del tiempo no escuchamos.\nVamos a hacer un escaneo rápido. No para cambiar nada. Solo para notar.\nLleva la atención a la cabeza. Hay tensión en la frente. En los ojos. Solo nota.\nBaja a la mandíbula y el cuello. Es uno de los sitios donde más cargamos sin saber.\nLos hombros. Están subidos. Hay peso acumulado ahí.\nEl pecho. Sientes apertura o contracción.\nEl abdomen. Está tenso o suelto.\nLa parte baja de la espalda. Hay incomodidad.\nLos muslos, las rodillas, las pantorrillas.\nLos pies. Los sientes.\nAhora haz un barrido de todo. Desde la cabeza hasta los pies.\nDónde está la mayor tensión ahora mismo.\nSin juzgar. Solo sabiéndolo.\nEl cuerpo guarda todo lo que la mente no procesa.\nEscucharlo ya es parte de la solución.\nAbre los ojos cuando quieras.' },

  // ── PREMIUM (15) ─────────────────────────────────────────────────

  // Ansiedad
  { title: 'Reducir ansiedad', minutes: 8, icon: Timer, description: 'Reduce la activación del sistema nervioso simpático con respiración + anclaje sensorial guiado.', free: false, theme: 'Ansiedad' },
  { title: 'Ansiedad profunda', minutes: 15, icon: Shield, description: 'Sesión completa para desactivar el estrés crónico. Relajación muscular progresiva de Jacobson adaptada.', free: false, theme: 'Ansiedad' },

  // Presencia
  { title: 'Atención plena', minutes: 10, icon: Eye, description: 'Entrena el foco atencional sostenido. Fortalece la corteza prefrontal dorsolateral con práctica deliberada.', free: false, theme: 'Presencia' },
  { title: 'El observador', minutes: 12, icon: Eye, description: 'Observa tus pensamientos sin identificarte con ellos. La separación consciente que lo cambia todo.', free: false, theme: 'Presencia' },
  { title: 'Presencia profunda', minutes: 15, icon: Crosshair, description: 'Desactiva la Red Neuronal por Defecto. Estado de observación pura sin contenido mental.', free: false, theme: 'Presencia' },

  // Sueño
  { title: 'Yoga Nidra express', minutes: 10, icon: Moon, description: 'Relajación consciente profunda. El estado entre vigilia y sueño donde ocurre la restauración neural.', free: false, theme: 'Sueño' },
  { title: 'Sueño profundo', minutes: 20, icon: Moon, description: 'Sesión completa para insomnio. Induce ondas delta cerebrales mediante relajación progresiva guiada.', free: false, theme: 'Sueño' },

  // Emociones
  { title: 'Regulación emocional', minutes: 12, icon: Heart, description: 'Procesa emociones difíciles sin reprimirlas. Protocolo Detecta-Nombra-Regula con base neurocientífica.', free: false, theme: 'Emociones' },
  { title: 'Amor incondicional', minutes: 20, icon: Heart, description: 'Metta bhavana: expande la compasión desde ti hacia todos los seres. Activa la ínsula anterior.', free: false, theme: 'Emociones' },

  // Energía
  { title: 'Activación matutina', minutes: 8, icon: Zap, description: 'Respiración energizante + visualización del día. Programa tu corteza prefrontal para el éxito.', free: false, theme: 'Energía' },
  { title: 'Energía vital', minutes: 20, icon: Zap, description: 'Breathwork completo + visualización energizante. Recarga cuerpo y mente desde la neurociencia aplicada.', free: false, theme: 'Energía' },

  // Respiración
  { title: 'Coherencia cardíaca', minutes: 12, icon: Heart, description: 'Respiración a 6 ciclos/min. Sincroniza corazón, cerebro y sistema nervioso autónomo.', free: false, theme: 'Respiración' },

  // Gratitud
  { title: 'Abundancia presente', minutes: 10, icon: Sparkles, description: 'Reprograma el sesgo de negatividad. Neuroplasticidad positiva aplicada a la gratitud profunda.', free: false, theme: 'Gratitud' },

  // Cuerpo
  { title: 'Escaneo corporal completo', minutes: 15, icon: Hand, description: 'Escaneo profundo de cabeza a pies. Activa la corteza somatosensorial completa. Integración mente-cuerpo.', free: false, theme: 'Cuerpo' },

  // Creatividad
  { title: 'Visualización creativa', minutes: 10, icon: Lightbulb, description: 'Imagina tu proyecto terminado con todos los sentidos. La corteza visual no distingue realidad de imaginación vívida.', free: false, theme: 'Creatividad' },
]

const themes = ['Todas', 'Ansiedad', 'Presencia', 'Sueño', 'Emociones', 'Energía', 'Respiración', 'Gratitud', 'Cuerpo', 'Creatividad']
const durations = ['Todas', '3-5 min', '8-12 min', '15-20 min']

function getDurationRange(filter: string): [number, number] {
  switch (filter) {
    case '3-5 min': return [3, 5]
    case '8-12 min': return [8, 12]
    case '15-20 min': return [15, 20]
    default: return [0, 999]
  }
}

function MeditationCard({ m, playing, isPaused, onPlay, onPause, onResume }: {
  m: Meditation
  playing: string | null
  isPaused: boolean
  onPlay: (m: Meditation) => void
  onPause: () => void
  onResume: () => void
}) {
  const isActive = playing === m.title
  const isCurrentlyPlaying = isActive && !isPaused
  return (
    <div className="glass rounded-2xl p-4 flex flex-col card-hover">
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-xl bg-accent-blue/15 flex items-center justify-center">
          <m.icon className="w-5 h-5 text-accent-blue" />
        </div>
        <div className="flex items-center gap-2">
          {!m.free && <PremiumBadge />}
          <span className="text-text-muted text-xs">{m.minutes} min</span>
        </div>
      </div>
      <h3 className="font-heading font-semibold text-white text-sm mb-0.5">{m.title}</h3>
      <p className="text-text-secondary text-xs mb-3 flex-1 line-clamp-2">{m.description}</p>
      {isActive && (
        <div className="flex items-center gap-1.5 mb-2">
          <span className={`w-1.5 h-1.5 rounded-full ${isCurrentlyPlaying ? 'bg-accent-blue animate-pulse' : 'bg-white/30'}`} />
          <span className="text-accent-blue text-[10px]">{isCurrentlyPlaying ? 'Reproduciendo...' : 'En pausa'}</span>
        </div>
      )}
      <button
        onClick={() => {
          if (isCurrentlyPlaying) onPause()
          else if (isActive && isPaused) onResume()
          else onPlay(m)
        }}
        className={`flex items-center justify-center gap-2 w-full py-2 rounded-xl text-xs font-medium transition-all active:scale-95 ${
          isActive ? 'bg-white/10 text-white' : 'bg-white/5 text-white'
        }`}
      >
        {isCurrentlyPlaying
          ? <><Pause className="w-3.5 h-3.5" /> Pausar</>
          : isActive && isPaused
            ? <><Play className="w-3.5 h-3.5" /> Reanudar</>
            : <><Play className="w-3.5 h-3.5" /> Reproducir</>}
      </button>
    </div>
  )
}

export default function MeditationCards() {
  const [playing, setPlaying] = useState<string | null>(null)
  const [isPaused, setIsPaused] = useState(false)
  const [themeFilter, setThemeFilter] = useState('Todas')
  const [durationFilter, setDurationFilter] = useState('Todas')
  const generationRef = useRef(0)

  useEffect(() => {
    return () => { if (typeof window !== 'undefined') window.speechSynthesis?.cancel() }
  }, [])

  const handlePlay = useCallback((m: Meditation) => {
    if (typeof window === 'undefined' || !window.speechSynthesis || !m.script) return
    window.speechSynthesis.cancel()
    const generation = ++generationRef.current
    const lines = m.script.split('\n').map(s => s.trim()).filter(Boolean)
    let i = 0
    const next = () => {
      if (generationRef.current !== generation) return
      if (i >= lines.length) { setPlaying(null); setIsPaused(false); return }
      const utt = new SpeechSynthesisUtterance(lines[i++])
      utt.lang = 'es-ES'; utt.rate = 0.62; utt.pitch = 0.88; utt.volume = 1
      // Select a calm Spanish voice if available
      const voices = window.speechSynthesis.getVoices()
      const esVoice = voices.find(v => v.lang.startsWith('es') && (v.name.includes('Paulina') || v.name.includes('Monica') || v.name.includes('Jorge') || v.name.includes('female') || v.name.includes('Female')))
        || voices.find(v => v.lang.startsWith('es'))
      if (esVoice) utt.voice = esVoice
      utt.onend = next
      window.speechSynthesis.speak(utt)
    }
    setPlaying(m.title); setIsPaused(false); next()
  }, [])

  const handlePause = useCallback(() => {
    window.speechSynthesis?.pause(); setIsPaused(true)
  }, [])

  const handleResume = useCallback(() => {
    window.speechSynthesis?.resume(); setIsPaused(false)
  }, [])

  const [minDur, maxDur] = getDurationRange(durationFilter)

  const filtered = meditations.filter((m) => {
    const themeMatch = themeFilter === 'Todas' || m.theme === themeFilter
    const durMatch = m.minutes >= minDur && m.minutes <= maxDur
    return themeMatch && durMatch
  })

  const freeCount = filtered.filter(m => m.free).length
  const premiumCount = filtered.filter(m => !m.free).length

  return (
    <div>
      {/* Theme filters */}
      <div className="mb-3">
        <div className="flex items-center gap-1.5 mb-2">
          <Tag className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-muted text-xs font-medium">Tema</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {themes.map((t) => (
            <button
              key={t}
              onClick={() => setThemeFilter(t)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                themeFilter === t
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-text-secondary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Duration filters */}
      <div className="mb-5">
        <div className="flex items-center gap-1.5 mb-2">
          <Clock className="w-3.5 h-3.5 text-text-muted" />
          <span className="text-text-muted text-xs font-medium">Duración</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
          {durations.map((d) => (
            <button
              key={d}
              onClick={() => setDurationFilter(d)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all active:scale-95 ${
                durationFilter === d
                  ? 'bg-white text-black'
                  : 'bg-white/5 text-text-secondary'
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="flex items-center gap-3 mb-4">
        <span className="text-text-muted text-xs">{filtered.length} meditaciones</span>
        <span className="text-text-muted text-xs">·</span>
        <span className="text-green-400 text-xs">{freeCount} gratis</span>
        {premiumCount > 0 && (
          <>
            <span className="text-text-muted text-xs">·</span>
            <span className="text-accent-blue text-xs">{premiumCount} premium</span>
          </>
        )}
      </div>

      {/* Grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 gap-3">
          {filtered.map((m) =>
            m.free ? (
              <MeditationCard key={m.title} m={m} playing={playing} isPaused={isPaused} onPlay={handlePlay} onPause={handlePause} onResume={handleResume} />
            ) : (
              <PremiumLock key={m.title} label={m.title}>
                <MeditationCard m={m} playing={playing} isPaused={isPaused} onPlay={handlePlay} onPause={handlePause} onResume={handleResume} />
              </PremiumLock>
            )
          )}
        </div>
      ) : (
        <div className="glass rounded-2xl p-8 text-center">
          <p className="text-text-muted text-sm">No hay meditaciones con estos filtros.</p>
          <button
            onClick={() => { setThemeFilter('Todas'); setDurationFilter('Todas') }}
            className="mt-3 text-accent-blue text-sm font-medium active:opacity-70"
          >
            Ver todas
          </button>
        </div>
      )}
    </div>
  )
}
