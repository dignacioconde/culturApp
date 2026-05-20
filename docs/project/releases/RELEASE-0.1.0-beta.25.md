---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.25
title: Liquidacion neta minima
lifecycle: active
created: '2026-05-20'
updated: '2026-05-20'
aliases:
  - RELEASE-0.1.0-beta.25
tags:
  - product-brain
  - release
  - beta
  - finance
  - data
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.25
release_tag: null
release_pr: null
---
# RELEASE-0.1.0-beta.25 — Liquidacion neta minima

## Estado

Activa.

## Rama de release

`release/0.1.0-beta.25`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.25` vuelve a `CACH-B0004` despues del corte de calendario para avanzar liquidacion neta de trabajos sin abrir facturacion completa, CRM ni colaboracion multiusuario.

## Objetivo de la release

Permitir que Cachés represente de forma minima cuando un gasto repercute sobre un ingreso y muestre una liquidacion neta comprensible en detalles de proyecto y evento, preservando el dashboard actual centrado en cobros/ingresos previstos.

## Alcance funcional

- Definir el contrato minimo de liquidacion neta: gasto interno, gasto repercutible y enlace opcional gasto -> ingreso.
- Versionar schema/RLS para guardar la relacion sin cruzar usuarios ni romper datos existentes.
- Integrar helpers y hooks para calcular resumen bruto, retencion, gastos internos, gastos repercutibles y neto operativo.
- Mostrar liquidacion neta en detalles de proyecto y evento como contexto, no como nuevo KPI principal del dashboard.
- Mantener compatibilidad con export/import de datos y con contratantes estructurados de beta 19.

## Scope

- [[../issues/CACH-0099|CACH-0099]] — Preparar Beta 25 de liquidacion neta.
- [[../issues/CACH-0100|CACH-0100]] — Definir contrato de liquidacion neta minima.
- [[../issues/CACH-0101|CACH-0101]] — Versionar schema y RLS de gastos repercutibles.
- [[../issues/CACH-0102|CACH-0102]] — Integrar hooks y helpers de liquidacion neta.
- [[../issues/CACH-0103|CACH-0103]] — UX minima de liquidacion en detalles.
- [[../issues/CACH-0104|CACH-0104]] — QA financiera y cierre de Beta 25.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0099|CACH-0099]] | Preparar Beta 25 de liquidacion neta | done | `release/0.1.0-beta.25` |
| [[../issues/CACH-0100|CACH-0100]] | Definir contrato de liquidacion neta minima | ready | `feat/CACH-0100-net-settlement-contract` |
| [[../issues/CACH-0101|CACH-0101]] | Versionar schema y RLS de gastos repercutibles | backlog | `feat/CACH-0101-reimbursable-expenses-schema` |
| [[../issues/CACH-0102|CACH-0102]] | Integrar hooks y helpers de liquidacion neta | backlog | `feat/CACH-0102-net-settlement-hooks` |
| [[../issues/CACH-0103|CACH-0103]] | UX minima de liquidacion en detalles | backlog | `feat/CACH-0103-net-settlement-detail-ux` |
| [[../issues/CACH-0104|CACH-0104]] | QA financiera y cierre de Beta 25 | backlog | `release/0.1.0-beta.25` |

## Fuera de alcance

- Facturas emitidas, numeracion legal, PDF, IVA y gestion fiscal completa.
- Pasarela de pago, conciliacion bancaria o estados contables avanzados.
- CRM, contactos multiples por contratante o colaboracion multiusuario.
- Cambiar los KPIs principales del dashboard mensual.
- Cambiar la formula de `cobro bruto/hora`: sigue usando solo ingresos cobrados con `event_id` y horas de eventos.
- Reescribir los formularios financieros completos fuera del flujo minimo.

## Riesgos

- El concepto de liquidacion neta puede confundirse con beneficio contable; la UI debe nombrarlo como resumen operativo del trabajo.
- El enlace gasto -> ingreso debe impedir cruces de usuario y mantener `project_id`/`event_id` coherentes.
- Las migraciones deben ser aditivas y reversibles: no borrar `client`, ingresos, gastos ni contratantes existentes.
- El dashboard no debe empezar a mezclar gastos o neto como KPI principal por accidente.
- Si se toca Supabase remoto, la migracion debe aplicarse solo con confirmacion humana y verificacion read-only posterior.

## Decisiones relacionadas

- [[../issues/CACH-B0004|CACH-B0004]] — Contratantes, facturacion y liquidacion neta.
- [[RELEASE-0.1.0-beta.19]] — Contratantes estructurados.
- [[../process/sdd-levels|SDD por niveles]].

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin `issue_workflow`
- [ ] Decisiones importantes documentadas

## Checklist de estabilizacion

- [ ] `npm run lint`
- [ ] `npm run test`
- [ ] `npm run build`
- [ ] `npm run pb:guard`
- [ ] `npm run verify:pr -- --base origin/main`
- [ ] Smoke financiero de proyecto y evento con gasto interno y gasto repercutible
- [ ] Estado remoto de migracion Supabase documentado como aplicado/verificado o pendiente/bloqueante

## Checklist de salida

- [ ] PR `release/0.1.0-beta.25` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag `v0.1.0-beta.25` creado desde `main`
- [ ] Produccion verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.25` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Planificado: resumen operativo de liquidacion neta en detalles de proyecto y evento.
- Planificado: soporte minimo para gastos repercutibles enlazados a ingresos.

### Cambiado

- Planificado segun contrato de `CACH-0100`.

### Corregido

- No aplica por ahora.

### Eliminado

- No aplica.

### Tecnico

- Planificado: migracion aditiva de gastos repercutibles, helpers puros y pruebas de regresion financiera.

## Resultado final

Pendiente hasta cerrar la release.
