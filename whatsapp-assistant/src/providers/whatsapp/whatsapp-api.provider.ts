/**
 * Proveedor: WhatsApp Business API (Meta Cloud API)
 *
 * Requisitos:
 * - Cuenta de Meta for Developers
 * - App con WhatsApp Business API activada
 * - Phone Number ID y Access Token configurados
 *
 * Ventajas: Producción real, estable, soportado oficialmente.
 * Limitación: Requiere número verificado por Meta y aprobación de plantillas
 *             para mensajes iniciados por la empresa.
 */

import axios from 'axios'
import { WhatsAppProvider } from './index'
import { env } from '../../config/env'
import { createLogger } from '../../utils/logger'

const log = createLogger('whatsapp-api-provider')

export class WhatsAppApiProvider implements WhatsAppProvider {
  private baseUrl: string
  private phoneNumberId: string
  private accessToken: string

  constructor() {
    if (!env.WHATSAPP_API_URL || !env.WHATSAPP_PHONE_NUMBER_ID || !env.WHATSAPP_ACCESS_TOKEN) {
      log.warn('WhatsApp API provider configurado sin credenciales completas — modo simulación activo')
    }
    this.baseUrl = env.WHATSAPP_API_URL ?? 'https://graph.facebook.com/v20.0'
    this.phoneNumberId = env.WHATSAPP_PHONE_NUMBER_ID ?? ''
    this.accessToken = env.WHATSAPP_ACCESS_TOKEN ?? ''
  }

  async sendText(to: string, text: string): Promise<void> {
    // Modo simulación cuando no hay credenciales (útil en desarrollo local)
    if (!this.phoneNumberId || !this.accessToken) {
      log.info({ to, text }, '[SIMULACIÓN] Mensaje que se enviaría por WhatsApp')
      return
    }

    try {
      const url = `${this.baseUrl}/${this.phoneNumberId}/messages`
      await axios.post(
        url,
        {
          messaging_product: 'whatsapp',
          to,
          type: 'text',
          text: { body: text },
        },
        {
          headers: {
            Authorization: `Bearer ${this.accessToken}`,
            'Content-Type': 'application/json',
          },
          timeout: 10_000,
        }
      )
      log.debug({ to }, 'Mensaje enviado correctamente')
    } catch (err: any) {
      const detail = err?.response?.data ?? err?.message
      log.error({ err: detail, to }, 'Error enviando mensaje por WhatsApp API')
      throw new Error(`Error al enviar mensaje: ${JSON.stringify(detail)}`)
    }
  }

  /**
   * Verificación del webhook según el protocolo de Meta.
   * GET /webhook?hub.mode=subscribe&hub.verify_token=XXX&hub.challenge=YYY
   */
  verifyWebhook(query: Record<string, string>): string | null {
    const mode = query['hub.mode']
    const token = query['hub.verify_token']
    const challenge = query['hub.challenge']

    if (mode === 'subscribe' && token === env.WHATSAPP_VERIFY_TOKEN) {
      log.info('Webhook verificado correctamente')
      return challenge ?? null
    }

    log.warn({ receivedToken: token }, 'Verificación de webhook fallida')
    return null
  }
}
