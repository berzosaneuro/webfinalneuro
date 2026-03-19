import { FastifyInstance } from 'fastify'
import {
  handleWebhookVerify,
  handleWebhookMessage,
  handleWebhookTest,
} from '../controllers/webhook.controller'

export async function webhookRoutes(app: FastifyInstance) {
  // Meta verifica el webhook con GET al registrarlo
  app.get('/webhook', handleWebhookVerify)

  // Mensajes entrantes en tiempo real
  app.post('/webhook', handleWebhookMessage)

  // Endpoint de prueba local (no exponer en producción sin auth)
  app.post('/webhook/test', handleWebhookTest)
}
