---
name: Usar Product Brain como fuente de verdad para implementación
description: Ante tareas de implementación, usar issue Markdown CACH, release activa, rama de release, commits trazables y validación; GitHub queda como soporte técnico de PR/CI cuando aplique.
type: feedback
updated: 2026-05-05
---

## Flujo obligatorio para implementación

Ante cualquier tarea de implementacion (nueva funcionalidad, fix, mejora), Codex y Claude Code deben seguir el flujo canonico documentado en:

- `docs/project/process/DEVELOPMENT_WORKFLOW.md`
- `docs/project/process/AGENT_WORKFLOW.md`
- `docs/project/process/BRANCHING_STRATEGY.md`
- `docs/project/process/COMMIT_CONVENTION.md`
- `docs/project/process/RELEASE_PROCESS.md`

### Regla principal

Product Brain (`docs/project/`) es la fuente principal de verdad para:

- backlog;
- issues internas `CACH-*`;
- releases;
- current release;
- planes;
- decisiones;
- cierre de entregables.

GitHub Issues ya no son la fuente principal de verdad. Se usan solo como soporte tecnico cuando haga falta PR, CI, milestone, release tecnica o trazabilidad externa.

## Antes de implementar

1. Leer `docs/project/START_HERE.md`.
2. Leer `docs/project/releases/CURRENT_RELEASE.md`.
3. Leer `docs/project/plans/CURRENT_PLAN.md`.
4. Leer `docs/project/backlog/BACKLOG.md`.
5. Leer la issue Markdown `CACH-*` relacionada.
6. Si falta issue, crear o proponer una issue Markdown antes de implementar.
7. Si falta release activa para una feature grande, parar y proponer crear/activar release.

## Ramas

- Si la tarea pertenece a una release, la rama de trabajo sale de la rama de release activa.
- La rama de trabajo vuelve a la rama de release.
- `main` queda estable hasta el cierre de release.
- Hotfix urgente puede salir de `main`, y luego debe propagarse a la release activa si aplica.

## Commits

Usar:

```text
<type>(CACH-XXXX): summary
```

Ejemplo:

```text
docs(CACH-B0015): document Product Brain release workflow
```

## Validación

- App: `npm run lint` y `npm run build`.
- Product Brain: `npm run pb:check` y `npm run pb:status`.
- UI: revisión visual/responsive/accesibilidad si aplica.
- Datos/finanzas: explicar contrato o cálculo afectado.

## Cierre

Actualizar:

- issue Markdown con resultado, commits, rama y validación;
- release notes;
- `CURRENT_RELEASE.md` si cambia alcance/estado;
- `CURRENT_PLAN.md` si cambia el plan;
- `BACKLOG.md` si cambia estado.

Mantener el checkpoint de memoria pre-PR: actualizar `.memory/` solo si hay preferencias, decisiones duraderas, gotchas recurrentes o reglas de workflow nuevas; si no, declarar `Memoria: no aplica`.

**How to apply:** Para implementación, orientar siempre desde Product Brain y no desde GitHub Issues. Si hay release activa, crear ramas desde `release/<version>` y usar commits trazables a `CACH-*`. Las releases deben ser cortes versionados pequeños, por ejemplo `RELEASE-0.1.0-beta.1` -> `release/0.1.0-beta.1`, para poder mergear a `main` y seguir con `beta.2` si hace falta. `0.1` es ciclo organizativo; `0.1.0-beta.N` son cortes mergeables; `0.1.0` cierra el ciclo con changelog consolidado.
