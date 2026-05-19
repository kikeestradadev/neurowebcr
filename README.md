# NeuroWebCR — Landing Page

Landing corporativa con **tema light / dark**, Pug modular, Sass, Tailwind CSS 4 y Swiper.

**Demo:** https://kikeestradadev.github.io/neurowebcr/

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
