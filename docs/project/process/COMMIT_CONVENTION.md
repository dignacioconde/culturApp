---
id: PB-PROCESS-COMMIT-CONVENTION
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Commit Convention
  - Convencion de commits
tags:
  - product-brain
  - process
  - git
  - commits
---

# Commit Convention

Los commits deben permitir reconstruir issue, release, rama y validacion.

## Formato

```text
<type>(<issue-id>): <summary>
```

Ejemplos:

```text
feat(CACH-B0001): add work hierarchy drawer
fix(CACH-B0014): preserve event local time
docs(CACH-B0015): document release branching workflow
refactor(CACH-B0002): extract mobile finance summary
chore(CACH-B0010): update agent workflow docs
```

## Tipos permitidos

| Tipo | Uso |
|---|---|
| `feat` | Funcionalidad nueva. |
| `fix` | Correccion de bug. |
| `docs` | Documentacion, Product Brain o prompts. |
| `style` | Cambios visuales sin modificar comportamiento. |
| `refactor` | Reestructuracion sin cambio funcional. |
| `test` | Tests o fixtures. |
| `chore` | Mantenimiento interno. |
| `perf` | Rendimiento. |
| `build` | Build tooling/dependencias. |
| `ci` | CI/CD. |
| `revert` | Revert de cambio anterior. |

## Reglas

- Si existe issue `CACH-*`, mencionarla en el scope.
- No usar mensajes genericos como `updates`, `fix stuff`, `changes`.
- No mezclar muchas issues en un mismo commit salvo que sea inevitable.
- Los commits de una release deben integrarse en la rama de release.
- Los commits sin issue deben justificarse como `chore`, `hotfix` o mantenimiento menor.
- No anadir `Co-Authored-By` de IA en commits.

## Buenos ejemplos

```text
feat(CACH-B0003): add quick paid action
fix(CACH-B0014): accept comma decimals in income form
docs(CACH-B0015): add Product Brain release process
test(CACH-B0014): cover overdue income grouping
```

## Malos ejemplos

```text
updates
fix stuff
changes
wip
feat: many things
fix(calendar): issue unclear
```

## Hotfix

Si no hay issue por urgencia real:

```text
fix(hotfix): prevent login crash
```

Despues del hotfix, documentar el resultado en Product Brain y crear issue retroactiva si el problema requiere seguimiento.
