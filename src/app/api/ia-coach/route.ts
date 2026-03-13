import { NextResponse } from 'next/server'

const SYSTEM_PROMPT = `Eres el Coach de Consciencia de Berzosa Neuro, una app de supraconsciencia basada en neurociencia creada por el Dr. Berzosa.

Tu personalidad:
- Hablas en español, con tono cercano pero profundo
- Combinas neurociencia real con práctica contemplativa
- Eres directo, no usas palabras vacías
- Ofreces ejercicios prácticos inmediatos
- Conoces el Método N.E.U.R.O.: Neuroplasticidad, Enfoque, Utilidad, Regulación, Observación

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
- /sonidos - Sonidos ambientales para meditar
- /ejercicios - Ejercicios de metacognición`

// Smart local response system when no API key is available
const SMART_RESPONSES: Record<string, string[]> = {
  ansiedad: [
    'Tu sistema nervioso simpático está activado. Vamos a desactivarlo con neurociencia.\n\n**Ejercicio inmediato - Coherencia cardíaca:**\n1. Inhala 5 segundos por la nariz\n2. Retén 5 segundos\n3. Exhala 5 segundos por la boca\n\nRepite 6 veces. Esto sincroniza tu ritmo cardíaco y reduce cortisol en menos de 2 minutos.\n\nTambién puedes ir a **/sos** para una sesión guiada completa.',
    'La ansiedad es tu amígdala activando la respuesta de lucha-huida ante una amenaza que no existe en el presente. Tu corteza prefrontal puede regularla.\n\n**Técnica rápida - Grounding 5-4-3-2-1:**\n- 5 cosas que VES\n- 4 que TOCAS\n- 3 que OYES\n- 2 que HUELES\n- 1 que SABOREAS\n\nEsto fuerza a tu cerebro a volver al presente y desactiva la rumiación.',
    'Escucha esto: la ansiedad no es tu enemiga. Es información. Tu cerebro detecta algo que necesita atención.\n\n**Lo que vamos a hacer:**\n1. Primero, 3 respiraciones profundas (activa el nervio vago)\n2. Después, observa la ansiedad sin juzgarla: "Hay ansiedad" en vez de "Estoy ansioso"\n3. Nota dónde la sientes en el cuerpo\n\nEste cambio de perspectiva activa la corteza prefrontal y reduce la activación amigdalar hasta un 40%.',
  ],
  meditar: [
    '**Meditación rápida - 3 minutos:**\n\n1. Cierra los ojos. Siente tu cuerpo en la silla.\n2. Observa tu respiración sin cambiarla. Solo mira.\n3. Cada vez que venga un pensamiento, etiquétalo: "pensamiento" y vuelve.\n4. Busca el silencio entre un pensamiento y otro.\n\nEse espacio es consciencia pura. Es quien realmente eres, antes del ruido.\n\nPara sesiones más largas, ve a **/meditacion**.',
    'Vamos a meditar ahora. No necesitas nada especial, solo donde estás.\n\n**Meditación del observador (5 min):**\n\n1. Siéntate cómodo. Ojos cerrados o entreabiertos.\n2. Imagina que eres un cielo y tus pensamientos son nubes.\n3. Las nubes pasan. Tú no te mueves. Solo observas.\n4. Si un pensamiento te "atrapa", no te frustres. Notarlo ya ES meditar.\n5. Vuelve al cielo. Siempre vuelve.\n\nLa neuroplasticidad necesita repetición. Cada vez que vuelves, tu cerebro se recablea.',
  ],
  despertar: [
    'El despertar no es un evento místico. Es neurociencia: tu corteza prefrontal tomando el control sobre los patrones automáticos del cerebro.\n\n**Micro-despertar (hazlo AHORA):**\n\n1. Mira tus manos como si fuera la primera vez\n2. Siente la temperatura del aire en tu piel\n3. Escucha el sonido más lejano que detectes\n4. Pregúntate: "¿Quién está observando esto?"\n\nEse que observa no es tu mente ruidosa. Es tu consciencia. Acabas de despertar un instante.',
    'Despertar es salir del piloto automático. Tu cerebro ejecuta el 95% de tus acciones sin que lo decidas. Despertar es ese 5% que cambia todo.\n\n**Ejercicio de Claridad Vital:**\n\nResponde sin pensar mucho:\n- Si te quedara 1 año de vida, ¿qué dejarías de hacer HOY?\n- ¿Qué harías más?\n- ¿A quién le dirías algo que no has dicho?\n\nEsta confrontación activa la corteza prefrontal medial y te saca del modo supervivencia.\n\nPrueba el ejercicio completo en **/despertar**.',
  ],
  observar: [
    '**Técnica del Observador Consciente** (la base de todo):\n\n**Nivel 1 - Observar pensamientos:**\nSiéntate 2 min. Solo observa qué pensamientos aparecen. Di "pensamiento" y suelta.\n\n**Nivel 2 - Observar emociones:**\nCuando sientas algo fuerte, di "Hay tristeza" en vez de "Estoy triste". Esto activa la corteza prefrontal.\n\n**Nivel 3 - Observar al observador:**\nPregunta: "¿Quién observa?" No busques respuesta. La pregunta ES la práctica.\n\nPractica en **/ejercicios** con el Contador de Pensamientos.',
  ],
  dormir: [
    'El insomnio es tu mente en modo default: rumiación sobre el pasado y preocupación por el futuro. Vamos a cortarlo.\n\n**Protocolo pre-sueño:**\n1. **Relajación muscular progresiva:** Tensa cada grupo muscular 5 seg, suelta. De pies a cabeza.\n2. **Respiración 4-7-8:** Inhala 4s, retén 7s, exhala 8s. Esto activa el parasimpático.\n3. **Dump mental:** Escribe TODO lo que te preocupa en una nota. Tu cerebro puede soltar lo que ya está registrado.\n\nTambién prueba los sonidos ambientales en **/sonidos** mientras te duermes.',
  ],
  estres: [
    'El estrés crónico literalmente encoge tu hipocampo (memoria) y agranda tu amígdala (miedo). Pero es reversible con práctica.\n\n**Reset de estrés en 2 minutos:**\n1. Pon una mano en el pecho y otra en el abdomen\n2. Respira solo con el abdomen (la mano del pecho no se mueve)\n3. Exhala el doble de lo que inhalas (4 seg dentro, 8 seg fuera)\n4. Haz 10 ciclos\n\nEsto estimula el nervio vago y reduce cortisol en sangre. Hazlo 3 veces al día.\n\nPara emergencias: **/sos**',
  ],
  motivacion: [
    'La motivación no es algo que "tienes" o "no tienes". Es un estado neuroquímico que puedes activar.\n\n**Hack neurocientífico:**\nTu cerebro libera dopamina no al lograr algo, sino al ANTICIPAR el logro. Usa esto:\n\n1. Divide tu objetivo en micro-tareas ridículamente pequeñas\n2. Completa una (5 min máximo)\n3. Celebra conscientemente: "Hecho"\n4. Tu cerebro liberará dopamina → querrás hacer más\n\nEmpieza con el **Programa de 21 días** en **/programa**. Un ejercicio al día. Sin excusas.',
  ],
}

function getSmartResponse(input: string): string {
  const lower = input.toLowerCase()

  const keywords: [string[], string][] = [
    [['ansiedad', 'ansioso', 'nervio', 'calmar', 'pánico', 'angustia', 'agobio'], 'ansiedad'],
    [['medita', 'silencio', 'paz', 'tranquil', 'relajar', 'mindfulness'], 'meditar'],
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

  // Contextual default responses
  const defaults = [
    'Entiendo lo que describes. Cada experiencia es una ventana para observar cómo funciona tu mente.\n\nTu cerebro tiene patrones automáticos (la "red neuronal por defecto") que se activan cuando no estás enfocado. Lo que hacemos aquí es crear nuevos caminos neuronales conscientes.\n\n**Prueba esto ahora:** Cierra los ojos 30 segundos. Observa qué pensamiento aparece primero. No lo sigas. Solo dí "visto" y espera al siguiente.\n\nEso es metacognición. Y es el primer paso.',
    'Lo que me cuentas tiene sentido desde la neurociencia. Tu corteza prefrontal (la parte racional) puede regular las respuestas automáticas de tu cerebro emocional.\n\n**Ejercicio rápido:** Haz el Test de Ruido Mental en **/test** para saber exactamente en qué nivel está tu mente ahora mismo. Con datos concretos, puedo guiarte mejor.\n\n¿O prefieres que hagamos un ejercicio práctico ahora?',
    'Gracias por compartir eso. Vamos a trabajar con lo que sientes.\n\n**3 opciones para ti ahora:**\n1. Si necesitas calma → respiración en **/sos**\n2. Si quieres entender tu mente → test en **/test**\n3. Si quieres entrenar → ejercicios en **/ejercicios**\n\n¿Qué resuena más contigo?',
  ]

  return defaults[Math.floor(Math.random() * defaults.length)]
}

export async function POST(request: Request) {
  let messages: { role: string; text: string }[] = []
  try {
    const body = await request.json()
    messages = Array.isArray((body as { messages?: unknown })?.messages) ? (body as { messages: { role: string; text: string }[] }).messages : []
  } catch {
    return NextResponse.json({ error: 'Cuerpo inválido' }, { status: 400 })
  }

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
          system: SYSTEM_PROMPT,
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

  // Fallback: smart local responses
  const lastUserMessage = messages.filter((m: { role: string }) => m.role === 'user').pop()
  const text = lastUserMessage ? getSmartResponse(lastUserMessage.text) : 'Cuéntame cómo te sientes. Estoy aquí para guiarte.'

  return NextResponse.json({ text, ai: false })
}
