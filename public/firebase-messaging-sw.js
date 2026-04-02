/* eslint-disable no-undef */
/**
 * Service Worker para Firebase Cloud Messaging (fondo).
 * Versión compat alineada con firebase@^11.10 en package.json.
 * Scope de registro: /firebase-cloud-messaging-push-scope (evita solapar /sw.js del PWA).
 */
importScripts('/api/fcm-sw-config')
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-app-compat.js')
importScripts('https://www.gstatic.com/firebasejs/11.10.0/firebase-messaging-compat.js')

firebase.initializeApp(self.__FIREBASE_FCM_CONFIG__)

const messaging = firebase.messaging()

messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title || 'Berzosa Neuro'
  const options = {
    body: payload.notification?.body || '',
    icon: '/icons/logo.png',
    badge: '/icons/logo.png',
    data: payload.data || {},
  }
  return self.registration.showNotification(title, options)
})
