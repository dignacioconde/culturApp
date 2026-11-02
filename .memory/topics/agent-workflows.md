# Workflows de agentes

Cargar solo para agentes, planificación, PR/release o mantenimiento de contexto.

## Fuentes canónicas

- Contexto: `docs/agent-context-policy.md`.
- Ejecución OpenCode: `.opencode/README.md`.
- Producto y releases: `docs/project/process/WORKFLOW.md`.
- Supabase remoto: `docs/project/process/supabase-db-access.md`.

## Gotchas duraderos

- Los workers que escriben necesitan ownership explícito; revisión, seguridad y UX permanecen read-only.
- `.opencode/AGENT_STATE.md` y `.opencode/runs/` son estado operativo, no memoria ni historial.
- Orientar Product Brain con `pnpm pb:orient -- --json`; abrir solo issue, parent, release o source-touchpoint relevante.
- `main` está protegida: el check requerido es `app`; no exigir `e2e`, no usar bypass y no mergear con CI rojo.
- Antes de cerrar, verificar contra tarea, diff y criterios; los cambios visuales requieren ruta, viewport y comprobación visual.
- Las migraciones remotas deben quedar `aplicadas/verificadas` o declararse bloqueantes; un smoke con mocks no prueba persistencia Supabase.
- Orquestación multi-modelo: `.env` (claves de obreros) y el registro de consumo de `cheap-worker` viven en el checkout principal y los comparten los worktrees; detalle en `docs/orchestration.md`.
- OpenCode 2.2.1 en scripts: usar `--standalone` para que lea variables de entorno, cerrar stdin (si no, `run` se cuelga) y sacar coste/tokens de `opencode session export <id>`; `opencode models` no acepta filtro de proveedor.
- OpenRouter reserva saldo por el `max_tokens` máximo: limitar `limit.output` por modelo o fallará con «requires more credits» aunque haya algo de saldo.
- Guardar aquí reglas reutilizables, nunca reportes de agentes, commits, ramas o cronologías de sesión.
