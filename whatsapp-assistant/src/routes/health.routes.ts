import { FastifyInstance } from 'fastify'
import { prisma } from '../lib/prisma'
import { messageQueue } from '../services/queue.service'
import { env } from '../config/env'

export async function healthRoutes(app: FastifyInstance) {
  // Health check público — no expone datos sensibles
  app.get('/health', async (_req, reply) => {
    return reply.send({ status: 'ok', ts: new Date().toISOString() })
  })

  // Health check detallado — requiere token interno
  app.get('/health/details', async (req, reply) => {
    const token = (req.headers['x-internal-token'] as string) ?? ''
    if (token !== env.INTERNAL_API_TOKEN) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    let dbOk = false
    try {
      await prisma.$queryRaw`SELECT 1`
      dbOk = true
    } catch {}

    return reply.send({
      status: 'ok',
      ts: new Date().toISOString(),
      env: env.NODE_ENV,
      db: dbOk ? 'connected' : 'error',
      queue: { size: messageQueue.size, provider: env.QUEUE_PROVIDER },
      ai: env.AI_PROVIDER,
      whatsapp: env.WHATSAPP_PROVIDER,
    })
  })

  // Lista escalados pendientes — requiere token interno
  app.get('/admin/escalations', async (req, reply) => {
    const token = (req.headers['x-internal-token'] as string) ?? ''
    if (token !== env.INTERNAL_API_TOKEN) {
      return reply.status(401).send({ error: 'Unauthorized' })
    }

    const { escalationService } = await import('../services/escalation.service')
    const pending = await escalationService.listPending()
    return reply.send({ count: pending.length, escalations: pending })
  })
}
