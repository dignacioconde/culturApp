# Orquestación multi-modelo — guía de agentes

Detalle bajo demanda de la sección "Handoff y Orquestación" de `AGENTS.md`. Guía de instalación y uso para humanos: `tools/README.md`. Diagrama de arquitectura: [`orchestration-architecture.html`](orchestration-architecture.html) (ábrelo en el navegador).

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

## Comandos de Claude Code

| Comando | Qué hace |
| --- | --- |
| `/task-plan <objetivo> [--codex]` | Subagente `task-splitter` escribe `docs/tasks/T-xxx-*.md`; el cerebro las valida y, con `--codex` o si tocan datos, pide revisión a Codex. |
| `/delegate <T-xxx> [alias] [--no-fallback]` | Llama a `delegate_task`; si pasa, `status: review`. Rechaza tareas de auth/RLS/migraciones/secretos/finanzas. |
| `/task-review <T-xxx> [--codex]` | Revisa la rama worker contra los criterios, re-ejecuta la verificación y emite veredicto. Integra con `cherry-pick` solo tras confirmación del usuario y nunca en `main`. |
| `/handoff [nota]` | Reescribe `docs/handoff.md` con el estado real (git, tareas, ramas worker, consumo). |

Definidos en `.claude/commands/` y `.claude/agents/task-splitter.md`. Se llaman `task-plan`/`task-review` porque `/plan` y `/review` ya existen en Claude Code.

## Pedir a Codex (MCP `codex`)

Herramientas del servidor `tools/codex-bridge/` (siempre `--sandbox read-only`):

- `codex_ask(prompt, model?, cwd?, timeout_s?)` — pregunta libre con acceso de lectura al repo (`codex exec --sandbox read-only --ephemeral`).
- `codex_review(base? | commit? | uncommitted?, prompt?, cwd?, timeout_s?)` — exactamente un objetivo. Sin `prompt` usa `codex review` nativo; con `prompt` usa `codex exec` en solo lectura sobre el mismo diff (`codex review` 0.166 no admite prompt junto a `--base/--commit/--uncommitted`).
- `cwd` es relativo a la raíz del repo y no puede salir de ella; se eliminan `OPENAI_API_KEY`/`CODEX_API_KEY` del entorno para usar siempre el login de la CLI.
- Smoke test: `pnpm smoke:codex` (sin coste) o `pnpm smoke:codex -- --live` (una llamada real).

Prompts tipo:

**Revisión de plan**

> codex_ask: «Revisa el plan de `docs/tasks/T-004*.md` a `T-007*.md` para el objetivo X. Señala tareas no atómicas, dependencias ocultas, criterios no verificables y riesgos de RLS/finanzas. Responde con lista priorizada y sin reescribir el plan.»

**Revisión de diff**

> codex_review: `base: "main"`, `cwd: ".worktrees/T-004-deepseek"`, `prompt: "Revisa contra los criterios de docs/tasks/T-004-*.md. Prioriza bugs, regresiones y cambios fuera de alcance."`

**Segunda opinión sobre un bug**

> codex_ask: «Síntoma: … Reproducción: … Hipótesis actual: … Ficheros sospechosos: … Dame causas alternativas ordenadas por probabilidad y cómo descartarlas. No edites ficheros.»

## Delegar a obreros (MCP `cheap-worker`)

- `list_models()` — alias, id de OpenCode, posición en la cadena, disponibilidad (clave en `.env`, Ollama arrancado), coste aproximado y usos (`config/models.yaml`).
- `delegate_task(task_file, model?, no_fallback?, max_retries?, timeout_s?, budget_s?, base?)` — crea `.worktrees/T-xxx-<alias>` (rama `worker/T-xxx-<alias>`, sufijo `-2`… si ya existe), ejecuta `opencode run`, corre el comando de `## Verificación`, reintenta con el error y recorre la cadena. Si pasa, commitea en la rama worker. Devuelve rama, commit, diff, intentos, modelo usado y coste. Nunca hace merge.
- `usage_report(days?)` — resumen de `logs/worker.jsonl` por modelo: intentos, éxitos, fallos, tokens y coste real.

Cadena por defecto: gratuitos de OpenCode → DeepSeek directo → Ollama → OpenRouter. Los modelos sin clave en `.env` (o sin Ollama) se saltan.

Detalles de funcionamiento:

- `.env` y `logs/` viven en el **checkout principal** (el que contiene `.git`), así sirven desde cualquier worktree.
- OpenCode corre con una config aislada (`OPENCODE_CONFIG` temporal): salida limitada a 8192 tokens por modelo (OpenRouter reserva saldo por el máximo), proveedor Ollama, sin `webfetch`, sin leer `.env` y sin `git commit/push/merge/reset/checkout`.
- El obrero recibe un entorno mínimo: solo la clave del proveedor que usa.
- Antes de commitear se escanea el diff en busca de claves; si aparece una, no se commitea (`secret_blocked`).
- Consumo: `opencode run --format json` no siempre emite tokens, así que tras cada intento se lee `opencode session export <id>` (coste y tokens acumulados de la sesión). Cada intento es una línea en `logs/worker.jsonl`.
- El worktree enlaza `node_modules` del repo para que la verificación funcione sin reinstalar.
- Smoke test: `pnpm smoke:worker` (sin coste) o `pnpm smoke:worker -- --live [--model <alias>]`.

Qué delegar: boilerplate, tests, refactors simples de 1–3 ficheros, docs. Qué no delegar: auth, RLS, migraciones, secretos, cálculos financieros, cambios multi-módulo.

Tras revisar: `git worktree remove .worktrees/T-xxx-<alias>` y, si se descarta, `git branch -D worker/T-xxx-<alias>`.

## Timeouts

- `.claude/settings.json` fija `MCP_TOOL_TIMEOUT` y `CLAUDE_CODE_MCP_TOOL_IDLE_TIMEOUT` a 1 h para tareas largas.
- Cada herramienta acepta `timeout_s`; el servidor mata el proceso hijo al vencer.
