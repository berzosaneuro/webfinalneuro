import Anthropic from '@anthropic-ai/sdk'
import { AIProvider } from './index'
import { ClassificationResult, NormalizedMessage } from '../../domain/message'
import { HistoryMessage } from '../../domain/message'
import { buildClassifyPrompt } from '../../prompts/classify.prompt'
import { buildResponsePrompt } from '../../prompts/respond.prompt'
import { env } from '../../config/env'
import { createLogger } from '../../utils/logger'

const log = createLogger('claude-provider')

export class ClaudeProvider implements AIProvider {
  private client: Anthropic

  constructor() {
    this.client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY })
  }

  async classify(message: NormalizedMessage, history: HistoryMessage[]): Promise<ClassificationResult> {
    const prompt = buildClassifyPrompt(message, history)

    try {
      const response = await this.client.messages.create({
        model: env.ANTHROPIC_MODEL,
        max_tokens: 256,
        messages: [{ role: 'user', content: prompt }],
      })

      const raw = (response.content[0] as any)?.text ?? '{}'
      const parsed = JSON.parse(raw.trim())

      // Validación básica del resultado
      const result: ClassificationResult = {
        type: ['saludo', 'consulta', 'queja', 'pedido', 'otro'].includes(parsed.type)
          ? parsed.type
          : 'otro',
        confidence: typeof parsed.confidence === 'number' ? Math.max(0, Math.min(1, parsed.confidence)) : 0.5,
        shouldEscalate: Boolean(parsed.shouldEscalate),
        escalateReason: parsed.escalateReason ?? undefined,
      }

      // Forzar escalado si la confianza está por debajo del umbral
      if (result.confidence < env.AI_CONFIDENCE_THRESHOLD && !result.shouldEscalate) {
        result.shouldEscalate = true
        result.escalateReason = 'low_confidence'
      }

      log.debug({ type: result.type, confidence: result.confidence }, 'Clasificación Claude')
      return result
    } catch (err) {
      log.error({ err }, 'Error en clasificación Claude — usando fallback')
      // Fallback seguro: clasificar como "otro" con confianza baja para escalar
      return { type: 'otro', confidence: 0.3, shouldEscalate: true, escalateReason: 'low_confidence' }
    }
  }

  async generateResponse(
    message: NormalizedMessage,
    classification: ClassificationResult,
    history: HistoryMessage[],
    contactName?: string
  ): Promise<string> {
    const prompt = buildResponsePrompt(message, classification, history, contactName)

    try {
      const response = await this.client.messages.create({
        model: env.ANTHROPIC_MODEL,
        max_tokens: 512,
        messages: [{ role: 'user', content: prompt }],
      })

      const text = (response.content[0] as any)?.text?.trim() ?? ''
      log.debug({ length: text.length }, 'Respuesta generada por Claude')
      return text
    } catch (err) {
      log.error({ err }, 'Error generando respuesta Claude')
      throw err
    }
  }
}
