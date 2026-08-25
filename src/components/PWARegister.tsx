'use client'

import { useEffect } from 'react'

export default function PWARegister() {
  useEffect(() => {
    if (!('serviceWorker' in navigator)) return

    let registration: ServiceWorkerRegistration | null = null

    navigator.serviceWorker
      .register('/sw.js')
      .then((reg) => {
        registration = reg
        // Fuerza una comprobación de actualización inmediata al abrir la app,
        // en vez de esperar a que iOS decida revisarlo por su cuenta (puede
        // tardar horas/días y a veces no lo hace hasta que fuerzas un cierre
        // total). Esto es clave para que dispositivos con un service worker
        // antiguo atascado se arreglen solos lo antes posible.
        reg.update().catch(() => {})
      })
      .catch(() => {})

    // Vuelve a comprobar cada vez que la app pasa a primer plano (abrir desde
    // el icono, volver de segundo plano, etc.) — es el momento en el que el
    // usuario más nota si algo va desactualizado.
    const onVisible = () => {
      if (document.visibilityState === 'visible') {
        registration?.update().catch(() => {})
      }
    }
    document.addEventListener('visibilitychange', onVisible)

    // Red de seguridad: revisa también cada 5 minutos mientras la app
    // permanezca abierta, por si el usuario la deja abierta mucho rato.
    const interval = setInterval(() => {
      registration?.update().catch(() => {})
    }, 5 * 60 * 1000)

    return () => {
      document.removeEventListener('visibilitychange', onVisible)
      clearInterval(interval)
    }
  }, [])

  return null
}
