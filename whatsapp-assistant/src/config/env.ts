import { z } from 'zod'
import dotenv from 'dotenv'

dotenv.config()

// ─── Esquema de validación ────────────────────────────────────────────────────
const envSchema = z.object({
  // Servidor
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(3000),
  HOST: z.string().default('0.0.0.0'),

  // Base de datos
  DATABASE_URL: z.string().min(1, 'DATABASE_URL es obligatorio'),

  // Proveedor WhatsApp
  WHATSAPP_PROVIDER: z.enum(['whatsapp-api', 'baileys']).default('whatsapp-api'),
  WHATSAPP_API_URL: z.string().url().optional(),
  WHATSAPP_PHONE_NUMBER_ID: z.string().optional(),
  WHATSAPP_ACCESS_TOKEN: z.string().optional(),
  WHATSAPP_VERIFY_TOKEN: z.string().default('verify_token_default'),

  // Proveedor IA
  AI_PROVIDER: z.enum(['claude', 'rules']).default('claude'),
  ANTHROPIC_API_KEY: z.string().optional(),
  ANTHROPIC_MODEL: z.string().default('claude-haiku-4-5-20251001'),
  AI_CONFIDENCE_THRESHOLD: z.coerce.number().min(0).max(1).default(0.65),

  // Escalado
  ESCALATION_FAILURE_LIMIT: z.coerce.number().default(3),

  // Cola
  QUEUE_PROVIDER: z.enum(['memory', 'redis']).default('memory'),
  REDIS_URL: z.string().optional(),

  // Seguridad
  INTERNAL_API_TOKEN: z.string().default('dev_internal_token'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
})

// Validación temprana: falla al arrancar si falta algo crítico
const parsed = envSchema.safeParse(process.env)

if (!parsed.success) {
  console.error('❌ Error de configuración de variables de entorno:')
  console.error(parsed.error.format())
  process.exit(1)
}

export const env = parsed.data
export type Env = typeof env
