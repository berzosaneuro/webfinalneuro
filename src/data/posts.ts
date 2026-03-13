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

export function getPostBySlug(slug: string): Post | undefined {
  return posts.find((p) => p.slug === slug)
}
