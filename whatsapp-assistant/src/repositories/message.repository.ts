import { prisma } from '../lib/prisma'
import { MessageRole, MessageType } from '../domain/message'
import { HistoryMessage } from '../domain/message'
import { createLogger } from '../utils/logger'

const log = createLogger('message-repository')

export const messageRepository = {
  async save(params: {
    conversationId: string
    role: MessageRole
    content: string
    messageType?: MessageType
    confidence?: number
    rawPayload?: unknown
  }) {
    return prisma.message.create({
      data: {
        conversationId: params.conversationId,
        role: params.role,
        content: params.content,
        messageType: params.messageType,
        confidence: params.confidence,
        rawPayload: params.rawPayload ? JSON.stringify(params.rawPayload) : undefined,
      },
    })
  },

  /**
   * Recupera los últimos N mensajes de una conversación para el historial.
   */
  async getRecentHistory(conversationId: string, limit = 10): Promise<HistoryMessage[]> {
    const messages = await prisma.message.findMany({
      where: { conversationId },
      orderBy: { sentAt: 'desc' },
      take: limit,
      select: { role: true, content: true, sentAt: true },
    })

    // Invertir para orden cronológico ascendente
    return messages.reverse().map((m) => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
      sentAt: m.sentAt,
    }))
  },

  async countByConversation(conversationId: string) {
    return prisma.message.count({ where: { conversationId } })
  },
}
