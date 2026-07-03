# Change Guardrails (Git History Based)

Este documento define qué archivos requieren cuidado especial, basado en el historial real de cambios del proyecto.

## Evidencia rápida del historial
Archivos más modificados (frecuencia alta):
- `README.md` (17)
- `public/index.html` (9)
- `public/en/index.html` (9)
- `public/site.js` (6)
- `public/api/db.php` (4)
- `scripts/run_migrations.php` (3)
- `public/api/track_contact.php` (3)

Esto confirma que el riesgo principal está en: markup HTML, tracking JS y capa DB/API.

## Zonas sensibles y reglas

### 1. Markup (`public/*.html`)
- Regla: la fuente de verdad es `public/` — se edita el HTML directamente, sin build ni motor de plantillas.
- Todo cambio de contenido/CTAs debe reflejarse en las 4 páginas: `public/index.html`, `public/servicios.html`, `public/en/index.html`, `public/en/servicios.html`.

Checklist mínimo:
1. editar y validar `public/index.html` / `public/servicios.html`
2. editar y validar `public/en/index.html` / `public/en/servicios.html`
3. confirmar assets versionados `site.js?v=...` y `styles.css?v=...`

### 2. Tracking frontend (`public/site.js`)
- Cambios aquí impactan conversiones (WhatsApp/mail), SEO events y analytics.
- Cualquier cambio requiere prueba funcional real en navegador (ambos CTAs de WhatsApp + correo).

Checklist mínimo:
1. click CTA WhatsApp flotante
2. click CTA WhatsApp sección contacto
3. click CTA correo
4. validar insert en DB

### 3. API y DB (`public/api/*`, `scripts/migrations/*`, `scripts/run_migrations.php`)
- No hardcodear credenciales; usar `.env`.
- Todo cambio de esquema debe ir por migración SQL nueva.
- No editar migraciones ya aplicadas en producción.

Checklist mínimo:
1. `php scripts/run_migrations.php`
2. POST real a endpoint con `curl`
3. `SELECT` de verificación en DB
4. revisar logs (`logs/*.log`)

### 4. Infra SEO/hosting (`public/.htaccess`, `robots`, `sitemap`)
- Cambios tienen impacto inmediato en indexación y canonicalización.
- No tocar sin validar local + producción.

Checklist mínimo:
1. `curl -I` homepage
2. `curl -I` sitemap/robots
3. confirmar redirects esperados (https + sin www)

## Archivos de alto cuidado (no tocar sin motivo claro)
- `public/site.js`
- `public/api/db.php`
- `public/api/track_contact.php`
- `scripts/run_migrations.php`
- `public/.htaccess`

## Política para futuros threads (Codex/Claude/Cursor)
Antes de cerrar una tarea que toque áreas sensibles, el agente debe documentar evidencia de:
1. build/recompilación aplicada,
2. prueba funcional,
3. verificación de datos o logs,
4. validación de producción (si aplica).

Si falta evidencia, la tarea se considera incompleta.
