# NeuroConciencia

Supraconciencia, metacognición y neuroplasticidad para apagar el ruido mental y vivir desde el presente.

**Autor:** Berzosa Neuro

## Ejecutar localmente

```bash
npm install
cp .env.local.example .env.local
# Edita .env.local con tus claves de Supabase
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
npm start
```

## Desplegar en Vercel

1. Sube el proyecto a GitHub.
2. En [vercel.com](https://vercel.com) → New Project → Importa el repositorio.
3. Configura las variables de entorno en Vercel (Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` (obligatorio)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` (obligatorio)
   - `ANTHROPIC_API_KEY` (opcional, para IA Coach real)
   - `EMAIL_SMTP_HOST`, `EMAIL_SMTP_PORT`, `EMAIL_SMTP_USER`, `EMAIL_SMTP_PASS`, `EMAIL_NOTIFY_TO` (opcional, para notificaciones)
4. Deploy. El Framework Preset debe detectar Next.js automáticamente.

**Base de datos:** Ejecuta `supabase/schema.sql` en tu proyecto Supabase antes del primer despliegue.
