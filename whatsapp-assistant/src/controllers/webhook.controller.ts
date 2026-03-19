import { FastifyRequest, FastifyReply } from 'fastify'
import { messageQueue } from '../services/queue.service'
import { normalizeWhatsAppApiPayload } from '../utils/normalizer'
import { getWhatsAppProvider } from '../providers/whatsapp/index'
import { createLogger } from '../utils/logger'

const log = createLogger('webhook-controller')

// ─── GET /webhook — Verificación de Meta ─────────────────────────────────────
export async function handleWebhookVerify(
  req: FastifyRequest<{ Querystring: Record<string, string> }>,
  reply: FastifyReply
) {
  const provider = getWhatsAppProvider()

  if (!provider.verifyWebhook) {
    return reply.status(404).send('No soportado')
  }

  const challenge = provider.verifyWebhook(req.query as Record<string, string>)
  if (challenge) {
    return reply.status(200).send(challenge)
  }

  log.warn({ query: req.query }, 'Verificación de webhook fallida')
  return reply.status(403).send('Forbidden')
}

// ─── POST /webhook — Recepción de mensajes ────────────────────────────────────
export async function handleWebhookMessage(
  req: FastifyRequest<{ Body: Record<string, unknown> }>,
  reply: FastifyReply
) {
  // WhatsApp espera 200 OK inmediato para evitar reenvíos
  reply.status(200).send({ status: 'ok' })

  const body = req.body

  // Ignorar eventos que no son mensajes (status updates, etc.)
  const entry = (body.entry as any[])?.[0]
  const changes = entry?.changes?.[0]
  const value = changes?.value

  if (!value?.messages) {
    log.debug('Webhook sin mensajes — ignorado')
    return
  }

  const normalized = normalizeWhatsAppApiPayload(body as Record<string, unknown>)

  if (!normalized) {
    log.warn('No se pudo normalizar el payload del webhook')
    return
  }

  // Solo procesar mensajes de texto por ahora
  if (normalized.mediaType !== 'text' || !normalized.body) {
    log.info({ from: normalized.from, type: normalized.mediaType }, 'Mensaje multimedia — ignorado en MVP')
    return
  }

  await messageQueue.add(normalized)
  log.info({ from: normalized.from }, 'Mensaje encolado desde webhook')
}

// ─── POST /webhook/test — Endpoint de prueba local ────────────────────────────
export async function handleWebhookTest(
  req: FastifyRequest<{ Body: { from: string; body: string; name?: string } }>,
  reply: FastifyReply
) {
  const { from, body, name } = req.body

  if (!from || !body) {
    return reply.status(400).send({ error: 'from y body son obligatorios' })
  }

  const normalized = {
    externalId: `test-${Date.now()}`,
    from,
    fromName: name,
    body,
    timestamp: Date.now() / 1000,
    mediaType: 'text' as const,
    rawPayload: req.body,
  }

  await messageQueue.add(normalized)
  log.info({ from, body }, 'Mensaje de prueba encolado')

  return reply.status(202).send({ status: 'queued', message: 'Mensaje encolado para procesamiento' })
}
