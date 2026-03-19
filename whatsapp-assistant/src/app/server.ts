import Fastify from 'fastify'
import { env } from '../config/env'
import { webhookRoutes } from '../routes/webhook.routes'
import { healthRoutes } from '../routes/health.routes'
import { createLogger } from '../utils/logger'

const log = createLogger('server')

export function buildServer() {
  const app = Fastify({
    logger: false, // Usamos pino directamente para tener control completo
    trustProxy: true,
  })

  // ── Plugins ────────────────────────────────────────────────────────────────
  app.register(import('@fastify/formbody'))

  // ── Middleware de logging ──────────────────────────────────────────────────
  app.addHook('onRequest', async (req) => {
    log.debug({ method: req.method, url: req.url }, '→ Request')
  })

  app.addHook('onResponse', async (req, reply) => {
    log.debug({ method: req.method, url: req.url, status: reply.statusCode }, '← Response')
  })

  // ── Rutas ─────────────────────────────────────────────────────────────────
  app.register(webhookRoutes)
  app.register(healthRoutes)

  // ── Manejo de errores global ───────────────────────────────────────────────
  app.setErrorHandler((err, req, reply) => {
    log.error({ err, url: req.url }, 'Error no capturado en request')
    reply.status(500).send({ error: 'Error interno del servidor' })
  })

  app.setNotFoundHandler((_req, reply) => {
    reply.status(404).send({ error: 'Ruta no encontrada' })
  })

  return app
}

export async function startServer() {
  const app = buildServer()

  try {
    await app.listen({ port: env.PORT, host: env.HOST })
    log.info(`🚀 Servidor iniciado en http://${env.HOST}:${env.PORT}`)
    log.info(`   Proveedor WhatsApp : ${env.WHATSAPP_PROVIDER}`)
    log.info(`   Proveedor IA       : ${env.AI_PROVIDER}`)
    log.info(`   Base de datos      : ${env.DATABASE_URL}`)
  } catch (err) {
    log.error({ err }, 'Error al iniciar el servidor')
    process.exit(1)
  }

  // Graceful shutdown
  const shutdown = async (signal: string) => {
    log.info({ signal }, 'Apagando servidor...')
    await app.close()
    process.exit(0)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT', () => shutdown('SIGINT'))

  return app
}
