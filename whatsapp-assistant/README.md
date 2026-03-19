# WhatsApp AI Assistant — Berzosa Neuro

Asistente de IA para respuesta automática de mensajes de WhatsApp. Clasifica intenciones, genera respuestas contextuales y escala a humano cuando es necesario.

## Inicio rápido

```bash
bash scripts/setup.sh   # Instala, configura BD y genera cliente Prisma
npm run dev             # Servidor en http://localhost:3000
npm run test:webhook    # Prueba con 7 mensajes de ejemplo
```

## Documentación

- [`docs/architecture.md`](docs/architecture.md) — Arquitectura y diagramas
- [`docs/local-setup.md`](docs/local-setup.md) — Ejecución local completa
- [`docs/deployment.md`](docs/deployment.md) — Despliegue en VPS, PaaS y Docker

## Stack

Node.js · TypeScript · Fastify · Prisma · SQLite/PostgreSQL · Claude API · WhatsApp Business API
