# Guía de ejecución local

## Requisitos previos

| Herramienta | Versión mínima |
|---|---|
| Node.js | 20.x LTS |
| npm | 10.x |
| Git | cualquiera |

> SQLite no requiere instalación adicional — está incluido en Prisma.

---

## Pasos de instalación

### 1. Clonar y entrar al directorio

```bash
cd whatsapp-assistant
```

### 2. Setup automático (recomendado)

```bash
bash scripts/setup.sh
```

Este script hace:
- `npm install`
- Crea `.env` desde `.env.example`
- Genera el cliente Prisma
- Crea la base de datos SQLite

### 3. Configurar variables de entorno

Edita `.env`:

```env
# Mínimo para funcionar en local sin credenciales reales:
DATABASE_URL="file:./data/assistant.db"
AI_PROVIDER=rules                # Sin API Key de Anthropic
WHATSAPP_PROVIDER=whatsapp-api   # En modo simulación si no hay credenciales
```

Para activar Claude AI real:
```env
AI_PROVIDER=claude
ANTHROPIC_API_KEY=sk-ant-...
```

### 4. Iniciar en desarrollo

```bash
npm run dev
```

El servidor arranca en `http://localhost:3000`.

---

## Probar el sistema

### Opción A — Script automático

```bash
npm run test:webhook
```

Envía 7 mensajes de prueba con distintas intenciones y muestra las respuestas.

### Opción B — curl manual

```bash
# Saludo
curl -X POST http://localhost:3000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"from":"34600000001","name":"María","body":"Hola, buenos días"}'

# Consulta
curl -X POST http://localhost:3000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"from":"34600000001","body":"¿Cuánto cuesta el programa?"}'

# Solicitar agente humano
curl -X POST http://localhost:3000/webhook/test \
  -H "Content-Type: application/json" \
  -d '{"from":"34600000001","body":"Quiero hablar con un agente"}'
```

### Health check

```bash
# Básico
curl http://localhost:3000/health

# Detallado (requiere token)
curl -H "x-internal-token: dev_internal_token" \
     http://localhost:3000/health/details

# Escalados pendientes
curl -H "x-internal-token: dev_internal_token" \
     http://localhost:3000/admin/escalations
```

---

## Explorar la base de datos

```bash
npm run db:studio
# Abre Prisma Studio en http://localhost:5555
```

---

## Webhook con ngrok (para recibir mensajes reales de Meta)

```bash
# Instalar ngrok si no lo tienes
brew install ngrok  # macOS
# o: https://ngrok.com/download

# Exponer el servidor local
ngrok http 3000

# Usar la URL generada (ej: https://abc123.ngrok.io/webhook)
# como webhook en el panel de Meta for Developers
```

---

## Logs

Los logs usan `pino-pretty` en desarrollo. Niveles configurables en `.env`:
```env
LOG_LEVEL=debug   # Máximo detalle
LOG_LEVEL=info    # Default
LOG_LEVEL=warn    # Solo advertencias
LOG_LEVEL=error   # Solo errores
```
