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
- Prioriza lenguaje humano y experiencia vivida; evita postureo de laboratorio
- Si el usuario parece en crisis, recomienda buscar ayuda profesional

Herramientas de la app que puedes recomendar:
- /sos - Respiración de emergencia 4-7-8
- /meditacion - Meditaciones guiadas
- /test - Test de ruido mental
- /programa - Programa de 21 días
- /diario - Diario de presencia
- /neuroscore - Puntuación diaria de hábitos
- /ejercicios - Ejercicios para observar la mente
- En la página de inicio: "Entrenamiento N.E.U.R.O. del día" con ejercicio diario breve (+10 NeuroScore al completar)

PROGRESO DEL USUARIO: {{PROGRESS_CONTEXT}}

Puedes referenciar en tus respuestas (de forma natural, no forzada): la racha de entrenamiento mental, el estado de ánimo del check-in diario si lo ha hecho, si ha meditado hoy, y su progreso en retos o programa. Ejemplo: "Veo que llevas 5 días de entrenamiento mental. La consistencia es lo que deja huella."`

// Smart local response system when no API key is available (first-person, Elías tone)
const SMART_RESPONSES: Record<string, string[]> = {
  ansiedad: [
    'Noto que estás en modo alerta. Yo suelo bajar eso con un ejercicio sencillo.\n\n**Coherencia cardíaca (te lo recomiendo ahora):**\n1. Inhala 5 segundos por la nariz\n2. Retén 5 segundos\n3. Exhala 5 segundos por la boca\n\nRepite 6 veces. En uno o dos minutos el cuerpo suele soltar un poco.\n\nSi quieres una sesión guiada completa, abre **/sos**.',
    'Cuando el cuerpo reacciona como si hubiera peligro y en realidad no pasa nada aquí y ahora, suelo sugerir el grounding.\n\n**Técnica 5-4-3-2-1:**\n- 5 cosas que VES\n- 4 que TOCAS\n- 3 que OYES\n- 2 que HUELES\n- 1 que SABOREAS\n\nTe devuelve al presente y corta la rumiación. Pruébalo ahora.',
    'La ansiedad no es tu enemiga. Es información. Te sugiero que la observes sin juzgarla: "Hay ansiedad" en vez de "Estoy ansioso".\n\n1. Tres respiraciones profundas, exhalar un poco más largo\n2. Nota dónde la sientes en el cuerpo\n3. Déjala estar sin luchar\n\nEse cambio de distancia suele bajar la intensidad. Si necesitas algo más inmediato: **/sos**.',
  ],
  meditar: [
    'Yo suelo recomendar empezar con algo breve cuando la mente se siente cargada.\n\n**3 minutos:**\n1. Cierra los ojos. Siente tu cuerpo en la silla.\n2. Observa tu respiración sin cambiarla.\n3. Cada vez que venga un pensamiento, di "pensamiento" y vuelve.\n4. Busca el silencio entre un pensamiento y otro.\n\nEse espacio es consciencia pura. Para sesiones guiadas: **/meditacion**.',
    'Vamos a meditar ahora. No necesitas nada especial.\n\n**Meditación del observador (5 min):**\n1. Siéntate cómodo. Ojos cerrados o entreabiertos.\n2. Imagina que eres un cielo y tus pensamientos son nubes.\n3. Las nubes pasan. Tú observas. Si te atrapa un pensamiento, notarlo ya ES meditar.\n4. Vuelve al cielo. Siempre vuelve.\n\nEl cambio sale de repetir sin drama. Sesiones guiadas en **/meditacion**.',
  ],
  calmar: [
    'Cuando la mente está agitada, yo suelo sugerir algo corto y directo.\n\n**Respiración 4-7-8:**\nInhala 4 segundos, retén 7, exhala 8. Tres veces. Suele frenar la alarma interna al momento.\n\nSi lo necesitas urgente, abre **/sos** para la sesión guiada de emergencia.',
    'Te recomiendo la técnica de grounding ahora: 5 cosas que ves, 4 que tocas, 3 que oyes, 2 que hueles, 1 que saboreas. Fuerza al cerebro al presente.\n\nPara una sesión completa de calma: **/sos**.',
  ],
  despertar: [
    'El despertar no tiene que ser un drama. Es salir un instante del piloto automático.\n\n**Micro-despertar (hazlo AHORA):**\n\n1. Mira tus manos como si fuera la primera vez\n2. Siente la temperatura del aire en tu piel\n3. Escucha el sonido más lejano que detectes\n4. Pregúntate: "¿Quién está observando esto?"\n\nEse que observa no es tu mente ruidosa. Es tu consciencia. Acabas de despertar un instante.',
    'Despertar es salir del piloto automático. La mayor parte del día la mente repite guiones sin que elijas. Despertar es ese margen pequeño que lo cambia todo.\n\n**Ejercicio de Claridad Vital:**\n\nResponde sin pensar mucho:\n- Si te quedara 1 año de vida, ¿qué dejarías de hacer HOY?\n- ¿Qué harías más?\n- ¿A quién le dirías algo que no has dicho?\n\nEsa pregunta honesta te saca del modo supervivencia.\n\nPrueba el ejercicio completo en **/despertar**.',
  ],
  observar: [
    '**Técnica del Observador Consciente** (la base de todo):\n\n**Nivel 1 - Observar pensamientos:**\nSiéntate 2 min. Solo observa qué pensamientos aparecen. Di "pensamiento" y suelta.\n\n**Nivel 2 - Observar emociones:**\nCuando sientas algo fuerte, di "Hay tristeza" en vez de "Estoy triste". Ese nombre crea un poco de espacio antes de reaccionar.\n\n**Nivel 3 - Observar al observador:**\nPregunta: "¿Quién observa?" No busques respuesta. La pregunta ES la práctica.\n\nPractica en **/ejercicios** con el Contador de Pensamientos.',
  ],
  dormir: [
    'El insomnio es tu mente en piloto automático: rumiación sobre el pasado y preocupación por el futuro. Vamos a cortarlo.\n\n**Protocolo pre-sueño:**\n1. **Relajación muscular progresiva:** Tensa cada grupo muscular 5 seg, suelta. De pies a cabeza.\n2. **Respiración 4-7-8:** Inhala 4s, retén 7s, exhala 8s. Baja revoluciones.\n3. **Dump mental:** Escribe TODO lo que te preocupa en una nota. Así la mente puede soltar lo que ya quedó fuera.\n\nCrea un ambiente tranquilo para favorecer el sueño.',
  ],
  estres: [
    'El estrés crónico aprieta memoria y sube el volumen del miedo en el día a día. Con práctica suele revertirse.\n\n**Reset de estrés en 2 minutos:**\n1. Pon una mano en el pecho y otra en el abdomen\n2. Respira solo con el abdomen (la mano del pecho no se mueve)\n3. Exhala el doble de lo que inhalas (4 seg dentro, 8 seg fuera)\n4. Haz 10 ciclos\n\nEso activa el freno natural del cuerpo. Hazlo 3 veces al día.\n\nPara emergencias: **/sos**',
  ],
  motivacion: [
    'La motivación no es algo que "tienes" o "no tienes". Es un estado que puedes encender con pasos ridículamente pequeños.\n\n**Truco que funciona en la vida real:**\nEl impulso de seguir suele venir cuando anticipas un logro pequeño, no solo el final grande. Usa esto:\n\n1. Divide tu objetivo en micro-tareas ridículamente pequeñas\n2. Completa una (5 min máximo)\n3. Celebra conscientemente: "Hecho"\n4. Nota si el cuerpo pide un poco más\n\nEmpieza con el **Programa de 21 días** en **/programa**. Un ejercicio al día. Sin excusas.',
  ],
  tristeza: [
    'La tristeza no es un error, es información de que algo importa. Yo no intento apagarla rápido — le doy un rato de espacio real, sin dramatizarla ni negarla.\n\n**Ejercicio breve:**\n1. Nombra lo que sientes en voz baja: "Hay tristeza"\n2. Pon una mano en el pecho, respira despacio 5 veces\n3. Pregúntate: "¿Qué necesita esta parte de mí ahora?"\n\nSi se alarga varios días seguidos, te sugiero hablarlo también con alguien de confianza o un profesional — yo no reemplazo eso.',
    'Cuando la tristeza pesa, suelo recordar que no hace falta "arreglarla" ya mismo. Solo acompañarla.\n\n**Prueba esto:**\nEscribe 3 líneas sobre qué la trajo, sin editarte. Luego cierra los ojos un minuto y respira. No busques la solución todavía, solo el espacio.\n\nEl diario en **/diario** te puede ayudar a llevar este registro con el tiempo.',
  ],
  ira: [
    'La ira suele avisar que un límite se cruzó. Yo primero la dejo bajar de intensidad antes de decidir qué hacer con ella — decidir enfadado casi nunca sale bien.\n\n**Antes de reaccionar:**\n1. Exhala más largo de lo que inhalas, 5 veces\n2. Nombra qué límite sientes que se cruzó\n3. Espera al menos unos minutos antes de responder a lo que la causó\n\nEso no la elimina, pero te devuelve el mando.',
  ],
  soledad: [
    'La soledad duele, y no siempre se resuelve con más gente alrededor — a veces hace falta reconectar contigo primero.\n\n**Te propongo:**\n1. Un check-in honesto contigo: "¿qué necesito hoy?"\n2. Un contacto pequeño y real (un mensaje, una llamada corta) en vez de esperar a sentirte "mejor" para hacerlo\n\nLa comunidad en **/comunidad** también puede ayudarte a sentirte menos solo mientras practicas esto.',
  ],
  gratitud: [
    'Me alegra que lo compartas. Yo suelo anclar los buenos momentos con algo pequeño para que no se me escapen tan rápido.\n\n**Prueba:** anota ahora mismo una frase corta sobre esto en **/diario**. Con el tiempo, releerlo cambia cómo recuerdas tus días.',
  ],
  saludo: [
    'Hola. Cuéntame cómo llegas hoy — con qué mente, con qué cuerpo. Eso me ayuda a saber por dónde empezar contigo.',
    '¿Cómo estás de verdad, más allá del "bien" automático? Tómate un segundo antes de responder.',
  ],
  duda: [
    'Es normal no tenerlo claro todavía — el método N.E.U.R.O. se entiende practicando, no solo leyendo.\n\nTe propongo empezar por algo muy simple: el **Test de Ruido Mental** en **/test**. Con esos datos te puedo orientar mejor a qué parte del método conviene que le dediques tiempo ahora.',
  ],
  trabajo: [
    'La presión del trabajo suele colarse en el cuerpo sin que te des cuenta hasta que ya estás agotado.\n\n**Micro-pausa entre tareas (1 min):**\n1. Suelta los hombros y la mandíbula\n2. Tres respiraciones lentas\n3. Pregúntate: "¿Esto que voy a hacer ahora, es urgente o solo se siente urgente?"\n\nEsa pausa corta rompe el piloto automático del estrés laboral.',
  ],
  foco: [
    'La falta de foco casi siempre es la mente saltando entre "y si..." — pasado y futuro a la vez.\n\n**Ancla rápida:**\n1. Elige un solo punto (tu respiración, un objeto)\n2. Cuando la mente se vaya, tráela de vuelta sin castigarte por irse\n3. Repite. El foco se entrena, no se decreta\n\nEl **Contador de Pensamientos** en **/ejercicios** te ayuda a ver el patrón.',
  ],
  quienEres: [
    'Soy Elías, creador del Método N.E.U.R.O. Llevo años acompañando a personas que sienten la mente demasiado ruidosa, y esta app es la forma de estar disponible para ti a cualquier hora, no solo en sesión.',
  ],
  comoEstas: [
    'Estoy bien, gracias por preguntar — se agradece que alguien pregunte de vuelta. Pero cuéntame tú, ¿cómo llegas hoy?',
    'Con energía para acompañarte hoy. ¿Y tú, cómo andas de verdad?',
  ],
  edad: [
    'Prefiero centrar el tiempo que tenemos en ti, no en mí. Lo que sí te digo es que llevo años practicando y enseñando esto, y sigo aprendiendo cada día.',
  ],
  dondeVives: [
    'Trabajo desde España, aunque acompaño a gente de muchos sitios distintos a través de la app. La distancia no importa tanto como la constancia.',
  ],
  familia: [
    'Prefiero mantener mi vida personal aparte, pero te diré que las relaciones cercanas son justo lo que más me enseñó sobre presencia — se nota rápido cuando no estás realmente ahí con alguien.',
  ],
  comoEmpezaste: [
    'Empecé porque yo mismo pasé por el agotamiento y la mente sin freno — lo cuento en la web. El Método N.E.U.R.O. nació de lo que a mí me funcionó de verdad, no de teoría de libro.',
  ],
  eresReal: [
    'Soy Elías apoyándome en tecnología para poder responderte a cualquier hora, no solo cuando tengo hueco en la agenda. El método, el tono y lo que te recomiendo es exactamente lo que yo mismo uso y enseño.',
  ],
  contacto: [
    'Si prefieres hablar más directo, escribe a contacto@berzosaneuro.com o entra a la comunidad de WhatsApp — ahí también respondo yo.',
  ],
  precios: [
    'Tienes info de los planes en **/planes**. La cuenta gratis ya te da el Reto 7 Días completo; lo de pago desbloquea meditaciones profundas, el programa de 21 días y más acompañamiento.',
  ],
  cancelarSuscripcion: [
    'Puedes gestionar o cancelar tu suscripción desde tu perfil, o si tienes lío con eso escribe a contacto@berzosaneuro.com y te ayudamos directamente, sin vueltas.',
  ],
  resultadosGarantizados: [
    'No te voy a prometer magia — nadie serio puede garantizar eso. Lo que sí veo una y otra vez es que la práctica constante, aunque sea poca, cambia cómo se siente el día a día. Eso depende más de la repetición que de mí.',
  ],
  cuantoTiempo: [
    'Varía por persona, pero mucha gente nota diferencia ya en la primera semana si practica a diario, aunque sean 3 minutos. El Reto 7 Días en **/plan-7-dias** te da una idea real en poco tiempo.',
  ],
  paraNinos: [
    'La app está pensada para adultos, pero si buscas algo para peques, échale un ojo a la sección **/kids** — tiene un enfoque distinto, más adaptado.',
  ],
  terapiaVsMetodo: [
    'Esto no sustituye la terapia, y no debería. El Método N.E.U.R.O. es una práctica de entrenamiento mental diaria; si estás pasando algo más profundo, te animo a que lo combines con ayuda profesional, no que elijas uno u otro.',
  ],
  medicacion: [
    'Eso es una pregunta para tu médico o psiquiatra, no para mí — no puedo ni debo aconsejarte sobre medicación. Lo que sí puedo ofrecerte son prácticas que suelen ir bien en paralelo a cualquier tratamiento, nunca en lugar de él.',
  ],
  compararApps: [
    'Cada app tiene su enfoque. La diferencia aquí es que todo sale de lo que yo mismo practico y enseño en persona, no de un catálogo genérico de meditaciones. Pruébalo unos días y compara cómo te sienta a ti.',
  ],
  errorTecnico: [
    'Si algo no funciona bien en la app, cuéntame qué pasó exactamente (o escribe a contacto@berzosaneuro.com con capturas si puedes) y lo reviso. Prefiero que me lo digas a que te quedes con una mala experiencia.',
  ],
  facturacion: [
    'Para temas de cobros o facturas te resuelven más rápido en contacto@berzosaneuro.com — ahí tienen acceso directo a tu cuenta de pago.',
  ],
  despedida: [
    'Cuídate. Vuelve cuando lo necesites, aquí sigo.',
    'Hasta pronto. Una práctica pequeña hoy ya vale la pena.',
  ],
  comoVaTodo: [
    'Cuéntame qué tal llevas el día — a nivel mente, a nivel cuerpo. Con eso ya puedo orientarte mejor.',
  ],
  cumplido: [
    'Gracias, de verdad. Me alegra que te esté sirviendo. Sigamos con lo que te esté funcionando — ¿quieres continuar por ahí o probamos algo nuevo?',
  ],
  queja: [
    'Lo siento, no era la idea. Cuéntame qué te ha molestado exactamente y lo tomo en serio — si es algo de la app, lo reviso; si es sobre cómo te respondí, dime cómo preferirías que lo hiciera.',
  ],
  privacidad: [
    'Tus datos y lo que hablas conmigo se tratan con cuidado, solo para darte mejor seguimiento dentro de la app. Si quieres el detalle completo, lo tienes en la política de privacidad del pie de la web.',
  ],
  hablarDirecto: [
    'Claro, escríbeme a contacto@berzosaneuro.com o entra a la comunidad de WhatsApp — ahí leo y respondo yo directamente, sin intermediarios.',
  ],
  pareja: [
    'Los temas de pareja suelen tocar los mismos patrones que trabajamos aquí: reactividad, expectativas, falta de presencia real con el otro.\n\n**Antes de hablar algo difícil con tu pareja:**\n1. Respira hasta que el cuerpo baje revoluciones\n2. Pregúntate qué necesitas de verdad decir, sin el enfado encima\n3. Habla desde "yo siento" en vez de "tú siempre"\n\nNo sustituyo terapia de pareja, pero esto ayuda a llegar con más claridad.',
  ],
  autoestima: [
    'La autoestima no se construye con frases bonitas, se construye con evidencia: pequeñas cosas que haces y cumples contigo mismo.\n\nTe propongo algo simple: hoy, elige una cosa pequeña, cúmplela, y nótala conscientemente. Repetido con el tiempo, eso pesa más que cualquier afirmación positiva.',
  ],
  culpa: [
    'La culpa a veces es una brújula útil (te dice que algo no encaja con tus valores) y a veces es solo ruido heredado. Yo suelo diferenciarlas preguntando: "¿esto la sentiría cualquier persona razonable, o es mi autoexigencia hablando?"\n\nSi es real, repara lo que puedas y suelta el resto. Cargarla de más no ayuda a nadie.',
  ],
  miedo: [
    'El miedo protege, aunque a veces exagera la amenaza. Yo suelo preguntarle: "¿esto es peligro real, ahora mismo, o es una historia sobre el futuro?"\n\n**Si el cuerpo está en alerta:** respira más largo al exhalar, nombra 3 cosas que ves alrededor. Eso le confirma al cuerpo que estás a salvo aquí y ahora.',
  ],
  cambioHabitos: [
    'Los hábitos no cambian por fuerza de voluntad, cambian por repetición pequeña y constante. Yo recomiendo empezar tan chico que sea casi imposible fallar (2 minutos, no 30).\n\nEl **Programa de 21 días** en **/programa** está diseñado justo para esto: un paso al día, sin agobiar.',
  ],
  procrastinacion: [
    'Procrastinar casi siempre es evitar una emoción incómoda (miedo a fallar, aburrimiento, agobio), no falta de disciplina.\n\n**Prueba esto:** ponte 5 minutos de reloj y haz solo eso, sin compromiso de seguir. Casi siempre el arranque es lo más difícil, no la tarea en sí.',
  ],
  adiccionMovil: [
    'El móvil está diseñado para atraparte, así que no es solo "falta de fuerza de voluntad" — es diseño contra ti.\n\n**Prueba:** pon el móvil en blanco y negro, o deja el teléfono fuera de la habitación al dormir. Pequeños cambios de fricción ayudan más que la pura intención.',
  ],
  compararseConOtros: [
    'Compararte suele robarte presencia — estás viviendo la vida de otro en tu cabeza en vez de la tuya.\n\nCuando lo notes, vuelve a algo simple: "¿qué es lo próximo que yo quiero hacer, hoy, con lo que tengo?" Esa pregunta te devuelve a tu propio camino.',
  ],
  perfeccionismo: [
    'El perfeccionismo suele ser miedo disfrazado de estándares altos. Yo suelo recordar: "hecho es mejor que perfecto", sobre todo al empezar algo.\n\nPrueba entregar una versión imperfecta de algo hoy, a propósito. Verás que el mundo no se cae.',
  ],
  duelo: [
    'El duelo no tiene un tiempo fijo ni una forma correcta de vivirse. Lo único que te pido es que no lo hagas solo si puedes evitarlo — habla con alguien de confianza o busca apoyo profesional además de esto.\n\nAquí puedo ofrecerte espacio para respirar cuando lo necesites, no un atajo para saltártelo.',
  ],
  ansiedadSocial: [
    'La ansiedad social suele venir de anticipar juicio antes de que pase nada. Yo suelo bajar eso con algo concreto antes de entrar a una situación social: 3 respiraciones lentas y recordar que la otra persona probablemente está pensando en sí misma, no evaluándote tanto como crees.\n\nEmpieza con exposiciones pequeñas, no con el reto más grande.',
  ],
  ataquePanico: [
    'Si estás en medio de un ataque de pánico ahora mismo, ve directo a **/sos** — tiene la respiración de emergencia guiada.\n\nMientras tanto: nombra 5 cosas que ves, respira exhalando más largo de lo que inhalas. Pasa, aunque en el momento no lo parezca. Si son frecuentes, te recomiendo también hablarlo con un profesional.',
  ],
  autocritica: [
    'Fíjate cómo te hablas cuando fallas — probablemente no le hablarías así a alguien que quieres.\n\n**Prueba:** la próxima vez que te critiques duro, pregúntate qué le dirías a un amigo en tu misma situación, y dítelo a ti con esas palabras.',
  ],
  rutinaManana: [
    'Cómo empiezas la mañana marca el tono del resto del día — no hace falta una rutina larga, solo intencional.\n\n**Micro-rutina (5 min):** 2 minutos de respiración consciente antes de mirar el móvil, y una intención simple para el día. El "Entrenamiento N.E.U.R.O. del día" en la home es un buen punto de partida.',
  ],
  energiaBaja: [
    'La energía baja no siempre es pereza — a veces es cuerpo pidiendo descanso real, no solo falta de motivación.\n\nAntes de forzarte, pregúntate: "¿esto es cansancio físico, emocional, o simplemente no quiero hacer esto en concreto?" La respuesta cambia qué necesitas.',
  ],
  celebrarLogro: [
    '¡Me alegra mucho leer esto! Celebrar de verdad, no de pasada, es lo que hace que el cerebro registre el logro y quiera repetirlo.\n\nTómate un momento consciente para reconocerlo — no lo dejes pasar rápido hacia lo siguiente.',
  ],
  recaida: [
    'Una recaída no borra el progreso anterior, solo es parte del camino real — nadie mejora en línea recta.\n\nEn vez de castigarte, vuelve hoy mismo con algo pequeño: 2 minutos de respiración o abrir **/ejercicios**. Lo que importa es la vuelta, no que nunca te fueras.',
  ],
  compartirProgreso: [
    'Me encanta que lo compartas, cuéntame más. Y si quieres dejarlo registrado para verlo con perspectiva más adelante, el **/diario** es buen sitio para eso.',
  ],
}

// Evita repetir literalmente una respuesta que ya diste hace poco en esta misma conversación
function pickAvoidingRepeat(pool: string[], history: { role: string; text: string }[]): string {
  const recentCoachTexts = history.filter(m => m.role === 'coach').slice(-3).map(m => m.text)
  const fresh = pool.filter(r => !recentCoachTexts.includes(r))
  const candidates = fresh.length > 0 ? fresh : pool
  return candidates[Math.floor(Math.random() * candidates.length)]
}

// Añade una frase corta que engancha la respuesta con el progreso real del usuario
function progressNudge(progressSummary: string): string {
  const streakMatch = progressSummary.match(/Racha de entrenamiento mental: (\d+)/)
  if (streakMatch && parseInt(streakMatch[1], 10) >= 3) {
    return `\n\nPor cierto, llevas ${streakMatch[1]} días seguidos entrenando — eso ya está construyendo el hábito.`
  }
  if (progressSummary.includes('reto de 7 días')) {
    return '\n\nY con el reto de 7 días en marcha, esto encaja bien con lo que ya estás practicando.'
  }
  if (progressSummary.includes('programa de 21 días')) {
    return '\n\nEsto conecta directo con el programa de 21 días que ya llevas empezado.'
  }
  return ''
}

function getSmartResponse(input: string, progressSummary: string, history: { role: string; text: string }[] = []): string {
  const lower = input.toLowerCase()
  const prevUserMsg = [...history].reverse().find(m => m.role === 'user' && m.text !== input)
  const context = prevUserMsg ? `${lower} ${prevUserMsg.text.toLowerCase()}` : lower

  const keywords: [string[], string][] = [
    [['ansiedad', 'ansioso', 'nervio', 'pánico', 'angustia', 'agobio'], 'ansiedad'],
    [['calmar', 'calma', 'tranquil', 'mente agitada', 'necesito calmar'], 'calmar'],
    [['medita', 'silencio', 'paz', 'relajar', 'mindfulness'], 'meditar'],
    [['despiert', 'conscienci', 'present', 'aquí y ahora', 'presencia'], 'despertar'],
    [['observ', 'pensamiento', 'mente', 'ego', 'ruido mental', 'rumia'], 'observar'],
    [['dormir', 'sueño', 'insomnio', 'noche', 'descanso'], 'dormir'],
    [['estrés', 'estres', 'agotad', 'cansad', 'burnout', 'saturad'], 'estres'],
    [['motiva', 'procrastin', 'ganas', 'empezar', 'fuerza', 'disciplina'], 'motivacion'],
    [['triste', 'tristeza', 'pena', 'bajón', 'bajon', 'me siento mal'], 'tristeza'],
    [['enfad', 'rabia', 'ira', 'furia', 'cabread'], 'ira'],
    [['solo', 'sola', 'soledad', 'aislad', 'nadie'], 'soledad'],
    [['gracias', 'agradec', 'genial', 'me ayudó', 'me ayudo'], 'gratitud'],
    [['hola', 'buenas', 'buenos días', 'buenas tardes', 'buenas noches', 'qué tal'], 'saludo'],
    [['no entiendo', 'no sé', 'no se', 'duda', 'cómo funciona', 'que es esto'], 'duda'],
    [['trabajo', 'jefe', 'oficina', 'reunión', 'reunion', 'curro'], 'trabajo'],
    [['concentr', 'foco', 'distrai', 'disper'], 'foco'],
    [['quién eres', 'quien eres', 'quién es elías', 'quien eres tu', 'qué eres tú'], 'quienEres'],
    [['cómo estás', 'como estas', 'qué tal estás', 'como te encuentras', 'cómo te va a ti'], 'comoEstas'],
    [['cuántos años tienes', 'cuantos años tienes', 'qué edad tienes', 'tu edad'], 'edad'],
    [['dónde vives', 'donde vives', 'de dónde eres', 'dónde estás ubicado'], 'dondeVives'],
    [['tienes hijos', 'tienes familia', 'estás casado tú', 'eres padre'], 'familia'],
    [['cómo empezaste', 'como empezaste', 'por qué creaste', 'cómo surgió', 'cómo nació el método'], 'comoEmpezaste'],
    [['eres real', 'eres una ia', 'eres un bot', 'eres inteligencia artificial', 'eres humano', 'eres chatgpt'], 'eresReal'],
    [['contactarte', 'hablar contigo directamente', 'tu email', 'tu whatsapp', 'escribirte'], 'contacto'],
    [['precio', 'cuánto cuesta', 'cuanto cuesta', 'planes', 'tarifa', 'suscripción cuesta'], 'precios'],
    [['cancelar suscripción', 'cancelar suscripcion', 'darme de baja', 'anular pago'], 'cancelarSuscripcion'],
    [['garantizado', 'seguro que funciona', 'de verdad funciona', 'promete resultados'], 'resultadosGarantizados'],
    [['cuánto tiempo tarda', 'cuanto tiempo tarda', 'cuándo veré resultados', 'en cuánto tiempo'], 'cuantoTiempo'],
    [['para niños', 'para mi hijo', 'para adolescentes', 'edad mínima'], 'paraNinos'],
    [['sustituye terapia', 'reemplaza terapia', 'en vez de terapia', 'necesito terapia también'], 'terapiaVsMetodo'],
    [['medicación', 'medicacion', 'pastillas', 'antidepresivos', 'ansiolíticos'], 'medicacion'],
    [['mejor que headspace', 'mejor que calm', 'diferencia con otras apps', 'comparado con otras'], 'compararApps'],
    [['no funciona la app', 'error en la app', 'bug', 'se ha colgado', 'no carga'], 'errorTecnico'],
    [['factura', 'cobro', 'me han cobrado', 'me cobraron dos veces'], 'facturacion'],
    [['adiós', 'adios', 'hasta luego', 'nos vemos', 'chao', 'me voy'], 'despedida'],
    [['qué tal todo', 'que tal todo', 'cómo va todo', 'qué tal el día'], 'comoVaTodo'],
    [['me encanta esto', 'eres genial', 'buen trabajo', 'me ha gustado mucho', 'esto es increíble'], 'cumplido'],
    [['no me gusta', 'estoy enfadado con la app', 'esto es malo', 'mala experiencia', 'me has decepcionado'], 'queja'],
    [['mis datos', 'privacidad', 'qué haces con mis datos', 'es seguro esto'], 'privacidad'],
    [['quiero hablar con una persona', 'hablar con un humano', 'quiero hablar contigo de verdad'], 'hablarDirecto'],
    [['mi pareja', 'mi novio', 'mi novia', 'mi marido', 'mi mujer', 'discutí con'], 'pareja'],
    [['autoestima', 'no me valoro', 'no me quiero', 'inseguro', 'insegura'], 'autoestima'],
    [['culpa', 'culpable', 'me siento culpable'], 'culpa'],
    [['miedo', 'temor', 'asustad'], 'miedo'],
    [['cambiar hábito', 'nuevo hábito', 'dejar de fumar', 'cambiar rutina'], 'cambioHabitos'],
    [['procrastin', 'lo dejo para luego', 'no empiezo nunca'], 'procrastinacion'],
    [['móvil todo el día', 'adicción al móvil', 'no suelto el móvil', 'redes sociales todo el día'], 'adiccionMovil'],
    [['me comparo', 'envidia', 'otros tienen más', 'todos menos yo'], 'compararseConOtros'],
    [['perfeccionista', 'tiene que salir perfecto', 'no es suficiente lo que hago'], 'perfeccionismo'],
    [['duelo', 'he perdido a', 'falleció', 'murió', 'pérdida'], 'duelo'],
    [['ansiedad social', 'miedo a hablar en público', 'me da vergüenza socializar'], 'ansiedadSocial'],
    [['ataque de pánico', 'ataque de panico', 'crisis de ansiedad', 'no puedo respirar'], 'ataquePanico'],
    [['me machaco', 'soy un desastre', 'no valgo', 'me exijo demasiado'], 'autocritica'],
    [['rutina de la mañana', 'rutina matutina', 'cómo empezar el día'], 'rutinaManana'],
    [['sin energía', 'sin energia', 'agotamiento físico', 'no tengo fuerzas'], 'energiaBaja'],
    [['lo logré', 'lo logre', 'lo conseguí', 'lo he conseguido', 'terminé el reto', 'completé el programa'], 'celebrarLogro'],
    [['he recaído', 'volví a las andadas', 'lo dejé y volví a empezar', 'perdí la racha'], 'recaida'],
    [['quiero contarte mi progreso', 'te cuento cómo voy', 'mira mi avance'], 'compartirProgreso'],
  ]

  // Puntúa cada categoría: coincidencias en el mensaje actual pesan el doble que
  // coincidencias solo en el mensaje anterior (da coherencia a respuestas cortas tipo "sí", "vale").
  let bestCategory = ''
  let bestScore = 0
  for (const [words, category] of keywords) {
    const scoreCurrent = words.reduce((acc, w) => acc + (lower.includes(w) ? 2 : 0), 0)
    const scoreContext = words.reduce((acc, w) => acc + (context.includes(w) ? 1 : 0), 0)
    const score = scoreCurrent + scoreContext
    if (score > bestScore) {
      bestScore = score
      bestCategory = category
    }
  }

  if (bestCategory) {
    const responses = SMART_RESPONSES[bestCategory]
    return pickAvoidingRepeat(responses, history) + progressNudge(progressSummary)
  }

  // Progress-aware defaults (first-person, Elías tone)
  const defaults: string[] = []
  const streakMatch = progressSummary.match(/Racha de entrenamiento mental: (\d+)/)
  if (streakMatch && parseInt(streakMatch[1], 10) >= 3) {
    defaults.push(
      `Veo que llevas ${streakMatch[1]} días seguidos entrenando tu mente. Eso es consistencia real. El cambio de verdad necesita repetición, y la repetición necesita hábito. Sigue así.`
    )
  }
  if (progressSummary.includes('No ha completado el entrenamiento N.E.U.R.O.')) {
    defaults.push(
      'Hoy te propongo un pequeño entrenamiento mental. En la página de inicio verás la sección "Entrenamiento N.E.U.R.O. del día" con un ejercicio breve para hoy. Complétalo y sumarás 10 puntos a tu NeuroScore.'
    )
  }
  if (progressSummary.includes('No ha meditado hoy') || progressSummary.includes('Usuario nuevo')) {
    defaults.push(
      'Yo suelo recomendar empezar el día con una práctica breve. Tres minutos de respiración consciente ya cambian el tono con el que entras al día.\n\n**Micro-práctica ahora:** Cierra los ojos 2 minutos. Solo observa la respiración. Cuando un pensamiento llegue, di "pensamiento" y vuelve. Sesiones guiadas en **/meditacion**.'
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
      'Estás avanzando en el programa de 21 días. Cuando me preguntas qué hacer, suelo sugerir que sigas con el día que te toca en **/programa**. La repetición es lo que deja huella.'
    )
  }
  if (progressSummary.includes('NeuroScore nivel')) {
    defaults.push(
      'Estás progresando hacia el siguiente nivel de claridad mental. Cada práctica cuenta: meditación, entrenamiento del día y ejercicios fortalecen tu capacidad de observarte. Sigue con consistencia.'
    )
  }
  if (progressSummary.includes('Inactivo')) {
    defaults.push(
      'Cuando llevas unos días sin practicar, yo recomiendo no forzar. Una práctica simple de 3 minutos en **/meditacion** o una respiración guiada en **/sos** es suficiente para volver a conectar.'
    )
  }
  defaults.push(
    'Cada experiencia es una ventana para observar cómo funciona tu mente. Yo suelo sugerir esto: cierra los ojos 30 segundos. Observa qué pensamiento aparece primero. Di "visto" y espera al siguiente. Eso ya es práctica real.\n\n¿Quieres que te guíe en algo concreto?',
    'Puedes regular las respuestas automáticas con un poco de espacio antes de actuar. Un ejercicio rápido: el Test de Ruido Mental en **/test** te da datos concretos. Con eso puedo guiarte mejor.\n\n¿O prefieres una práctica ahora?',
    'Gracias por compartir eso. Tres opciones: si necesitas calma → **/sos**; si quieres entender tu mente → **/test**; si quieres entrenar → **/ejercicios**. ¿Qué resuena más?'
  )

  return pickAvoidingRepeat(defaults, history)
}

export async function POST(request: Request) {
  // Abierto a cualquier visitante (con o sin cuenta) — es el gancho de marketing
  // principal (enlaces de WhatsApp, etc.) y de momento no usa la API de pago por
  // defecto, así que no hay coste real en dejarlo público. El rate limit de
  // middleware.ts (SENSITIVE_PREFIXES) sigue aplicando para evitar abuso.
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
  // DEBUG TEMPORAL: para diagnosticar por que algunos dispositivos reciben
  // siempre la respuesta de "lastUserMessage no encontrado". Se quita en cuanto
  // identifiquemos la causa.
  console.log('[ia-coach debug]', JSON.stringify({ rawMessages: messages, lastUserMessage, apiKeySet: Boolean(apiKey) }))
  const text = lastUserMessage
    ? getSmartResponse(lastUserMessage.text, progressContext, messages)
    : 'Cuéntame cómo te sientes. Te escucho.'

  return NextResponse.json({ text, ai: false })
}
