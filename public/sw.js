// Service worker "kill switch".
//
// public/sw.js dejó de existir en el repo en algún momento, pero el componente
// PWARegister.tsx sigue intentando registrarlo en cada carga. Los dispositivos que
// instalaron la app ANTES de que el archivo desapareciera se quedaron con un
// service worker antiguo activo y controlando la app, sirviendo código/caché
// viejos indefinidamente — cerrar la app o recargar no lo desregistra, solo
// borrar e instalar de nuevo la app lo arregla manualmente.
//
// Este archivo, al existir de nuevo, hace que esos dispositivos lo descarguen,
// y en vez de volver a cachear nada, se autodesregistra y limpia sus cachés.
// Así los dispositivos afectados se arreglan solos en su próxima visita, sin
// que el usuario tenga que borrar y reinstalar la app manualmente.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys()
      await Promise.all(keys.map((key) => caches.delete(key)))
      await self.registration.unregister()
      const clientsList = await self.clients.matchAll({ type: 'window' })
      clientsList.forEach((client) => client.navigate(client.url))
    })()
  )
})
