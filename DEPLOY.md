# Pasos para subir Berzosa Neuro a GitHub y Vercel

## Ya hecho (en tu proyecto)
- ✅ Git inicializado
- ✅ Todos los archivos guardados
- ✅ Proyecto listo para desplegar

---

## Paso 1: Subir a GitHub

1. Entra en **https://github.com** e inicia sesión (o crea cuenta gratis).

2. Haz clic en **+** (arriba derecha) → **New repository**.

3. Pon:
   - **Repository name:** `berzosaneuro` (o el nombre que quieras)
   - **Private** o **Public** (tú eliges)
   - **No** marques "Add a README" (ya tienes uno)
   - Clic en **Create repository**

4. En la terminal (o en Cursor: Terminal → New Terminal), ejecuta:

```bash
cd "c:\Users\USUARIO\Desktop\Apps terminadas\Webberzosaneuro-main"
git remote add origin https://github.com/TU-USUARIO/berzosaneuro.git
git branch -M main
git push -u origin main
```

*(Cambia `TU-USUARIO` y `berzosaneuro` por tu usuario y nombre del repo)*

Si GitHub te pide usuario y contraseña, usa un **Personal Access Token** en lugar de la contraseña (Settings → Developer settings → Personal access tokens).

---

## Paso 2: Conectar con Vercel (despliegue automático)

1. Entra en **https://vercel.com** e inicia sesión (con GitHub si quieres).

2. Clic en **Add New...** → **Project**.

3. Importa el repo `berzosaneuro` desde GitHub (selecciónalo en la lista).

4. En **Environment Variables** añade:
   - `NEXT_PUBLIC_SUPABASE_URL` = tu URL de Supabase
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = tu clave anónima de Supabase

5. Clic en **Deploy**.

Vercel generará una URL tipo: `https://berzosaneuro.vercel.app`

Cada vez que hagas `git push` a GitHub, Vercel desplegará automáticamente los cambios.

---

## Paso 3: Base de datos (Supabase)

Antes de usar la app en producción:

1. Entra en **https://supabase.com** → tu proyecto.
2. Ve a **SQL Editor**.
3. Copia el contenido de `supabase/schema.sql` y pégalo en una nueva query.
4. Ejecuta el SQL.

---

## Resumen

| Paso | Qué hacer |
|------|-----------|
| 1 | Crear repo en GitHub y ejecutar los 3 comandos `git` |
| 2 | Importar el repo en Vercel y configurar las 2 variables de Supabase |
| 3 | Ejecutar `supabase/schema.sql` en Supabase |

Cuando termine, tendrás una URL pública que podrás compartir en Instagram.
