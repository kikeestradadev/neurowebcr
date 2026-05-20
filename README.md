# NeuroWebCR — Landing Page

Landing corporativa con **tema light / dark**, Pug modular, Sass, Tailwind CSS 4 y Swiper.

**Demo:** https://neurowebcr.com/

## Stack y flujo (Prepros)

```
src/pug/          →  public/index.html     (Pug)
src/styles/       →  styles.css            (Sass / Prepros)
tailwind.css      →  public/tailwind-dist.css (Tailwind CLI)
src/js/           →  public/index-dist.js  (Prepros / bundler)
public/site.js    →  tema + menú + Swiper  (copiar o enlazar desde build)
```

### Orden en Prepros (tu flujo habitual)

1. `src/styles/styles.scss` → `src/styles/styles.css`
2. `src/styles/tailwind.css` → `public/tailwind-dist.css`
3. `src/pug/pages/index.pug` → `public/index.html`

Prepros **no** genera `public/en/index.html` solo. Para inglés, una vez por sesión:

```bash
npm run build:pug
```

(Opcional: los scripts `npm run build*` son alternativa por terminal; **no son obligatorios** si usas Prepros.)

## Estructura de temas

| Archivo | Rol |
|---------|-----|
| `src/styles/core/_theme.scss` | Tokens CSS `--nw-*` (light / dark) |
| `src/styles/components/_logo.scss` | Visibilidad logo b/w por tema |
| `src/styles/components/_theme-toggle.scss` | Botón sol/luna |
| `src/js/core-modules/themeModule.js` | Lógica tema (módulos ES) |
| `public/site.js` | Misma lógica para deploy sin bundler |
| `src/pug/config/_branding.pug` | Rutas de logos |
| `src/pug/mixins/logo.pug` | Mixins `+logoHorizontal`, etc. |
| `src/pug/mixins/theme-toggle.pug` | Mixin `+themeToggle` |

### Logos (`public/images/`)

| Archivo | Uso |
|---------|-----|
| `logo_b_h.png` | Negro horizontal → **tema light** (header) |
| `logo_b_v.png` | Negro vertical → watermark hero en light |
| `logo_w_h.png` | Blanco horizontal → **tema dark** / footer |
| `logo_w_v.png` | Blanco vertical → watermark hero en dark |

### Clases Tailwind semánticas

Usar siempre tokens que responden al tema:

- `bg-nw-bg`, `bg-nw-surface`, `text-nw-text`, `text-nw-text-muted`
- `bg-nw-accent`, `border-nw-surface-muted`
- `section-band` → portafolio y footer (banda de contraste)

Evitar `bg-white`, `text-black` fijos salvo excepciones (ej. botón WhatsApp verde).

### Persistencia

- `localStorage` clave: `nw-theme` (`light` | `dark`)
- Sin valor guardado → respeta `prefers-color-scheme`
- Script inline en `<head>` evita flash al cargar

## Idiomas (ES / EN)

La landing se genera en **dos versiones** al compilar Pug:

| Idioma | URL local | Archivo |
|--------|-----------|---------|
| Español | `/` | `public/index.html` |
| English | `/en/` | `public/en/index.html` |

**Textos:** edita `src/locales/es.json` y `src/locales/en.json` (nav, hero, servicios, portafolio, contacto, footer).

**Selector:** botón **ES / EN** en el header (enlaces entre ambas versiones).

**Build:** `npm run build:pug` compila las dos páginas. En GitHub Pages: `https://tu-usuario.github.io/neurowebcr/` y `.../neurowebcr/en/`.

## Pug

```
src/pug/
├── config/
│   ├── template.pug      ← layout base (extends)
│   └── _branding.pug     ← rutas logos
├── mixins/
│   ├── logo.pug
│   └── theme-toggle.pug
├── modulos/              ← secciones de la landing
└── pages/
    └── index.pug         ← ensambla módulos
```

Variables globales (WhatsApp, email, año): bloque `append config` en `index.pug`. Traducciones: `src/locales/*.json`.

## Scripts npm

```bash
npm install          # solo la primera vez (para deploy y build:pug)
npm run build:pug    # ES + EN → public/index.html y public/en/index.html
npm run deploy       # sube la carpeta public/ tal como está (sin compilar)
npm run deploy:full  # opcional: npm run build + deploy (sin Prepros)
```

## Dev Environment (XAMPP localhost)

Ruta local esperada:

```bash
/Applications/XAMPP/xamppfiles/htdocs/neurowebcr
```

### Build local

```bash
npm run build
```

Resultado esperado:

- `public/index.html`
- `public/en/index.html`
- `public/tailwind-dist.css`

Notas:

- Warnings de Sass (`@import`, `type-of`, `map-get`) y Node (`MODULE_TYPELESS_PACKAGE_JSON`) pueden aparecer.
- Esos warnings **no bloquean** el build actual ni el deploy.

### URL local

- `http://localhost/neurowebcr` puede mostrar listado de carpeta (según Apache).
- URL funcional de la landing en este setup: `http://localhost/neurowebcr/public/`
- Inglés: `http://localhost/neurowebcr/public/en/`

## Deploy a Producción (cPanel / Apache)

Para `https://neurowebcr.com/`, usar solo el contenido generado en `public/`.
Este proyecto usa Tailwind 4 (requiere Node >= 20 para compilar), por lo que en shared hosting con Node 16 se debe compilar en local.

1. Compilar local:

```bash
npm install
npm run build
```

2. En cPanel (`File Manager`), abrir la carpeta raíz del dominio (`public_html` o la asignada a `neurowebcr.com`).
3. Subir el **contenido de `public/`** directamente a esa raíz (no la carpeta `public`, sino lo que está dentro).
4. Verificar que existan en raíz: `index.html`, `en/`, `tailwind-dist.css`, `site.js`, `images/`.
5. Probar:
   - `https://neurowebcr.com/`
   - `https://neurowebcr.com/en/`

### Nota para Shared Hosting

- Si el servidor muestra `Unsupported engine` o error de `@tailwindcss/oxide`, no ejecutar build en servidor.
- Flujo recomendado: `npm run build` en local + upload del contenido de `public/` a cPanel.

### Troubleshooting Producción (aprendido)

1. Si `https://neurowebcr.com/` abre, pero `/images/...` da `404`:
   - Verifica que el dominio realmente apunte al docroot esperado.
   - Prueba rápida:

```bash
echo "ok-neuro" > /home/ovalhost/neurowebcr/public/probe.txt
curl -I https://neurowebcr.com/probe.txt
```

Si responde `200`, el docroot sí está bien.

2. Si `probe.txt` responde `200` pero imágenes siguen en `404`, revisar permisos de carpetas públicas.
   - En Linux, el servidor necesita permiso de ejecución en carpetas para poder entrar y servir archivos.
   - Recomendado:

```bash
cd /home/ovalhost/neurowebcr/public
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

3. Verificación final:

```bash
curl -I https://neurowebcr.com/images/ico.png
curl -I https://neurowebcr.com/images/logo_w_v.png
curl -I https://neurowebcr.com/images/pf/mb.png
```

Deben responder `200`.

## GitHub Pages (deploy con Prepros)

**No hay un “build” del proyecto en el repo.** Lo que se publica es la carpeta **`public/`** después de que Prepros (y, si aplica, `build:pug`) hayan generado ahí el HTML y el CSS.

### Checklist antes de `npm run deploy`

1. Prepros compiló sin errores (Sass + Tailwind + Pug).
2. Existen y están actualizados:
   - `public/index.html`
   - `public/tailwind-dist.css`
   - `public/site.js`
   - `public/images/`
   - `public/en/index.html` (tras `npm run build:pug`)
3. Repo **público** y Pages activado (ver abajo).

```bash
npm run deploy
```

Eso sube **solo** `public/` a la rama `gh-pages`. No ejecuta Sass ni Pug por ti.

**URLs:** https://heroeskq3.github.io/neurowebcr/ y https://heroeskq3.github.io/neurowebcr/en/

### Si ves 404

1. **Activar Pages** (lo debe hacer el dueño del repo en GitHub): **Settings → Pages** → rama **`gh-pages`**, carpeta **`/ (root)`**  
   O bien: Source = **GitHub Actions** (compila en la nube con `npm run build`; distinto al flujo Prepros).
2. Esperar 1–5 minutos y recargar.

### GitHub Actions vs Prepros

| Método | Quién compila | Cuándo usarlo |
|--------|----------------|---------------|
| **Prepros + `npm run deploy`** | Tú en tu Mac | Tu flujo actual |
| **Push a `main` + Actions** | GitHub (`npm run build`) | Si no usas Prepros en el equipo |

No mezcles ambos sin coordinar: si usas Prepros, despliega con `npm run deploy` después de compilar; no hace falta que Actions compile por ti.

## SEO técnico (estado actual)

### Implementado

- Meta base:
  - `title`
  - `meta description`
  - `meta robots="index,follow,max-image-preview:large"`
- Internacionalización SEO:
  - `canonical` absoluto por idioma (`/` y `/en/`)
  - `hreflang` (`es`, `en`, `x-default`)
- Social meta:
  - Open Graph: `og:title`, `og:site_name`, `og:description`, `og:type`, `og:url`, `og:image`, `og:locale`, `og:locale:alternate`
  - Twitter: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
  - `twitter:site` y `twitter:creator` listos para activarse cuando se definan handles reales
- Medición:
  - Google Analytics 4 (`gtag.js`) instalado globalmente con ID `G-3GGD52GQ13` en la plantilla base
  - Consent Mode v2 configurado con estado por defecto `denied` para usuarios del EEE
  - Tracking de funnel y CTAs en `public/site.js`
- Datos estructurados (`JSON-LD`):
  - `Organization`
  - `ProfessionalService`
  - `WebSite`
  - `WebPage`
- Indexación:
  - `public/robots.txt`
  - `public/sitemap.xml` con versiones ES/EN y `x-default`

### Archivos SEO clave

- Plantilla SEO: `src/pug/config/template.pug`
- Compilación Pug + URLs absolutas: `scripts/compile-pug.js`
- Generación de `robots.txt` y `sitemap.xml`: `scripts/generate-seo-files.js`
- Script build integrado: `package.json` (`build:seo` y `build`)

### Cómo se construye SEO

```bash
npm run build
```

Este comando:
1. Compila CSS
2. Compila Pug (ES/EN)
3. Genera `public/robots.txt` y `public/sitemap.xml`

### Dominio canónico (`SITE_URL`)

La URL base SEO se toma de:
1. Variable de entorno `SITE_URL` (prioridad alta)
2. `homepage` en `package.json`
3. Fallback: `https://neurowebcr.com`

Ejemplo para producción:

```bash
SITE_URL="https://neurowebcr.com" npm run build
```

### Pendientes SEO (acordados)

1. Definir perfiles reales de marca para `sameAs` (Instagram, LinkedIn, GitHub, etc.).
2. Definir `twitter:site` y `twitter:creator` reales en locales:
   - `src/locales/es.json`
   - `src/locales/en.json`
3. (Pendiente separado) Optimización de imágenes para Core Web Vitals.
4. Integrar banner/CMP de cookies que dispare actualización de consentimiento (`gtag('consent', 'update', ...)`) según elección del usuario.

### Consent Mode v2 (GA4)

La plantilla aplica por defecto en EEE:

- `ad_storage: denied`
- `analytics_storage: denied`
- `ad_user_data: denied`
- `ad_personalization: denied`

Cuando el usuario acepte cookies, el banner/CMP debe ejecutar:

```js
gtag('consent', 'update', {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted'
});
```

Si rechaza, mantener `denied`.

### Validación rápida local

```bash
rg -n "canonical|hreflang|og:|twitter:|application/ld\\+json|meta name=\"robots\"" public/index.html public/en/index.html
cat public/robots.txt
cat public/sitemap.xml
```

### Eventos de funnel (GA4)

Implementados en `public/site.js`:

- `navigation_click`
  - Dispara en menú principal y móvil (`.nav-link`, `.mobile-nav-link`).
- `generate_lead`
  - Dispara para clics a WhatsApp (`a[href*="wa.me"]`).
  - Dispara para clics a email (`a[href^="mailto:"]`).
- `select_content`
  - Dispara al hacer clic en proyectos de portafolio (`.portfolio-card--link`).
- `view_section`
  - Dispara una vez por sección al entrar en viewport (IntersectionObserver, `section[id]`).

Parámetros base enviados:

- `page_lang`
- `page_path`

Parámetros adicionales según evento:

- `link_text`, `link_target`
- `lead_type`, `cta_text`, `link_url`
- `content_type`, `item_name`, `item_category`
- `section_id`
