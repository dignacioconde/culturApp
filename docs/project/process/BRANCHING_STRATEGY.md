---
id: PB-PROCESS-BRANCHING-STRATEGY
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Branching Strategy
  - Estrategia de ramas
tags:
  - product-brain
  - process
  - git
  - branching
---

# Branching Strategy

`main` debe mantenerse estable. Las releases activas tienen una rama de integracion y las tareas salen de esa rama.

## Ramas principales

| Rama | Uso |
|---|---|
| `main` | Estado estable, deployable y merge final de releases. |
| `release/<version>` | Integracion de todas las issues de una release. |
| `feature/<issue-id>-<short-name>` | Nueva funcionalidad de una issue. |
| `fix/<issue-id>-<short-name>` | Correccion dentro de una release. |
| `chore/<issue-id>-<short-name>` | Tooling, mantenimiento o tareas internas. |
| `docs/<issue-id>-<short-name>` | Documentacion y Product Brain. |
| `hotfix/<short-name>` | Urgencia de produccion desde `main`. |

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
feature/CACH-B0001-work-hierarchy
fix/CACH-B0014-mvp-trust-pass
docs/CACH-B0015-product-ops-workflow
chore/CACH-B0010-agent-tooling
hotfix/fix-login-crash
```

Usar el ID canonico de Product Brain (`CACH-*`) en ramas de trabajo.

## Caso A: trabajo dentro de release activa

```bash
git switch main
git pull
git switch -c release/0.1.0-beta.1

git switch release/0.1.0-beta.1
git switch -c feature/CACH-B0001-work-hierarchy
```

Al terminar:

```bash
git switch release/0.1.0-beta.1
git pull
git merge feature/CACH-B0001-work-hierarchy
```

## Caso B: fix dentro de release activa

```bash
git switch release/0.1.0-beta.1
git pull
git switch -c fix/CACH-B0014-mvp-trust-pass
```

Vuelve a la rama de release:

```bash
git switch release/0.1.0-beta.1
git merge fix/CACH-B0014-mvp-trust-pass
```

## Caso C: documentacion o Product Brain

Si pertenece a una release activa:

```bash
git switch release/0.1.0-beta.1
git switch -c docs/CACH-B0015-product-ops-workflow
```

Si es mantenimiento fuera de release, documentar en la issue por que queda fuera de release.

## Caso D: hotfix urgente en produccion

```bash
git switch main
git pull
git switch -c hotfix/fix-login-crash
```

Merge a `main` y despues propagar a release activa si aplica:

```bash
git switch release/0.1.0-beta.1
git cherry-pick <hotfix-commit>
```

## Reglas

- No trabajar directamente sobre `main`.
- No mezclar issues de releases distintas en la misma rama.
- Las ramas de feature/fix salen de la release activa si pertenecen a ella.
- Las ramas de feature/fix vuelven a la release activa.
- La release se mergea a `main` cuando esta validada.
- Los hotfixes urgentes pueden salir de `main`, pero deben propagarse a la release activa si el cambio tambien aplica.
- Si no existe release activa y la tarea es grande, crear o activar release antes de implementar.

## Limpieza

Tras merge correcto:

```bash
git branch -d feature/CACH-B0001-work-hierarchy
git push origin --delete feature/CACH-B0001-work-hierarchy
```

La rama de release se mantiene mientras la release este activa o estabilizando.
