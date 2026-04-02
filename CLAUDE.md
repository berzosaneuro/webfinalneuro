# CLAUDE.md — Berzosa Neuro (NeuroConciencia)

Guía completa para asistentes de IA que trabajen en este repositorio.

---

## Visión general del proyecto

**Berzosa Neuro** es una aplicación web progresiva (PWA) de bienestar mental con tono experiencial (sin postureo de laboratorio), creada por el Dr. Berzosa. El contenido gira en torno al **Método N.E.U.R.O.** — presencia, observación de la mente y hábitos repetibles:

- **N** — Neutraliza el pensamiento
- **E** — Entrena la atención
- **U** — Ubícate en el cuerpo
- **R** — Regula la emoción
- **O** — Observa sin identificarte

El idioma de la app y todo su contenido es **español**. Mantén siempre el español en cualquier texto visible al usuario.

---

## Stack tecnológico

| Tecnología | Versión | Uso |
|---|---|---|
| Next.js | ^14.2 | Framework (App Router) |
| React | ^18.3 | UI |
| TypeScript | ^5.9 | Tipado |
| Tailwind CSS | ^3.4 | Estilos |
| Supabase | ^2.97 | Base de datos PostgreSQL + API |
| lucide-react | ^0.574 | Iconografía |
| Inter + Poppins | Google Fonts | Tipografía |

---

## Estructura del proyecto

```
/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── layout.tsx          # Root layout (Navbar, Footer, BottomTabBar, contextos)
│   │   ├── page.tsx            # Home dashboard
│   │   ├── globals.css         # Estilos globales + variables CSS
│   │   │
│   │   ├── api/                # Route Handlers (API)
│   │   │   ├── ia-coach/       # IA Coach (Claude API + fallback local)
│   │   │   ├── community/      # Posts de comunidad
│   │   │   ├── contact/        # Formulario de contacto
│   │   │   ├── leads/          # Captación de leads
│   │   │   ├── subscribers/    # Suscriptores de email
│   │   │   ├── clients/        # CRM de clientes
│   │   │   ├── calls/          # Registro de llamadas
│   │   │   ├── diario/         # Entradas del diario
│   │   │   ├── mapa/           # Mapa de consciencia
│   │   │   ├── neuroscore/     # NeuroScore diario
│   │   │   ├── programa/       # Progreso del programa 21 días
│   │   │   └── admin/delete/   # Eliminación de registros (admin)
│   │   │
│   │   ├── admin/              # Panel de administración
│   │   │   ├── page.tsx        # Dashboard admin (CRM, leads, suscriptores, etc.)
│   │   │   └── login/page.tsx  # Login admin
│   │   │
│   │   ├── meditacion/         # Meditaciones guiadas (70+ meditaciones)
│   │   ├── programa/           # Programa 21 días
│   │   ├── ejercicios/         # Ejercicios interactivos (observación de la mente)
│   │   ├── despertar/          # Módulo "Despertar en Vida"
│   │   ├── neuroscore/         # Tracker de hábitos diario
│   │   ├── diario/             # Diario de presencia
│   │   ├── mapa/               # Mapa de consciencia (radar)
│   │   ├── sos/                # Respiración de emergencia
│   │   ├── test/               # Test de ruido mental
│   │   ├── ia-coach/           # Chat con IA Coach
│   │   ├── comunidad/          # Foro comunitario (4 canales)
│   │   ├── circulos/           # Círculos de práctica
│   │   ├── leaderboard/        # Ranking de usuarios
│   │   ├── biblioteca/         # Artículos y recursos ([slug] dinámico)
│   │   ├── sonidos/            # Sonidos ambientales
│   │   ├── plan-7-dias/        # Plan gratuito de 7 días
│   │   ├── planes/             # Precios y planes
│   │   ├── podcast/            # NeuroPodcast
│   │   ├── masterclass/        # Masterclasses en vídeo
│   │   ├── retos/              # Retos diarios
│   │   ├── referidos/          # Programa de referidos
│   │   ├── historias/          # Historias de transformación
│   │   ├── clientes/           # CRM de clientes (vista usuario)
│   │   ├── llamadas/           # Gestor de llamadas
│   │   ├── metodo/             # Explicación del Método N.E.U.R.O.
│   │   ├── sobre/              # Página "Sobre Berzosa Neuro"
│   │   ├── contacto/           # Formulario de contacto
│   │   ├── libro/              # Libro
│   │   ├── retiro/             # Retiro presencial
│   │   ├── corporativo/        # Empresas / B2B
│   │   ├── captacion/          # Captación de clientes
│   │   ├── certificacion/      # Certificación
│   │   ├── marketplace/        # Marketplace
│   │   ├── kids/               # Versión para niños
│   │   ├── notificaciones/     # Configuración de notificaciones
│   │   ├── onboarding/         # Flujo de incorporación
│   │   ├── biofeedback/        # Biofeedback
│   │   ├── companero/          # Compañero de práctica
│   │   └── ar-meditacion/      # AR / Meditación
│   │
│   ├── components/             # Componentes reutilizables
│   │   ├── Navbar.tsx          # Barra de navegación (desktop + mobile hamburger)
│   │   ├── BottomTabBar.tsx    # Tab bar inferior (solo móvil, fijo)
│   │   ├── Footer.tsx          # Pie de página
│   │   ├── PWARegister.tsx     # Registro del Service Worker
│   │   ├── Button.tsx          # Botón con variantes
│   │   ├── Card.tsx            # Tarjeta base
│   │   ├── Container.tsx       # Wrapper de ancho máximo con padding
│   │   ├── SectionTitle.tsx    # Título de sección estandarizado
│   │   ├── FadeInSection.tsx   # Animación fade-in con IntersectionObserver
│   │   ├── PremiumLock.tsx     # Gate de contenido premium (overlay con blur)
│   │   ├── PremiumBadge.tsx    # Insignia de estado Premium
│   │   ├── EmailCapture.tsx    # Formulario de captura de email
│   │
│   ├── context/                # React Context providers
│   │   ├── PremiumContext.tsx  # Estado del plan (free/premium) en localStorage
│   │   ├── AdminContext.tsx    # Autenticación de admin en localStorage
│   │   └── UserContext.tsx     # Datos del usuario
│   │
│   ├── data/
│   │   └── posts.ts            # Datos estáticos de artículos (biblioteca)
│   │
│   └── lib/
│       └── supabase.ts         # Cliente Supabase (singleton con getSupabase())
│
├── supabase/
│   └── schema.sql              # Esquema completo de la BD + políticas RLS
│
├── public/
│   ├── manifest.json           # Manifiesto PWA
│   ├── sw.js                   # Service Worker
│   ├── icons/icon.svg          # Icono de la app
│   └── elias-1.jpg / elias-2.jpg  # Fotos del autor
│
├── tailwind.config.ts          # Configuración de Tailwind + design tokens
├── next.config.js              # Configuración de Next.js
├── tsconfig.json               # Configuración TypeScript
└── .env.local.example          # Variables de entorno requeridas
```

---

## Sistema de diseño

### Colores (definidos en `tailwind.config.ts`)

```ts
// Fondos oscuros
dark.primary    = '#080B16'   // Fondo principal del body
dark.surface    = '#0F1423'   // Superficie de tarjetas
dark.surface-2  = '#151B2E'   // Superficie secundaria
dark.border     = '#1E2742'   // Bordes

// Accentos
accent.blue     = '#7C3AED'   // Violeta principal (llamado "blue" por convención interna)
accent.blue-hover = '#A78BFA' // Hover del violeta
accent.purple   = '#8B5CF6'   // Violeta secundario
accent.cyan     = '#06B6D4'
accent.teal     = '#14B8A6'
accent.amber    = '#F59E0B'
accent.emerald  = '#10B981'
accent.rose     = '#F43F5E'

// Texto
text.primary    = '#F1F5F9'   // Texto principal
text.secondary  = '#94A3B8'   // Texto secundario
text.muted      = '#64748B'   // Texto apagado
```

### Clases CSS personalizadas (`globals.css`)

| Clase | Uso |
|---|---|
| `.glass` | Tarjeta con glassmorphism oscuro (fondo + blur + borde violeta sutil) |
| `.glass-light` | Glassmorphism más ligero para botones de acción rápida |
| `.orb` | Círculo difuso animado para el fondo (decoración ambiental) |
| `.gradient-text` | Texto con degradado violeta-azul-cyan |
| `.neural-pulse` | Animación de pulso suave |
| `.glow-blue` | Sombra brillante violeta |
| `.ios-header` | Estilo de header iOS (blur + border bottom sutil) |
| `.tab-bar` | Estilo de tab bar iOS (blur + safe areas) |
| `.fade-in-section` | Clase base para FadeInSection (visible/hidden) |
| `.pill-btn` | Botón pill redondeado |

### Tipografía

- **Body**: `-apple-system, BlinkMacSystemFont, Inter, system-ui` (font-sans)
- **Headings**: `Poppins, -apple-system, BlinkMacSystemFont` (font-heading)
- Usar `font-heading` en títulos (`h1`, `h2`, nombres de secciones)

### Animaciones de Tailwind

- `animate-fade-in` — fade simple (0.5s)
- `animate-fade-in-up` — fade + sube desde abajo (0.5s)
- `animate-slide-up` — sube desde fuera del viewport (0.35s, menú móvil)
- `animate-scale-in` — escala desde 0.9 (0.3s)
- `animate-glow-pulse` — pulso de brillo continuo (3s)

---

## Patrones de componentes

### Estructura de página estándar

```tsx
'use client' // si usa hooks o eventos

import Container from '@/components/Container'
import FadeInSection from '@/components/FadeInSection'

export default function MiPagina() {
  return (
    <div className="relative overflow-hidden">
      {/* Orbs decorativos de fondo */}
      <div className="orb w-72 h-72 bg-accent-blue top-20 -left-20" />

      <section className="relative pt-8 pb-6">
        <Container>
          <FadeInSection>
            {/* Contenido */}
          </FadeInSection>
        </Container>
      </section>
    </div>
  )
}
```

### Tarjeta glass estándar

```tsx
<div className="glass rounded-3xl p-5">
  {/* contenido */}
</div>
```

### Contenido premium gateado

```tsx
import PremiumLock from '@/components/PremiumLock'

<PremiumLock label="Meditación Premium">
  <MiComponentePremium />
</PremiumLock>
```

### Consumo de contextos

```tsx
import { usePremium } from '@/context/PremiumContext'
import { useAdmin } from '@/context/AdminContext'

const { isPremium, upgradeToPremium } = usePremium()
const { isAdmin } = useAdmin()
```

---

## Base de datos (Supabase)

### Tablas principales

| Tabla | Descripción |
|---|---|
| `contacts` | Mensajes del formulario de contacto |
| `leads` | Emails captados (fuente: web, test, programa, etc.) |
| `subscribers` | Lista maestra de suscriptores (deduplicada por email) |
| `community_posts` | Posts del foro comunitario |
| `clients` | CRM de clientes (admin) |
| `calls` | Registro de llamadas (admin) |
| `diary_entries` | Entradas del diario (por user_email + date, único) |
| `mapa_entries` | Registros del mapa de consciencia (por user_email + date, único) |
| `neuroscore_entries` | Hábitos diarios (por user_email + date, único) |
| `programa_progress` | Progreso del programa 21 días (por user_email, único) |
| `test_results` | Resultados del test de ruido mental |

### Cliente Supabase

```ts
import { getSupabase } from '@/lib/supabase'

const supabase = getSupabase() // singleton, lanza error si no hay env vars
```

Requiere variables de entorno:
```
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key
```

### API Routes — patrón estándar

```ts
// src/app/api/ejemplo/route.ts
import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export async function GET() {
  try {
    const supabase = getSupabase()
    const { data, error } = await supabase.from('tabla').select('*').order('created_at', { ascending: false })
    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
  } catch {
    return NextResponse.json({ error: 'Supabase no configurado' }, { status: 503 })
  }
}
```

---

## Sistema de autenticación

### Premium (usuario)

- Estado guardado en `localStorage` con clave `neuroconciencia-plan`
- Valores: `'free'` | `'premium'`
- Gestionado por `PremiumContext`
- **Sin autenticación real** — es una bandera de cliente por ahora

### Admin

- Contraseña hardcodeada en `AdminContext`: `berzosa2024`
- Estado guardado en `localStorage` con clave `neuroconciencia-admin`
- Acceso en `/admin/login` y `/admin`
- **No exponer ni cambiar la contraseña en commits públicos**

---

## IA Coach (`/api/ia-coach`)

El endpoint usa Claude como backend primario con fallback a respuestas locales inteligentes:

1. Si `ANTHROPIC_API_KEY` está configurada → usa `claude-sonnet-4-5-20250929`
2. Si no → detecta palabras clave y devuelve respuestas predefinidas en español

Para activar la IA real añade en `.env.local`:
```
ANTHROPIC_API_KEY=tu-api-key
```

---

## Convenciones de desarrollo

### Nombrado de archivos

- Páginas: `src/app/<ruta>/page.tsx`
- Componentes co-localizados: `src/app/<ruta>/MiComponente.tsx` (PascalCase)
- Componentes globales: `src/components/MiComponente.tsx`
- API routes: `src/app/api/<endpoint>/route.ts`

### TypeScript

- Usar tipos explícitos en props de componentes e interfaces de datos
- `'use client'` al inicio de todo componente que use hooks, eventos o APIs del navegador
- Los Server Components (sin `'use client'`) son los de solo lectura/renderizado

### Importaciones

```ts
// Alias @/ apunta a src/
import Container from '@/components/Container'
import { usePremium } from '@/context/PremiumContext'
import { getSupabase } from '@/lib/supabase'
```

### Iconos

Usar exclusivamente `lucide-react`. Tamaños habituales: `w-4 h-4`, `w-5 h-5`, `w-6 h-6`.

---

## Comandos de desarrollo

```bash
# Instalar dependencias
npm install

# Servidor de desarrollo (http://localhost:3000)
npm run dev

# Build de producción
npm run build

# Servidor de producción
npm start

# Linter
npm run lint
```

---

## Variables de entorno

Copiar `.env.local.example` a `.env.local` y rellenar:

```env
# Supabase (requerido para persistencia de datos)
NEXT_PUBLIC_SUPABASE_URL=https://TU-PROYECTO.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=tu-anon-key-aqui

# Anthropic (opcional — activa IA real en /ia-coach)
ANTHROPIC_API_KEY=tu-api-key-aqui
```

El `.env.local` está en `.gitignore`. **Nunca commitear credenciales reales.**

---

## PWA

- Manifiesto: `public/manifest.json`
- Service Worker: `public/sw.js`
- Registro: `src/components/PWARegister.tsx` (montado en el root layout)
- Icono: `public/icons/icon.svg`
- Safe areas para iPhone/Dynamic Island mediante variables CSS: `--sat`, `--sab`, `--sal`, `--sar`

---

## Navegación

### Desktop
`Navbar.tsx` — sticky en la parte superior, con links principales y botón "Empezar" / badge PRO.

### Móvil
- **Top bar**: logo + botón hamburguesa → dropdown con menú categorizado
- **Bottom tab bar** (`BottomTabBar.tsx`): fijo en la parte inferior, 5 tabs: Inicio, Meditar, Clientes, Llamadas, PRO

El layout aplica `pb-20 md:pb-0` al `<main>` para dejar espacio al tab bar en móvil.

---

## Páginas pendientes de completar / en desarrollo

Las siguientes páginas existen pero están incompletas o son placeholders:

- `/ar-meditacion` — Meditación en realidad aumentada
- `/biofeedback` — Biofeedback
- `/companero` — Compañero de práctica
- `/onboarding` — Flujo de onboarding

---

## Reglas para IA al modificar este proyecto

1. **Idioma**: Todo el contenido visible al usuario debe estar en **español**.
2. **Estética**: Respetar el sistema de diseño oscuro con glassmorphism. No introducir fondos claros ni colores fuera de la paleta.
3. **Componentes**: Reutilizar `Container`, `FadeInSection`, `Card`, `Button`, `PremiumLock` en lugar de crear equivalentes nuevos.
4. **Sin tocar la lógica de negocio**: No modificar la estructura de datos de Supabase, las API routes existentes, ni los contextos de Premium/Admin salvo instrucción explícita.
5. **`'use client'` siempre que sea necesario**: Cualquier componente con `useState`, `useEffect`, `onClick`, etc.
6. **Mantener el alias `@/`**: No usar rutas relativas como `../../components`.
7. **No commitear `.env.local`** ni credenciales reales.
8. **Lucide React para iconos**: No introducir otras librerías de iconos.
9. **Tailwind puro**: No añadir CSS-in-JS ni módulos CSS salvo en `globals.css` para utilidades globales.
10. **Mobile-first**: La app está diseñada principalmente para móvil. Verificar siempre las vistas en móvil antes que en desktop.
11. **Love Mode intocable en refactors de copy**: No modificar mensajes románticos/cute, `LoveModeLayer`, textos en `src/lib/personalized-ui.ts` destinados al tema love, ni el bloque `html[data-theme='love']` en `globals.css` salvo que el usuario pida **explícitamente** cambios en Love Mode. Los refactors de tono del producto principal no deben tocar esta experiencia (tono distinto: íntimo, personal).
