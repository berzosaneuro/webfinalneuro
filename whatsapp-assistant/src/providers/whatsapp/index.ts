// ─── Interfaz del proveedor de WhatsApp ───────────────────────────────────────
// Todos los proveedores (WhatsApp Business API, Baileys, etc.) deben implementar
// esta interfaz. Así el resto de la app no depende del proveedor concreto.

export interface WhatsAppProvider {
  /**
   * Envía un mensaje de texto a un número de teléfono.
   */
  sendText(to: string, text: string): Promise<void>

  /**
   * Verifica el token del webhook (handshake de Meta).
   * Devuelve el challenge si es válido, null si no.
   */
  verifyWebhook?(query: Record<string, string>): string | null
}

// ─── Factory ──────────────────────────────────────────────────────────────────
import { env } from '../../config/env'
import { WhatsAppApiProvider } from './whatsapp-api.provider'
import { BaileysProvider } from './baileys.provider'

let _instance: WhatsAppProvider | null = null

export function getWhatsAppProvider(): WhatsAppProvider {
  if (_instance) return _instance

  switch (env.WHATSAPP_PROVIDER) {
    case 'whatsapp-api':
      _instance = new WhatsAppApiProvider()
      break
    case 'baileys':
      _instance = new BaileysProvider()
      break
    default:
      throw new Error(`Proveedor de WhatsApp desconocido: ${env.WHATSAPP_PROVIDER}`)
  }

  return _instance
}
