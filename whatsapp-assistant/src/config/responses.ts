// ─── Respuestas configurables ─────────────────────────────────────────────────
// Edita estas plantillas sin tocar la lógica del asistente.
// Las llaves {nombre}, {contacto} se sustituyen dinámicamente.

export const RESPONSE_TEMPLATES = {
  // ── Por tipo de mensaje ────────────────────────────────────────────────────
  saludo: [
    '¡Hola{nombre}! Soy el asistente de Berzosa Neuro. ¿En qué puedo ayudarte hoy?',
    '¡Buenas{nombre}! Estoy aquí para ayudarte. ¿Cuál es tu consulta?',
  ],

  consulta: [
    'Entendido, voy a buscar la información que necesitas sobre tu consulta.',
    'Déjame revisar eso para darte la mejor respuesta posible.',
  ],

  queja: [
    'Lamento que hayas tenido esta experiencia. Voy a escalar tu caso a un especialista humano que podrá atenderte mejor.',
  ],

  pedido: [
    'He recibido tu solicitud. Te confirmaré los próximos pasos en breve.',
    'Perfecto, procesando tu pedido ahora mismo.',
  ],

  otro: [
    'He recibido tu mensaje. ¿Podrías darme más detalles para poder ayudarte mejor?',
    'Entendido. ¿Puedes contarme más sobre lo que necesitas?',
  ],

  // ── Escalado a humano ─────────────────────────────────────────────────────
  escalation_notice: '🔔 Un agente humano se pondrá en contacto contigo lo antes posible. Mientras tanto, puedes seguir escribiéndonos.',

  escalation_user_request: '¡Claro! Te conecto con un agente humano ahora mismo. 👤',

  // ── Errores / fallback ────────────────────────────────────────────────────
  error_generic: 'Lo siento, ha ocurrido un error técnico. Por favor, inténtalo de nuevo en unos instantes.',

  unknown_type: 'Recibí tu mensaje. ¿Podrías explicarme un poco más para poder ayudarte?',

  // ── Fuera de servicio ─────────────────────────────────────────────────────
  out_of_hours: '⏰ Nuestro horario de atención es de lunes a viernes de 9:00 a 18:00 (hora Madrid). Te responderemos en cuanto abramos.',
} as const

export type ResponseTemplateKey = keyof typeof RESPONSE_TEMPLATES

// ─── Palabras clave de escalado por solicitud del usuario ─────────────────────
export const ESCALATION_KEYWORDS = [
  'agente', 'humano', 'persona', 'operador', 'hablar con alguien',
  'quiero hablar', 'llámame', 'llamada', 'urgente', 'emergencia',
  'esto es un problema grave', 'denunciar', 'queja formal',
]

// ─── Palabras clave de frustración/urgencia ───────────────────────────────────
export const FRUSTRATION_KEYWORDS = [
  'estoy harto', 'no funciona', 'mentira', 'estafadores', 'devuélveme',
  'esto es una vergüenza', 'inaceptable', 'os denuncio', 'fraude',
  'muy mal servicio', 'pésimo', 'fatal',
]

// ─── Palabras clave por tipo de mensaje ──────────────────────────────────────
export const CLASSIFICATION_KEYWORDS: Record<string, string[]> = {
  saludo: ['hola', 'buenos días', 'buenas tardes', 'buenas noches', 'hey', 'qué tal', 'saludos'],
  consulta: ['cómo', 'cuánto', 'qué es', 'información', 'me puedes decir', 'dónde', 'cuándo', 'precio', 'horario', 'disponible'],
  queja: ['queja', 'problema', 'mal', 'error', 'no funciona', 'fallo', 'incidencia', 'reclamación'],
  pedido: ['quiero', 'necesito', 'pedir', 'solicitar', 'comprar', 'contratar', 'reservar', 'apuntarme'],
}
