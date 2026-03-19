import { NormalizedMessage } from '../domain/message'
import { createLogger } from './logger'

const log = createLogger('normalizer')

// ─── Normalización desde WhatsApp Business API (Meta) ─────────────────────────
export function normalizeWhatsAppApiPayload(body: Record<string, unknown>): NormalizedMessage | null {
  try {
    const entry = (body.entry as any[])?.[0]
    const changes = entry?.changes?.[0]
    const value = changes?.value
    const message = value?.messages?.[0]

    if (!message) return null

    const contact = value?.contacts?.[0]
    const fromName = contact?.profile?.name as string | undefined

    const mediaType = resolveMediaType(message.type)

    return {
      externalId: message.id as string,
      from: message.from as string,
      fromName,
      body: extractText(message),
      timestamp: parseInt(message.timestamp as string, 10),
      mediaType,
      rawPayload: body,
    }
  } catch (err) {
    log.error({ err }, 'Error normalizando payload de WhatsApp API')
    return null
  }
}

// ─── Normalización desde Baileys ─────────────────────────────────────────────
export function normalizeBaileysPayload(message: Record<string, unknown>): NormalizedMessage | null {
  try {
    const key = message.key as Record<string, unknown>
    const from = (key?.remoteJid as string)?.replace('@s.whatsapp.net', '')
    const msgContent = message.message as Record<string, unknown>
    const text =
      (msgContent?.conversation as string) ||
      (msgContent?.extendedTextMessage as any)?.text ||
      ''

    if (!from || !text) return null

    return {
      externalId: key?.id as string,
      from,
      body: text,
      timestamp: Date.now() / 1000,
      mediaType: 'text',
      rawPayload: message,
    }
  } catch (err) {
    log.error({ err }, 'Error normalizando payload de Baileys')
    return null
  }
}

// ─── Helpers ──────────────────────────────────────────────────────────────────
function extractText(message: Record<string, unknown>): string {
  if (message.type === 'text') {
    return ((message.text as any)?.body as string) ?? ''
  }
  if (message.type === 'button') {
    return (message.button as any)?.text ?? ''
  }
  if (message.type === 'interactive') {
    const interactive = message.interactive as any
    return (
      interactive?.button_reply?.title ||
      interactive?.list_reply?.title ||
      ''
    )
  }
  // Para media (imagen, audio, etc.) usa el caption si existe
  return (message as any)?.[message.type as string]?.caption ?? '[Mensaje multimedia]'
}

function resolveMediaType(type: string): NormalizedMessage['mediaType'] {
  const map: Record<string, NormalizedMessage['mediaType']> = {
    text: 'text',
    image: 'image',
    audio: 'audio',
    video: 'video',
    document: 'document',
    button: 'text',
    interactive: 'text',
  }
  return map[type] ?? 'other'
}

// ─── Sanitización de texto ────────────────────────────────────────────────────
export function sanitizeText(text: string): string {
  return text.trim().replace(/\s+/g, ' ').substring(0, 4000)
}

// ─── Interpolación de plantillas ─────────────────────────────────────────────
export function interpolate(template: string, vars: Record<string, string>): string {
  return template.replace(/\{(\w+)\}/g, (_, key) => vars[key] ?? '')
}
