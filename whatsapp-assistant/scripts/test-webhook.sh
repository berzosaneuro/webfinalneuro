#!/bin/bash
# ─── Script de pruebas del webhook local ─────────────────────────────────────
# Uso: bash scripts/test-webhook.sh
# Requiere: curl, jq (opcional para pretty print)

BASE_URL="${BASE_URL:-http://localhost:3000}"

echo "🧪 Probando WhatsApp AI Assistant en $BASE_URL"
echo "────────────────────────────────────────────────"

run_test() {
  local name="$1"
  local payload="$2"
  echo ""
  echo "▶  $name"
  response=$(curl -s -X POST "$BASE_URL/webhook/test" \
    -H "Content-Type: application/json" \
    -d "$payload")
  echo "   Respuesta: $response"
  sleep 1
}

# ─── Test 1: Saludo ───────────────────────────────────────────────────────────
run_test "Saludo" '{
  "from": "34600000001",
  "name": "María García",
  "body": "Hola, buenos días"
}'

# ─── Test 2: Consulta de precio ───────────────────────────────────────────────
run_test "Consulta de precio" '{
  "from": "34600000002",
  "name": "Carlos López",
  "body": "¿Cuánto cuesta el programa de 21 días?"
}'

# ─── Test 3: Queja ────────────────────────────────────────────────────────────
run_test "Queja" '{
  "from": "34600000003",
  "name": "Ana Martínez",
  "body": "No funciona el acceso a las meditaciones, llevo días con este problema"
}'

# ─── Test 4: Pedido ──────────────────────────────────────────────────────────
run_test "Pedido / Solicitud" '{
  "from": "34600000004",
  "name": "Pedro Sánchez",
  "body": "Quiero apuntarme al retiro de meditación del próximo mes"
}'

# ─── Test 5: Solicitud de agente humano ───────────────────────────────────────
run_test "Solicitud de agente humano" '{
  "from": "34600000005",
  "name": "Laura Fernández",
  "body": "Necesito hablar con una persona, con un agente por favor"
}'

# ─── Test 6: Frustración ─────────────────────────────────────────────────────
run_test "Frustración" '{
  "from": "34600000006",
  "name": "Roberto Díaz",
  "body": "Esto es una vergüenza, estoy harto del servicio"
}'

# ─── Test 7: Mensaje ambiguo ─────────────────────────────────────────────────
run_test "Mensaje ambiguo (bajo confidence)" '{
  "from": "34600000007",
  "body": "asdfgh qwerty mmm"
}'

echo ""
echo "────────────────────────────────────────────────"
echo "✅ Tests completados. Revisa los logs del servidor para ver el procesamiento."
echo ""
echo "📊 Estado del sistema:"
curl -s "$BASE_URL/health" | (command -v jq >/dev/null 2>&1 && jq . || cat)
