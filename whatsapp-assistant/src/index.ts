/**
 * Punto de entrada de la aplicación.
 * Orden de arranque:
 * 1. Validar variables de entorno (en config/env.ts al importar)
 * 2. Iniciar el worker de mensajes
 * 3. Iniciar el servidor HTTP
 */

import { startServer } from './app/server'
import { startMessageWorker } from './workers/message.worker'
import { createLogger } from './utils/logger'

const log = createLogger('bootstrap')

async function main() {
  log.info('Iniciando WhatsApp AI Assistant...')

  // Iniciar el worker antes del servidor para que la cola esté lista
  startMessageWorker()

  await startServer()
}

main().catch((err) => {
  console.error('Error fatal al iniciar la aplicación:', err)
  process.exit(1)
})
