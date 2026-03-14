# Cómo configurar tu voz clonada en las meditaciones

## Opción rápida (recomendada)

En la terminal, ejecuta:

```bash
npm run setup:elevenlabs
```

El script te pedirá:
1. **API Key** — desde ElevenLabs → Profile → API Keys
2. **Voice ID** — desde ElevenLabs → Voice Lab → tu voz clonada → copiar el ID

Pégalos cuando te los pida y pulsa Enter. ¡Listo!

---

## Opción manual

1. Crea o edita el archivo `.env.local` en la raíz del proyecto.
2. Añade estas líneas (sustituye por tus valores reales):

```
ELEVENLABS_API_KEY=tu-api-key-aqui
ELEVENLABS_VOICE_ID=tu-voice-id-aqui
```

3. Reinicia el servidor: `npm run dev`

---

## Dónde encontrar tus datos en ElevenLabs

- **API Key**: [elevenlabs.io/app/settings/api-keys](https://elevenlabs.io/app/settings/api-keys)
- **Voice ID**: [elevenlabs.io/app/voice-lab](https://elevenlabs.io/app/voice-lab) → clic en tu voz → en los detalles verás el Voice ID

---

Si no configuras ElevenLabs, las meditaciones seguirán usando la voz del navegador (TTS). No hace falta configurar nada para que la app funcione.

---

## Producción (Vercel u otro hosting)

El archivo `.env.local` **no se sube** a producción. Si quieres tu voz clonada en la app desplegada:

1. Entra en el panel de tu hosting (ej. Vercel → Project → Settings → Environment Variables).
2. Añade `ELEVENLABS_API_KEY` y `ELEVENLABS_VOICE_ID` con tus valores.
3. Redespliega la app.

---

## Solución de problemas

- **La voz no suena**: Reinicia el servidor (`npm run dev`) después de editar `.env.local`.
- **Solo se escucha ruido ambiente**: Pulsa el botón rojo **Detener** (cuadrado) para parar todo.
