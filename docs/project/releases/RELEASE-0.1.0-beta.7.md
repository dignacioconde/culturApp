---
id: RELEASE-0.1.0-beta.7
type: release
status: Active
created: 2026-05-07
updated: 2026-05-07
release_branch: release/0.1.0-beta.7
release_tag: v0.1.0-beta.7
aliases:
  - RELEASE-0.1.0-beta.7
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.7 — Portabilidad mínima de datos

## Estado

Active

## Rama de release

`release/0.1.0-beta.7`

## Tag

`v0.1.0-beta.7`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.7` es un corte iterativo mergeable centrado en confianza de datos y portabilidad mínima.

## Objetivo de la release

Dar al usuario una garantía básica de salida de datos antes de ampliar onboarding o acceso beta: exportar su información y validar una importación CSV mínima sin persistir datos incorrectos.

Beta 7 debe mejorar confianza sin rediseñar el modelo de datos ni abrir todavía invitaciones, analítica o onboarding completo.

## Alcance funcional

- Exportar datos propios de proyectos, eventos, ingresos y gastos.
- Ofrecer una importación CSV mínima con validación previa.
- Mostrar errores de importación antes de guardar.
- Mantener la separación por usuario y el uso de hooks existentes.
- Documentar límites conocidos de formato, duplicados y campos incompletos.

## Restricciones CACH-B0005

- No usar service role ni saltarse RLS desde cliente.
- No aceptar `user_id` editable ni importado desde archivo.
- No cambiar schema Supabase salvo issue nueva y criterio explícito.
- No mezclar portabilidad con onboarding, invitaciones o analítica.
- No prometer compatibilidad completa con Excel/Google Sheets si la beta solo cubre CSV básico.

## Scope

- [[../issues/CACH-B0005|CACH-B0005]] — Importacion, exportacion y portabilidad de datos.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0005|CACH-B0005]] | Importacion, exportacion y portabilidad de datos | In progress | `release/0.1.0-beta.7` |

## Fuera de alcance

- Onboarding, invitaciones, consentimiento de analítica y acceso beta de [[../issues/CACH-B0006|CACH-B0006]].
- Contratantes, facturación y liquidación neta de [[../issues/CACH-B0004|CACH-B0004]].
- Calendario unificado, PWA/offline, notificaciones o features Pro.
- Importadores avanzados con mapeo persistente, plantillas múltiples o sincronización con Google Sheets.

## Riesgos

- La importación puede tocar contratos de datos sensibles; se mitiga manteniendo validación previa y `user_id` desde sesión autenticada.
- Exportar datos incompletos puede generar falsa confianza; se mitiga enumerando claramente entidades incluidas y límites.
- CSV puede crecer en complejidad si se intenta cubrir todos los formatos reales; se mitiga con una plantilla mínima verificable.

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

- [ ] Build correcto
- [ ] Tests/checks correctos (`npm run test`, `npm run lint`, `npm run build`, `npm run pb:check`, `git diff --check`)
- [ ] Revisión visual autenticada
- [ ] Revisión responsive autenticada
- [ ] Revisión accesibilidad
- [ ] Revisión de regresión básica
- [ ] Revisión de documentación

## Checklist de salida

- [ ] PR `release/0.1.0-beta.7` -> `main` abierta
- [ ] CI en verde
- [ ] Revisión aprobada
- [ ] PR mergeada en `main`
- [ ] `main` actualizado en local
- [ ] Tag `v0.1.0-beta.7` creado desde `main`
- [ ] Producción verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.7` eliminada
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Documento de release actualizado como cerrado

## Release notes

### Añadido

- Pendiente.

### Cambiado

- Pendiente.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Técnico

- Validación esperada: `npm run test`, `npm run lint`, `npm run build`, `npm run pb:check`, `git diff --check` y smoke autenticado de exportación/importación.

## Resultado final

Pendiente hasta cerrar la release.
