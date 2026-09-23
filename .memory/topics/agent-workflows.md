# Workflows de agentes

Cargar solo para agentes, planificación, PR/release o mantenimiento de contexto.

## Fuentes canónicas

- Contexto: `docs/agent-context-policy.md`.
- Ejecución OpenCode: `.opencode/README.md`.
- Producto y releases: `docs/project/process/WORKFLOW.md`.
- Supabase remoto: `docs/project/process/supabase-db-access.md`.

## Gotchas duraderos

- Si el usuario pide OpenCode, usar el workflow del repositorio. No delegar cambios triviales.
- Los workers que escriben necesitan ownership explícito; revisión, seguridad y UX permanecen read-only.
- `.opencode/AGENT_STATE.md` y `.opencode/runs/` son estado operativo, no memoria ni historial.
- Orientar Product Brain con `pnpm pb:orient -- --json`; abrir solo issue, parent, release o source-touchpoint relevante.
- `main` está protegida: el check requerido es `app`; no exigir `e2e`, no usar bypass y no mergear con CI rojo.
- Antes de cerrar, verificar contra tarea, diff y criterios; los cambios visuales requieren ruta, viewport y comprobación visual.
- Si el cambio debe verse publicado, la preview no basta: merge a `main`, smoke del dominio de producción y limpieza de rama.
- Las migraciones remotas deben quedar `aplicadas/verificadas` o declararse bloqueantes; un smoke con mocks no prueba persistencia Supabase.
- Guardar aquí reglas reutilizables, nunca reportes de agentes, commits, ramas o cronologías de sesión.
