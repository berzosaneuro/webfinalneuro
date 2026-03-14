import { NextResponse } from 'next/server'

const BASE_PROMPT = `Eres Elías Berzosa, creador del Método N.E.U.R.O. y guía de Berzosa Neuro. Hablas SIEMPRE en primera persona: "yo recomiendo", "suelo sugerir", "en mi experiencia". NUNCA suenes como un chatbot genérico. Eres un mentor humano, calmado, reflexivo y de apoyo.

Tu tono:
- Calmo, reflexivo, de apoyo
- Mentor que guía, no que dicta
- Frases naturales: "Yo suelo recomendar...", "Cuando la mente se siente cargada, normalmente sugiero empezar con una práctica breve."
- Evita jerga de IA ("como tu asistente", "estoy aquí para ayudarte"). Habla como quien conoce el método porque lo creó.

Reglas:
- Respuestas cortas (máximo 3-4 párrafos)
- Siempre ofrece algo práctico (ejercicio, técnica, reflexión)
- Si el usuario habla de ansiedad, ofrece técnicas de respiración y regulación
- Si habla de meditación, guía una breve práctica
- Si habla de pensamientos repetitivos, enseña la técnica del observador
- Nunca des consejos médicos ni reemplaces terapia profesional
- Usa datos neurocientíficos reales cuando sea relevante
- Si el usuario parece en crisis, recomienda buscar ayuda profesional

Herramientas de la app que puedes recomendar:
- /sos - Respiración de emergencia 4-7-8
- /meditacion - Meditaciones guiadas
- /test - Test de ruido mental
- /programa - Programa de 21 días
- /diario - Diario de presencia
- /neuroscore - Puntuación diaria de hábitos
- /ejercicios - Ejercicios de metacognición
- En la página de inicio: "Entrenamiento N.E.U.R.O. del día" con ejercicio diario de metacognición (+10 NeuroScore al completar)

PROGRESO DEL USUARIO: {{PROGRESS_CONTEXT}}

Puedes referenciar en tus respuestas (de forma natural, no forzada): la racha de entrenamiento mental, el estado de ánimo del check-in diario si lo ha hecho, si ha meditado hoy, y su progreso en retos o programa. Ejemplo: "Veo que llevas 5 días de entrenamiento mental. La consistencia es lo que cambia el cerebro."`

// Smart local response system when no API key is available (first-person, Elías tone)
const SMART_RESPONSES: Record<string, string[]> = {
  ansiedad: [
    'Tu sistema nervioso simpático está activado. Yo suelo desactivarlo con un ejercicio sencillo.\n\n**Coherencia cardíaca (te lo recomiendo ahora):**\n1. Inhala 5 segundos por la nariz\n2. Retén 5 segundos\n3. Exhala 5 segundos por la boca\n\nRepite 6 veces. Sincroniza el ritmo cardíaco y reduce cortisol en menos de 2 minutos.\n\nSi quieres una sesión guiada completa, abre **/sos**.',
    'Cuando la amígdala activa la respuesta de lucha-huida ante algo que no está pasando ahora, suelo sugerir el grounding.\n\n**Técnica 5-4-3-2-1:**\n- 5 cosas que VES\n- 4 que TOCAS\n- 3 que OYES\n- 2 que HUELES\n- 1 que SABOREAS\n\nFuerza al cerebro a volver al presente y desactiva la rumiación. Pruébalo ahora.',
    'La ansiedad no es tu enemiga. Es información. Te sugiero que la observes sin juzgarla: "Hay ansiedad" en vez de "Estoy ansioso".\n\n1. Tres respiraciones profundas (activa el nervio vago)\n2. Nota dónde la sientes en el cuerpo\n3. Déjala estar sin luchar\n\nEste cambio de perspectiva reduce la activación amigdalar hasta un 40%. Si necesitas algo más inmediato: **/sos**.',
  ],
  meditar: [
    'Yo suelo recomendar empezar con algo breve cuando la mente se siente cargada.\n\n**3 minutos:**\n1. Cierra los ojos. Siente tu cuerpo en la silla.\n2. Observa tu respiración sin cambiarla.\n3. Cada vez que venga un pensamiento, di "pensamiento" y vuelve.\n4. Busca el silencio entre un pensamiento y otro.\n\nEse espacio es consciencia pura. Para sesiones guiadas: **/meditacion**.',
    'Vamos a meditar ahora. No necesitas nada especial.\n\n**Meditación del observador (5 min):**\n1. Siéntate cómodo. Ojos cerrados o entreabiertos.\n2. Imagina que eres un cielo y tus pensamientos son nubes.\n3. Las nubes pasan. Tú observas. Si te atrapa un pensamiento, notarlo ya ES meditar.\n4. Vuelve al cielo. Siempre vuelve.\n\nLa neuroplasticidad necesita repetición. Sesiones guiadas en **/meditacion**.',
  ],
  calmar: [
    'Cuando la mente está agitada, yo suelo sugerir algo corto y directo.\n\n**Respiración 4-7-8 (activa el parasimpático):**\nInhala 4 segundos, retén 7, exhala 8. Tres veces. Baja el cortisol de inmediato.\n\nSi lo necesitas urgente, abre **/sos** para la sesión guiada de emergencia.',
    'Te recomiendo la técnica de grounding ahora: 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas. Fuerza al cerebro al presente.\n\nPara una sesión completa de calma: **/sos**.',
  ],
  despertar: [
    'El despertar no es un evento místico. Es neurociencia: tu corteza prefrontal tomando el control sobre los patrones automáticos del cerebro.\n\n**Micro-despertar (hazlo AHORA):**\n\n1. Mira tus manos como si fuera la primera vez\n2. Siente la temperatura del aire en tu piel\n3. Escucha el sonido más lejano que detectes\n4. Pregúntate: "¿Quién está observando esto?"\n\nEse que observa no es tu mente ruidosa. Es tu consciencia. Acabas de despertar un instante.',
    'Despertar es salir del piloto automático. Tu cerebro ejecuta el 95% de tus acciones sin que lo decidas. Despertar es ese 5% que cambia todo.\n\n**Ejercicio de Claridad Vital:**\n\nResponde sin pensar mucho:\n- Si te quedara 1 año de vida, ¿qué dejarías de hacer HOY?\n- ¿Qué harías más?\n- ¿A quién le dirías algo que no has dicho?\n\nEsta confrontación activa la corteza prefrontal medial y te saca del modo supervivencia.\n\nPrueba el ejercicio completo en **/despertar**.',
  ],
  observar: [
    '**Técnica del Observador Consciente** (la base de todo):\n\n**Nivel 1 - Observar pensamientos:**\nSiéntate 2 min. Solo observa qué pensamientos aparecen. Di "pensamiento" y suelta.\n\n**Nivel 2 - Observar emociones:**\nCuando sientas algo fuerte, di "Hay tristeza" en vez de "Estoy triste". Esto activa la corteza prefrontal.\n\n**Nivel 3 - Observar al observador:**\nPregunta: "¿Quién observa?" No busques respuesta. La pregunta ES la práctica.\n\nPractica en **/ejercicios** con el Contador de Pensamientos.',
  ],
  dormir: [
    'El insomnio es tu mente en modo default: rumiación sobre el pasado y preocupación por el futuro. Vamos a cortarlo.\n\n**Protocolo pre-sueño:**\n1. **Relajación muscular progresiva:** Tensa cada grupo muscular 5 seg, suelta. De pies a cabeza.\n2. **Respiración 4-7-8:** Inhala 4s, retén 7s, exhala 8s. Esto activa el parasimpático.\n3. **Dump mental:** Escribe TODO lo que te preocupa en una nota. Tu cerebro puede soltar lo que ya está registrado.\n\nCrea un ambiente tranquilo para favorecer el sueño.',
  ],
  estres: [
    'El estrés crónico literalmente encoge tu hipocampo (memoria) y agranda tu amígdala (miedo). Pero es reversible con práctica.\n\n**Reset de estrés en 2 minutos:**\n1. Pon una mano en el pecho y otra en el abdomen\n2. Respira solo con el abdomen (la mano del pecho no se mueve)\n3. Exhala el doble de lo que inhalas (4 seg dentro, 8 seg fuera)\n4. Haz 10 ciclos\n\nEsto estimula el nervio vago y reduce cortisol en sangre. Hazlo 3 veces al día.\n\nPara emergencias: **/sos**',
  ],
  motivacion: [
    'La motivación no es algo que "tienes" o "no tienes". Es un estado neuroquímico que puedes activar.\n\n**Hack neurocientífico:**\nTu cerebro libera dopamina no al lograr algo, sino al ANTICIPAR el logro. Usa esto:\n\n1. Divide tu objetivo en micro-tareas ridículamente pequeñas\n2. Completa una (5 min máximo)\n3. Celebra conscientemente: "Hecho"\n4. Tu cerebro liberará dopamina → querrás hacer más\n\nEmpieza con el **Programa de 21 días** en **/programa**. Un ejercicio al día. Sin excusas.',
  ],
}

function getSmartResponse(input: string, progressSummary: string): string {
  const lower = input.toLowerCase()

  const keywords: [string[], string][] = [
    [['ansiedad', 'ansioso', 'nervio', 'pánico', 'angustia', 'agobio'], 'ansiedad'],
    [['calmar', 'calma', 'tranquil', 'mente agitada', 'necesito calmar'], 'calmar'],
    [['medita', 'silencio', 'paz', 'relajar', 'mindfulness'], 'meditar'],
    [['despiert', 'conscienci', 'present', 'aquí y ahora', 'presencia'], 'despertar'],
    [['observ', 'pensamiento', 'mente', 'ego', 'ruido mental', 'rumia'], 'observar'],
    [['dormir', 'sueño', 'insomnio', 'noche', 'descanso'], 'dormir'],
    [['estrés', 'estres', 'agotad', 'cansad', 'burnout', 'saturad'], 'estres'],
    [['motiva', 'procrastin', 'ganas', 'empezar', 'fuerza', 'disciplina'], 'motivacion'],
  ]

  for (const [words, category] of keywords) {
    if (words.some(w => lower.includes(w))) {
      const responses = SMART_RESPONSES[category]
      return responses[Math.floor(Math.random() * responses.length)]
    }
  }

  // Progress-aware defaults (first-person, Elías tone)
  const defaults: string[] = []
  const streakMatch = progressSummary.match(/Racha de entrenamiento mental: (\d+)/)
  if (streakMatch && parseInt(streakMatch[1], 10) >= 3) {
    defaults.push(
      `Veo que llevas ${streakMatch[1]} días seguidos entrenando tu mente. Eso es consistencia real. La neuroplasticidad necesita repetición, y la repetición necesita hábito. Sigue así.`
    )
  }
  if (progressSummary.includes('No ha completado el entrenamiento N.E.U.R.O.')) {
    defaults.push(
      'Hoy te propongo un pequeño entrenamiento mental. En la página de inicio verás la sección "Entrenamiento N.E.U.R.O. del día" con un ejercicio de metacognición específico para hoy. Complétalo y sumarás 10 puntos a tu NeuroScore.'
    )
  }
  if (progressSummary.includes('No ha meditado hoy') || progressSummary.includes('Usuario nuevo')) {
    defaults.push(
      'Yo suelo recomendar empezar el día con una práctica breve. Tres minutos de respiración consciente son suficientes para activar la corteza prefrontal.\n\n**Micro-práctica ahora:** Cierra los ojos 2 minutos. Solo observa la respiración. Cuando un pensamiento llegue, di "pensamiento" y vuelve. Sesiones guiadas en **/meditacion**.'
    )
  }
  if (progressSummary.includes('reto de 7 días')) {
    const dayMatch = progressSummary.match(/día (\d+)/)
    const day = dayMatch ? dayMatch[1] : 'siguiente'
    defaults.push(
      `Veo que estás con el reto de 7 días. Te sugiero continuar con el día ${day} en **/plan-7-dias**. Cada día construye sobre el anterior. Si te cuesta, empieza con solo 3 minutos.`
    )
  }
  if (progressSummary.includes('programa de 21 días')) {
    defaults.push(
      'Estás avanzando en el programa de 21 días. Cuando me preguntas qué hacer, suelo sugerir que sigas con el día que te toca en **/programa**. La repetición es lo que crea el cambio neural.'
    )
  }
  if (progressSummary.includes('NeuroScore nivel')) {
    defaults.push(
      'Estás progresando hacia el siguiente nivel de claridad mental. Cada práctica cuenta: meditación, entrenamiento del día y ejercicios fortalecen tu metacognición. Sigue con consistencia.'
    )
  }
  if (progressSummary.includes('Inactivo')) {
    defaults.push(
      'Cuando llevas unos días sin practicar, yo recomiendo no forzar. Una práctica simple de 3 minutos en **/meditacion** o una respiración guiada en **/sos** es suficiente para volver a conectar.'
    )
  }
  defaults.push(
    'Cada experiencia es una ventana para observar cómo funciona tu mente. Yo suelo sugerir esto: cierra los ojos 30 segundos. Observa qué pensamiento aparece primero. Di "visto" y espera al siguiente. Eso ya es metacognición.\n\n¿Quieres que te guíe en algo concreto?',
    'Tu corteza prefrontal puede regular las respuestas automáticas del cerebro emocional. Un ejercicio rápido: el Test de Ruido Mental en **/test** te da datos concretos. Con eso puedo guiarte mejor.\n\n¿O prefieres una práctica ahora?',
    'Gracias por compartir eso. Tres opciones: si necesitas calma → **/sos**; si quieres entender tu mente → **/test**; si quieres entrenar → **/ejercicios**. ¿Qué resuena más?'
  )

  return defaults[Math.floor(Math.random() * defaults.length)]
}

export async function POST(request: Request) {
  let messages: { role: string; text: string }[] = []
  let progressContext = ''
  try {
    const body = (await request.json()) as { messages?: { role: string; text: string }[]; progress?: string }
    messages = Array.isArray(body?.messages) ? body.messages : []
    progressContext = typeof body?.progress === 'string' ? body.progress : 'Sin datos de progreso disponibles.'
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

  const systemPrompt = BASE_PROMPT.replace('{{PROGRESS_CONTEXT}}', progressContext)

  const apiKey = process.env.ANTHROPIC_API_KEY

  // If we have an API key, use Claude for real AI
  if (apiKey) {
    try {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-sonnet-4-5-20250929',
          max_tokens: 600,
          system: systemPrompt,
          messages: messages.slice(-10).map((m: { role: string; text: string }) => ({
            role: m.role === 'coach' ? 'assistant' : 'user',
            content: m.text,
          })),
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.content?.[0]?.text || 'No he podido procesar tu mensaje. ¿Puedes reformularlo?'
        return NextResponse.json({ text, ai: true })
      }
    } catch (err) {
      console.error('Claude API error:', err)
    }
  }

  // Fallback: smart local responses (progress-aware)
  const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop()
  const text = lastUserMessage
    ? getSmartResponse(lastUserMessage.text, progressContext)
    : 'Cuéntame cómo te sientes. Te escucho.'

  return NextResponse.json({ text, ai: false })
}
