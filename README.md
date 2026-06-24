# NeuroWebCR — Landing Page

Corporate bilingual landing page for **NeuroWeb Costa Rica** (web development, AI agents, automation).

**Production:** https://neurowebcr.com/

---

## For AI Agents — Quick Reference

Use this section to orient yourself before making changes.

| Topic | Value |
|-------|-------|
| **Architecture** | Static HTML/CSS/JS frontend + PHP REST endpoints + MySQL |
| **Source of truth** | `public/` — edit files directly; there is **no** build step, **no** Pug, **no** `src/`, **no** `package.json` |
| **Spanish page** | `public/index.html` → `/` |
| **English page** | `public/en/index.html` → `/en/` |
| **Shared assets** | `public/styles.css`, `public/site.js`, `public/images/` (EN page references them via `../`) |
| **Runtime JS** | `public/site.js` (theme, menu, Swiper, lead modals, GA4, contact tracking) |
| **Backend API** | `public/api/track_contact.php`, `public/api/submit_lead.php` |
| **Database config** | Root `.env` (see `.env.example`) |
| **Migrations** | `scripts/migrations/*.sql` → run with `php scripts/run_migrations.php` |
| **SEO artifacts** | Embedded in HTML `<head>` + `public/robots.txt` + `public/sitemap.xml` |
| **Deploy target** | Upload **contents of `public/`** to Apache docroot (cPanel shared hosting) |
| **Guardrails** | See `CHANGE_GUARDRAILS.md`, `AI_ENVIRONMENT_CONTEXT.md`, `AI_DATABASE_INSTRUCTIONS.md` |

### Rules agents must follow

1. **Content or copy changes** → edit both `public/index.html` and `public/en/index.html`.
2. **SEO metadata** (title, description, OG, JSON-LD) lives inside each HTML file's `<head>` — update both languages.
3. **CSS changes** → edit `public/styles.css` and bump its cache-buster (`?v=YYYYMMDD`) in both HTML files.
4. **JS changes** → edit `public/site.js`; consider adding or bumping a `?v=` query param in both HTML files to avoid stale cache in production.
5. **Schema changes** → new SQL file in `scripts/migrations/`, never edit applied migrations.
6. **Do not assume** MySQL is unavailable locally — this project uses XAMPP; verify connectivity before reporting DB failures.
7. **Legacy files** (`prepros.config`, docs mentioning Pug/npm) are outdated — ignore them.

---

## Architecture

```text
Browser
  │
  ├── public/index.html          (ES)  ─┐
  ├── public/en/index.html       (EN)  ─┤ static HTML sections
  ├── public/styles.css                ─┤ Tailwind 4 compiled CSS + --nw-* theme tokens
  ├── public/site.js                   ─┤ vanilla JS (no bundler)
  └── CDN: Swiper 11, Google Fonts, GA4
  │
  └── fetch POST ──► public/api/track_contact.php   (click tracking)
                 └──► public/api/submit_lead.php    (lead form submissions)
                           │
                           ▼
                     MySQL (neurowebcr)
                           │
                           ▼
                     logs/ (runtime, not in git)
```

There is **no Node/npm build pipeline** in this repository. The site is served as static files from Apache with PHP endpoints for persistence.

### What changed from the legacy stack

Previously the project used **Pug templates**, **Sass**, **Tailwind CLI**, and **Prepros** under a `src/` directory with npm scripts. That pipeline was removed. All markup, styles, and client logic now live as committed artifacts under `public/`.

---

## Repository Structure

```text
neurowebcr/
├── public/                      # Deploy root — everything served to the web
│   ├── index.html               # Spanish landing (canonical /)
│   ├── en/
│   │   └── index.html           # English landing (/en/)
│   ├── styles.css               # Compiled Tailwind 4 + custom components + theme tokens
│   ├── site.js                  # All client-side runtime logic
│   ├── robots.txt               # Crawler directives
│   ├── sitemap.xml              # ES + EN URLs with hreflang annotations
│   ├── sitemap.xsl              # Human-readable sitemap stylesheet
│   ├── .htaccess                # HTTPS, www normalization, local cache bypass
│   ├── api/
│   │   ├── db.php               # PDO connection, .env loader, logging helpers
│   │   ├── track_contact.php    # POST: CTA click events
│   │   └── submit_lead.php      # POST: lead form submissions
│   ├── assets/
│   │   └── sprite.svg           # Inline SVG sprite
│   └── images/                  # Logos, favicon, team photos, portfolio thumbnails
│       ├── logo_b_h.png         # Black horizontal (light theme header)
│       ├── logo_b_v.png         # Black vertical watermark (light hero)
│       ├── logo_w_h.png         # White horizontal (dark theme / footer)
│       ├── logo_w_v.png         # White vertical watermark (dark hero)
│       ├── ico.png              # Favicon
│       └── pf/                  # Portfolio project images
│
├── scripts/
│   ├── run_migrations.php       # Applies SQL migrations idempotently
│   └── migrations/              # Incremental schema changes
│       ├── 20260521_001_create_contact_click_events.sql
│       ├── 20260521_002_create_lead_submissions.sql
│       ├── 20260521_003_add_phone_lead_type.sql
│       └── 20260521_004_add_service_interest_to_leads.sql
│
├── logs/                        # Runtime logs (gitignored content; create on server)
├── .env                         # Local/production secrets (gitignored)
├── .env.example                 # Template for DB and timezone config
├── CHANGE_GUARDRAILS.md         # Sensitive files and verification checklists
├── AI_ENVIRONMENT_CONTEXT.md    # Local vs production rules for agents
├── AI_DATABASE_INSTRUCTIONS.md  # Migration workflow for agents
└── CHANGELOG.md                 # Release history
```

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Markup | Static HTML5 (hand-authored, bilingual) |
| CSS | Tailwind CSS 4 (pre-compiled into `public/styles.css`) |
| JS | Vanilla ES5-compatible IIFE in `public/site.js` |
| Carousel | Swiper 11 (CDN) |
| Fonts | Inter + Space Grotesk (Google Fonts CDN) |
| Analytics | Google Analytics 4 (`G-3GGD52GQ13`) + Consent Mode v2 |
| Server | Apache + PHP 8+ |
| Database | MySQL / MariaDB via PDO |
| Hosting | cPanel shared hosting (production) |

---

## Page Structure (both languages)

Both HTML files share the same section IDs and layout. Only text content and `lang` attributes differ.

| Section ID | Content |
|------------|---------|
| `#inicio` | Hero — headline, subtitle, CTAs, stats |
| `#servicios` | Service cards (5 services) |
| `#confianza` | Trust / value propositions |
| `#portafolio` | Portfolio Swiper carousel |
| `#equipo` | Team / founders |
| `#faq` | FAQ accordion |
| `#legal` | Privacy policy |
| `#contacto` | Contact cards + lead capture modals (WhatsApp, email, phone) |

### Lead capture modals

Contact CTAs open modals (`data-open-lead-modal="whatsapp|email"`) defined in the `#contacto` section. Submissions POST to `submit_lead.php`. Direct link clicks (e.g. `wa.me`, `mailto:`) are tracked via `track_contact.php`.

---

## Theme System (light / dark)

| Mechanism | Location |
|-----------|----------|
| CSS tokens `--nw-*` | `public/styles.css` (`:root` / `[data-theme=light]` / `[data-theme=dark]`) |
| Theme attribute | `document.documentElement[data-theme]` |
| Anti-flash script | Inline `<script>` in `<head>` of each HTML file |
| Toggle UI | `[data-theme-toggle]` buttons in header |
| Persistence | `localStorage` key `nw-theme` (`light` \| `dark`) |
| Fallback | `prefers-color-scheme` when no stored preference |
| Logo swap | `.logo__img--light` / `.logo__img--dark` visibility via CSS |

### Semantic utility classes

Prefer token-driven classes over hardcoded colors:

- `bg-nw-bg`, `bg-nw-surface`, `text-nw-text`, `text-nw-text-muted`
- `bg-nw-accent`, `border-nw-surface-muted`
- `section-band`, `section-band-muted` for portfolio/footer contrast sections

---

## Internationalization (ES / EN)

| Language | URL | File | `lang` attribute |
|----------|-----|------|------------------|
| Spanish (default) | `/` | `public/index.html` | `es` |
| English | `/en/` | `public/en/index.html` | `en` |

- Language switcher in header links between `./` and `./en/`.
- EN page uses relative paths (`../styles.css`, `../site.js`, `../images/...`) for shared assets.
- SEO hreflang tags in both files: `es`, `en`, `x-default` (default → Spanish).
- **Any content change must be mirrored in both files.**

---

## SEO

SEO is **embedded directly in each HTML file** — there is no build-time generator.

### Implemented in `<head>`

- `<title>`, `<meta name="description">`, `<meta name="robots">`
- Canonical URL and hreflang alternates (absolute URLs to `https://neurowebcr.com/`)
- Open Graph: `og:title`, `og:site_name`, `og:description`, `og:type`, `og:url`, `og:image`, `og:locale`, `og:locale:alternate`
- Twitter Card: `twitter:card`, `twitter:title`, `twitter:description`, `twitter:image`
- Geo meta tags (Costa Rica / Alajuela)
- JSON-LD `@graph` with: `Organization`, `ProfessionalService`, `WebSite`, `WebPage`, five `Service` nodes

### Crawler files

| File | Purpose |
|------|---------|
| `public/robots.txt` | Allows all; points to sitemap |
| `public/sitemap.xml` | ES + EN URLs with `xhtml:link` hreflang entries |
| `public/sitemap.xsl` | Browser-friendly sitemap view |

### Apache rules (`public/.htaccess`)

- Force HTTPS (dynamic host, no hardcoded domain)
- Strip `www.` prefix (301)
- **Disabled on** `localhost` / `127.0.0.1`
- No-cache headers on local dev to avoid stale assets while iterating

### SEO maintenance checklist

When changing titles, descriptions, or services:

1. Update `<title>`, meta description, OG/Twitter tags in **both** HTML files.
2. Update the JSON-LD block in **both** HTML files (keep `@id` URLs consistent).
3. Update `lastmod` in `public/sitemap.xml` if URLs or content changed materially.

### Pending SEO items

- Add real social profile URLs beyond LinkedIn in JSON-LD `sameAs`.
- Set `twitter:site` / `twitter:creator` handles if accounts exist.
- Integrate a CMP/banner that calls `gtag('consent', 'update', ...)` for EEA visitors.

---

## Analytics (GA4)

**Property ID:** `G-3GGD52GQ13`

### Consent Mode v2 (EEA default: denied)

```js
gtag('consent', 'default', {
  ad_storage: 'denied',
  analytics_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  wait_for_update: 500,
  region: ['AT','BE','BG', /* ... EU/EEA countries ... */]
});
```

### Custom events (`public/site.js`)

| Event | Trigger |
|-------|---------|
| `navigation_click` | Header / mobile nav links |
| `generate_lead` | WhatsApp, email, phone CTA clicks |
| `select_content` | Portfolio card clicks |
| `view_section` | Section visibility via `IntersectionObserver` |

Base params on all events: `page_lang`, `page_path`.

---

## Backend API

### `POST /api/track_contact.php`

Records CTA click events (WhatsApp, email, phone links).

**Payload fields:** `lead_type`, `cta_text`, `link_url`, `page_lang`, `page_path`, `referrer_url`

**Table:** `contact_click_events`

### `POST /api/submit_lead.php`

Records lead form submissions from modals.

**Payload fields:** `lead_type`, `full_name`, `service_interest`, `whatsapp_number` / `phone` / `email`, `message`, `page_lang`, `page_path`

**Table:** `lead_submissions`

### Database tables

```sql
contact_click_events  -- id, lead_type, cta_text, link_url, page_lang, page_path,
                      -- referrer_url, user_agent, ip_address, created_at

lead_submissions      -- id, lead_type, full_name, service_interest, whatsapp_number,
                      -- phone, email, message, page_lang, page_path,
                      -- ip_address, user_agent, created_at
```

`lead_type` accepts: `whatsapp`, `email`, `phone`.

---

## Environment & Database

Copy the template and adjust for your environment:

```bash
cp .env.example .env
```

```dotenv
DB_HOST=localhost
DB_HOST_FALLBACK=127.0.0.1
DB_PORT=3306
DB_NAME=neurowebcr
DB_USER=root
DB_PASSWORD=
DB_CHARSET=utf8mb4
APP_TIMEZONE=America/Costa_Rica
DB_TIMEZONE_OFFSET=-06:00
```

### Apply migrations

```bash
php scripts/run_migrations.php
```

Rules:

1. Create new `.sql` files under `scripts/migrations/` with format `YYYYMMDD_NNN_description.sql`.
2. Never modify migrations already applied in production.
3. For corrections, add a new migration — do not rewrite history.

### Local development (XAMPP)

Expected project path:

```text
/Applications/XAMPP/xamppfiles/htdocs/neurowebcr
```

Local URLs:

- Spanish: `http://localhost/neurowebcr/public/`
- English: `http://localhost/neurowebcr/public/en/`

Local DB defaults: host `localhost` (fallback `127.0.0.1`), database `neurowebcr`, user `root`, empty password.

---

## Production Deploy (cPanel / Apache)

1. Ensure `.env` exists on the server with production credentials.
2. Run migrations on the server: `php scripts/run_migrations.php`
3. Upload **contents of `public/`** to the domain docroot (not the `public` folder itself).
4. Ensure `logs/` exists and is writable by the web server:

```bash
mkdir -p logs
chown -R <web-user>:<web-group> logs
chmod -R 775 logs
```

5. Verify:
   - https://neurowebcr.com/
   - https://neurowebcr.com/en/
   - https://neurowebcr.com/sitemap.xml
   - https://neurowebcr.com/robots.txt

### Post-deploy verification

```bash
# Assets served
curl -s https://neurowebcr.com/ | grep -E "styles.css\\?v=|site.js"

# Tracking endpoint
curl -i -X POST "https://neurowebcr.com/api/track_contact.php" \
  -H "Content-Type: application/json" \
  -d '{"lead_type":"whatsapp","cta_text":"deploy_test","link_url":"https://wa.me/50670118183","page_lang":"es","page_path":"/"}'

# DB writes
# SELECT id, lead_type, cta_text, page_path, created_at
# FROM contact_click_events ORDER BY id DESC LIMIT 20;

# Logs on failure
# tail -n 100 logs/track_contact_requests.log
# tail -n 100 logs/mysql_errors.log
```

Build on the server is **not required** — compile CSS locally if needed, then upload artifacts.

---

## Sensitive Files (handle with care)

| File | Risk |
|------|------|
| `public/index.html`, `public/en/index.html` | SEO, content, tracking markup |
| `public/site.js` | Analytics, lead capture, theme, API calls |
| `public/styles.css` | Global layout and theme |
| `public/.htaccess` | Redirects, caching |
| `public/api/db.php` | Database credentials path |
| `public/api/track_contact.php`, `public/api/submit_lead.php` | Lead data pipeline |
| `scripts/run_migrations.php` | Schema state |
| `public/robots.txt`, `public/sitemap.xml` | Indexation |

See `CHANGE_GUARDRAILS.md` for verification checklists before closing tasks that touch these files.

---

## Git Workflow (production)

If production servers run `git pull` from `main`:

- Work in feature branches; merge to `main` without rewriting published history.
- Avoid `rebase` + `force push` on `main` after deployment.

---

## Related Documentation

| File | Purpose |
|------|---------|
| `CHANGE_GUARDRAILS.md` | Checklists for template, tracking, API, SEO changes |
| `AI_ENVIRONMENT_CONTEXT.md` | Local XAMPP vs production rules for AI agents |
| `AI_DATABASE_INSTRUCTIONS.md` | Migration conventions for AI agents |
| `CHANGELOG.md` | Release history |
