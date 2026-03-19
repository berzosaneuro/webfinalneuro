import { getAIProvider } from '../providers/ai/index'
import { NormalizedMessage, ClassificationResult } from '../domain/message'
import { HistoryMessage } from '../domain/message'
import { RESPONSE_TEMPLATES } from '../config/responses'
import { createLogger } from '../utils/logger'

const log = createLogger('response-service')

export const responseService = {
  /**
   * Genera la respuesta final al usuario.
   * Intenta el proveedor de IA; si falla, usa plantilla estática.
   */
  async generate(
    message: NormalizedMessage,
    classification: ClassificationResult,
    history: HistoryMessage[],
    contactName?: string
  ): Promise<string> {
    const ai = getAIProvider()

    try {
      const response = await ai.generateResponse(message, classification, history, contactName)
      if (response && response.trim().length > 0) return response
    } catch (err) {
      log.error({ err }, 'Error en AI.generateResponse — usando plantilla estática')
    }

    // Fallback a plantilla estática
    return this.fromTemplate(classification.type, contactName)
  },

  /**
   * Devuelve una plantilla estática por tipo de mensaje.
   */
  fromTemplate(type: string, contactName?: string): string {
    const templates = (RESPONSE_TEMPLATES as unknown as Record<string, string | string[]>)[type]
      ?? RESPONSE_TEMPLATES.otro
    const arr = Array.isArray(templates) ? templates : [templates]
    const template = arr[Math.floor(Math.random() * arr.length)]
    const nombre = contactName ? `, ${contactName}` : ''
    return template.replace('{nombre}', nombre).replace('{contacto}', contactName ?? '')
  },
}
