# Berzosa Neuro (NeuroConciencia)

Aplicación web progresiva (PWA) de bienestar mental basada en neurociencia. Método N.E.U.R.O.: Neutraliza el pensamiento, Entrena la atención, Ubícate en el cuerpo, Regula la emoción, Observa sin identificarte.

**Autor:** Berzosa Neuro

---

## Requisitos

- Node.js 18+
- Cuenta en [Supabase](https://supabase.com) (para persistencia)
- Opcional: Anthropic API key (IA Coach), SMTP (notificaciones)

---

## Ejecutar localmente

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local con tus claves
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

### Variables de entorno mínimas

- `NEXT_PUBLIC_SUPABASE_URL` — URL del proyecto Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — Clave anónima (anon/public) de Supabase

Sin ellas, la app arranca pero las APIs devolverán 503 ("Base de datos no configurada"). Ver `.env.local.example` para el resto.

---

## Build y producción

```bash
npm run build
npm start
```

- `npm run build` — Compila para producción
- `npm run start` — Sirve la build
- `npm run lint` — Ejecuta ESLint

---

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. En [vercel.com](https://vercel.com) → Add New → Project → Importa el repo.
3. Variables de entorno (Settings → Environment Variables):

   | Variable | Obligatorio | Descripción |
   |----------|-------------|-------------|
   | `NEXT_PUBLIC_SUPABASE_URL` | ✅ | URL del proyecto Supabase |
   | `NEXT_PUBLIC_SUPABASE_ANON_KEY` | ✅ | Clave anónima Supabase |
   | `NEXT_PUBLIC_ADMIN_PASSWORD` | No | Contraseña del panel admin (por defecto: berzosaneuro) |
   | `ANTHROPIC_API_KEY` | No | Activa IA Coach real (Claude) |
   | `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`, `EMAIL_NOTIFY_TO` | No | SMTP para notificaciones |

4. Deploy — Vercel detecta Next.js automáticamente.

**Base de datos:** Ejecuta `supabase/schema.sql` en el SQL Editor de tu proyecto Supabase antes del primer despliegue.
