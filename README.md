# CCycle — Frontend

Seguimiento menstrual, ciclo y bienestar. React + TypeScript + Vite + PWA.

> Las estimaciones del ciclo son orientativas: no son certezas médicas ni método anticonceptivo.

## Desarrollo local

```powershell
npm install
Copy-Item .env.example .env   # edítalo con tus valores
npm test        # pruebas vitest
npm run dev     # → http://localhost:5173
npm run build   # genera dist/ con PWA (sw.js + manifest)
```

El backend debe estar en marcha (ver repo `Calendario-backend`) y la variable
`VITE_API_URL` debe apuntar a él.

## Variables de entorno

| Variable | Ejemplo | Descripción |
|---|---|---|
| `VITE_SUPABASE_URL` | `https://tu-proyecto.supabase.co` | URL del proyecto Supabase |
| `VITE_SUPABASE_ANON_KEY` | `tu-anon-key` | Clave publicable (anon) |
| `VITE_API_URL` | `http://localhost:8000` | URL del backend (en prod: tu API en Render) |

## Desplegar en Vercel (paso a paso)

1. Entra a [vercel.com](https://vercel.com) e inicia sesión con tu cuenta de GitHub.
2. **Add New → Project → Import** el repositorio `Calendario-Frontend`.
3. Vercel detecta solo **Vite**: deja Framework Preset = Vite,
   Build Command = `npm run build`, Output Directory = `dist`.
4. En **Environment Variables** añade:
   - `VITE_SUPABASE_URL` = tu URL de Supabase
   - `VITE_SUPABASE_ANON_KEY` = tu clave anon
   - `VITE_API_URL` = la URL de tu backend en Render (ej. `https://ccycle-backend.onrender.com`)
5. **Deploy**. Tu app quedará en `https://tu-proyecto.vercel.app`.
6. Después del primer despliegue, copia esa URL y:
   - Añádela a los **Redirect URLs** de Supabase Auth.
   - Úsala como `FRONTEND_URL` / `BACKEND_CORS_ORIGINS` en el backend (Render).

Cada `git push` a `main` redespliega automáticamente.
