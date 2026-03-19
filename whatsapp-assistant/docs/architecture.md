# Arquitectura del Sistema — WhatsApp AI Assistant

## Visión general

```
┌─────────────────────────────────────────────────────────────────┐
│                         ENTRADA                                 │
│                                                                 │
│  WhatsApp Business API ──→ POST /webhook                        │
│  (o Baileys socket)        GET  /webhook (verificación Meta)    │
└────────────────────────────┬────────────────────────────────────┘
                             │
                    Webhook Controller
                    normalizeWhatsAppApiPayload()
                             │
                    ┌────────▼────────┐
                    │  Cola (memory)  │  ← desacoplado del HTTP
                    │  InMemoryQueue  │    sustituible por BullMQ
                    └────────┬────────┘
                             │
                    Message Worker (consume jobs)
                             │
              ┌──────────────▼──────────────┐
              │      message.service.ts     │
              │   (Orquestador principal)   │
              └──────────────┬──────────────┘
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   Contact Repo      Conversation Repo    Message Repo
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │ SQLite / PostgreSQL
                          Prisma ORM
                             │
          ┌──────────────────┼──────────────────┐
          │                  │                  │
   AI Provider          Escalation         Response
   (Claude/Rules)        Service            Service
          │                  │                  │
   classify()          escalate()         generate()
   generateResponse()        │
                      EscalationLog        │
                             │             │
                    ┌────────▼─────────────▼────────┐
                    │      WhatsApp Provider         │
                    │   sendText(to, responseText)   │
                    └───────────────────────────────┘
```

## Módulos principales

### Providers (adaptadores externos)
- **`providers/whatsapp/`** — Envío de mensajes. Interfaz `WhatsAppProvider`.
  - `whatsapp-api.provider.ts` — Meta Cloud API (producción)
  - `baileys.provider.ts` — WhatsApp Web open source (solo desarrollo)
- **`providers/ai/`** — Clasificación y generación. Interfaz `AIProvider`.
  - `claude.provider.ts` — Claude API de Anthropic
  - `rules.provider.ts` — Basado en palabras clave (fallback offline)

### Services (lógica de negocio)
- `message.service.ts` — Orquestador principal del flujo
- `escalation.service.ts` — Lógica de escalado a humano
- `response.service.ts` — Generación de respuesta con fallback
- `history.service.ts` — Recuperación del historial de conversación
- `queue.service.ts` — Cola FIFO en memoria (con reintentos)

### Repositories (acceso a datos)
- `contact.repository.ts`
- `conversation.repository.ts`
- `message.repository.ts`

### Domain (tipos puros, sin dependencias)
- `message.ts` — `NormalizedMessage`, `ClassificationResult`, `MessageType`
- `conversation.ts` — `ConversationState`, `MessageContext`

## Flujo de escalado

```
Mensaje recibido
       │
       ├── ¿Conversación ya escalada? → SÍ → Silencio (no responder)
       │
       ├── Clasificar mensaje
       │
       ├── ¿confidence < umbral?    → SÍ → Escalar (low_confidence)
       ├── ¿Pide agente humano?     → SÍ → Escalar (user_request)
       ├── ¿Frustración detectada?  → SÍ → Escalar (frustration)
       ├── ¿failureCount >= límite? → SÍ → Escalar (consecutive_failures)
       │
       └── NO → Generar respuesta → Enviar → Guardar
```

## Estrategia de sustitución de proveedores

### Cambiar WhatsApp provider
1. Editar `WHATSAPP_PROVIDER` en `.env`
2. Si es nuevo proveedor: implementar `WhatsAppProvider` en `providers/whatsapp/`
3. Añadir al factory en `providers/whatsapp/index.ts`
4. Sin tocar nada más

### Cambiar AI provider
1. Editar `AI_PROVIDER` en `.env`
2. Si es nuevo proveedor: implementar `AIProvider` en `providers/ai/`
3. Añadir al factory en `providers/ai/index.ts`
4. Sin tocar nada más

### Migrar SQLite → PostgreSQL
1. Cambiar `provider = "postgresql"` en `prisma/schema.prisma`
2. Cambiar `DATABASE_URL` en `.env`
3. Ejecutar `npx prisma migrate deploy`
4. Sin tocar código de la app
