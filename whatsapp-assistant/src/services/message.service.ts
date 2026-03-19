/**
 * Servicio principal de orquestación.
 *
 * Flujo completo por mensaje entrante:
 * 1. Upsert del contacto
 * 2. Obtener o crear conversación activa
 * 3. Guardar mensaje del usuario
 * 4. Si la conversación está escalada → no responder automáticamente
 * 5. Obtener historial reciente
 * 6. Clasificar el mensaje
 * 7. Evaluar si escalar (por clasificación + fallos acumulados + frustración)
 * 8. Si escala → enviar aviso + marcar + detener
 * 9. Si no escala → generar respuesta + enviar + guardar
 */

import { NormalizedMessage } from '../domain/message'
import { contactRepository } from '../repositories/contact.repository'
import { conversationRepository } from '../repositories/conversation.repository'
import { messageRepository } from '../repositories/message.repository'
import { historyService } from './history.service'
import { escalationService } from './escalation.service'
import { responseService } from './response.service'
import { getAIProvider } from '../providers/ai/index'
import { getWhatsAppProvider } from '../providers/whatsapp/index'
import { RESPONSE_TEMPLATES } from '../config/responses'
import { createLogger } from '../utils/logger'

const log = createLogger('message-service')

export async function processMessage(message: NormalizedMessage): Promise<void> {
  const wa = getWhatsAppProvider()
  const ai = getAIProvider()

  log.info({ from: message.from, body: message.body.substring(0, 80) }, 'Procesando mensaje')

  // ── 1. Contacto ────────────────────────────────────────────────────────────
  const contact = await contactRepository.upsert(message.from, message.fromName)

  // ── 2. Conversación ────────────────────────────────────────────────────────
  const conversation = await conversationRepository.getOrCreate(contact.id)

  // ── 3. Guardar mensaje del usuario ────────────────────────────────────────
  await messageRepository.save({
    conversationId: conversation.id,
    role: 'user',
    content: message.body,
    rawPayload: message.rawPayload,
  })

  // ── 4. Si ya está escalada, no responder ──────────────────────────────────
  if (escalationService.isEscalated(conversation.status)) {
    log.info({ conversationId: conversation.id }, 'Conversación escalada — sin respuesta automática')
    return
  }

  // ── 5. Historial ──────────────────────────────────────────────────────────
  const history = await historyService.getRecent(conversation.id, 10)

  // ── 6. Clasificación ──────────────────────────────────────────────────────
  const classification = await ai.classify(message, history)

  await messageRepository.save({
    conversationId: conversation.id,
    role: 'user',
    content: message.body,
    messageType: classification.type,
    confidence: classification.confidence,
  }).catch(() => {}) // ya guardado arriba, aquí solo actualizamos metadatos si conviene

  // Actualizar el tipo en el mensaje ya guardado (opción alternativa: upsert)
  // Por simplicidad en MVP dejamos el mensaje sin tipo y guardamos el tipo en el log

  // ── 7. Evaluación de escalado ─────────────────────────────────────────────
  const updatedConv = await conversationRepository.findById(conversation.id)
  const currentFailures = updatedConv?.failureCount ?? 0

  const escalateByFailures = escalationService.shouldEscalateByFailures(currentFailures)
  const shouldEscalate = classification.shouldEscalate || escalateByFailures

  if (shouldEscalate) {
    const trigger = escalateByFailures ? 'consecutive_failures' : (classification.escalateReason ?? 'low_confidence')
    const reason = buildEscalationReason(trigger)

    await escalationService.escalate({
      conversationId: conversation.id,
      contactPhone: contact.phone,
      reason,
      trigger: trigger as any,
    })

    // Mensaje de aviso al usuario
    const noticeKey = trigger === 'user_request' ? 'escalation_user_request' : 'escalation_notice'
    const notice = RESPONSE_TEMPLATES[noticeKey as keyof typeof RESPONSE_TEMPLATES] as string
    await wa.sendText(message.from, notice)

    await messageRepository.save({
      conversationId: conversation.id,
      role: 'assistant',
      content: notice,
    })

    log.warn({ conversationId: conversation.id, trigger }, 'Conversación escalada')
    return
  }

  // ── 8. Reset de fallos si la clasificación fue exitosa ────────────────────
  if (classification.confidence >= 0.65) {
    await conversationRepository.resetFailureCount(conversation.id)
  } else {
    await conversationRepository.incrementFailureCount(conversation.id)
  }

  // ── 9. Generar y enviar respuesta ─────────────────────────────────────────
  try {
    const responseText = await responseService.generate(
      message,
      classification,
      history,
      contact.name ?? undefined
    )

    await wa.sendText(message.from, responseText)

    await messageRepository.save({
      conversationId: conversation.id,
      role: 'assistant',
      content: responseText,
      messageType: classification.type,
    })

    log.info({ from: message.from, type: classification.type }, 'Respuesta enviada')
  } catch (err) {
    log.error({ err, from: message.from }, 'Error enviando respuesta — incrementando contador de fallos')
    await conversationRepository.incrementFailureCount(conversation.id)

    // Enviar mensaje de error genérico
    await wa.sendText(message.from, RESPONSE_TEMPLATES.error_generic).catch(() => {})
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildEscalationReason(trigger: string): string {
  const reasons: Record<string, string> = {
    user_request: 'El usuario solicitó hablar con un agente humano',
    low_confidence: 'Baja confianza en la clasificación del mensaje',
    frustration: 'Se detectó frustración o queja grave en el mensaje',
    complaint: 'Queja grave detectada',
    consecutive_failures: `Superado el límite de fallos consecutivos`,
  }
  return reasons[trigger] ?? 'Razón desconocida'
}
