# Orquestación multi-modelo — guía de agentes

Detalle bajo demanda de la sección "Handoff y Orquestación" de `AGENTS.md`. Guía de instalación y uso para humanos: `tools/README.md`.

## Roles

| Rol | Quién | Cómo se invoca | Credencial |
| --- | --- | --- | --- |
| Cerebro principal | Claude Code | `claude` / extensión | Suscripción Claude (login de la CLI) |
| Segundo cerebro | Codex | MCP `codex` → `codex exec`/`codex review` | Suscripción ChatGPT (login de la CLI) |
| Obrero | DeepSeek, Qwen, GLM… | MCP `cheap-worker` → `opencode run` | API key propia en `.env` |
| Obrero local | Ollama | MCP `cheap-worker` → `opencode run` | Ninguna |

## Ciclo de una tarea

1. **Planificar** (`/task-plan`): un cerebro divide el objetivo en `docs/tasks/T-xxx-*.md`.
2. **Delegar** (`/delegate T-xxx [alias]`): `cheap-worker` crea `.worktrees/T-xxx-<alias>` en la rama `worker/T-xxx-<alias>`, ejecuta el obrero, verifica, reintenta, hace fallback y commitea en esa rama.
3. **Revisar** (`/task-review T-xxx`): un cerebro lee el diff y, si es delicado, pide opinión a Codex. Veredicto: `aprobar` / `pedir cambios` / `rehacer con modelo mejor`.
4. **Integrar**: solo tras `aprobar`, el cerebro integra la rama worker (merge o cherry-pick) y borra el worktree.
5. **Handoff** (`/handoff`): actualiza `docs/handoff.md`.

## Pedir a Codex (MCP `codex`)

Herramientas del servidor `tools/codex-bridge/` (siempre `--sandbox read-only`):

- `codex_ask(prompt, cwd?, timeout_s?)` — pregunta libre con acceso de lectura al repo.
- `codex_review(base?, commit?, uncommitted?, prompt?, cwd?, timeout_s?)` — envuelve `codex review`.

Prompts tipo:

**Revisión de plan**

> codex_ask: «Revisa el plan de `docs/tasks/T-004*.md` a `T-007*.md` para el objetivo X. Señala tareas no atómicas, dependencias ocultas, criterios no verificables y riesgos de RLS/finanzas. Responde con lista priorizada y sin reescribir el plan.»

**Revisión de diff**

> codex_review: `base: "main"`, `cwd: ".worktrees/T-004-deepseek"`, `prompt: "Revisa contra los criterios de docs/tasks/T-004-*.md. Prioriza bugs, regresiones y cambios fuera de alcance."`

**Segunda opinión sobre un bug**

> codex_ask: «Síntoma: … Reproducción: … Hipótesis actual: … Ficheros sospechosos: … Dame causas alternativas ordenadas por probabilidad y cómo descartarlas. No edites ficheros.»

## Delegar a obreros (MCP `cheap-worker`)

- `list_models()` — alias, proveedor, id, coste aproximado y usos recomendados (`config/models.yaml`).
- `delegate_task(task_file, model?, timeout_s?)` — devuelve rama, diff, salida de verificación, `passed`, intentos y modelo usado.
- `usage_report()` — resumen de `logs/worker.jsonl` (éxitos, fallos, tokens, coste).

Qué delegar: boilerplate, tests, refactors simples de 1–3 ficheros, docs. Qué no delegar: auth, RLS, migraciones, secretos, cálculos financieros, cambios multi-módulo.

## Timeouts

- `.claude/settings.json` fija `MCP_TOOL_TIMEOUT` y `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` a 1 h para tareas largas.
- Cada herramienta acepta `timeout_s`; el servidor mata el proceso hijo al vencer.
