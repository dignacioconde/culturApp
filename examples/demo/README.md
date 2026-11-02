# Demo de orquestación (CACH-0106)

Ejecución real del ciclo completo sobre un módulo de juguete (`text.mjs`), sin tocar la app. Sirve como ejemplo de uso y como prueba de extremo a extremo de los comandos, los MCP `codex` y `cheap-worker` y los modelos obreros.

```bash
pnpm test:demo   # tests de examples/demo (node:test)
```

## Punto de partida

`text.mjs` exportaba solo `capitalize(text)`, con un test.

Objetivo: añadir `slugify(texto)` y `truncate(texto, max)` con sus tests.

## Qué pasó (2026-11-02)

| Paso | Comando | Resultado | Tiempo | Coste obrero |
| --- | --- | --- | --- | --- |
| 1 | `/task-plan <objetivo> --codex` | `task-splitter` creó [T-001](../../docs/tasks/T-001-slugify-demo.md) y [T-002](../../docs/tasks/T-002-truncate-demo.md). Codex revisó el plan y el cerebro aplicó parte de los comentarios, justificando los descartados. | ~6 min | — |
| 2 | `/delegate T-001` | `deepseek-free` pasó la verificación al primer intento y commiteó en `worker/T-001-deepseek-free`. | 38 s (obrero 18 s) | 0 USD |
| 3 | `/task-review T-001 --codex` | **Aprobar**. Cuatro criterios cumplidos; Codex sin hallazgos. Integrado con `cherry-pick` tras confirmar. | ~1 min | — |
| 4 | `/delegate T-002` | `deepseek-free` pasó al primer intento, partiendo de la rama ya integrada. | ~40 s (obrero 17 s) | 0 USD |
| 5 | `/task-review T-002` | **Aprobar**. Cinco criterios cumplidos; Codex sin hallazgos. Integrado. | ~1 min | — |
| 6 | `/handoff` | `docs/handoff.md` reescrito con git, tareas, ramas worker y `usage_report`. | ~1 min | — |

Total de obreros: 2 tareas, 2 intentos, 0 USD. Los modelos de pago no se usaron porque el primero de la cadena resolvió ambas tareas.

## Qué destapó la demo

- **Bug en `cheap-worker`**: lo detectó el propio cerebro en el paso 2. `changed_files` perdía el primer carácter de la ruta porque se recortaba la salida de `git status --porcelain`. Ya está corregido.
- **`/task-review` necesita `git worktree remove --force`**, porque el worktree enlaza `node_modules` y git lo ve como fichero sin seguimiento. Ya está corregido en el comando.
- **El cerebro se para antes de integrar**, como debe. En modo no interactivo pregunta «¿Lo integro?» y termina sin hacer nada.
- **Un `/handoff` puede borrar riesgos que siguen vigentes**: hay que revisar su diff antes de commitear.

## Reproducirlo sin la interfaz

Dentro de Claude Code basta con escribir los comandos. Para lanzarlos desde la terminal (CI, scripts), `claude -p` necesita cargar los MCP del proyecto sin la aprobación interactiva y con permisos explícitos:

```bash
claude -p '/delegate T-001' \
  --mcp-config .mcp.json --strict-mcp-config \
  --permission-mode acceptEdits \
  --allowedTools "Read Edit Glob Grep Bash(ls:*) mcp__cheap-worker__delegate_task mcp__cheap-worker__list_models"
```

`/task-plan` además necesita `Write Agent Task mcp__codex__codex_ask`. `/task-review` necesita `Bash(git diff:*) Bash(git show:*) Bash(node:*) mcp__codex__codex_review`.
