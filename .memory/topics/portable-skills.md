# Portable Skills Memory

## 2026-05-03 - Skills Use A Single Source With Claude Symlinks

- Context: Commit `f542ffa` added portable skills under `.agents/skills/`, `.agents/templates/portable-skill/SKILL.md`, and `.claude/skills/*` symlinks.
- Durable memory: `.agents/skills/<skill-name>/SKILL.md` is the canonical source; `.claude/skills/<skill-name>` should remain a relative symlink to `../../.agents/skills/<skill-name>`. Do not duplicate skill bodies into `.claude`.
- Source: `docs/agent-skills-strategy.md`; `README.md`; `TECHDOC.md`; `AGENTS.md`.

## 2026-05-08 - Skill Set Actualizado: 16 Skills Portables

- Context: Product Brain v2 consolidó skills de orientación, release, revisión, memoria, contexto y comunicación concisa. `brain-orient` legacy fue sustituido por `product-brain-orient`.
- Durable memory: las skills canónicas viven en `.agents/skills/` y se exponen como symlinks en `.claude/skills/`. El catálogo actual incluye: `agent-context-maintenance`, `caveman`, `compact-memory`, `cultura-agent-orchestration`, `cultura-code-review`, `cultura-data-finance-review`, `cultura-frontend-review`, `cultura-issue-launch`, `cultura-release-task-flow`, `cultura-security-privacy-review`, `cultura-testing-release-check`, `memory-orient`, `memory-protocol`, `portable-skill-authoring`, `product-brain-capture` y `product-brain-orient`.
- Source: `docs/agent-skills-strategy.md`; `npm run verify:skills`.

## 2026-05-07 - cultura-agent-orchestration: Delegación Codex/Claude/OpenCode

- Context: Beta 6 necesitaba acelerar revisión de planes y trabajo con agentes sin depender siempre de OpenCode.
- Durable memory: `cultura-agent-orchestration` decide cuándo usar trabajo directo, subagentes nativos de Codex/Claude, agentes OpenCode, revisión paralela, ownership de escritura y verificación. Mantiene OpenCode para peticiones explícitas o flujos que lo requieran, y evita delegación en tareas triviales.
- Source: `.agents/skills/cultura-agent-orchestration/SKILL.md`; `docs/agent-skills-strategy.md`.

## 2026-05-08 - Product Brain Orient Reemplaza Brain Orient Legacy

- Context: Product Brain migró a v2 plano y los agentes necesitan orientación eficiente sin cargar todo `docs/project/`.
- Durable memory: `product-brain-orient` vive en `.agents/skills/product-brain-orient/SKILL.md` y se expone en `.claude/skills/product-brain-orient`. `.claude/skills/brain-orient` legacy queda eliminado. `compact-memory` debe exponerse como symlink de directorio `.claude/skills/compact-memory`, no como `.md`.
- Source: `.agents/skills/product-brain-orient/SKILL.md`; `docs/agent-skills-strategy.md`.

## 2026-05-06 - memory-orient: Briefing De Memoria Por Contexto De Tarea

- Context: No existía una forma rápida de obtener solo la memoria relevante para una tarea concreta sin leer los 17 archivos completos. Análogo a `brain-orient` pero para `.memory/`.
- Durable memory: `/memory-orient` lee `MEMORY.md` + `core.md`, identifica área de la tarea por keywords, y carga solo los archivos `.memory/` relevantes según tabla de routing (formularios → `topics/forms.md`, calendario → `projects/calendar.md`, etc.). Output: briefing < 20 líneas. Es read-only (no escribe memoria). Usar en paralelo con `brain-orient` al inicio de sesiones de planificación grandes.
- Source: `.agents/skills/memory-orient/SKILL.md`; análisis 2026-05-06.

## 2026-05-03 - Memory Is Local Markdown And Lower Priority Than Canonical Docs

- Context: Commit `37ff950` added `.memory/`, `docs/agent-memory.md`, and the `memory-protocol` skill.
- Durable memory: memory is for durable, small, auditable context; it must not store secrets and must never outrank current user instructions, `AGENTS.md`, source code, migrations, tests, or canonical docs.
- Source: `.agents/skills/memory-protocol/SKILL.md`; `docs/agent-memory.md`; `.memory/core.md`.
