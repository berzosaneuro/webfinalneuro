import { NormalizedMessage } from '../domain/message'
import { HistoryMessage } from '../domain/message'

/**
 * Prompt para clasificar el tipo de mensaje de WhatsApp.
 * Diseñado para modelos Claude. Separar el prompt del proveedor facilita
 * iteraciones de calidad sin tocar código de negocio.
 */
export function buildClassifyPrompt(message: NormalizedMessage, history: HistoryMessage[]): string {
  const historyBlock =
    history.length > 0
      ? `\nHistorial reciente:\n${history
          .map((m) => `${m.role === 'user' ? 'Usuario' : 'Asistente'}: ${m.content}`)
          .join('\n')}`
      : ''

  return `Eres un clasificador de mensajes de WhatsApp para un negocio de bienestar mental (Berzosa Neuro).

Tu tarea es clasificar el siguiente mensaje y devolver SOLO un JSON válido con esta estructura exacta:
{
  "type": "saludo" | "consulta" | "queja" | "pedido" | "otro",
  "confidence": 0.0 a 1.0,
  "shouldEscalate": true | false,
  "escalateReason": "user_request" | "low_confidence" | "frustration" | "complaint" | null
}

Reglas de clasificación:
- "saludo": el usuario saluda o se presenta por primera vez
- "consulta": el usuario hace una pregunta sobre servicios, precios, horarios, etc.
- "queja": el usuario expresa insatisfacción, reporta un problema o hace una reclamación
- "pedido": el usuario quiere contratar, comprar, reservar o solicitar algo concreto
- "otro": ninguna categoría encaja bien

Reglas de escalado (shouldEscalate = true cuando):
- El usuario pide explícitamente hablar con un humano (escalateReason: "user_request")
- La queja es grave o expresa frustración extrema (escalateReason: "frustration" o "complaint")
- No puedes clasificar con confianza < 0.5 (escalateReason: "low_confidence")
${historyBlock}

Mensaje a clasificar:
"${message.body}"

Responde SOLO con el JSON, sin explicaciones ni texto adicional.`
}
