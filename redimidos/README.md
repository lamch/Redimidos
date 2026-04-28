# 🕊️ Bot Automático de Noticias — Redimidos.net

Tres archivos que se agregan a tu proyecto Next.js existente para publicar noticias cristianas automáticamente cada mañana.

---

## Archivos a agregar a tu repo

```
src/app/api/bot-noticias/route.js   ← Endpoint Next.js (el bot)
scripts/actualizar-noticias.js      ← Script que ejecuta GitHub Actions
.github/workflows/bot-noticias.yml  ← Workflow automático diario
```

---

## Instalación (5 pasos)

### 1. Agregar dependencias al package.json

```bash
npm install @anthropic-ai/sdk fast-xml-parser
```

### 2. Copiar los 3 archivos a tu proyecto

Copia cada archivo en la ruta indicada dentro de tu proyecto `Redimidos-main`.

### 3. Crear variable de entorno local (.env.local)

```env
# Clave de Anthropic — console.anthropic.com
ANTHROPIC_API_KEY=sk-ant-xxxxxxxxxxxxx

# Secreto para proteger el endpoint (inventa uno largo, ej: openssl rand -hex 32)
CRON_SECRET=pon_aqui_un_secreto_largo_y_aleatorio

# (Opcional) Unsplash para imágenes
UNSPLASH_KEY=
```

### 4. Agregar Secrets en GitHub

Ve a tu repo → **Settings → Secrets and variables → Actions → New repository secret**

| Secret | Valor |
|--------|-------|
| `ANTHROPIC_API_KEY` | Tu clave de Anthropic |
| `CRON_SECRET` | El mismo valor que pusiste en .env.local |
| `VERCEL_URL` | `https://www.redimidos.net` (o la URL de Vercel) |
| `UNSPLASH_KEY` | (Opcional) Clave gratuita de Unsplash |

### 5. Agregar variables de entorno en Vercel

Ve a vercel.com → tu proyecto → **Settings → Environment Variables**

Agrega:
- `ANTHROPIC_API_KEY`
- `CRON_SECRET`
- `UNSPLASH_KEY` (opcional)

---

## Cómo funciona

```
GitHub Actions (7 AM Bolivia)
    │
    ├─→ POST https://redimidos.net/api/bot-noticias
    │       │
    │       ├─ Recopila noticias de 6 fuentes RSS
    │       ├─ Claude AI genera resúmenes en español
    │       └─ Retorna JSON con las noticias
    │
    ├─→ scripts/actualizar-noticias.js
    │       ├─ Inserta nuevas noticias al inicio de public/data/noticias.json
    │       └─ Evita duplicados, mantiene máx. 200 noticias
    │
    └─→ git commit + push
            └─ Vercel detecta el push y redespliega automáticamente ✓
```

---

## Ejecutar manualmente

Desde GitHub → **Actions → Bot Noticias Cristianas → Run workflow**

Puedes elegir:
- Cantidad de noticias (1-10)
- Dry run: ver el resultado sin guardar

---

## Categorías

Las noticias se clasifican automáticamente en: `Actualidad`, `Internacional`, `Vida`, `Ministerio`, `Música`

Si tienes otras categorías en tu sitio, edítalas en `route.js` en el array `CATEGORIAS`.

---

## Costos estimados

| Servicio | Costo aprox. |
|----------|-------------|
| Claude AI (5 noticias/día) | ~$0.05/día = $1.50/mes |
| Unsplash | Gratis |
| GitHub Actions | Gratis |
| Vercel | Gratis (plan hobby) |
