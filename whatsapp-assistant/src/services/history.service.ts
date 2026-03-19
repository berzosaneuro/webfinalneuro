import { messageRepository } from '../repositories/message.repository'
import { HistoryMessage } from '../domain/message'

/**
 * Servicio de historial de conversación.
 * Abstrae la capa de persistencia del resto de servicios.
 */
export const historyService = {
  /**
   * Devuelve los últimos N mensajes de una conversación en orden cronológico.
   * Se usa para dar contexto al clasificador y al generador de respuestas.
   */
  async getRecent(conversationId: string, limit = 10): Promise<HistoryMessage[]> {
    return messageRepository.getRecentHistory(conversationId, limit)
  },
}
