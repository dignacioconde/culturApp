---
schema_version: 2
kind: process
id: PB-PROCESS-DEVELOPMENT-WORKFLOW
title: Development Workflow
lifecycle: deprecated
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Development Workflow
  - Flujo de desarrollo
tags:
  - product-brain
  - process
  - development
generated: false
---
# Development Workflow

Consolidado en [[WORKFLOW]].

Ver [[WORKFLOW]] para el flujo completo: tarea pequeña, release multi-issue, validaciones, Obsidian sync y cuándo crear issues/ADRs.

El Product Brain es la fuente de verdad. GitHub queda para PRs, checks, commits y releases tecnicas cuando haga falta, pero el por que y el estado de producto viven en `docs/project/`.

## Ciclo operativo

```text
Idea / necesidad
  ↓
Backlog
  ↓
Issue Markdown CACH-*
  ↓
Asignacion a release
  ↓
Rama de release
  ↓
Rama local feat/fix/chore/docs
  ↓
Commits trazables
  ↓
Validacion
  ↓
Squash a release branch
  ↓
Cierre de issue
  ↓
Release notes
  ↓
PR release -> main
  ↓
CURRENT_STATE / Product Brain actualizado
```

## 1. Entrada de ideas

Las ideas entran por `docs/project/inbox/` o [[../backlog/IDEAS|Ideas]]. No se crea GitHub Issue para una idea sin refinar.

Para curar:

1. Revisar si ya existe una issue en [[../indexes/issues.index|Issues Index]].
2. Si es inmadura, dejarla en [[../backlog/IDEAS|Ideas]].
3. Si necesita decision, crear ADR con [[../templates/ADR_TEMPLATE|ADR Template]].
4. Si es implementable, crear issue `CACH-*` con [[../templates/ISSUE_TEMPLATE|Issue Template]].

## 2. Backlog y triage

El tablero operativo vive en [[../backlog/BACKLOG|Backlog]]. El detalle vive en cada issue.

Antes de mover algo a desarrollo, pasar por [[../backlog/TRIAGE|Triage]] y confirmar Definition of Ready.

## 3. Crear issue Markdown

Cada issue debe responder:

- que problema resuelve;
- cual es el objetivo;
- que queda dentro y fuera;
- que criterios de aceptacion la cierran;
- a que release pertenece;
- que rama sugiere;
- como se validara.

Naming:

```text
docs/project/issues/CACH-XXXX-short-title.md
docs/project/issues/CACH-BXXXX-short-title.md
```

En este repo los IDs canonicos actuales son el filename completo, por ejemplo `CACH-B0014`.

## 4. Asignar a release

Si hay release activa, actualizar:

- [[../releases/CURRENT_RELEASE|Current Release]]
- documento de la release, por ejemplo [[../releases/RELEASE-0.1.0-beta.1|RELEASE-0.1.0-beta.1]]
- [[../backlog/BACKLOG|Backlog]]

Si no hay release activa y el trabajo es grande, parar y crear/activar una release antes de implementar.

## 5. Preparar ramas

La release activa debe tener rama propia. Desde ahi salen las ramas de trabajo solo si pertenecen a esa release. Si hay release activa pero una tarea nueva no pertenece a ella, se aplaza, va por flujo ligero desde `main`, o se anade explicitamente al documento de la release.

```bash
git fetch --prune origin
git switch main
git pull origin main
git switch -c release/0.1.0-beta.1
git push -u origin release/0.1.0-beta.1

git switch release/0.1.0-beta.1
git branch --show-current
git switch -c feat/CACH-B0001-work-hierarchy
```

Si la rama de release ya existe:

```bash
git fetch --prune origin
git switch release/0.1.0-beta.1
git pull origin release/0.1.0-beta.1
git branch --show-current
git switch -c fix/CACH-B0014-mvp-trust-pass
```

## 6. Implementar

Trabajar con cambios pequenos y trazables. No mezclar releases distintas en una misma rama.

Los commits siguen [[COMMIT_CONVENTION]]:

```bash
git commit -m "fix(CACH-B0014): keep paid date consistent"
```

## 7. Validar

Validacion minima segun tipo:

- Docs/Product Brain: `npm run pb:check` y `npm run pb:status`.
- App React: `npm run lint` y `npm run build`.
- UI: captura o revision visual en ruta/viewport afectado.
- Datos/finanzas: explicar calculo o contrato afectado.
- Supabase/RLS: revisar `user_id`, policies y hooks.

## 8. Squash a release branch

La rama de trabajo vuelve a la rama de release.

```bash
git switch release/0.1.0-beta.1
git pull origin release/0.1.0-beta.1
git diff release/0.1.0-beta.1...feat/CACH-B0001-work-hierarchy
git log --oneline release/0.1.0-beta.1..feat/CACH-B0001-work-hierarchy
git merge --squash feat/CACH-B0001-work-hierarchy
git commit -m "feat(CACH-B0001): add work hierarchy"
git push origin release/0.1.0-beta.1
git branch -d feat/CACH-B0001-work-hierarchy
```

Actualizar la issue:

- estado;
- resultado;
- commits relacionados;
- validacion ejecutada;
- rama o PR relacionada.

## 9. Cierre de issue

Una issue pasa a `Ready for Release` cuando:

- codigo o documentacion implementada;
- validacion relevante ejecutada o justificada;
- issue actualizada con resultado;
- commits relacionados anadidos;
- release actualizada;
- no quedan TODOs criticos ocultos.

Pasa a `Released` solo cuando la PR de release se mergea a `main` y el estado del producto queda actualizado.

## 10. Cierre de release

Una release esta lista para abrir PR `release/<version>` -> `main` cuando:

- todas sus issues estan `Ready for Release` o `Released`;
- no hay cambios sin documentar;
- release notes completas;
- build/checks correctos;
- QA basico hecho;
- decisiones importantes en ADR;
- backlog y Current Release actualizados;
- no se hara merge local directo a `main`.

## 11. Actualizar Product Brain

Al cerrar:

- actualizar [[../releases/CURRENT_RELEASE|Current Release]];
- actualizar release notes;
- actualizar [[../plans/CURRENT_PLAN|Current Plan]];
- actualizar [[../backlog/BACKLOG|Backlog]];
- crear ADR si hubo decision importante;
- ejecutar `npm run pb:check`.

## Respuesta obligatoria antes de implementar

```md
## Contexto leido

- Release activa:
- Rama esperada:
- Issue relacionada:
- Estado actual:
- Riesgos detectados:

## Propuesta de trabajo

- Rama a usar:
- Archivos que se tocaran:
- Plan de implementacion:
- Validacion:
```

## Definition of Ready

Una issue esta `Ready` cuando:

- tiene objetivo claro;
- tiene release asignada o se declara fuera de release;
- tiene alcance incluido/fuera de alcance;
- tiene criterios de aceptacion;
- tiene rama sugerida;
- no bloquea por dudas criticas;
- tiene dependencias identificadas.

## Definition of Done

Una issue esta `Ready for Release` cuando:

- el cambio esta implementado;
- los checks relevantes pasan;
- la revision visual/responsive/accesibilidad existe si toca UI;
- la issue recoge resultado, commits y validacion;
- la release recoge la issue y sus notas;
- la deuda tecnica descubierta queda documentada.

## Definition of Release Done

Una release esta `Released` cuando:

- la PR `release/<version>` -> `main` se mergeo;
- `main` se actualizo en local;
- el tag `vX.Y.Z-beta.N` se creo desde `main`;
- las issues incluidas estan `Released`;
- release notes completas;
- Current Release y Current Plan actualizados;
- estado de producto actualizado;
- rama remota de release eliminada o archivada segun convenga;
- el cambio esta verificado en produccion si afecta a la app publicada.
