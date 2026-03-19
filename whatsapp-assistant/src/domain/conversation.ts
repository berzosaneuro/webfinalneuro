// ─── Tipos del dominio de conversación ───────────────────────────────────────

export type ConversationStatus = 'active' | 'escalated' | 'closed'

export interface ConversationState {
  id: string
  contactId: string
  contactPhone: string
  status: ConversationStatus
  failureCount: number
  escalatedAt?: Date
  escalationReason?: string
  escalationTrigger?: string
  createdAt: Date
  updatedAt: Date
}

// Contexto completo que el servicio de mensajes necesita para generar la respuesta
export interface MessageContext {
  conversation: ConversationState
  recentHistory: Array<{ role: 'user' | 'assistant'; content: string }>
  contactName?: string
}
