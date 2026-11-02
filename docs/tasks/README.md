# Tareas delegables (`docs/tasks/`)

Una tarea por fichero: `T-001-nombre-corto.md`. Son unidades atómicas que un modelo barato puede ejecutar sin más contexto que el propio fichero y los ficheros que lista.

- Plantilla: [_TEMPLATE.md](_TEMPLATE.md).
- Numeración: siguiente número libre, tres dígitos.
- Si la tarea nace de una issue Product Brain, enlázala en `issue:`; la issue `CACH-*` sigue siendo la fuente de producto.
- El bloque `## Verificación` debe contener exactamente un bloque de código `bash` con un único comando; `cheap-worker` lo ejecuta en el worktree y considera éxito su código de salida 0.
- Estados (`status:`): `todo`, `delegated`, `review`, `done`, `redo`.

Reglas para que una tarea sea delegable:

- Toca 1–3 ficheros, idealmente uno.
- Los criterios de aceptación son verificables por el comando.
- No toca auth, RLS, migraciones, secretos ni cálculos financieros (eso lo implementa un cerebro).
