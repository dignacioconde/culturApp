---
id: PB-CURATION-FLOW
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
tags:
  - product-brain
  - workflow
  - inbox
---

# Flujo de Curation del Inbox

Proceso para clasificar y gestionar capturas rápidas en el inbox del Product Brain.

## Entrada: Inbox

Cuando capturas una idea rápida con `/product-brain-capture` o directamente en `inbox/`, la nota entra sin clasificar. El objetivo es mover cada captura a su destino apropiado o rechazarla.

## Clasificaciones posibles

| Clase | Destino | Criterio |
|-------|---------|----------|
| **ZK** | `knowledge/` | Notas de investigación, learning, patrones técnicos. Titulo: `PB-ZK-YYYYMMDD-topic` |
| **Issue** | `issues/` | Trabajo de producto con usuario/problema claro. Titulo: `CACH-###` (autoincremental) |
| **ADR** | `decisions/` | Decisión arquitectónica o de producto que afecta múltiples áreas. Titulo: `ADR-####` |
| **Release** | `releases/` | Criterios de salida, notas de release, bloqueadores. |
| **Context** | `context/` | Snapshots estables: análisis, mapas, modelos financieros. Titulo: `*-YYYYMMDD.md` |
| **Duplicado** | Inbox → merge | Misma idea ya existe en otro archivo. Linkear y archivar la copia. |
| **Rechazado** | Inbox → delete | Idea contradice contexto, es demasiado grande, o no tiene usuario claro. Documentar por qué. |

## Proceso de Curation

1. **Leer entrada** — Entiende el problema, la solución y por qué importa.
2. **Challenge** — ¿Está repetida? ¿Contradice contexto? ¿Tiene usuario claro? ¿Es prematura?
   - Si falla challenge → **Rechazado**
3. **Elegir clase** — Usa tabla arriba según el tipo de información.
4. **Mover y reformatear** — Copia contenido a destino con frontmatter, título y estructura correcta.
5. **Linkear** — Si hay archivos relacionados (issues, ADRs, ZK), agrega links en sección "Related".
6. **Deletear inbox** — Borra la entrada original.

## Ejemplo: Issue

```markdown
---
id: CACH-0026
type: issue
status: Backlog
priority: High
release: RELEASE-0.1-beta
created: 2026-05-04
updated: 2026-05-04
---

# CACH-0026 — Título descriptivo

## Summary
Una línea con el qué y el para qué.

## Context
Por qué importa, dónde estamos.

## Problem
Detalles de lo que no funciona.

## Proposed Solution
Qué haría roto arreglado.

## Acceptance Criteria
- [ ] Criterio 1
- [ ] Criterio 2

## Related
- [[../knowledge/PB-ZK-...]]
- [[../decisions/ADR-...]]
```

## Modo "Alfred"

Si dudas, clasifica así:
- **¿Es observación de algo visto?** → ZK
- **¿Es trabajo de producto con usuario claro?** → Issue
- **¿Decide algo que afecta múltiples áreas?** → ADR
- **¿Es estado estable del proyecto?** → Context

## Cadencia

- **Daily** — Revisar inbox tras captura manual o `pb:capture`.
- **Weekly** — Barrer inbox residual y listar entradas sin clasificar.
- **Monthly** — Archivado: borrar rechazados documentados, consolidar ZK viejo.
