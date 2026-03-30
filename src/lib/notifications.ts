/**
 * Notification Service Layer — Berzosa Neuro
 *
 * Preparado para futuras notificaciones push.
 * NO implementa push aún. Esta capa define la interfaz y estructura.
 *
 * Uso futuro:
 * - Mensaje diario del mentor (Elías)
 * - Recordatorio de meditación
 * - Recordatorio de continuación del reto (7 días / 21 días)
 *
 * Cuando se implemente push:
 * 1. Añadir permiso y suscripción del usuario
 * 2. Integrar con servicio de push (OneSignal, Firebase, etc.)
 * 3. Implementar scheduleDailyMentor, scheduleMeditationReminder, scheduleChallengeReminder
 */

export type NotificationType =
  | 'daily_mentor'
  | 'meditation_reminder'
  | 'challenge_continuation_reminder'

export type NotificationPayload = {
  type: NotificationType
  title: string
  body: string
  url?: string
  scheduledFor?: Date
}

/** Horarios sugeridos para recordatorios (sin implementar aún) */
export const SUGGESTED_REMINDER_TIMES = {
  morning: '08:00',
  afternoon: '14:00',
  evening: '20:00',
} as const

/** Plantillas de mensajes (para uso futuro) */
export const NOTIFICATION_TEMPLATES: Record<NotificationType, { title: string; body: string }> = {
  daily_mentor: {
    title: 'Mensaje de Elías',
    body: 'Un momento para tu práctica. Tu cerebro necesita repetición para cambiar.',
  },
  meditation_reminder: {
    title: 'Hora de meditar',
    body: '3 minutos pueden cambiar tu día. ¿Te animas?',
  },
  challenge_continuation_reminder: {
    title: 'Sigue con tu reto',
    body: 'Un día más. El cambio de verdad se construye con constancia.',
  },
}

/**
 * Programa un recordatorio (placeholder — no ejecuta nada aún).
 * En el futuro: registrar con el servicio de push.
 */
export function scheduleReminder(
  type: NotificationType,
  _scheduledTime?: Date
): Promise<boolean> {
  const template = NOTIFICATION_TEMPLATES[type]
  // Placeholder: simular éxito. Aquí se integrará el servicio real.
  console.debug('[notifications] scheduleReminder:', type, template.title)
  return Promise.resolve(true)
}

/**
 * Cancela un recordatorio programado (placeholder).
 */
export function cancelReminder(_type: NotificationType): Promise<void> {
  return Promise.resolve()
}

/**
 * Comprueba si las notificaciones están soportadas y permitidas.
 */
export function areNotificationsSupported(): boolean {
  if (typeof window === 'undefined') return false
  return 'Notification' in window && 'serviceWorker' in navigator
}
