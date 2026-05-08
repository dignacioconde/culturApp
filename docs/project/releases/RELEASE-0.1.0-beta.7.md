---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.7
title: Portabilidad mínima de datos
lifecycle: active
created: '2026-05-07'
updated: '2026-05-08'
aliases:
  - RELEASE-0.1.0-beta.7
tags:
  - product-brain
  - release
  - beta
generated: false
release_phase: released
release_current: false
release_branch: release/0.1.0-beta.7
release_tag: v0.1.0-beta.7
release_pr: null
---
# RELEASE-0.1.0-beta.7 — Portabilidad mínima de datos

## Estado

Released

## Rama de release

`release/0.1.0-beta.7`

## Tag

`v0.1.0-beta.7`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.7` es un corte iterativo mergeable centrado en confianza de datos y portabilidad mínima.

## Objetivo de la release

Dar al usuario una garantía básica de salida de datos antes de ampliar onboarding o acceso beta: exportar sus datos operativos y validar una importación CSV mínima antes de guardar.

Beta 7 debe mejorar confianza sin rediseñar el modelo de datos ni abrir todavía invitaciones, analítica o onboarding completo.

## Alcance funcional

- Exportar datos operativos propios de proyectos, eventos, ingresos y gastos.
- Ofrecer una importación CSV mínima con plantilla fija, claves locales y validación previa.
- Mostrar errores de importación antes de guardar.
- Mantener la separación por usuario y el uso de hooks existentes.
- Documentar límites conocidos de formato, duplicados, campos incompletos, tamaño, filas y guardado no atómico.

## Restricciones CACH-B0005

- No usar service role ni saltarse RLS desde cliente.
- No aceptar `user_id` editable ni importado desde archivo.
- No aceptar `id`, `created_at`, `project_id` ni `event_id` desde CSV.
- No cambiar schema Supabase salvo issue nueva y criterio explícito.
- No mezclar portabilidad con onboarding, invitaciones o analítica.
- No prometer compatibilidad completa con Excel/Google Sheets si la beta solo cubre CSV básico.
- No prometer restore completo, importación idempotente ni transacción multi-tabla.

## Scope

- [[../issues/CACH-B0005|CACH-B0005]] — Importacion, exportacion y portabilidad de datos.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion, exportacion y portabilidad de datos | Released | `release/0.1.0-beta.7` |

## Fuera de alcance

- Onboarding, invitaciones, consentimiento de analítica y acceso beta de [[../issues/CACH-B0006|CACH-B0006]].
- Contratantes, facturación y liquidación neta de [[../issues/CACH-B0004|CACH-B0004]].
- Calendario unificado, PWA/offline, notificaciones o features Pro.
- Importadores avanzados con mapeo persistente, plantillas múltiples o sincronización con Google Sheets.
- Excel/XLSX directo, notas libres, restore JSON, update/merge/idempotencia y RPC transaccional.

## Riesgos

- La importación puede tocar contratos de datos sensibles; se mitiga manteniendo validación previa, `user_id` desde sesión autenticada y rechazo de UUIDs crudos.
- Exportar datos incompletos puede generar falsa confianza; se mitiga enumerando claramente entidades incluidas y límites.
- CSV puede crecer en complejidad si se intenta cubrir todos los formatos reales; se mitiga con una plantilla mínima verificable.
- El guardado cliente no es atómico; se mitiga comunicándolo en UI y mostrando fallos parciales si ocurren tras validar.

## Decisiones relacionadas

- [[../decisions/ADR-0002-beta-trust-before-pro|ADR-0002]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validación definidos

## Checklist de desarrollo

- [ ] Todas las issues están en progreso o cerradas
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin estado
- [ ] No hay decisiones importantes sin documentar

## Checklist de estabilización

- [x] Build correcto
- [x] Tests/checks correctos (`npm run test`, `npm run lint`, `npm run build`, `npm run pb:check`, `git diff --check`)
- [x] Revisión visual autenticada
- [x] Revisión responsive autenticada
- [x] Revisión accesibilidad
- [x] Revisión de regresión básica
- [x] Revisión de documentación

## Checklist de salida

- [x] PR `release/0.1.0-beta.7` -> `main` abierta: https://github.com/dignacioconde/culturApp/pull/86
- [x] CI en verde
- [x] Revisión aprobada
- [x] PR mergeada en `main`
- [x] `main` actualizado en local
- [x] Tag `v0.1.0-beta.7` creado desde `main`
- [x] Producción verificada si aplica
- [x] Rama remota `release/0.1.0-beta.7` eliminada
- [x] Release notes actualizadas
- [x] Issues marcadas como `Released`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Documento de release actualizado como cerrado

## Release notes

### Añadido

- Página privada `Tus datos` enlazada desde Ajustes y la navegación principal.
- Exportación de proyectos, eventos, ingresos y gastos en backup JSON y CSV por entidad.
- Plantilla CSV descargable con ejemplos, claves locales `project_key`/`event_key`, previsualización y validación antes de guardar.
- Importación CSV create-only, no atómica, con informe de guardado parcial si una escritura falla tras validar.

### Cambiado

- La portabilidad queda limitada a datos operativos; no incluye auth, email, restore JSON, Excel/XLSX ni sincronización externa.

### Corregido

- La importación rechaza cabeceras de ownership, IDs y FKs crudas del archivo.
- Exportación e importación CSV mitigan fórmulas de hoja de cálculo.

### Eliminado

- No aplica.

### Técnico

- Validación ejecutada: `npm run test`, `npm run lint`, `npm run build`, `npm run pb:check` y `git diff --check`.
- Smoke autenticado de exportación/importación en `/data` aceptado por revisión manual del usuario el 2026-05-07.
- E2E Playwright no cuenta como bloqueo mientras no exista seed/auth estable; la cobertura principal de esta beta vive en Vitest y smoke autenticado manual.

## Resultado final

Release cerrada y mergeada a `main` el 2026-05-07 en PR #86. Tag `v0.1.0-beta.7` creado desde `main`.
