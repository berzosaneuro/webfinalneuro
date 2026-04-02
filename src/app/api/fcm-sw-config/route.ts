import { getFirebaseWebConfig } from '@/lib/firebase-web-config'

export const dynamic = 'force-dynamic'

/**
 * Inyecta la config en el service worker de FCM (mismos valores que el cliente).
 * Solo expone datos ya pensados para ser públicos en apps web Firebase.
 */
export async function GET() {
  const config = getFirebaseWebConfig()
  const body = `self.__FIREBASE_FCM_CONFIG__=${JSON.stringify(config)};`
  return new Response(body, {
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
      'Cache-Control': 'public, max-age=300',
    },
  })
}
