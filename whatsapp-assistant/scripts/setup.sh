#!/bin/bash
# ─── Setup inicial del proyecto ───────────────────────────────────────────────
set -e

echo "🔧 Configurando WhatsApp AI Assistant..."

# 1. Instalar dependencias
echo "📦 Instalando dependencias..."
npm install

# 2. Copiar .env si no existe
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Archivo .env creado desde .env.example — edítalo con tus credenciales"
else
  echo "✓  .env ya existe"
fi

# 3. Crear directorio de datos para SQLite
mkdir -p data
echo "✓  Directorio data/ creado"

# 4. Generar cliente Prisma
echo "🗄️  Generando cliente Prisma..."
npx prisma generate

# 5. Crear/migrar base de datos
echo "🗄️  Creando base de datos SQLite..."
npx prisma db push

echo ""
echo "✅ Setup completado. Para iniciar:"
echo "   npm run dev"
echo ""
echo "🧪 Para probar con mensajes de ejemplo:"
echo "   npm run test:webhook"
