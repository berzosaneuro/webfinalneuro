# Plan de implementación de mejoras — Berzosa Neuro

Plan estructurado por prioridad. **No implementar aún.** Revisar antes de codificar.

---

## Priority 1 — Critical bugs

### 1.1 Slow audio start
- **Qué hace:** El audio tarda varios segundos en iniciarse (ElevenLabs API) o el TTS arranca con retraso.
- **Archivos:** `src/app/meditacion/MeditationCards.tsx`, `src/app/api/elevenlabs/tts/route.ts`
- **Solución:** Mostrar estado "Preparando audio..." o skeleton durante la carga. Probar prefetch/optimización de latencia de ElevenLabs (`optimize_streaming_latency`).
- **Complejidad:** Media

### 1.2 Strange noise at audio start
- **Qué hace:** Ruido/chirrido al inicio de la reproducción.
- **Archivos:** `src/app/meditacion/MeditationCards.tsx`, `src/lib/audio-manager.ts`, `src/app/sos/page.tsx`
- **Solución:** Fade-in suave (gain 0→1) en Web Audio al iniciar. Evitar cortes bruscos en el synth pad. Revisar el orden de inicio de ambient + TTS/audio.
- **Complejidad:** Baja

### 1.3 Podcast system not working
- **Qué hace:** Los episodios usan solo `speechSynthesis` (TTS del navegador). Sin ambient, sin ElevenLabs.
- **Archivos:** `src/app/podcast/page.tsx`
- **Solución:** Integrar API ElevenLabs (como en meditaciones) para voz clonada. Revisar que `handlePlay` y `stopPodcast` se usen correctamente y que `claimAndPlay` esté registrado.
- **Complejidad:** Media

---

## Priority 2 — Audio system improvements

### 2.1 Missing background ambient music
- **Qué hace:** Meditaciones ya tienen synth pad. Podcast y Masterclass no tienen música ambiente.
- **Archivos:** `src/app/podcast/page.tsx`, `src/app/masterclass/page.tsx`, `src/lib/audio-manager.ts`
- **Solución:** Reutilizar `createAmbientPad` (synth) o exponer un helper en `audio-manager` para iniciar/detener ambient. Integrar en podcast y masterclass con `claimAndPlay` para no solapar fuentes.
- **Complejidad:** Media

### 2.2 Missing STOP button in audio player
- **Qué hace:** Meditaciones tienen botón Detener (cuadrado rojo). Podcast tiene "Parar". Masterclass tiene "Parar" en el modal. Comprobar que todos los reproductores tengan un STOP visible.
- **Archivos:** `src/app/meditacion/MeditationCards.tsx` (ya tiene), `src/app/podcast/page.tsx` (tiene Parar), `src/app/masterclass/page.tsx` (tiene Parar en modal)
- **Solución:** Revisar y normalizar que cada reproductor tenga un STOP explícito y fácil de encontrar. Si falta, añadirlo.
- **Complejidad:** Baja

### 2.3 Masterclass and podcasts needing ElevenLabs cloned voice
- **Qué hace:** Solo meditaciones usan ElevenLabs. Podcast y Masterclass usan `speechSynthesis`.
- **Archivos:** `src/app/podcast/page.tsx`, `src/app/masterclass/page.tsx`, `src/app/api/elevenlabs/tts/route.ts`
- **Solución:** Replicar flujo de `MeditationCards`: intentar ElevenLabs primero, fallback a `speechSynthesis`. Reutilizar `/api/elevenlabs/tts` y el patrón try/catch + startTTS.
- **Complejidad:** Media

---

## Priority 3 — UI fixes

### 3.1 Library buttons appearing cut off
- **Qué hace:** Botones o enlaces de la biblioteca quedan recortados en móvil o desktop.
- **Archivos:** `src/app/biblioteca/page.tsx`, `src/components/Card.tsx`, `globals.css`
- **Solución:** Revisar layout (flex, overflow, min-width). Ajustar padding, line-clamp y tamaños de texto. Probar en distintos viewports.
- **Complejidad:** Baja

---

## Priority 4 — Content and library improvements

### 4.1 Small amount of content in the library
- **Qué hace:** Biblioteca muestra pocos artículos (6 en `posts.ts`).
- **Archivos:** `src/data/posts.ts`, `src/app/api/biblioteca/route.ts`
- **Solución:** Añadir más posts en `posts.ts` o cargar desde Supabase si se usa API. Mantener estructura `Post` (slug, title, date, summary, content, exercise).
- **Complejidad:** Baja (solo datos) o Media (si se integra con CMS/BD)

---

## Priority 5 — New features

### 5.1 Seven-day challenge allowing users to skip days
- **Qué hace:** Usuarios pueden marcar días como completados sin hacer el ejercicio y acceder a días desbloqueados en cualquier orden.
- **Archivos:** `src/app/plan-7-dias/page.tsx`
- **Solución:** 
  - Opción A: Validar que el día anterior esté completado antes de permitir marcar el actual.
  - Opción B: Permitir orden libre pero mostrar advertencia si se marca sin haber pasado por el enlace del ejercicio.
  - Opción C: Añadir un mínimo de tiempo o paso obligatorio (ej. "Ir al ejercicio") antes de habilitar "Marcar como completado".
- **Complejidad:** Media

### 5.2 Session tracking for meditation progress
- **Qué hace:** No hay historial de meditaciones completadas ni métricas (tiempo, sesiones por día/semana).
- **Archivos:** Nuevos o existentes: `src/app/meditacion/MeditationCards.tsx`, `src/app/api/` (nueva ruta o extensión), `supabase/schema.sql`, `src/app/neuroscore/` o dashboard de progreso
- **Solución:** 
  - Crear tabla `meditation_sessions` (user_email/anon_id, meditation_title, completed_at, duration_seconds).
  - API POST al completar meditación.
  - Opcional: vista en NeuroScore o página de progreso con sesiones y streak.
- **Complejidad:** Alta

---

## Resumen por prioridad

| Prioridad | Items | Complejidad total |
|-----------|-------|-------------------|
| P1 Critical | 3 | 1 media, 1 baja, 1 media |
| P2 Audio | 3 | 2 media, 1 baja |
| P3 UI | 1 | Baja |
| P4 Content | 1 | Baja–Media |
| P5 Features | 2 | 1 media, 1 alta |

---

## Orden sugerido de implementación

1. P1.2 — Ruido al inicio (rápido, impacto alto)
2. P1.3 — Podcast no funciona (verificar estado real)
3. P2.1 — Ambient en podcast/masterclass
4. P2.3 — ElevenLabs en podcast y masterclass
5. P1.1 — Slow audio start (UX de carga)
6. P3.1 — Biblioteca recortada
7. P5.1 — Reto 7 días: restricción de saltos
8. P4.1 — Más contenido en biblioteca
9. P5.2 — Tracking de sesiones de meditación
