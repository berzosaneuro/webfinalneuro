/**
 * Worker: procesa los jobs de la cola de mensajes.
 * Se inicializa una sola vez al arrancar el servidor.
 */

import { messageQueue } from '../services/queue.service'
import { processMessage } from '../services/message.service'
import { createLogger } from '../utils/logger'

const log = createLogger('message-worker')

export function startMessageWorker() {
  log.info('Worker de mensajes iniciado')

  messageQueue.process(async (job) => {
    const { id, message, attempts } = job
    log.debug({ id, from: message.from, attempts }, 'Procesando job')

    await processMessage(message)

    log.debug({ id }, 'Job completado')
  })
}
