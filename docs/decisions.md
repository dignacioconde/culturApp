# Decisiones de tooling de agentes (ADR breve)

Registro de decisiones sobre la orquestación de agentes y modelos. Las decisiones de producto siguen en Product Brain (`docs/project/decisions/`).

Formato: fecha · decisión · motivo · alternativas descartadas. Si una decisión se reemplaza, márcala `Reemplazada por ADR-xxx` en lugar de borrarla.

## ADR-001 — Cerebros solo vía CLIs oficiales

- Fecha: 2026-11-02
- Decisión: Claude Code y Codex se usan exclusivamente a través de `claude` y `codex`. Ningún componente lee, copia ni reenvía tokens OAuth de suscripción ni imita su identidad.
- Motivo: cumplir los términos de ambos proveedores y evitar bloqueos de cuenta.
- Descartado: proxies tipo "claude-code-router"/"codex-proxy" que reutilizan la sesión de suscripción.

## ADR-002 — Obreros con `opencode run`

- Fecha: 2026-11-02
- Decisión: el servidor `cheap-worker` ejecuta los modelos baratos con `opencode run --model <provider/model> --format json --auto`, con una config aislada vía `OPENCODE_CONFIG`.
- Motivo: OpenCode ya está instalado y en uso en el repo, soporta muchos proveedores (OpenRouter, DeepSeek, DashScope, Zhipu, Ollama) y emite eventos JSON con tokens/coste.
- Descartado: `aider` (no instalado, requiere Python y uv); llamadas HTTP directas (habría que reimplementar el bucle agente).

## ADR-003 — Codex como MCP mediante wrapper propio

- Fecha: 2026-11-02
- Decisión: `tools/codex-bridge/` expone herramientas MCP que invocan `codex exec --sandbox read-only` y `codex review`.
- Motivo: Codex CLI 0.166.0 no ofrece subcomando `mcp-server`; el wrapper usa solo la CLI oficial.
- Descartado: fijar una versión antigua de Codex con `mcp-server`.

## ADR-004 — Aislamiento por worktree y sin merge automático

- Fecha: 2026-11-02
- Decisión: cada delegación crea un worktree en `.worktrees/` con rama `worker/T-xxx-<alias>`. El servidor nunca hace merge; un cerebro revisa con `/task-review`.
- Motivo: los modelos baratos fallan más en cambios multi-fichero; el aislamiento evita romper la rama de trabajo.
- Descartado: trabajar en la rama actual con stash; abrir PR automática.

## ADR-005 — Servidores MCP en Node

- Fecha: 2026-11-02
- Decisión: `cheap-worker` y `codex-bridge` se escriben en Node (ESM) con `@modelcontextprotocol/sdk`.
- Motivo: el repo ya es Node/pnpm; no hay `uv` ni Python moderno por defecto.
- Descartado: Python + FastMCP.

## ADR-006 — Consumo de obreros desde la sesión de OpenCode

- Fecha: 2026-11-02
- Decisión: tras cada intento, `cheap-worker` lee `opencode session export <id>` y registra coste y tokens en `logs/worker.jsonl` del checkout principal, junto a `.env`.
- Motivo: en OpenCode 2.2.1 `run --format json` no siempre emite el evento final con tokens; el export trae el coste calculado por OpenCode. Compartir `.env` y logs entre worktrees evita duplicar claves y fragmentar el informe.
- Descartado: consultar saldos de cada proveedor (solo algunos tienen API, sin desglose por tarea); estimar coste con precios de `config/models.yaml`.
