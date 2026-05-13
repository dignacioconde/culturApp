---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.19
title: Contratantes estructurados
lifecycle: active
created: '2026-05-13'
updated: '2026-05-13'
aliases:
  - RELEASE-0.1.0-beta.19
tags:
  - product-brain
  - release
  - beta
  - finance
  - data
generated: false
release_phase: released
release_current: false
release_branch: release/0.1.0-beta.19
release_tag: v0.1.0-beta.19
release_pr: https://github.com/dignacioconde/culturApp/pull/105
---
# RELEASE-0.1.0-beta.19 — Contratantes estructurados

## Estado

Released.

## Rama de release

`release/0.1.0-beta.19`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.19` es un corte mergeable para abrir `CACH-B0004` por el slice seguro de contratantes estructurados.

## Objetivo de la release

Crear la base de datos, contrato técnico y UX mínima para que proyectos y eventos puedan usar un contratante reutilizable, sin romper el campo `client` actual ni cambiar fórmulas financieras.

## Alcance funcional

- Decidir el modelo mínimo de contratante y documentar el límite entre contratante, facturación y CRM.
- Versionar schema, RLS y backfill para `contractors` con compatibilidad hacia `client`.
- Añadir hooks y portabilidad para contratantes.
- Permitir elegir o crear contratante desde formularios de proyecto y evento.
- Mostrar el contratante de forma limpia en listados, detalles, calendario y trabajos.
- Verificar que dashboard, detalles, cobros y `cobro bruto/hora` no cambian de fórmula.

## Scope

- [[../issues/CACH-0057|CACH-0057]] — Definir modelo mínimo de contratantes.
- [[../issues/CACH-0058|CACH-0058]] — Versionar schema de contratantes y RLS.
- [[../issues/CACH-0059|CACH-0059]] — Integrar hooks y portabilidad de contratantes.
- [[../issues/CACH-0060|CACH-0060]] — Añadir UX mínima de contratantes en proyectos y eventos.
- [[../issues/CACH-0061|CACH-0061]] — Verificar regresión financiera y cierre técnico beta 19.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0057|CACH-0057]] | Definir modelo mínimo de contratantes | done | `release/0.1.0-beta.19` |
| [[../issues/CACH-0058|CACH-0058]] | Versionar schema de contratantes y RLS | done | `release/0.1.0-beta.19` |
| [[../issues/CACH-0059|CACH-0059]] | Integrar hooks y portabilidad de contratantes | done | `release/0.1.0-beta.19` |
| [[../issues/CACH-0060|CACH-0060]] | Añadir UX mínima de contratantes en proyectos y eventos | done | `release/0.1.0-beta.19` |
| [[../issues/CACH-0061|CACH-0061]] | Verificar regresión financiera y cierre técnico beta 19 | done | `release/0.1.0-beta.19` |

## Fuera de alcance

- Facturas emitidas, numeración, PDF, presupuestos, albaranes o fiscalidad completa.
- Liquidación neta que vincule gasto repercutible con ingreso concreto.
- CRM ligero, contactos múltiples, pipeline comercial o colaboración multiusuario.
- Unificar ingresos/gastos a nivel proyecto.
- Cambiar `cobro bruto/hora`, KPIs, dashboard finance helpers o reglas de IRPF.
- Mutar Supabase producción sin mostrar SQL exacto y recibir confirmación explícita.

## Riesgos

- La migración remota de Supabase es funcionalmente bloqueante: una release con schema pendiente puede estar code-complete, pero no production-ready.
- El backfill desde `client` debe deduplicar por usuario y texto normalizado sin perder el texto libre existente.
- La UX debe evitar convertirse en un CRM pesado; el objetivo es reutilizar contratantes, no gestionar ventas.
- Portabilidad debe conservar datasets anteriores y no exponer `user_id`.
- Cualquier cambio accidental en fórmulas financieras debe bloquear el cierre.

## Decisiones relacionadas

- [[../issues/CACH-B0004|CACH-B0004]] — Contratantes, facturación y liquidación neta.
- [[../context/data-finance-model-20260504|data-finance-model-20260504]]
- [[../decisions/ADR-0001-project-event-finance-model|ADR-0001]]
- [[../decisions/ADR-0006-gross-cache-per-hour|ADR-0006]]
- [[../process/supabase-db-access|Supabase DB Access]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada localmente
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan cerradas o listas para release
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:guard`
- [x] `npm run release:sync-check`
- [x] Smoke proyecto/evento/listados/dashboard/exportacion
- [x] Verificacion remota Supabase o bloqueo documentado
- [x] Regresion financiera confirmada sin cambios de formulas

## Checklist de salida

- [x] PR `release/0.1.0-beta.19` -> `main` abierta
- [x] CI en verde
- [x] PR mergeada en `main`
- [x] Tag creado desde `main` si aplica
- [x] Produccion verificada o marcada como pendiente por migracion remota
- [x] Rama remota `release/0.1.0-beta.19` eliminada si aplica
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Aniadido

- Tabla `contractors` con RLS por usuario y backfill desde `client`.
- `contractor_id` opcional en proyectos y eventos.
- Herencia persistida de `project.contractor_id` hacia eventos vinculados cuando no tienen contratante propio.
- Hook `useContractors`, selector de contratante y creación inline desde formularios de proyecto/evento.
- Ruta `/contractors` para gestionar contratantes como entidad ligera.
- Exportación/importación de contratantes con compatibilidad CSV legacy.

### Cambiado

- Proyectos, eventos, calendarios y `/work` muestran contratante estructurado, heredado o `client` legacy sin duplicar texto.

### Corregido

- La app ya no muestra errores genéricos de carga en trabajos/contratantes cuando el schema de contratantes está pendiente: se informa el estado de migración de forma específica.

### Eliminado

- No aplica por ahora.

### Tecnico

- Migración local `supabase/migrations/20260513120000_contractors.sql`.
- Validación local completada: `npm run lint`, `npm run test`, `npm run build`, `npm run pb:guard`, `npm run release:sync-check` y `npm run verify:pr -- --base origin/main`.
- Migración remota Supabase aplicada, verificada con SQL read-only y sincronizada en historial con `migration repair`.
- Smoke manual autenticado confirmado por usuario: `/work`, `/contractors` y herencia de contratante desde proyecto hacia evento.

## Resultado final

Release cerrada mediante PR final a `main`. Tag `v0.1.0-beta.19` preparado desde `main`; produccion verificada en `https://app.caches.es` con smoke de rutas SPA.
