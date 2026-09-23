# Skills portables

Cargar solo al crear, revisar o exponer skills.

## Fuentes canónicas

- Estrategia y catálogo: `docs/agent-skills-strategy.md`.
- Implementación: `.agents/skills/<skill>/SKILL.md`.
- Validación: `pnpm verify:skills`.

## Gotchas duraderos

- Resolver siempre el alias de `Skill roots` antes de leer: las skills Cultura viven en `.agents/skills/`, no en el directorio global `.system`.
- `.agents/skills/<nombre>/SKILL.md` es la fuente única; `.claude/skills/<nombre>` debe ser un symlink relativo a `../../.agents/skills/<nombre>`, nunca una copia.
- Una skill debe tener un trabajo concreto, triggers claros, procedimiento, salida, calidad y seguridad. Las reglas globales permanecen en `AGENTS.md` o documentación canónica.
- `product-brain-orient` es el nombre vigente. No recrear `brain-orient`; `compact-memory` también se expone como symlink de directorio.
- `product-brain-sdd-review` aplica SDD progresivo y semántico; no crear por defecto otro agente experto en SDD.
- `react-doctor` es advisory y no sustituye revisión CulturaApp, tests, lint ni build.
- `cultura-learning-loop` convierte incidentes en guardrails duraderos; no debe crear diarios ni memoria automática.
- `cultura-agent-orchestration` decide entre trabajo directo, subagentes y OpenCode; evitar delegación en tareas triviales.
- `memory-orient` usa `pnpm memory:route` y el índice único; no mantener tablas o recuentos de archivos dentro de la skill.
