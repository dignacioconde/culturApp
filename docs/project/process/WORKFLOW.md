---
schema_version: 2
kind: process
id: PB-PROCESS-WORKFLOW
title: Workflow
lifecycle: active
created: '2026-05-05'
updated: '2026-05-13'
aliases:
  - Workflow
  - Thin Product Brain Workflow
tags:
  - product-brain
  - process
  - workflow
generated: false
---
# Workflow

Documento principal de proceso para Cachés. Reemplaza a `DEVELOPMENT_WORKFLOW.md` y `AGENT_WORKFLOW.md` como referencia operativa.

---

## Flujo mínimo — tarea pequeña

Para fixes, chores, mejoras menores y features pequeñas que no pertenecen a ninguna release activa:

```
1. Leer AGENTS.md
2. Leer .memory/MEMORY.md
3. Leer docs/project/START_HERE.md
4. Leer la issue CACH relacionada, si existe
5. Crear rama desde main (feat/<slug>, fix/<slug>, chore/<slug> o docs/<slug>)
6. Implementar el cambio
7. Ejecutar validaciones relevantes
8. Abrir PR hacia main
```

No leer CURRENT_RELEASE, CURRENT_PLAN ni BACKLOG salvo que la tarea pertenezca a una release activa o afecte planificación.

### Cuándo aplica este flujo

- Fixes puntuales.
- Chores de tooling o mantenimiento.
- Mejoras menores de UI o UX.
- Documentación que no forma parte de una release.
- Tareas exploratoras o spikes.
- Cualquier cambio que no agrupe con otras issues bajo un objetivo de release.

### Hotfix y chore sin issue CACH

Un hotfix urgente o chore menor puede no tener issue CACH si:

- Es obvio, pequeño y no afecta planificación.
- El commit lo describe con suficiente claridad.
- Se declara explícitamente en el commit: `hotfix:` o `chore:`.

Si se descubre que el cambio tiene más alcance del esperado, crear issue CACH antes de continuar.

---

## Flujo de release multi-issue

Usar release branch solo cuando:

- Hay varias issues relacionadas que deben integrarse antes de llegar a main.
- Hay una fase real de estabilización.
- Hay un corte funcional agrupado con release notes.
- Hay riesgo de integración entre issues.
- Se necesita preparar una entrega con changelog.

```
main
  ↓
release/<version-or-name>
  ↓
feat/<issue-id>-<short-name>   (o fix/, chore/, docs/)
  ↓
release/<version-or-name>
  ↓
PR release/<version-or-name> -> main
```

La release activa debe estar registrada en `CURRENT_RELEASE.md`, `CURRENT_PLAN.md` o el documento de release antes de crear ramas de tarea desde ella.

Antes de crear una rama de tarea scopeada a release:

```bash
git fetch --prune origin
git switch release/<version-or-name>
git pull origin release/<version-or-name>
git branch --show-current
git switch -c feat/<issue-id>-<short-name>
```

Las ramas de tarea son locales por defecto y se integran con squash despues de revisar el diff/log contra la release:

```bash
git diff release/<version-or-name>...feat/<issue-id>-<short-name>
git log --oneline release/<version-or-name>..feat/<issue-id>-<short-name>
npm run verify:pr -- --base origin/release/<version-or-name>
git merge --squash feat/<issue-id>-<short-name>
```

Para una rama de tarea dentro de una release, la base de verificación es la propia release (`release/<version>` u `origin/release/<version>`), no `origin/main`. `origin/main` se usa para la PR final `release/<version>` -> `main`.

Si hay release activa pero una tarea nueva no pertenece a ella, no sale de la release por defecto. Hay que aplazarla, ejecutarla por flujo ligero desde `main`, o anadirla explicitamente al documento de la release activa.

### Cuándo NO usar release branch

- La tarea es un fix o mejora menor.
- La tarea no agrupa con otras issues.
- No hay necesidad de release notes específicas.
- La issue puede cerrarse en una sola PR a main.

### CURRENT_RELEASE.md

Puede estar en estado `No active release`. Es válido y no bloquea trabajo.

Si no hay release activa, las tareas van directamente a main por PR.

Si hay release activa pero la tarea no pertenece a ella, tambien puede ir por flujo ligero desde `main` si es pequena, aislada y production-safe.

Antes de abrir PR con `npm run ship -- --execute --issue CACH-XXXX`, una issue `work_type: feature` debe tener `release: RELEASE-...`. Si la feature sale intencionalmente por flujo ligero sin release, relanzar con `--allow-no-release` y dejarlo explicado en la issue/PR.

### Cierre de beta

El cierre de beta se hace con una unica PR `release/<version>` -> `main`. No hacer merge local directo a `main`, aunque la release este validada.

Checklist minimo:

- PR `release/<version>` -> `main` abierta.
- CI en verde.
- Revision aprobada.
- PR mergeada en `main`.
- `main` actualizado en local.
- Tag `vX.Y.Z-beta.N` creado desde `main`.
- Produccion verificada si aplica.
- Rama remota `release/<version>` eliminada.
- Documento de release actualizado como cerrado.

---

## Cuándo crear issue CACH

Crear issue CACH cuando:

- La tarea es suficientemente grande para necesitar criterios de aceptación.
- La tarea pertenece a una release activa.
- La tarea tiene dependencias o riesgos que vale la pena documentar.
- Se quiere trazabilidad en el Product Brain.

No es obligatorio para: hotfixes urgentes obvios, chores triviales, ajustes de copy, cambios de una línea.

### Campos obligatorios de una issue CACH

- Objetivo: qué debe quedar conseguido.
- Alcance: qué está incluido y qué queda fuera.
- Criterios de aceptación: verificables.
- Validación: qué comandos o checks se ejecutarán.
- Resultado: se rellena al cerrar.

Campos opcionales: release, rama sugerida, riesgos, dependencias, notas técnicas, PR, commits.

Además del cuerpo, toda issue debe usar el frontmatter v2 de `frontmatter-schema.md` (`schema_version: 2`, `kind: issue`, `lifecycle`, `issue_workflow`, `work_type`, `work_level`, `size`, `components`, etc.). No usar `type/status` top-level en documentos nuevos.

---

## Cuándo crear ADR

Solo para decisiones duraderas con impacto futuro:

- Arquitectura o modelo de datos.
- Estrategia de branching o releases.
- Dependencias nuevas importantes.
- Convenciones de producto o proceso que afecten trabajo futuro.
- Decisiones de seguridad o privacidad con consecuencias duraderas.
- Reglas transversales cerradas por un slice que gobernarán futuras implementaciones de producto, UX, datos o seguridad.

No crear ADR para: reglas menores de estilo, decisiones reversibles, convenciones temporales.

Si una issue hija descubre o consolida una regla transversal, no basta con dejarla enterrada en el resultado de la issue: crear o actualizar una decisión y enlazarla desde la épica o parent antes de cerrar el trabajo.

---

## Validaciones

### Bloqueantes

Son bloqueantes para PR o merge:

- `npm run verify:pr -- --base origin/main` — preflight local de PR, incluyendo checks del job `app` y whitespace.
- En ramas de tarea que nacen de una release, usar `npm run verify:pr -- --base origin/release/<version>` antes del squash; reservar `origin/main` para la PR final de la release.
- `npm run lint` — si se toca código JS/TS y se ejecuta una validación acotada.
- `npm run test` — requerido por CI `app`; no tratarlo como solo aviso.
- `npm run build` — si se toca código de app o tooling que afecta build.
- `npm run pb:guard` — si se toca `docs/project/` o `scripts/brain/`.
- `npm run pb:ready-check -- CACH-XXXX` — antes de mover una issue a `ready`.
- `npm run pb:close-check -- CACH-XXXX` — antes de marcar una issue como `done` o cerrar trabajo trazado.
- Verificación DB remoto — si se toca `supabase/migrations/` o la feature depende de schema/policy/RPC nuevo: confirmar migración aplicada/verificada en remoto, o declarar explícitamente que la funcionalidad no está lista en producción.

### Solo aviso (no bloquean merge)

- `npm run pb:status` — muestra estado de sync con Obsidian; no es criterio de merge.
- `npm run pb:push` / `npm run pb:pull` — Obsidian sync; útil pero no bloquea.

### Validación visual

Si se toca UI: verificar en navegador en la ruta afectada, con viewport relevante. Para calendarios: verificar que toolbar, cabecera y filas del mes son visibles.

### Validación de Supabase remoto

Si el cambio introduce o depende de objetos nuevos de Supabase, el smoke mockeado no basta para cerrar la funcionalidad como producción verificada. Antes de marcar una release como `released`, confirmar el schema remoto con SQL read-only, revisar RLS/policies cuando aplique y ejecutar un smoke real o transaccional con `rollback` del flujo afectado.

---

## Obsidian sync

`pb:status` y `pb:push` / `pb:pull` son útiles para mantener el vault sincronizado.

No son criterio bloqueante de merge. Si el repo está consistente (`pb:guard` OK) y el vault tiene drift leve, el merge puede hacerse. Sincronizar con Obsidian después si aplica.

---

## Relacionado

- [[BRANCHING_STRATEGY]] — tipos de rama y convenciones de nombre.
- [[COMMIT_CONVENTION]] — formato de commits trazables.
- [[RELEASE_PROCESS]] — crear, activar y cerrar releases multi-issue.
- [[definition-of-done]] — salida mínima honesta de una issue.
