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
release_pr: https://github.com/dignacioconde/culturApp/pull/114
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
- Mostrar liquidacion neta en detalles de proyecto y evento como contexto expandible, no como KPI principal ni como carga diaria.
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
| [[../issues/CACH-0100|CACH-0100]] | Definir contrato de liquidacion neta minima | done | `release/0.1.0-beta.25` |
| [[../issues/CACH-0101|CACH-0101]] | Versionar schema y RLS de gastos repercutibles | done | `release/0.1.0-beta.25` |
| [[../issues/CACH-0102|CACH-0102]] | Integrar hooks y helpers de liquidacion neta | done | `release/0.1.0-beta.25` |
| [[../issues/CACH-0103|CACH-0103]] | UX minima de liquidacion en detalles | done | `release/0.1.0-beta.25` |
| [[../issues/CACH-0104|CACH-0104]] | QA financiera y cierre de Beta 25 | done | `release/0.1.0-beta.25` |

## Fuera de alcance

- Facturas emitidas, numeracion legal, PDF, IVA y gestion fiscal completa.
- Pasarela de pago, conciliacion bancaria o estados contables avanzados.
- CRM, contactos multiples por contratante o colaboracion multiusuario.
- Cambiar los KPIs principales del dashboard mensual.
- Cambiar la formula de `cobro bruto/hora`: sigue usando solo ingresos cobrados con `event_id` y horas de eventos.
- Reescribir los formularios financieros completos fuera del flujo minimo.

## Riesgos

- El concepto de liquidacion neta puede confundirse con beneficio contable; la UI debe nombrarlo como resumen operativo del trabajo.
- La UI no debe pedir al usuario que enlace gastos a ingresos en la operativa diaria; ese soporte queda en datos/portabilidad hasta que exista una necesidad clara.
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

- [x] Todas las issues estan en progreso o cerradas
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] Decisiones importantes documentadas

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:guard`
- [x] `npm run verify:pr -- --base origin/main`
- [x] Smoke financiero de proyecto y evento con gasto interno y gasto repercutible
- [x] Estado remoto de migracion Supabase documentado como aplicado/verificado o pendiente/bloqueante

## Checklist de salida

- [x] PR `release/0.1.0-beta.25` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag `v0.1.0-beta.25` creado desde `main`
- [ ] Produccion verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.25` eliminada si aplica
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Aniadido

- Resumen operativo de liquidacion neta en el detalle expandido de proyecto y evento.
- Soporte minimo para marcar gastos repercutibles sin pedir modelado contable diario.
- Soporte tecnico para enlace gasto -> ingreso en schema/import, reservado para usos futuros o datos avanzados.
- Helper puro `netSettlement` y tests de regresion financiera.

### Cambiado

- `useExpenses` sanea payloads para que `user_id` siga saliendo del usuario autenticado.
- Export/import conserva los nuevos campos de gastos repercutibles sin aceptar ownership ni FKs crudas en CSV de importacion.

### Corregido

- No aplica por ahora.

### Eliminado

- No aplica.

### Tecnico

- Migracion local aditiva `20260520120000_reimbursable_expenses.sql`.
- Policies de `incomes` y `expenses` explicitadas con `with check`.
- Trigger de coherencia para impedir enlaces gasto -> ingreso entre usuarios o alcances distintos.
- Migracion remota Supabase aplicada y verificada el 2026-05-20 tras confirmacion humana.
- Historial remoto de migraciones reparado para versiones antiguas ya aplicadas manualmente; `npx supabase db push --linked --dry-run` queda en `Remote database is up to date`.

## Resultado final

Implementacion local y migracion remota preparadas en `release/0.1.0-beta.25`. Pendiente cierre final: PR a `main`, CI, tag y publicacion.

## Siguiente corte

Beta 26 queda orientada a simplificar selectores y acciones: menos botones visibles, menos decisiones técnicas en formularios y más acciones contextuales UX-friendly para que el manejo diario sea más ligero.
