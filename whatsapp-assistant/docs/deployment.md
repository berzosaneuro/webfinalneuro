# Guía de despliegue en servidor

## Opción A — VPS / servidor dedicado (Ubuntu/Debian)

### 1. Preparar el servidor

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# PM2 para gestión de procesos
npm install -g pm2
```

### 2. Desplegar la aplicación

```bash
git clone <repo-url> /opt/whatsapp-assistant
cd /opt/whatsapp-assistant/whatsapp-assistant

npm install --production
cp .env.example .env
# Editar .env con credenciales de producción

# Para PostgreSQL, cambiar también prisma/schema.prisma provider a "postgresql"
npx prisma generate
npx prisma migrate deploy   # (o db push para SQLite)

npm run build
```

### 3. Iniciar con PM2

```bash
pm2 start dist/index.js --name whatsapp-assistant
pm2 save
pm2 startup   # Configurar inicio automático
```

### 4. Nginx como reverse proxy

```nginx
# /etc/nginx/sites-available/whatsapp-assistant
server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/whatsapp-assistant /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

### 5. SSL con Let's Encrypt

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d tu-dominio.com
```

---

## Opción B — Railway / Render / Fly.io (PaaS)

### Railway

```bash
# Instalar CLI
npm install -g @railway/cli
railway login

# Nuevo proyecto
railway new
railway link

# Variables de entorno (en el dashboard de Railway o CLI)
railway variables set NODE_ENV=production
railway variables set DATABASE_URL="postgresql://..."
railway variables set ANTHROPIC_API_KEY="sk-ant-..."
# ... (resto de variables)

# Desplegar
railway up
```

El `Dockerfile` y `railway.json` opcionales (Railway detecta Node.js automáticamente).

---

## Opción C — Docker

```dockerfile
# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/package.json ./
EXPOSE 3000
CMD ["node", "dist/index.js"]
```

```bash
docker build -t whatsapp-assistant .
docker run -p 3000:3000 --env-file .env whatsapp-assistant
```

---

## Configurar el Webhook en Meta for Developers

1. Ir a [developers.facebook.com](https://developers.facebook.com)
2. Seleccionar tu App → WhatsApp → Configuración
3. En "Webhooks", añadir:
   - **URL**: `https://tu-dominio.com/webhook`
   - **Token de verificación**: el valor de `WHATSAPP_VERIFY_TOKEN` en tu `.env`
4. Suscribir al evento **`messages`**
5. Verificar que el GET `/webhook` responde correctamente

---

## Variables de entorno en producción

```env
NODE_ENV=production
PORT=3000
HOST=0.0.0.0

# PostgreSQL en producción (recomendado sobre SQLite)
DATABASE_URL="postgresql://usuario:contraseña@host:5432/whatsapp_assistant"

WHATSAPP_PROVIDER=whatsapp-api
WHATSAPP_API_URL=https://graph.facebook.com/v20.0
WHATSAPP_PHONE_NUMBER_ID=<tu_phone_id>
WHATSAPP_ACCESS_TOKEN=<tu_token_permanente>
WHATSAPP_VERIFY_TOKEN=<token_secreto_aleatorio>

AI_PROVIDER=claude
ANTHROPIC_API_KEY=<tu_api_key>
ANTHROPIC_MODEL=claude-haiku-4-5-20251001

AI_CONFIDENCE_THRESHOLD=0.65
ESCALATION_FAILURE_LIMIT=3

QUEUE_PROVIDER=memory   # o redis si escala
INTERNAL_API_TOKEN=<token_aleatorio_seguro>
LOG_LEVEL=info
```

---

## Migración SQLite → PostgreSQL

```bash
# 1. En prisma/schema.prisma cambiar:
#    provider = "postgresql"

# 2. En .env cambiar DATABASE_URL a postgres

# 3. Ejecutar
npx prisma migrate deploy

# No hay que tocar nada más del código
```

---

## Monitorización en producción

```bash
# Logs en tiempo real (PM2)
pm2 logs whatsapp-assistant

# Estado del proceso
pm2 status

# Escalados pendientes (endpoint interno)
curl -H "x-internal-token: TU_TOKEN" https://tu-dominio.com/admin/escalations
```
