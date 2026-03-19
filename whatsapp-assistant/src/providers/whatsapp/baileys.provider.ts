/**
 * Proveedor: Baileys (open source, multi-device)
 *
 * ⚠️  ADVERTENCIA DE PRODUCCIÓN:
 * Baileys se conecta a WhatsApp usando el protocolo de WhatsApp Web,
 * lo cual NO está autorizado por Meta. El número puede ser baneado en producción.
 * Úsalo SOLO para desarrollo, pruebas o entornos no críticos.
 *
 * Para activar Baileys:
 *   npm install @whiskeysockets/baileys
 * y cambia WHATSAPP_PROVIDER=baileys en .env
 *
 * Esta clase actúa como stub. La conexión real se gestiona en el worker de Baileys.
 */

import { WhatsAppProvider } from './index'
import { createLogger } from '../../utils/logger'

const log = createLogger('baileys-provider')

// La instancia de socket de Baileys se inyecta en runtime
let _baileysSocket: { sendMessage: Function } | null = null

export function setBaileysSocket(sock: { sendMessage: Function }) {
  _baileysSocket = sock
}

export class BaileysProvider implements WhatsAppProvider {
  async sendText(to: string, text: string): Promise<void> {
    if (!_baileysSocket) {
      log.warn({ to }, '[Baileys] Socket no inicializado — mensaje no enviado')
      return
    }

    const jid = to.includes('@') ? to : `${to}@s.whatsapp.net`
    await _baileysSocket.sendMessage(jid, { text })
    log.debug({ to }, '[Baileys] Mensaje enviado')
  }

  // Baileys no usa webhooks HTTP — los mensajes llegan por evento en el socket
  verifyWebhook(_query: Record<string, string>): string | null {
    return null
  }
}
