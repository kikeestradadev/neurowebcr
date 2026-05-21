# Instrucciones de Base de Datos para Codex / Claude / Cursor

## Regla obligatoria
Cualquier cambio a nivel de base de datos (tablas, columnas, índices, constraints, datos semilla críticos) debe implementarse mediante una migración SQL en `scripts/migrations/`.

## Flujo obligatorio
1. Crear un archivo `.sql` nuevo en `scripts/migrations/` con nombre incremental y descriptivo.
2. No modificar migraciones ya ejecutadas en producción.
3. El código de aplicación debe asumir que la migración será corrida con:

```bash
php scripts/run_migrations.php
```

4. Si se requiere rollback, crear una nueva migración correctiva; no reescribir historial.

## Convención de nombre
Usar formato:

```text
YYYYMMDD_NNN_descripcion.sql
```

Ejemplo:

```text
20260521_001_create_contact_click_events.sql
```

## Conexión esperada (local actual)
- Host: `localhost`
- Base de datos: `neurowebcr`
- Usuario: `root`
- Password: `` (vacío)

## Definición para agentes
Si una tarea solicita cambios de base de datos, el agente debe:
- crear la migración en `scripts/migrations/`,
- verificar que `php scripts/run_migrations.php` la aplique,
- y documentar el comando de ejecución para producción.

## Regla de integración con plantillas/frontend
Si el cambio de base de datos depende de eventos frontend (por ejemplo tracking de CTAs):
- aplicar cambios sobre archivos fuente (`src/` y/o JS runtime correspondiente),
- recompilar salidas necesarias,
- y validar que producción sirva assets versionados para evitar cache de JS antiguo.
