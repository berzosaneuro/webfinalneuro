/**
 * Daily Training Program notification service.
 * ADD-ONLY: Uses existing notification infrastructure when available.
 * Independent from existing meditation flows.
 */

import { scheduleReminder } from '@/lib/notifications'

/**
 * Sends a daily training notification to the user.
 * Uses Web Notifications API when permitted, or schedules via existing infrastructure.
 */
export async function sendDailyNotification(userId: string, message: string): Promise<boolean> {
  if (typeof window === 'undefined') {
    return false
  }

  if (!('Notification' in window)) {
    return false
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification('Berzosa Neuro — Práctica del día', {
        body: message,
        icon: '/icons/logo.png',
      })
      return true
    } catch {
      return false
    }
  }

  if (Notification.permission === 'default') {
    const permission = await Notification.requestPermission()
    if (permission === 'granted') {
      try {
        new Notification('Berzosa Neuro — Práctica del día', {
          body: message,
          icon: '/icons/logo.png',
        })
        return true
      } catch {
        return false
      }
    }
  }

  scheduleReminder('daily_mentor').catch(() => {})
  return false
}

/** Example notification messages for the Daily Training Program */
export const EXAMPLE_NOTIFICATIONS = [
  'Día 1/21: 7min observa pensamientos. Empieza ahora',
  '4 días de racha. Día 5 te espera (8min)',
  'El retorno reconfigura el cerebro. 6min listos',
  'Noche: 10min reset sistema nervioso',
  '120min total. Día 7 stress (9min)',
]
