import { prisma } from '../lib/prisma'
import { EscalationTrigger } from '../domain/message'
import { createLogger } from '../utils/logger'

const log = createLogger('conversation-repository')

export const conversationRepository = {
  /**
   * Busca la conversación activa de un contacto o crea una nueva.
   */
  async getOrCreate(contactId: string) {
    const existing = await prisma.conversation.findFirst({
      where: { contactId, status: 'active' },
      orderBy: { createdAt: 'desc' },
    })

    if (existing) return existing

    return prisma.conversation.create({
      data: { contactId },
    })
  },

  async findById(id: string) {
    return prisma.conversation.findUnique({ where: { id } })
  },

  /**
   * Marca una conversación como escalada y registra el motivo.
   */
  async escalate(conversationId: string, reason: string, trigger: EscalationTrigger) {
    const [conversation] = await Promise.all([
      prisma.conversation.update({
        where: { id: conversationId },
        data: {
          status: 'escalated',
          escalatedAt: new Date(),
          escalationReason: reason,
          escalationTrigger: trigger,
        },
      }),
      prisma.escalationLog.create({
        data: {
          conversationId,
          contactPhone: '',  // Se rellena en el servicio con la info del contacto
          reason,
          trigger,
        },
      }),
    ])
    return conversation
  },

  /**
   * Incrementa el contador de fallos consecutivos.
   * Se resetea cuando el usuario envía un mensaje que se clasifica correctamente.
   */
  async incrementFailureCount(conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { failureCount: { increment: 1 } },
    })
  },

  async resetFailureCount(conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { failureCount: 0 },
    })
  },

  async close(conversationId: string) {
    return prisma.conversation.update({
      where: { id: conversationId },
      data: { status: 'closed' },
    })
  },
}
