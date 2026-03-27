export type Post = {
  slug: string
  title: string
  date: string
  summary: string
  content: string
  exercise: string
}

export const posts: Post[] = [
  {
    slug: 'por-que-tu-mente-no-se-calla',
    title: 'Por qué tu mente no se calla',
    date: '2026-02-10',
    summary: 'El ruido mental no es un defecto. Es un patrón aprendido que tu cerebro repite porque nadie le enseñó a parar.',
    content: `Tu mente no para porque así fue entrenada. Desde que eres pequeño, la sociedad premia la actividad mental constante: planificar, anticipar, analizar. El problema es que nadie te enseñó a desactivar ese modo.

El ruido mental es el resultado de una mente que opera en modo automático. Pensamientos repetitivos, diálogos internos, escenarios imaginarios... todo esto consume energía y te aleja del momento presente.

La neurociencia ha demostrado que la red neuronal por defecto (Default Mode Network) se activa cuando no estás enfocado en una tarea específica. Esta red es responsable de la rumiación, la planificación excesiva y la autocrítica.

La buena noticia: puedes entrenar tu cerebro para reducir esta actividad. La neuroplasticidad permite crear nuevos patrones. Con práctica constante de atención plena, la actividad de la red por defecto se reduce significativamente.

No se trata de dejar de pensar. Se trata de elegir cuándo pensar y cuándo simplemente estar presente.`,
    exercise: 'Durante 5 minutos, siéntate en silencio y cuenta cada pensamiento que aparece. No lo juzgues, solo cuenta. Al final, observa: ¿cuántos pensamientos fueron útiles? ¿Cuántos eran repeticiones?',
  },
  {
    slug: 'ego-mecanismo-defensivo',
    title: 'Ego: mecanismo defensivo',
    date: '2026-02-05',
    summary: 'El ego no es tu enemigo. Pero tampoco eres tú. Aprende a reconocer cuándo habla el ego y cuándo habla la conciencia.',
    content: `El ego es un constructo mental que creaste para sobrevivir socialmente. No es malo, pero confundirlo con tu identidad real genera sufrimiento.

El ego necesita compararse, defenderse, tener razón. Cuando alguien te critica y sientes una reacción inmediata de defensa o ataque, ese es el ego actuando.

La conciencia, en cambio, observa sin reaccionar. Puede recibir una crítica y evaluarla objetivamente, sin tomársela como un ataque personal.

El problema surge cuando vivimos identificados al 100% con el ego. Cada situación se convierte en una amenaza potencial a nuestra autoimagen. Esto genera ansiedad social, necesidad de validación y miedo al rechazo.

La metacognición te permite ver el ego como lo que es: una herramienta, no tu esencia. Cuando observas tus reacciones desde fuera, el ego pierde poder automático sobre ti.`,
    exercise: 'La próxima vez que sientas una reacción emocional intensa ante un comentario o situación, para y pregúntate: "¿Esto amenaza mi supervivencia real o solo mi autoimagen?" Observa cómo cambia la intensidad de la reacción.',
  },
  {
    slug: 'neuroplasticidad-aplicada-al-ahora',
    title: 'Neuroplasticidad aplicada al ahora',
    date: '2026-01-28',
    summary: 'Tu cerebro cambia con cada experiencia repetida. Usa eso a tu favor para entrenar la presencia.',
    content: `La neuroplasticidad es la capacidad del cerebro para reorganizar sus conexiones neuronales. Cada vez que repites un patrón mental, ese circuito se fortalece. Esto funciona tanto para patrones negativos como positivos.

Si pasas años rumiando, el circuito de la rumiación se vuelve más fuerte y automático. Pero si entrenas la atención plena, los circuitos de presencia y regulación emocional se fortalecen.

Estudios con meditadores experimentados muestran cambios estructurales en el cerebro: mayor densidad de materia gris en la corteza prefrontal, reducción de la amígdala y fortalecimiento de las conexiones entre áreas de regulación emocional.

Lo más importante: estos cambios no requieren años de meditación en un monasterio. Investigaciones muestran cambios medibles en solo 8 semanas de práctica diaria de 15-20 minutos.

La clave está en la constancia, no en la duración. 10 minutos diarios durante meses son más efectivos que sesiones largas esporádicas.`,
    exercise: 'Elige una actividad cotidiana (lavarte los dientes, ducharte, comer) y durante una semana hazla con atención plena total. Nota cada sensación, cada movimiento. Estás creando un nuevo circuito de presencia.',
  },
  {
    slug: 'como-cortar-la-rumiacion',
    title: 'Cómo cortar la rumiación',
    date: '2026-01-20',
    summary: 'La rumiación es el hábito de darle vueltas a lo mismo sin llegar a ninguna solución. Así se rompe el ciclo.',
    content: `La rumiación es un bucle mental en el que analizas una situación pasada o futura una y otra vez sin llegar a ninguna conclusión útil. Es uno de los principales predictores de depresión y ansiedad.

El cerebro rumia porque cree que está resolviendo un problema. Pero en realidad solo está activando los mismos circuitos de estrés repetidamente, liberando cortisol y manteniendo el sistema nervioso en alerta.

Para cortar la rumiación necesitas interrumpir el patrón. Aquí hay tres técnicas basadas en evidencia:

1. Etiquetado cognitivo: Cuando notes que estás rumiando, di mentalmente "rumiación" o "pensamiento repetitivo". Este simple acto activa la corteza prefrontal y reduce la actividad de la amígdala.

2. Anclaje sensorial: Lleva tu atención a una sensación física inmediata. Siente tus pies en el suelo, la temperatura del aire, los sonidos del entorno. Esto saca al cerebro del modo narrativo.

3. Acción mínima: Si el pensamiento está relacionado con algo que puedes resolver, toma una acción mínima (escribir un mensaje, apuntar una idea). Si no puedes hacer nada al respecto, reconócelo y suelta.`,
    exercise: 'Cada vez que detectes un pensamiento repetitivo hoy, usa la técnica del etiquetado: di mentalmente "bucle" y redirige tu atención a tres cosas que puedes ver, dos que puedes oír y una que puedes tocar.',
  },
  {
    slug: 'atencion-el-musculo-que-no-entrenas',
    title: 'Atención: el músculo que no entrenas',
    date: '2026-01-15',
    summary: 'La atención es la base de todo. Sin ella, no hay presencia, no hay control y no hay claridad mental.',
    content: `Vivimos en la era de la distracción. Tu cerebro recibe más estímulos en un día que el de tus abuelos en un mes. Y sin embargo, nadie te enseñó a gestionar tu atención.

La atención no es algo que tienes o no tienes. Es un músculo que se entrena. Y como cualquier músculo, si no lo ejercitas, se atrofia.

Cada vez que desbloqueas el móvil sin motivo, que cambias de pestaña mientras trabajas o que pierdes el hilo de una conversación, estás entrenando la distracción. Tu cerebro aprende que los estímulos rápidos son más atractivos que la concentración sostenida.

La buena noticia: la atención responde muy bien al entrenamiento. Estudios muestran que solo 10 minutos diarios de práctica de atención focalizada mejoran significativamente la capacidad de concentración en 4 semanas.

El entrenamiento es simple pero no fácil: elige un punto de anclaje (respiración, sensación corporal, sonido) y mantén tu atención ahí. Cuando la mente se desvíe, nótalo y vuelve. Cada vez que vuelves, estás haciendo una repetición. Eso es entrenar.`,
    exercise: 'Haz 5 minutos de atención focalizada ahora: cierra los ojos, enfócate en tu respiración. Cada vez que tu mente se vaya, anota mentalmente "distracción" y vuelve. Cuenta cuántas veces vuelves. Ese número son tus repeticiones de hoy.',
  },
  {
    slug: 'vivir-en-piloto-automatico',
    title: 'Vivir en piloto automático',
    date: '2026-01-08',
    summary: 'El 95% de tus acciones diarias son automáticas. Aprende a identificar cuándo estás en modo automático y cómo salir.',
    content: `Tu cerebro automatiza comportamientos para ahorrar energía. Esto es útil para tareas como conducir o caminar, pero se vuelve problemático cuando automatiza tus reacciones emocionales, tus patrones de pensamiento y tus hábitos.

Vivir en piloto automático significa reaccionar en lugar de responder. Significa que tus días se parecen entre sí no porque elijas que sea así, sino porque tu cerebro repite los mismos circuitos una y otra vez.

Señales de que estás en piloto automático:
- Llegas a un lugar y no recuerdas el trayecto
- Comes sin saborear la comida
- Respondes a mensajes mientras piensas en otra cosa
- Reaccionas emocionalmente antes de procesar la situación
- Sientes que el tiempo pasa demasiado rápido

Salir del piloto automático no significa estar hiperconsciente de todo. Significa tener momentos deliberados de presencia a lo largo del día. Pequeñas pausas donde eliges conscientemente dónde poner tu atención.

La conciencia es como un foco de luz: no puedes iluminar todo a la vez, pero puedes elegir qué iluminas.`,
    exercise: 'Elige tres momentos del día (al despertar, al comer, al acostarte) para hacer una "pausa de conciencia" de 30 segundos: para, respira, observa qué sientes y dónde estás. Sin juzgar, solo observar.',
  },
]

  {
    slug: 'la-ansiedad-como-brujula',
    title: 'La ansiedad como brújula',
    date: '2026-02-18',
    summary: 'La ansiedad no es una enfermedad ni un defecto de fábrica. Es una señal de tu sistema nervioso que apunta hacia algo que necesitas atender.',
    content: `La ansiedad tiene mala reputación. Se habla de ella como si fuera un mal que hay que eliminar cuanto antes. Pero antes de suprimirla, conviene entender qué está haciendo.

El sistema nervioso autónomo genera la respuesta de ansiedad cuando detecta una amenaza, real o imaginada. El problema moderno es que el cerebro no distingue bien entre un depredador y un correo de trabajo urgente. Ambos disparan el mismo mecanismo.

La ansiedad se convierte en un problema cuando la ignoramos o cuando la amplificamos con pensamiento rumiativo. Si la ignoras, el cuerpo sube la intensidad de la señal. Si la alimentas con más pensamiento catastrofista, el sistema nervioso interpreta que la amenaza es mayor y produce más ansiedad.

La tercera vía es la más efectiva: observar la ansiedad como información. ¿Qué parte de mi vida estoy descuidando? ¿Qué límite no he puesto? ¿Qué necesidad estoy ignorando? La ansiedad rara vez es irracional. Suele señalar algo real que no queremos ver.

Esto no significa que toda ansiedad sea útil o que haya que actuar siempre según lo que dice. Significa que antes de apagarla, vale la pena preguntarle qué quiere decirte.`,
    exercise: 'La próxima vez que notes ansiedad, en lugar de resistirla o amplificarla, haz esto: pon una mano en el pecho, respira despacio y pregúntate en voz baja "¿de qué me estás avisando?". Escucha sin juzgar. Anota lo que aparezca.',
  },
  {
    slug: 'respiracion-y-sistema-nervioso',
    title: 'Respiración y sistema nervioso',
    date: '2026-02-25',
    summary: 'Controlar la respiración es la palanca más directa que tienes sobre tu sistema nervioso autónomo. Aquí está la ciencia detrás de eso.',
    content: `La mayoría de las funciones del sistema nervioso autónomo están fuera de tu control voluntario: la frecuencia cardíaca, la digestión, la dilatación de las pupilas. Pero hay una excepción notable: la respiración.

El nervio vago conecta el cerebro con los órganos principales del cuerpo. Cuando exhalas, estimulas ese nervio y activas el sistema parasimpático, el modo de calma y recuperación. Cuando inhalas, activas ligeramente el simpático. Por eso una exhalación más larga que la inhalación calma el sistema nervioso de forma medible en segundos.

Esta no es una teoría nueva. Los yoguis lo conocían hace miles de años. La diferencia es que ahora tenemos los datos: estudios con biofeedback muestran que la respiración coherente a 5-6 ciclos por minuto sincroniza las ondas cerebrales con el ritmo cardíaco, reduce el cortisol y mejora la variabilidad de la frecuencia cardíaca, un marcador de salud cardiovascular y resiliencia al estrés.

La respiración diafragmática también activa los mecanorreceptores del diafragma, que envían señales de seguridad al tronco cerebral. Es biología básica: si el cuerpo respira profundo, el cerebro concluye que no hay peligro inmediato.

La práctica no requiere tiempo ni equipamiento. Requiere acordarte de usarla.`,
    exercise: 'Practica la respiración 4-7-8 durante 4 ciclos: inhala 4 segundos, retén 7, exhala 8. Hazlo antes de una reunión difícil, al despertar o cuando notes tensión. Observa cómo cambia tu estado en menos de 2 minutos.',
  },
  {
    slug: 'sueno-y-neuroplasticidad',
    title: 'Sueño y neuroplasticidad',
    date: '2026-03-03',
    summary: 'Sin sueño profundo no hay neuroplasticidad real. Tu cerebro consolida lo aprendido, repara conexiones y elimina residuos tóxicos mientras duermes.',
    content: `Dormir no es un lujo ni una pérdida de tiempo productivo. Es el proceso de mantenimiento más importante que tiene tu cerebro, y no puede posponerse sin consecuencias.

Durante el sueño de ondas lentas, el cerebro consolida la memoria declarativa: lo que aprendiste, las conversaciones que tuviste, las emociones que procesaste. Las sinapsis que se activaron durante el día se estabilizan o se podan. Es literalmente cuando el aprendizaje se "escribe en el hardware".

El sistema glinfático, descubierto en 2013, opera principalmente durante el sueño profundo. Las células gliales se contraen hasta un 60%, ampliando el espacio extracelular y permitiendo que el líquido cefalorraquídeo arrastre los residuos metabólicos acumulados, incluidas proteínas beta-amiloide relacionadas con el Alzheimer.

La privación de sueño no solo te cansa. Deteriora la corteza prefrontal en pocas horas, reduciendo tu capacidad de tomar decisiones, regular emociones y acceder a la empatía. Un estudio de la Universidad de California mostró que dormir 6 horas durante dos semanas produce el mismo deterioro cognitivo que una privación total de 48 horas, pero los sujetos no lo perciben.

El problema: el cerebro privado de sueño es mal juez de cuánto ha dormido.`,
    exercise: 'Durante una semana, anota la hora en que apagas las pantallas y la hora a la que te duermes aproximadamente. Observa si hay más de 30 minutos de diferencia. Ese tiempo de exposición a luz azul reduce la melatonina y retrasa el inicio del sueño profundo. Experimenta con adelantarlo 30 minutos.',
  },
  {
    slug: 'como-se-forma-un-habito',
    title: 'Cómo se forma un hábito neurológico',
    date: '2026-03-10',
    summary: 'Un hábito es un circuito neuronal automatizado en los ganglios basales. Saber cómo se forma es la clave para crear los que quieres y desactivar los que no.',
    content: `Todo hábito sigue el mismo patrón neurológico: señal, rutina, recompensa. Charles Duhigg lo popularizó, pero la biología detrás lleva décadas estudiada.

Los ganglios basales son las estructuras cerebrales responsables de automatizar comportamientos. Cuando repites una acción suficientes veces en un contexto similar, los ganglios basales "comprimen" la secuencia en un único paquete automático. El cerebro deja de pensar en cada paso y ejecuta el hábito como un bloque.

Esta es la razón por la que cambiar un hábito arraigado es tan difícil: no se puede borrar un circuito neuronal. Solo se puede reemplazar. El mismo disparador, la misma recompensa, pero una rutina diferente en medio. Si intentas eliminar el hábito sin sustituirlo, el cerebro sigue esperando la recompensa y el impulso vuelve.

Los hábitos también se anclan a contextos físicos. Investigaciones sobre cambios de hábito muestran que mudarse de ciudad o cambiar de trabajo facilitan la instalación de nuevos hábitos, porque los disparadores contextuales anteriores desaparecen. No tienes que esperar a mudarte, pero sí puedes cambiar deliberadamente el entorno en el que quieres instalar un hábito.

La clave no es la motivación. Es la repetición en el contexto correcto durante suficiente tiempo para que los ganglios basales tomen el control.`,
    exercise: 'Elige un hábito que quieras instalar. Define: (1) el disparador (qué situación o momento lo activa), (2) la rutina exacta que harás, (3) la recompensa inmediata que te darás. Practica la secuencia completa durante 14 días consecutivos. La automatización empieza a notarse entre los días 18 y 60.',
  },
  {
    slug: 'cortisol-y-estres-cronico',
    title: 'Cortisol y estrés crónico',
    date: '2026-03-17',
    summary: 'El estrés agudo te salva la vida. El estrés crónico te la acorta. Entender la diferencia y cómo salir del segundo es urgente.',
    content: `El cortisol es una hormona de supervivencia. En situaciones de peligro real, te da energía inmediata, agudiza los sentidos y suprime funciones no esenciales como la digestión y la inmunidad para que puedas huir o luchar. Hasta aquí, hace exactamente lo que debe.

El problema es el estrés crónico: cuando el sistema de alarma no se apaga porque los estímulos no cesan. Emails, deudas, conflictos relacionales, redes sociales. El cerebro no distingue entre una amenaza física y una narrativa mental sobre el futuro. Ambas producen cortisol.

Años de cortisol elevado tienen consecuencias documentadas: reducción del hipocampo (memoria y aprendizaje), deterioro de la corteza prefrontal (juicio y control emocional), supresión del sistema inmune, inflamación crónica y envejecimiento celular acelerado. El estrés crónico no solo te hace sentir mal. Te cambia físicamente.

La buena noticia es que los efectos son en gran parte reversibles con el tiempo y la práctica correcta. Estudios de neuroimagen muestran que el hipocampo puede recuperar volumen tras periodos sostenidos de reducción de estrés y práctica meditativa.

El primer paso no es relajarte. Es identificar qué fuentes de estrés son inevitables, cuáles son opcionales, y cuáles son fabricadas completamente por el pensamiento.`,
    exercise: 'Haz una lista de las tres principales fuentes de estrés en tu vida ahora mismo. Para cada una, clasifícala: (A) real y urgente, (B) real pero no urgente, (C) imaginaria o fabricada por pensamiento. Las de categoría C son el lugar donde el trabajo de presencia tiene más impacto inmediato.',
  },
  {
    slug: 'presencia-sin-meditacion-formal',
    title: 'Presencia sin meditación formal',
    date: '2026-03-24',
    summary: 'No necesitas cojín ni app ni treinta minutos libres para entrenar la presencia. Cualquier momento cotidiano es una oportunidad de práctica real.',
    content: `La meditación formal es valiosa, pero tiene un problema de accesibilidad: requiere tiempo, condiciones y disciplina que no todo el mundo puede mantener de forma consistente. La buena noticia es que la presencia no depende de la meditación formal.

La presencia informal consiste en usar los momentos cotidianos como anclajes de atención. Lavarte los dientes con atención total. Caminar sintiendo cada paso. Comer sin móvil, saboreando. Escuchar al otro sin preparar tu respuesta mientras habla. Cada uno de estos momentos activa el mismo músculo de atención que la meditación formal.

La diferencia con simplemente estar distraído radica en la intención deliberada. No es que "te pase" estar presente. Es que eliges llevar la atención a lo que está ocurriendo ahora, con todas sus dimensiones sensoriales.

Los estudios de Jon Kabat-Zinn y su programa MBSR (Reducción del Estrés Basada en Mindfulness) muestran que incluso la práctica informal sistemática produce cambios medibles en la actividad cerebral, el bienestar subjetivo y la respuesta al estrés en 8 semanas.

No hace falta esperar a tener tiempo. La práctica ocurre en los intersticios de tu día, en los momentos que normalmente rellenas con el móvil o el piloto automático.`,
    exercise: 'Elige tres momentos fijos del día (al despertar, al comer, antes de dormir) y conviértelos en "pausas de presencia" de 60 segundos: para, mira alrededor, siente tu cuerpo, escucha los sonidos. Sin teléfono, sin agenda. Solo observar lo que ya está. Durante dos semanas, sin fallar ningún día.',
  },
]

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
