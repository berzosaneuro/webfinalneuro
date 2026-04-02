/** Configuración web de Firebase (Console → Configuración del proyecto → Tus apps). Solo variables NEXT_PUBLIC. */
export function getFirebaseWebConfig(): Record<string, string> {
  return {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || '',
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || '',
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || '',
  }
}

export function isFirebaseWebConfigComplete(): boolean {
  const c = getFirebaseWebConfig()
  return Boolean(
    c.apiKey && c.projectId && c.messagingSenderId && c.appId && c.authDomain
  )
}
