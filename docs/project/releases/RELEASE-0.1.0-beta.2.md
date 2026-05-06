---
id: RELEASE-0.1.0-beta.2
type: release
status: Active
created: 2026-05-06
updated: 2026-05-06
release_branch: release/0.1.0-beta.2
aliases:
  - RELEASE-0.1.0-beta.2
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.2 — Endurecer confianza de datos

## Estado

Active

## Rama de release

`release/0.1.0-beta.2`

## Goal

Corregir los 5 bugs críticos de CACH-B0014 que rompen la confianza del usuario en los datos de agenda y cobros del MVP.

## Product Outcome

El usuario puede confiar en que los eventos aparecen a la hora correcta, los cobros marcados como pagados registran la fecha, los importes con coma se aceptan sin error, los cobros vencidos son visibles en el dashboard y el Product Brain no genera IDs duplicados en capturas rápidas.

## Scope

- [[../issues/CACH-B0014|CACH-B0014]] — Endurecer agenda, cobros y captura del MVP

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0014|CACH-B0014]] | Endurecer agenda, cobros y captura del MVP | done | `feature/CACH-B0014-hardening` |

## Fuera de alcance

- CACH-0030 (homogeneizar diseño/paleta) — PR directo a main cuando toque.
- CACH-B0001 a CACH-B0007 — siguientes cortes del ciclo 0.1.

## Riesgos

- Bug 1 (timezone): si CACH-0029 ya aplicó los helpers, puede que solo falte verificar; si no, afecta formularios de evento.
- Bug 3 (decimal): similar a Bug 1, depende de cobertura real de CACH-0029.

## Decisiones relacionadas

- ADR-0011 — Timestamps como instantes y Europe/Madrid en cliente
- ADR-0012 — Decimales europeos con input text e inputmode decimal

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada (`release/0.1.0-beta.2`)
- [x] Issues asociadas (CACH-B0014)
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues del corte estan cerradas (CACH-B0014 done)
- [x] Commits integrados en rama feature
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint` — OK
- [x] `npm run build` — OK
- [x] `npm run pb:check` — OK
- [ ] `npm run pb:status`
- [ ] Revision visual (evento a la hora correcta, cobro vencido visible)
- [ ] Revision responsive

## Checklist de salida

- [ ] Release mergeada a `main`
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Current Release actualizado
- [ ] Current Plan actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Corregido

- Desfase horario en eventos: los eventos se muestran a la hora guardada.
- Incoherencia `is_paid` / `paid_date`: al marcar como pagado se rellena `paid_date` automáticamente.
- Formato decimal europeo: se acepta "12,50" y "12.50" en todos los formularios de importe.
- Cobros vencidos ocultos: el dashboard muestra cobros con `due_date` pasado y `is_paid = false`.
- Colisiones de ID en `pb:capture`: los IDs de captura son únicos.

### Tecnico

- CACH-B0014 completa el endurecimiento técnico del MVP aplazado en beta.1.

## Resultado final

Pendiente de merge a `main` mediante PR.
