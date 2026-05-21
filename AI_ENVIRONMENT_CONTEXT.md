# Contexto de Entorno (Local y Producción)

Este archivo define reglas obligatorias para agentes (Codex, Claude, Cursor) cuando trabajen en este proyecto.

## Regla principal
No asumir que MySQL local "no está disponible" sin verificar primero. En este proyecto, el entorno local usa XAMPP y MySQL **sí debe considerarse accesible** cuando el servicio esté encendido.

## Entorno local (desarrollo)
- Ruta del proyecto: `/Applications/XAMPP/xamppfiles/htdocs/neurowebcr`
- Stack local: XAMPP (Apache + MySQL)
- Base de datos: `neurowebcr`
- Host: `localhost`
- Usuario: `root`
- Password: vacío (`""`)

### Validación mínima obligatoria antes de reportar fallo de DB
1. Verificar que MySQL esté arriba en XAMPP.
2. Probar conectividad TCP explícita si hay error por socket:
   - usar `127.0.0.1` como host de prueba.
3. Si sigue fallando, reportar error exacto y acción siguiente concreta.

## Producción
- El entorno de producción puede diferir en host, usuario, password, puerto y políticas de red.
- Nunca asumir que las credenciales de local aplican en producción.
- Toda configuración sensible de producción debe ser configurable por variables de entorno o archivo de configuración del servidor.

## Reglas de cambios de base de datos
1. Todo cambio de base de datos debe ir en migraciones SQL en `scripts/migrations/`.
2. Ejecutar con:

```bash
php scripts/run_migrations.php
```

3. No editar migraciones históricas ya aplicadas en producción.
4. Si hay que corregir algo, crear una nueva migración.

## Instrucción operativa para agentes
Cuando una tarea toque base de datos:
- implementar migración,
- ejecutar/validar `php scripts/run_migrations.php`,
- documentar resultado,
- y si hay diferencias local vs prod, dejarlas explícitas en el reporte final.

## Regla anti-regresión (tracking frontend + API)
Cuando se cambie cualquier lógica de tracking frontend o endpoints bajo `public/api/`:
1. Verificar que `public/index.html` y `public/en/index.html` reflejen cambios de assets versionados (`site.js?v=...`).
2. Confirmar que el endpoint acepte `POST` real con `curl`.
3. Confirmar escritura en DB (`SELECT` de últimos registros).
4. Confirmar permisos de `logs/` y revisar trazas (`track_contact_requests.log`, `mysql_errors.log`).
5. No cerrar la tarea hasta tener evidencia de estos 4 puntos en el reporte.

## Regla de plantillas y build (Prepros/Pug)
- La fuente real es `src/`; `public/` es salida compilada.
- No resolver cambios funcionales editando HTML generado en `public/` de forma manual.
- Si se toca template/tracking/assets, recompilar y validar `public/index.html` + `public/en/index.html`.
- Confirmar que el HTML final tenga assets versionados (`site.js?v=...`, `tailwind-dist.css?v=...`) antes de cerrar la tarea.
