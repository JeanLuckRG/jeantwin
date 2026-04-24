# Jean Twin V1 — Sitio profesional de Jean Luck Ruiz Granda

Sitio profesional completo con asistente IA integrado.  
**Frontend:** HTML + CSS + Vanilla JS  
**Backend:** Vercel Serverless Function → Gemini API  
**Deploy target:** Vercel (free tier)

---

## Estructura del proyecto

```
jeantwin-v1/
├── api/
│   └── chat.js              ← Endpoint seguro para Gemini API
├── assets/
│   ├── jean-luck.png        ← Foto de perfil
│   ├── favicon.svg          ← Favicon (ya incluido)
│   └── cv-jean-luck-ruiz-granda.pdf  ← COMPLETAR: tu CV en PDF
├── config/
│   └── assistant.js         ← System prompt + KB del asistente
├── css/
│   └── styles.css           ← Design system completo
├── js/
│   └── app.js               ← Nav, chat, formulario
├── index.html               ← Sitio completo (una página)
├── .env.example             ← Variables de entorno requeridas
├── vercel.json              ← Configuración Vercel
├── package.json             ← Dependencias backend
└── README.md
```

---

## Configuración antes de publicar

### 1. API key de Gemini (para el chat IA real)

1. Ve a [aistudio.google.com/app/apikey](https://aistudio.google.com/app/apikey)
2. Crea o copia tu API key
3. En Vercel (después de deploy): **Settings → Environment Variables → GEMINI_API_KEY**

Sin la key, el chat funciona en **modo fallback** (respuestas KB locales). El sitio funciona igual.

### 2. Formulario de contacto (Formspree)

1. Crea cuenta en [formspree.io](https://formspree.io) con `injeanluck@gmail.com`
2. Nuevo formulario → copia el ID (ej. `xabc1234`)
3. En `js/app.js`, línea ~72, reemplaza `YOUR_FORM_ID`:
   ```js
   const FORMSPREE_URL = 'https://formspree.io/f/xabc1234';
   ```

### 3. Placeholders que debes completar en index.html

Busca `<!-- COMPLETAR:` en el HTML — hay 5 lugares:

| Lugar | Qué completar |
|---|---|
| Hero stat card | Años reales de experiencia (actualmente `10`) |
| Formación card 1 | Título universitario + universidad + año |
| Formación card 2 | Primera certificación + entidad + año |
| Formación card 3 | Segunda certificación + entidad + año |
| Formación card 4 | Curso/programa complementario + institución + año |
| CV download | Agrega tu CV real en `assets/cv-jean-luck-ruiz-granda.pdf` |

### 4. Dominio y meta tags

Después de publicar, reemplaza las 4 ocurrencias de `YOUR-DOMAIN.COM` en el `<head>` de `index.html`:
- `<link rel="canonical">`
- `<meta property="og:url">`
- `<meta property="og:image">`
- `<meta name="twitter:image">`

Crea también `og-image.jpg` (1200×630px) — usa Canva o Figma con fondo navy y tu foto.

---

## Correr localmente

### Opción A — sin backend (solo frontend)

Abre `index.html` directamente en el browser. El chat usará modo fallback (KB local).

### Opción B — con backend Gemini (recomendado)

Requiere Node.js 18+ y Vercel CLI.

```bash
# 1. Instalar dependencias
npm install

# 2. Crear archivo de variables de entorno
cp .env.example .env
# Edita .env y agrega tu GEMINI_API_KEY real

# 3. Instalar Vercel CLI (si no lo tienes)
npm install -g vercel

# 4. Correr en local con Vercel dev
vercel dev
```

El sitio estará en `http://localhost:3000`.  
El endpoint del chat estará en `http://localhost:3000/api/chat`.

---

## Deploy a Vercel

### Primera vez (drag & drop — sin CLI)

1. Ve a [vercel.com](https://vercel.com) → **Add New Project**
2. **Import Git Repository** si tienes el código en GitHub, o usa **drag & drop** de la carpeta
3. En **Environment Variables**, agrega `GEMINI_API_KEY` con tu key real
4. Click **Deploy**

### Con Vercel CLI

```bash
# Login
vercel login

# Deploy a preview
vercel

# Deploy a producción
vercel --prod
```

### Dominio personalizado

En Vercel → tu proyecto → **Settings → Domains** → agrega tu dominio.

---

## Variables de entorno

| Variable | Requerida | Descripción |
|---|---|---|
| `GEMINI_API_KEY` | No (modo fallback si falta) | API key de Google Gemini |

---

## Comportamiento del chat IA

| Condición | Comportamiento |
|---|---|
| `GEMINI_API_KEY` configurada | Respuestas generadas por Gemini 1.5 Flash |
| Sin API key | Modo fallback — respuestas KB locales de `config/assistant.js` |
| Error de Gemini | Fallback automático a KB local |
| Rate limit excedido (>15 req/min por IP) | Error 429, se muestra mensaje al usuario |

El system prompt completo del asistente está en `config/assistant.js` — edítalo para ajustar el comportamiento, agregar información nueva, o cambiar el tono.

---

## Checklist de publicación

- [ ] `YOUR-DOMAIN.COM` reemplazado en las 4 meta tags
- [ ] `YOUR_FORM_ID` reemplazado en `js/app.js` (Formspree)
- [ ] `GEMINI_API_KEY` configurada en Vercel Environment Variables
- [ ] Stat card "10+" actualizado con años reales de experiencia
- [ ] Sección Formación completada (4 cards con `[corchetes]`)
- [ ] `assets/cv-jean-luck-ruiz-granda.pdf` subido
- [ ] `assets/og-image.jpg` creado (1200×630px) y URL actualizada
- [ ] Probar formulario de contacto con email real
- [ ] Probar chat IA en producción
- [ ] Verificar en mobile (375px)
- [ ] Verificar links externos (WhatsApp, Calendar, LinkedIn)

---

## Información de contacto (referencia)

| Canal | Valor |
|---|---|
| WhatsApp | +57 300 3646376 |
| Email | injeanluck@gmail.com |
| LinkedIn | linkedin.com/in/jean-luck-ruiz-granda-a35088162 |
| Calendario | calendar.app.google/mNCvbC9qWUPPNVBu5 |

---

*Jean Twin V1 · 2026 · Jean Luck Ruiz Granda*
