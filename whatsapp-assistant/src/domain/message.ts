// ─── Tipos del dominio de mensajes ───────────────────────────────────────────

export type MessageRole = 'user' | 'assistant'

export type MessageType = 'saludo' | 'consulta' | 'queja' | 'pedido' | 'otro'

// Mensaje normalizado que circula internamente por el sistema
export interface NormalizedMessage {
  /** ID externo del mensaje (del proveedor de WhatsApp) */
  externalId: string
  /** Número de teléfono del remitente (formato E.164: +34XXXXXXXXX) */
  from: string
  /** Nombre del contacto si está disponible */
  fromName?: string
  /** Contenido textual del mensaje */
  body: string
  /** Timestamp UNIX del mensaje original */
  timestamp: number
  /** Tipo de mensaje de WhatsApp (text, image, audio, etc.) */
  mediaType: 'text' | 'image' | 'audio' | 'video' | 'document' | 'other'
  /** Payload original del proveedor para auditoría */
  rawPayload: unknown
}

// Resultado de la clasificación del mensaje
export interface ClassificationResult {
  type: MessageType
  /** 0.0 – 1.0 */
  confidence: number
  /** true si debe escalarse inmediatamente */
  shouldEscalate: boolean
  escalateReason?: EscalationTrigger
}

export type EscalationTrigger =
  | 'user_request'
  | 'low_confidence'
  | 'frustration'
  | 'consecutive_failures'
  | 'complaint'

// Mensaje para el historial de conversación (modelo simplificado)
export interface HistoryMessage {
  role: MessageRole
  content: string
  sentAt: Date
}
