#!/usr/bin/env node
/**
 * Script para configurar ElevenLabs en .env.local
 * Ejecuta: node scripts/setup-elevenlabs.js
 */

const fs = require('fs')
const path = require('path')
const readline = require('readline')

const rl = readline.createInterface({ input: process.stdin, output: process.stdout })
const question = (q) => new Promise((res) => rl.question(q, res))

async function main() {
  console.log('\n🎙️  Configuración de ElevenLabs para tus meditaciones\n')
  console.log('Pasos para obtener tus datos:')
  console.log('1. Entra en https://elevenlabs.io y haz login')
  console.log('2. API Key: Profile (arriba derecha) → API Keys → Copiar')
  console.log('3. Voice ID: Voice Lab → Tu voz clonada → Ver detalles → Copiar el ID\n')

  const apiKey = await question('Pega tu API Key: ')
  const voiceId = await question('Pega tu Voice ID: ')
  rl.close()

  const apiKeyTrim = apiKey.trim()
  const voiceIdTrim = voiceId.trim()
  if (!apiKeyTrim || !voiceIdTrim) {
    console.error('\n❌ Necesitas ambas: API Key y Voice ID')
    process.exit(1)
  }

  const root = path.join(__dirname, '..')
  const envPath = path.join(root, '.env.local')
  const examplePath = path.join(root, '.env.local.example')

  let content
  if (fs.existsSync(envPath)) {
    content = fs.readFileSync(envPath, 'utf8')
    if (content.includes('ELEVENLABS_API_KEY=')) {
      content = content.replace(/ELEVENLABS_API_KEY=.*/g, `ELEVENLABS_API_KEY=${apiKeyTrim}`)
    } else {
      content += `\n# ElevenLabs\nELEVENLABS_API_KEY=${apiKeyTrim}\n`
    }
    if (content.includes('ELEVENLABS_VOICE_ID=')) {
      content = content.replace(/ELEVENLABS_VOICE_ID=.*/g, `ELEVENLABS_VOICE_ID=${voiceIdTrim}`)
    } else {
      content += `ELEVENLABS_VOICE_ID=${voiceIdTrim}\n`
    }
  } else {
    content = fs.existsSync(examplePath)
      ? fs.readFileSync(examplePath, 'utf8')
      : ''
    content = content.replace(/ELEVENLABS_API_KEY=.*/g, `ELEVENLABS_API_KEY=${apiKeyTrim}`)
    content = content.replace(/ELEVENLABS_VOICE_ID=.*/g, `ELEVENLABS_VOICE_ID=${voiceIdTrim}`)
  }

  fs.writeFileSync(envPath, content)
  console.log('\n✅ ¡Listo! ElevenLabs configurado en .env.local')
  console.log('   Reinicia el servidor (npm run dev) y reproduce una meditación.\n')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
