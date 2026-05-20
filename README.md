# NeuroWebCR — Landing Page

Corporate landing page built with **light/dark theme**, modular Pug, Sass, Tailwind CSS 4, and Swiper.

**Demo:** https://neurowebcr.com/

## Stack and Build Flow (Prepros)

```text
src/pug/          →  public/index.html        (Pug)
src/styles/       →  styles.css               (Sass / Prepros)
tailwind.css      →  public/tailwind-dist.css (Tailwind CLI)
src/js/           →  public/index-dist.js     (Prepros / bundler)
public/site.js    →  theme + menu + Swiper
```

### Prepros Order (recommended flow)

1. `src/styles/styles.scss` → `src/styles/styles.css`
2. `src/styles/tailwind.css` → `public/tailwind-dist.css`
3. `src/pug/pages/index.pug` → `public/index.html`

Prepros does **not** generate `public/en/index.html` automatically. Run once per session:

```bash
npm run build:pug
```

`npm run build*` scripts are optional if you prefer terminal-based builds.

## Theme Structure

| File | Role |
|------|------|
| `src/styles/core/_theme.scss` | CSS tokens `--nw-*` (light/dark) |
| `src/styles/components/_logo.scss` | Theme-based logo visibility |
| `src/styles/components/_theme-toggle.scss` | Sun/moon toggle styles |
| `src/js/core-modules/themeModule.js` | Theme logic (ES modules) |
| `public/site.js` | Runtime logic for deploy without bundler |
| `src/pug/config/_branding.pug` | Logo paths |
| `src/pug/mixins/logo.pug` | `+logoHorizontal`, etc. |
| `src/pug/mixins/theme-toggle.pug` | `+themeToggle` |

### Logos (`public/images/`)

| File | Usage |
|------|------|
| `logo_b_h.png` | Black horizontal logo (light theme header) |
| `logo_b_v.png` | Black vertical watermark (light hero) |
| `logo_w_h.png` | White horizontal logo (dark theme/footer) |
| `logo_w_v.png` | White vertical watermark (dark hero) |

### Semantic Tailwind Classes

Use token-driven classes:

- `bg-nw-bg`, `bg-nw-surface`, `text-nw-text`, `text-nw-text-muted`
- `bg-nw-accent`, `border-nw-surface-muted`
- `section-band` for portfolio/footer contrast section

Avoid fixed `bg-white` / `text-black` unless intentionally required.

### Persistence

- `localStorage` key: `nw-theme` (`light` | `dark`)
- If no stored value exists, `prefers-color-scheme` is used
- Inline `<head>` script prevents theme flash

## Languages (ES / EN)

The landing is generated in two language variants:

| Language | Local URL | Output |
|----------|-----------|--------|
| Spanish | `/` | `public/index.html` |
| English | `/en/` | `public/en/index.html` |

Content source:

- `src/locales/es.json`
- `src/locales/en.json`

Build:

```bash
npm run build:pug
```

## Pug Layout

```text
src/pug/
├── config/
│   ├── template.pug
│   └── _branding.pug
├── mixins/
│   ├── logo.pug
│   └── theme-toggle.pug
├── modulos/
└── pages/
    └── index.pug
```

Global variables (WhatsApp, email, current year) are defined in `index.pug` (`append config` block).

## NPM Scripts

```bash
npm install
npm run build:pug
npm run deploy
npm run deploy:full
```

## Local Dev Environment (XAMPP)

Expected local path:

```bash
/Applications/XAMPP/xamppfiles/htdocs/neurowebcr
```

### Local build

```bash
npm run build
```

Expected output:

- `public/index.html`
- `public/en/index.html`
- `public/tailwind-dist.css`

Notes:

- Sass deprecation warnings and Node module-type warnings may appear.
- Warnings do not block current build/deploy flow.

### Local URLs

- `http://localhost/neurowebcr` may show a directory listing depending on Apache config.
- Landing URL: `http://localhost/neurowebcr/public/`
- English: `http://localhost/neurowebcr/public/en/`

## Production Deploy (cPanel / Apache)

Use generated assets from `public/` for `https://neurowebcr.com/`.

1. Build locally:

```bash
npm install
npm run build
```

2. In cPanel File Manager, open domain docroot (`public_html` or mapped docroot).
3. Upload **contents of `public/`** to docroot (not the `public` folder itself).
4. Verify presence of: `index.html`, `en/`, `tailwind-dist.css`, `site.js`, `images/`.
5. Test:
   - `https://neurowebcr.com/`
   - `https://neurowebcr.com/en/`

### Canonical host and protocol (Search Console)

`public/.htaccess` applies dynamic `301` behavior:

- force HTTPS on current host
- normalize host by removing `www.`
- no hardcoded domain

Local bypass:

- redirects are disabled on `localhost` and `127.0.0.1`

### Shared Hosting Note

If server runtime is incompatible (for example Tailwind 4 build requirements), do not build on server. Build locally, then upload artifacts.

### Production Troubleshooting

1. If homepage is up but images return `404`, confirm docroot mapping first.
2. If docroot is correct, validate file and directory permissions:

```bash
cd /home/ovalhost/neurowebcr/public
find . -type d -exec chmod 755 {} \;
find . -type f -exec chmod 644 {} \;
```

3. Validate with:

```bash
curl -I https://neurowebcr.com/images/ico.png
curl -I https://neurowebcr.com/images/logo_w_v.png
curl -I https://neurowebcr.com/images/pf/mb.png
```

## GitHub Pages (Prepros deploy flow)

Deploy publishes the `public/` directory output.

### Pre-deploy checklist

1. Prepros completed Sass + Tailwind + Pug without errors.
2. Updated outputs exist:
   - `public/index.html`
   - `public/tailwind-dist.css`
   - `public/site.js`
   - `public/images/`
   - `public/en/index.html`
3. Repository visibility and Pages settings are valid.

Deploy:

```bash
npm run deploy
```

Example URLs:

- `https://<your-user>.github.io/neurowebcr/`
- `https://<your-user>.github.io/neurowebcr/en/`

## Recommended Git Practice (production)

If production servers run `git pull` from `main`, avoid rewriting published `main` history (`rebase` + `push --force`).

Recommended:

1. Work in feature/fix branches.
2. Merge to `main` without rewriting published history.
3. Perform history cleanup only before publication or on non-production branches.

## SEO Technical Status

### Implemented

- Core metadata:
  - `title`
  - `meta description`
  - `meta robots="index,follow,max-image-preview:large"`
- International SEO:
  - absolute canonical URLs per language
  - hreflang: `es`, `en`, `x-default`
- Social metadata:
  - Open Graph (`og:title`, `og:site_name`, `og:description`, `og:type`, `og:url`, `og:image`, `og:locale`, `og:locale:alternate`)
  - Twitter (`twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`)
- Analytics:
  - GA4 (`G-3GGD52GQ13`)
  - Consent Mode v2 default setup for EEA
  - funnel tracking in `public/site.js`
- Structured data (JSON-LD):
  - `Organization`
  - `ProfessionalService`
  - `ContactPoint`
  - `WebSite`
  - `WebPage`
  - `Service` entries per service block
- Indexation artifacts:
  - `public/robots.txt`
  - `public/sitemap.xml` with ES/EN/x-default

### Key SEO files

- `src/pug/config/template.pug`
- `scripts/compile-pug.js`
- `scripts/generate-seo-files.js`
- `package.json` (`build`, `build:seo`)

### SEO build command

```bash
npm run build
```

Execution pipeline:

1. CSS build
2. Pug compile (ES/EN)
3. robots/sitemap generation

### Canonical domain source (`SITE_URL`)

Resolution order:

1. `SITE_URL` environment variable
2. `homepage` in `package.json`
3. fallback `https://neurowebcr.com`

Example:

```bash
SITE_URL="https://neurowebcr.com" npm run build
```

### SEO pending items

1. Set real social profile URLs for `sameAs`.
2. Set real `twitter:site` and `twitter:creator` handles in locale files.
3. Optimize images for Core Web Vitals.
4. Integrate CMP/banner with runtime `gtag('consent', 'update', ...)`.

### Consent Mode v2

Default state in EEA:

- `ad_storage: denied`
- `analytics_storage: denied`
- `ad_user_data: denied`
- `ad_personalization: denied`

Grant example:

```js
gtag('consent', 'update', {
  ad_storage: 'granted',
  analytics_storage: 'granted',
  ad_user_data: 'granted',
  ad_personalization: 'granted'
});
```

### Local validation commands

```bash
rg -n "canonical|hreflang|og:|twitter:|application/ld\\+json|meta name=\"robots\"" public/index.html public/en/index.html
cat public/robots.txt
cat public/sitemap.xml
```

### Funnel events (GA4)

Implemented in `public/site.js`:

- `navigation_click`
- `generate_lead` (WhatsApp and email actions)
- `select_content` (portfolio item clicks)
- `view_section` (section visibility via IntersectionObserver)

Base parameters:

- `page_lang`
- `page_path`

Additional parameters by event:

- `link_text`, `link_target`
- `lead_type`, `cta_text`, `link_url`
- `content_type`, `item_name`, `item_category`
- `section_id`
