---
id: CACH-B0002
type: issue
status: Backlog
priority: High
release: Unassigned
created: 2026-05-04
updated: 2026-05-04
aliases:
  - CACH-B0002
tags:
  - product-brain
  - issue
  - mobile
---

# CACH-B0002 — Simplificar experiencia mobile financiera

## Summary

Reducir fricción y densidad visual en mobile para resumen financiero, botones, formularios, tablas de ingresos/gastos y cards/cajas de la UI.

## Context

Agrupa #3, #11, #13, #14 y #15. Absorbe tambien la captura "UI compacta: cards/cajas en toda la app".

## Problem

En mobile, el resumen financiero y las tablas ocupan demasiado; los botones de edición/eliminación pesan más de lo necesario y los formularios de ingresos/gastos requieren demasiado espacio.

El Dashboard móvil debe sentirse tan compacto y escaneable como Events y Projects, sin romper legibilidad ni targets táctiles.

## Proposed Solution

- Resúmenes financieros colapsables o reducidos.
- Acceso a detalle financiero bajo demanda.
- Botones compactos en mobile.
- Formularios de ingresos/gastos optimizados para selección táctil.
- Sustituir tablas por cards/listas cuando el viewport lo requiera.
- Revisar padding interno de cards, gaps entre items y layout de grids en mobile.
- Mantener targets táctiles de 40-44px aunque se compacte la superficie visual.

## Acceptance Criteria

- [ ] El resumen financiero no tapa el contenido principal en evento/proyecto.
- [ ] Dashboard mobile muestra KPIs financieros de forma escaneable.
- [ ] Ingresos/gastos pueden añadirse en mobile sin girar pantalla.
- [ ] Tablas financieras tienen alternativa usable en mobile.
- [ ] Cards/cajas de Dashboard, Events y Projects comparten una densidad visual coherente.

## Related

- [[../plans/backlog-mayo-2026]]
- [[../context/ux-mobile-guardrails-20260504|ux-mobile-guardrails-20260504]]
- [[../context/ui-direction-v3-20260504|ui-direction-v3-20260504]]
