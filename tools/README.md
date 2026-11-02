# Orquestación multi-modelo — guía de uso

Guía para humanos de las herramientas de `tools/`. El detalle para agentes está en [`docs/orchestration.md`](../docs/orchestration.md) y el diagrama en [`docs/orchestration-architecture.html`](../docs/orchestration-architecture.html), que se abre en el navegador. Las decisiones están en [`docs/decisions.md`](../docs/decisions.md) (ADR-001…006).

**Reparto de papeles:**
- **Cerebros** (Claude Code y Codex, con tu suscripción): planifican y revisan.
- **Obreros** (modelos baratos o locales): implementan tareas pequeñas en ramas aisladas.

Nada se integra sin que lo apruebes.

## Puesta en marcha (una vez)

1. **Dependencias**: `pnpm install`.
2. **CLIs**: `claude` (con `~/.local/bin` en el `PATH`) y `codex` con login de ChatGPT (`codex login status`).
3. **Claves**: copia `.env.example` a `.env` en la raíz del checkout principal y rellena solo lo que uses. Sin ninguna clave funcionan los modelos gratuitos de OpenCode y Ollama.
4. **Ollama** (opcional, respaldo local): `ollama serve` y `ollama pull qwen2.5-coder:7b`.
5. **Aprobar los MCP**: abre `claude` en el repo y aprueba `codex` y `cheap-worker` cuando te lo pida.
6. **Comprobar**:
   ```bash
   pnpm smoke:codex              # protocolo y validaciones (sin coste)
   pnpm smoke:worker             # además lista los modelos disponibles
   pnpm smoke:worker -- --live   # una delegación real mínima (gratis con la cadena por defecto)
   ```

## Uso diario (dentro de Claude Code)

```text
/task-plan Añade X a Y con tests [--codex]   → crea docs/tasks/T-xxx-*.md
/delegate T-001 [alias] [--no-fallback]      → el obrero lo implementa en worktree aislado
/task-review T-001 [--codex]                 → veredicto; integra solo si confirmas
/handoff                                     → actualiza docs/handoff.md
```

Ejemplo real completo, con tiempos y costes: [`examples/demo/README.md`](../examples/demo/README.md).

**Qué delegar:** tests, boilerplate, refactors de 1–3 ficheros y docs. **Qué no:** auth, RLS, migraciones, secretos, finanzas y cambios multi-módulo. Los comandos se niegan a delegarlos.

## Modelos y coste

La cadena por defecto está en [`config/models.yaml`](../config/models.yaml): gratuitos de OpenCode → DeepSeek directo → Ollama → OpenRouter. Si un modelo no tiene clave en `.env` o Ollama está parado, se salta. Solo se pasa a un modelo de pago cuando los anteriores fallan.

- **Ver qué hay disponible**: herramienta `list_models` o `pnpm smoke:worker`.
- **Forzar un modelo**: `/delegate T-001 deepseek --no-fallback`.
- **Consumo real**: herramienta `usage_report` (por modelo: intentos, éxitos, tokens y USD). Cada intento queda en `logs/worker.jsonl` del checkout principal, con el coste que calcula OpenCode.

## Perfiles (opcional)

`pnpm profiles` lanza `claude` y `codex` con configuración y login separados, por ejemplo para una segunda cuenta o un perfil sin conectores personales. Con una sola cuenta no hace falta. Detalle en `docs/orchestration.md`.

## Problemas conocidos

| Síntoma | Causa y solución |
| --- | --- |
| `Model unavailable: openrouter/...` | Falta la clave en `.env`, o no está guardado. |
| `requires more credits, or fewer max_tokens` | OpenRouter reserva saldo por la salida máxima. `cheap-worker` ya la limita a 8192; si ocurre a mano, sube saldo o el límite de la clave. |
| `opencode run` se queda colgado | Tiene stdin abierto. Ejecútalo con `</dev/null`; `cheap-worker` ya lo cierra. |
| `opencode` no ve las claves | Hay que pasar `--standalone`; `cheap-worker` ya lo hace. |
| MCP «Pending approval» | Abre `claude` en el repo y apruébalos. Con un perfil nuevo hay que aprobarlos otra vez. |
| `git worktree remove` falla | Usa `--force`: el worktree enlaza `node_modules`. |
| Quedan worktrees sueltos | `git worktree list`, luego `git worktree remove --force .worktrees/<nombre>` y `git branch -D worker/<nombre>`. |

## Mantenimiento

- **Añadir o cambiar un modelo**: edita `config/models.yaml` (comprueba el id con `opencode models --standalone`) y ejecuta `pnpm smoke:worker`.
- **Cambios de arquitectura**: actualiza a la vez `docs/orchestration.md` y `docs/orchestration-architecture.html`, y añade un ADR si cambia una decisión.
- **Ficheros**:
  - `tools/codex-bridge/`: MCP `codex`.
  - `tools/cheap-worker/`: MCP `cheap-worker`.
  - `tools/lib/run.mjs`: lanzamiento de procesos con timeout.
  - `.mcp.json` y `.claude/settings.json`: registro de los MCP y timeouts.
  - `.claude/commands/` y `.claude/agents/`: comandos y subagente.
