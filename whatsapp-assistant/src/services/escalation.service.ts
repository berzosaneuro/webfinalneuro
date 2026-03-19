import { conversationRepository } from '../repositories/conversation.repository'
import { prisma } from '../lib/prisma'
import { EscalationTrigger } from '../domain/message'
import { env } from '../config/env'
import { createLogger } from '../utils/logger'

const log = createLogger('escalation-service')

export const escalationService = {
  /**
   * Evalúa si una conversación debe escalarse basándose en el contador de fallos.
   */
  shouldEscalateByFailures(failureCount: number): boolean {
    return failureCount >= env.ESCALATION_FAILURE_LIMIT
  },

  /**
   * Ejecuta el escalado:
   * 1. Marca la conversación como "escalated"
   * 2. Crea el log de escalado con el motivo
   * 3. Detiene respuestas automáticas (la conversación escalada no se procesa más)
   */
  async escalate(params: {
    conversationId: string
    contactPhone: string
    reason: string
    trigger: EscalationTrigger
  }): Promise<void> {
    const { conversationId, contactPhone, reason, trigger } = params

    log.warn({ conversationId, contactPhone, trigger }, `Escalando conversación: ${reason}`)

    await conversationRepository.escalate(conversationId, reason, trigger)

    // Actualizar el log de escalado con el teléfono del contacto
    await prisma.escalationLog.updateMany({
      where: { conversationId },
      data: { contactPhone },
    })
  },

  /**
   * Comprueba si una conversación ya está escalada (no debe procesarse automáticamente).
   */
  isEscalated(status: string): boolean {
    return status === 'escalated'
  },

  /**
   * Lista conversaciones escaladas pendientes de revisión humana.
   */
  async listPending() {
    return prisma.escalationLog.findMany({
      where: { resolvedAt: null },
      orderBy: { createdAt: 'asc' },
    })
  },

  /**
   * Marca un escalado como resuelto (tras atención humana).
   */
  async resolve(escalationLogId: string, resolvedBy: string, notes?: string) {
    return prisma.escalationLog.update({
      where: { id: escalationLogId },
      data: { resolvedAt: new Date(), resolvedBy, notes },
    })
  },
}
