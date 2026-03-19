/**
 * Proveedor de IA basado en reglas — fallback sin dependencia externa.
 * Funciona siempre, incluso sin ANTHROPIC_API_KEY.
 */

import { AIProvider } from './index'
import { ClassificationResult, NormalizedMessage, MessageType } from '../../domain/message'
import { HistoryMessage } from '../../domain/message'
import {
  CLASSIFICATION_KEYWORDS,
  ESCALATION_KEYWORDS,
  FRUSTRATION_KEYWORDS,
  RESPONSE_TEMPLATES,
} from '../../config/responses'
import { createLogger } from '../../utils/logger'
import { interpolate } from '../../utils/normalizer'

const log = createLogger('rules-provider')

export class RulesProvider implements AIProvider {
  async classify(message: NormalizedMessage, _history: HistoryMessage[]): Promise<ClassificationResult> {
    const text = message.body.toLowerCase()

    // Detectar petición de escalado por el usuario
    if (ESCALATION_KEYWORDS.some((kw) => text.includes(kw))) {
      return { type: 'otro', confidence: 0.9, shouldEscalate: true, escalateReason: 'user_request' }
    }

    // Detectar frustración
    if (FRUSTRATION_KEYWORDS.some((kw) => text.includes(kw))) {
      return { type: 'queja', confidence: 0.85, shouldEscalate: true, escalateReason: 'frustration' }
    }

    // Clasificar por palabras clave
    const scores: Record<string, number> = {}
    for (const [type, keywords] of Object.entries(CLASSIFICATION_KEYWORDS)) {
      scores[type] = keywords.filter((kw) => text.includes(kw)).length
    }

    const sorted = Object.entries(scores).sort(([, a], [, b]) => b - a)
    const [bestType, bestScore] = sorted[0]

    if (bestScore === 0) {
      log.debug('No se encontraron palabras clave — clasificando como "otro"')
      return { type: 'otro', confidence: 0.4, shouldEscalate: false }
    }

    const total = Object.values(scores).reduce((a, b) => a + b, 0) || 1
    const confidence = Math.min(0.85, bestScore / total + 0.3)

    return {
      type: bestType as MessageType,
      confidence,
      shouldEscalate: confidence < 0.5,
      escalateReason: confidence < 0.5 ? 'low_confidence' : undefined,
    }
  }

  async generateResponse(
    _message: NormalizedMessage,
    classification: ClassificationResult,
    _history: HistoryMessage[],
    contactName?: string
  ): Promise<string> {
    const templates = RESPONSE_TEMPLATES[classification.type] as unknown as string | string[]
    const templateArr = Array.isArray(templates) ? templates : [templates]
    const template = templateArr[Math.floor(Math.random() * templateArr.length)]

    const nameStr = contactName ? `, ${contactName}` : ''
    return interpolate(template, { nombre: nameStr, contacto: contactName ?? '' })
  }
}
