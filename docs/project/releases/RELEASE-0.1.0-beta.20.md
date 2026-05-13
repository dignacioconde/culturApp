---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.20
title: Hardening UX móvil financiera
lifecycle: active
created: '2026-05-13'
updated: '2026-05-13'
aliases:
  - RELEASE-0.1.0-beta.20
tags:
  - product-brain
  - release
  - beta
  - ux
  - mobile
  - finance
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.20
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.20 — Hardening UX móvil financiera

## Estado

Active.

## Rama de release

`release/0.1.0-beta.20`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.20` es un corte pequeño de hardening UX antes de abrir nuevas reglas de datos, liquidación neta o facturación completa.

## Objetivo de la release

Cerrar la deuda residual de UX móvil financiera consolidada en `CACH-B0002`: una barra contextual reusable y consistente para detalles de proyecto y evento, sin tocar fórmulas, schema, RLS ni semántica financiera.

## Alcance funcional

- Unificar el patrón de `BottomActionBar` en `/events/:id` y `/projects/:id`.
- Mantener acciones financieras y de gestión visibles, táctiles y consistentes en móvil.
- Evitar solape con la navegación inferior global y con el contenido al final del scroll.
- Mantener la acción destructiva como secundaria y siempre confirmada.
- Verificar desktop sin perder densidad profesional.

## Scope

- [[../issues/CACH-0063|CACH-0063]] — Unificar BottomActionBar en detalles.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0063|CACH-0063]] | Unificar BottomActionBar en detalles | ready | `feat/CACH-0063-bottom-action-bar` |

## Fuera de alcance

- Cambiar fórmulas financieras, KPIs, helpers, hooks públicos financieros o reglas de IRPF.
- Cambiar schema, migraciones, RLS, Supabase remoto o `user_id`.
- Abrir liquidación neta, contratantes, facturación, CRM o un rediseño completo de detalles.
- Cambiar la navegación desktop fuera de la adaptación necesaria del patrón compartido.

## Riesgos

- La barra contextual puede tapar contenido en 320 px si no se reserva padding inferior suficiente.
- La navegación inferior global no debe competir con acciones contextuales en detalles.
- El componente compartido no debe forzar cambios de comportamiento en editar, cobro rápido, gasto rápido o eliminar.
- Unificar visualmente no debe degradar la densidad ni la jerarquía de desktop.

## Decisiones relacionadas

- [[../issues/CACH-B0002|CACH-B0002]] — Simplificar experiencia mobile financiera.
- [[../decisions/ADR-0016-ux-mobile-financiera-operativa-acciones-contextuales|ADR-0016]] — UX móvil financiera.
- [[../context/ux-mobile-guardrails-20260504|ux-mobile-guardrails-20260504]]
- [[../context/design-system-caches-20260506|design-system-caches-20260506]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release definida
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] CACH-0063 implementada
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin `issue_workflow`
- [ ] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [ ] `npm run lint`
- [ ] `npm run build`
- [ ] `npm run pb:guard`
- [ ] `npm run release:sync-check`
- [ ] Revision visual en 320 px, 390 px, 768 px y desktop
- [ ] Confirmar que editar, cobro rápido, gasto rápido y eliminar mantienen los flujos actuales

## Checklist de salida

- [ ] PR `release/0.1.0-beta.20` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/0.1.0-beta.20` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Pendiente hasta implementar `CACH-0063`.

### Cambiado

- Pendiente hasta implementar `CACH-0063`.

### Corregido

- Pendiente hasta implementar `CACH-0063`.

### Eliminado

- No aplica por ahora.

### Tecnico

- Release abierta como hardening UX sin cambios de datos ni migraciones.

## Resultado final

Pendiente hasta cerrar la release.
