'use client'

import { useEffect } from 'react'
import { getFirebaseWebConfig, isFirebaseWebConfigComplete } from '@/lib/firebase-web-config'

const FCM_SW_SCOPE = '/firebase-cloud-messaging-push-scope/'

/**
 * Inicializa Firebase Messaging solo en el navegador (sin SSR).
 * Registra firebase-messaging-sw.js en un scope propio para no interferir con /sw.js del PWA.
 */
export default function FirebaseMessagingRegister() {
  useEffect(() => {
    if (typeof window === 'undefined') return

    void (async () => {
      if (!isFirebaseWebConfigComplete()) {
        console.warn(
          '[FCM] Config incompleta: define NEXT_PUBLIC_FIREBASE_* en .env (ver .env.local.example)'
        )
        return
      }

      const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY?.trim()
      if (!vapidKey) {
        console.warn('[FCM] Falta NEXT_PUBLIC_FIREBASE_VAPID_KEY (Console → Cloud Messaging → certificado web push)')
        return
      }

      try {
        const { initializeApp, getApps } = await import('firebase/app')
        const { getMessaging, getToken, isSupported } = await import('firebase/messaging')

        const supported = await isSupported()
        if (!supported) {
          console.log('[FCM] Messaging no soportado en este navegador o entorno')
          return
        }

        const config = getFirebaseWebConfig()
        const app = getApps().length > 0 ? getApps()[0]! : initializeApp(config)
        const messaging = getMessaging(app)

        const permission = await Notification.requestPermission()
        if (permission === 'granted') {
          console.log('[FCM] Permiso de notificaciones: concedido')
        } else if (permission === 'denied') {
          console.log('[FCM] Permiso de notificaciones: denegado')
          return
        } else {
          console.log('[FCM] Permiso de notificaciones: pendiente / no concedido')
          return
        }

        const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js', {
          scope: FCM_SW_SCOPE,
        })
        await navigator.serviceWorker.ready

        console.log('[FCM] Llamando a getToken…')
        const token = await getToken(messaging, {
          vapidKey,
          serviceWorkerRegistration: registration,
        })

        if (token) {
          if (process.env.NODE_ENV === 'development') {
            console.log('[FCM] Token FCM obtenido (longitud)', token.length)
          }
        } else {
          console.warn('[FCM] No se obtuvo token (revisa VAPID y permisos)')
        }
      } catch (err) {
        console.error('[FCM] Error', err)
      }
    })()
  }, [])

  return null
}
