---
schema_version: 2
kind: process
id: PB-PROCESS-BRANCHING-STRATEGY
title: Branching Strategy
lifecycle: active
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Branching Strategy
  - Estrategia de ramas
tags:
  - product-brain
  - process
  - git
  - branching
generated: false
---
# Branching Strategy

`main` debe mantenerse estable. Las releases activas tienen una rama de integracion visible en remoto y las tareas salen de esa rama.

Durante una beta multi-issue, fase de estabilizacion o trabajo coordinado con agentes, solo `release/<version>` se comparte en remoto por defecto. Las ramas de tarea son locales, se revisan antes de integrarse y entran en la release mediante `git merge --squash`.

## Ramas principales

| Rama | Uso |
|---|---|
| `main` | Estado estable, deployable y destino final de PRs. |
| `release/<version>` | Integracion remota de todas las issues de una release. |
| `feat/<issue-id>-<short-name>` | Nueva funcionalidad de una issue. |
| `fix/<issue-id>-<short-name>` | Correccion dentro de una release. |
| `chore/<issue-id>-<short-name>` | Tooling, mantenimiento o tareas internas. |
| `docs/<issue-id>-<short-name>` | Documentacion y Product Brain. |
| `hotfix/<short-name>` | Urgencia de produccion desde `main`. |

`feature/` queda permitido como naming legacy, pero las ramas nuevas deben usar `feat/` para alinearse con Conventional Commits.

## Convencion

Las releases usan ID versionado. La rama de release debe derivar directamente del ID de release:

```text
RELEASE-0.1.0-beta.1 -> release/0.1.0-beta.1
RELEASE-0.1.0-beta.2 -> release/0.1.0-beta.2
RELEASE-0.2.0-mobile-finance -> release/0.2.0-mobile-finance
```

La tercera cifra y el sufijo de prerelease permiten cerrar cortes pequenos en `main` y seguir iterando con otra release, sin convertir una rama en zona permanente.

Regla de ciclo:

```text
0.1                  ciclo organizativo
0.1.0-beta.1         primer corte mergeable
0.1.0-beta.2         segundo corte mergeable
0.1.0                cierre y changelog consolidado del ciclo
0.1.1                patch posterior
0.2.0-beta.1         primer corte del siguiente ciclo
```

```text
main
release/0.1.0-beta.1
feat/CACH-B0001-work-hierarchy
fix/CACH-B0014-mvp-trust-pass
docs/CACH-B0015-product-ops-workflow
chore/CACH-B0010-agent-tooling
hotfix/fix-login-crash
```

Usar el ID canonico de Product Brain (`CACH-*`) en ramas de trabajo.

## Cuando crear release branch

Crear una rama `release/<version>` cuando empieza una beta con:

- varias tareas planificadas;
- fase real de estabilizacion;
- necesidad de validar varios cambios juntos antes de `main`;
- trabajo coordinado con agentes;
- release notes o changelog agrupado.

No crear release branch para fixes, chores o mejoras menores que puedan cerrarse con una PR directa a `main`.

## Caso A: trabajo dentro de release activa

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

La rama de tarea nace desde la release activa, no desde `main`. Si la tarea pertenece a una beta y la rama salio de `main` por error, corregir con rebase o cherry-pick antes de integrarla.

Al terminar:

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

## Caso B: fix dentro de release activa

```bash
git fetch --prune origin
git switch release/0.1.0-beta.1
git pull origin release/0.1.0-beta.1
git branch --show-current
git switch -c fix/CACH-B0014-mvp-trust-pass
```

Vuelve a la rama de release:

```bash
git switch release/0.1.0-beta.1
git diff release/0.1.0-beta.1...fix/CACH-B0014-mvp-trust-pass
git log --oneline release/0.1.0-beta.1..fix/CACH-B0014-mvp-trust-pass
git merge --squash fix/CACH-B0014-mvp-trust-pass
git commit -m "fix(CACH-B0014): harden MVP trust pass"
git push origin release/0.1.0-beta.1
git branch -d fix/CACH-B0014-mvp-trust-pass
```

## Caso C: documentacion o Product Brain

Si pertenece a una release activa:

```bash
git switch release/0.1.0-beta.1
git branch --show-current
git switch -c docs/CACH-B0015-product-ops-workflow
```

Si es mantenimiento fuera de release, documentar en la issue por que queda fuera de release.

## Caso D: hotfix urgente en produccion

```bash
git switch main
git pull
git switch -c hotfix/fix-login-crash
```

Abrir PR a `main` y despues propagar a release activa si aplica:

```bash
git switch release/0.1.0-beta.1
git cherry-pick <hotfix-commit>
```

## Caso E: tarea pequeña o sin release activa

Para fixes, chores, mejoras menores o cualquier cambio que no agrupe con otras issues:

```bash
git fetch --prune origin
git switch main
git pull origin main
git switch -c fix/my-small-fix   # o feat/, chore/, docs/
```

Al terminar:

```bash
git push -u origin fix/my-small-fix
# Abrir PR a main
```

No se necesita release branch. No se necesita release activa. PR directa a `main`.

## Ramas remotas de tarea

Las ramas de tarea no se suben al remoto por defecto. Subir una rama remota de tarea solo es valido como excepcion explicita:

- tarea grande o de mas de una sesion;
- revision remota necesaria;
- trabajo en varios equipos o dispositivos;
- riesgo real de perder trabajo local;
- bloqueo que requiera intervencion externa.

Si se sube una rama remota de tarea, debe borrarse despues de integrarla en la release activa.

## Reglas

- Las ramas de tarea salen de la release activa **solo si la tarea pertenece a esa release**.
- Si hay release activa pero la tarea nueva no pertenece a ella, no se crea desde la release por defecto: se aplaza, va por flujo ligero desde `main`, o se anade explicitamente al documento de la release activa.
- Si no hay release activa, la rama sale de `main` y vuelve a `main` por PR.
- Para tareas scopeadas a una release, crear la rama desde `main` es invalido salvo que la release branch no exista todavia.
- No mezclar issues de releases distintas en la misma rama.
- La release entra a `main` mediante una PR unica `release/<version>` -> `main`.
- No hacer merge local directo de `release/<version>` a `main`.
- Los hotfixes urgentes salen siempre de `main` y se propagan a la release activa si el cambio también aplica.
- No trabajar directamente sobre `main` (commits sin rama).

## Limpieza

Tras squash y push correcto a la release:

```bash
git switch release/0.1.0-beta.1
git status
git log --oneline -n 5
git push origin release/0.1.0-beta.1
git branch -d feat/CACH-B0001-work-hierarchy
```

La rama de release se mantiene mientras la release este activa o estabilizando. Al cerrar la beta, crear tag desde `main` actualizado y borrar la rama remota de release.
