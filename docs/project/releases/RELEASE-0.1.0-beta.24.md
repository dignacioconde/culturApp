---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.24
title: Calendario claro y sincronizacion suscribible
lifecycle: active
created: '2026-05-14'
updated: '2026-05-14'
aliases:
  - RELEASE-0.1.0-beta.24
tags:
  - product-brain
  - release
  - beta
  - calendar
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.24
release_tag: v0.1.0-beta.24
release_pr: null
---
# RELEASE-0.1.0-beta.24 — Calendario claro y sincronización suscribible

## Estado

Active.

## Rama de release

`release/0.1.0-beta.24`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.24` es un corte funcional solo de calendario para mejorar claridad, uso móvil y sincronización externa sin abrir OAuth ni escritura en calendarios de terceros.

## Objetivo de la release

Hacer que Agenda y Plan anual sean más comprensibles y útiles en móvil, y permitir que el usuario suscriba sus eventos de Cachés en Apple Calendar, Google Calendar, Outlook u otros calendarios compatibles mediante enlace privado `.ics/webcal`.

## Alcance funcional

- Calendarios separados con lenguaje claro: Agenda de eventos y Plan anual de proyectos.
- Agenda móvil con lista accionable del periodo visible.
- Leyendas/resúmenes para que los colores tengan significado reconocible.
- Plan anual móvil simplificado alrededor de meses y proyectos del mes.
- Feed privado suscribible de eventos, revocable y de solo lectura.
- Sin OAuth, sin escritura en calendarios externos y sin sincronizar proyectos en v1.

## Scope

- [[../issues/CACH-0089|CACH-0089]] — Preparar Beta 24 de calendario.
- [[../issues/CACH-0090|CACH-0090]] — Clarificar Agenda y Plan anual.
- [[../issues/CACH-0091|CACH-0091]] — Rehacer visibilidad móvil de calendarios.
- [[../issues/CACH-0092|CACH-0092]] — Feed suscribible privado de eventos.
- [[../issues/CACH-0093|CACH-0093]] — UI de sincronización por proveedor.
- [[../issues/CACH-0094|CACH-0094]] — QA y cierre de Beta 24 calendario.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0089|CACH-0089]] | Preparar Beta 24 de calendario | done | `release/0.1.0-beta.24` |
| [[../issues/CACH-0090|CACH-0090]] | Clarificar Agenda y Plan anual | done | `release/0.1.0-beta.24` |
| [[../issues/CACH-0091|CACH-0091]] | Rehacer visibilidad móvil de calendarios | done | `release/0.1.0-beta.24` |
| [[../issues/CACH-0092|CACH-0092]] | Feed suscribible privado de eventos | done local; pendiente remoto | `release/0.1.0-beta.24` |
| [[../issues/CACH-0093|CACH-0093]] | UI de sincronización por proveedor | done | `release/0.1.0-beta.24` |
| [[../issues/CACH-0094|CACH-0094]] | QA y cierre de Beta 24 calendario | done local; pendiente PR/deploy | `release/0.1.0-beta.24` |

## Fuera de alcance

- OAuth con Google Calendar o Microsoft Graph.
- Escritura, borrado o importación desde calendarios externos.
- Feed público sin token privado y revocable.
- Sincronización de proyectos como bloques de día completo.
- Rediseño custom completo de React Big Calendar o reintroducción de semana móvil.
- Cambios de finanzas, contratantes, facturación, dashboard o fórmulas.

## Riesgos

- El enlace privado da acceso a los eventos incluidos a cualquiera que lo tenga; debe poder revocarse y regenerarse.
- Google Calendar requiere añadir calendarios por URL desde navegador de ordenador, no desde la app móvil.
- Apple y Outlook pueden tardar en refrescar; la UI no debe prometer actualización inmediata.
- La Edge Function pública debe exponer solo campos mínimos y nunca notas, importes, datos fiscales ni `user_id`.
- React Big Calendar debe conservar altura real en móvil y desktop.

## Decisiones relacionadas

- [[../issues/CACH-B0007|CACH-B0007]] — Calendarios claros y sincronización suscribible.
- [[../issues/CACH-0056|CACH-0056]] — Calendario de eventos y plan anual separados.
- [[../knowledge/PB-ZK-20260504-rbc-height|PB-ZK-20260504-rbc-height]] — React Big Calendar necesita altura real.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [ ] Commits integrados en rama release
- [ ] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:guard`
- [x] `npm run verify:pr -- --base origin/main`
- [x] Revision responsive de `/calendar/events`
- [x] Revision responsive de `/calendar/projects`
- [x] Verificacion de Edge Function y migracion remota marcada aplicada/verificada o pendiente

## Checklist de salida

- [ ] PR `release/0.1.0-beta.24` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag `v0.1.0-beta.24` creado desde `main`
- [ ] Produccion verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.24` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Enlaces privados suscribibles para llevar eventos de Cachés a calendarios externos compatibles.
- Panel de sincronización por proveedor en Agenda.

### Cambiado

- Agenda y Plan anual explican mejor sus usos y mejoran la lectura móvil.

### Corregido

- Se elimina el selector móvil poco útil como superficie principal y el detalle seleccionado deja de tapar el calendario.

### Eliminado

- No aplica.

### Tecnico

- Nueva tabla `calendar_feeds`, RPCs seguras y Edge Function pública protegida por token privado.

## Resultado final

Implementación local completada y validada. Pendiente antes de publicar: commit/PR, aplicar migración `20260514120000_calendar_feeds.sql` y desplegar `calendar-feed` en Supabase remoto sin JWT.
