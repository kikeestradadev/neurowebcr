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
