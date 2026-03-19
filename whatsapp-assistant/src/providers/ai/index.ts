// ─── Interfaz del proveedor de IA ─────────────────────────────────────────────
// Desacoplado del canal de WhatsApp y de la lógica de negocio.
// Para cambiar de Claude a GPT-4, Gemini, etc., solo hay que implementar esta interfaz.

import { ClassificationResult, NormalizedMessage } from '../../domain/message'
import { HistoryMessage } from '../../domain/message'

export interface AIProvider {
  /**
   * Clasifica el tipo de mensaje y devuelve confianza + flag de escalado.
   */
  classify(message: NormalizedMessage, history: HistoryMessage[]): Promise<ClassificationResult>

  /**
   * Genera una respuesta contextual basada en el mensaje y el historial.
   */
  generateResponse(
    message: NormalizedMessage,
    classification: ClassificationResult,
    history: HistoryMessage[],
    contactName?: string
  ): Promise<string>
}

// ─── Factory ──────────────────────────────────────────────────────────────────
import { env } from '../../config/env'
import { ClaudeProvider } from './claude.provider'
import { RulesProvider } from './rules.provider'
import { createLogger } from '../../utils/logger'

const log = createLogger('ai-provider-factory')
let _instance: AIProvider | null = null

export function getAIProvider(): AIProvider {
  if (_instance) return _instance

  if (env.AI_PROVIDER === 'claude' && env.ANTHROPIC_API_KEY) {
    log.info('Proveedor de IA: Claude')
    _instance = new ClaudeProvider()
  } else {
    if (env.AI_PROVIDER === 'claude' && !env.ANTHROPIC_API_KEY) {
      log.warn('ANTHROPIC_API_KEY no configurado — usando fallback basado en reglas')
    } else {
      log.info('Proveedor de IA: Reglas (sin IA)')
    }
    _instance = new RulesProvider()
  }

  return _instance
}
