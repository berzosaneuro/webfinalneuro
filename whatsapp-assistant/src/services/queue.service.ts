/**
 * Cola de mensajes desacoplada.
 *
 * Implementación "memory": FIFO en memoria, útil para desarrollo y MVP.
 * Para producción con volumen, sustituye por BullMQ + Redis cambiando
 * QUEUE_PROVIDER=redis en .env (el contrato de la interfaz no cambia).
 */

import { NormalizedMessage } from '../domain/message'
import { createLogger } from '../utils/logger'

const log = createLogger('queue-service')

type QueueJob = {
  id: string
  message: NormalizedMessage
  attempts: number
  addedAt: Date
}

type JobHandler = (job: QueueJob) => Promise<void>

class InMemoryQueue {
  private queue: QueueJob[] = []
  private processing = false
  private handler: JobHandler | null = null

  process(handler: JobHandler) {
    this.handler = handler
    setImmediate(() => this.runLoop())
  }

  async add(message: NormalizedMessage): Promise<string> {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
    this.queue.push({ id, message, attempts: 0, addedAt: new Date() })
    log.debug({ id, from: message.from }, 'Mensaje encolado')
    if (!this.processing) {
      setImmediate(() => this.runLoop())
    }
    return id
  }

  private async runLoop() {
    if (this.processing || !this.handler) return
    this.processing = true

    while (this.queue.length > 0) {
      const job = this.queue.shift()!
      try {
        job.attempts++
        await this.handler(job)
      } catch (err) {
        log.error({ err, jobId: job.id, attempts: job.attempts }, 'Error procesando mensaje de la cola')
        // Reintento hasta 3 veces con backoff simple
        if (job.attempts < 3) {
          setTimeout(() => this.queue.unshift(job), job.attempts * 1000)
        } else {
          log.error({ jobId: job.id }, 'Job descartado tras 3 intentos')
        }
      }
    }

    this.processing = false
  }

  get size() { return this.queue.length }
}

// Singleton
export const messageQueue = new InMemoryQueue()
