---
schema_version: 2
kind: issue
id: CACH-B0002
title: Simplificar experiencia mobile financiera
lifecycle: active
created: '2026-05-04'
updated: '2026-05-13'
aliases:
  - CACH-B0002
tags:
  - product-brain
  - issue
  - mobile
generated: false
work_type: feature
work_level: initiative
issue_workflow: backlog
priority: p1
size: m
area: frontend
components:
  - finance
  - design-system
parent: null
related:
  - CACH-0032
  - CACH-0038
  - CACH-0041
  - CACH-0042
  - CACH-0045
  - CACH-0055
  - CACH-0063
depends_on: []
blocked_by: []
adr:
  - ADR-0016
release: null
theme: finance-operations
---
# CACH-B0002 — Simplificar experiencia mobile financiera

## Summary

Reducir fricción y densidad visual en móvil para dashboard, detalles de proyecto/evento, ingresos, gastos y acciones financieras frecuentes.

Tras los slices cerrados hasta beta 18, la épica deja de representar una petición genérica de "compactar" y queda como paraguas activo solo para deuda residual de patrón compartido.

## Context

Agrupa las entradas originales #3, #11, #13, #14 y #15, además de la captura "UI compacta: cards/cajas en toda la app".

La decisión canónica resultante vive en [[../decisions/ADR-0016-ux-mobile-financiera-operativa-acciones-contextuales|ADR-0016]].

## Problem

En móvil, el usuario necesita responder rápido:

- qué ocurre ahora o próximamente;
- qué cobros necesitan atención;
- cuánto está cobrado, pendiente y neto;
- cómo añadir o editar un ingreso/gasto sin pelearse con tablas, botones grandes ni controles pequeños.

La versión inicial de la épica era demasiado amplia para ejecutarse en un solo corte y no distinguía decisiones ya tomadas de deuda residual.

## Proposed Solution

Decisiones consolidadas:

- Dashboard móvil: operativa diaria antes que KPIs financieros completos.
- Detalles de proyecto/evento: resumen compacto por defecto con `Cobrado`, `Pendiente` y `Neto`; detalle financiero bajo demanda.
- Ingresos/gastos en móvil: listas compactas y acciones táctiles, no tablas densas.
- Quick actions financieras: concepto editable, importe y estado cobrado/pendiente cuando aplique.
- Acciones destructivas: fuera de la acción principal y siempre con confirmación.
- Navegación inferior global: no compite con barras contextuales en detalles.
- Fórmulas, hooks, schema, RLS, semántica de cobro y `cobro bruto/hora`: fuera de alcance de esta épica UX.

Deuda residual:

- Extraer o unificar el patrón de barra contextual móvil en detalles de proyecto/evento. Ver [[CACH-0063|CACH-0063]].

## Acceptance Criteria

- [x] El resumen financiero no tapa el contenido principal en evento/proyecto. Cubierto por [[CACH-0038|CACH-0038]] y [[CACH-0055|CACH-0055]].
- [x] Dashboard mobile muestra KPIs financieros de forma escaneable. Cubierto por [[CACH-0032|CACH-0032]] y [[CACH-0041|CACH-0041]].
- [x] Ingresos/gastos pueden añadirse en mobile sin girar pantalla. Cubierto por [[CACH-0038|CACH-0038]] y [[CACH-0055|CACH-0055]].
- [x] Tablas financieras tienen alternativa usable en mobile. Cubierto por [[CACH-0038|CACH-0038]] y [[CACH-0055|CACH-0055]].
- [x] Cards/cajas de Dashboard, Events y Projects comparten una densidad visual coherente. Cubierto por [[CACH-0041|CACH-0041]], [[CACH-0042|CACH-0042]] y [[CACH-0055|CACH-0055]].
- [ ] Las barras contextuales de detalle de proyecto y evento comparten un patrón reusable. Pendiente en [[CACH-0063|CACH-0063]].

## Decisiones consolidadas

- [[../decisions/ADR-0016-ux-mobile-financiera-operativa-acciones-contextuales|ADR-0016]] captura las reglas duraderas de UX móvil financiera.
- Los cambios visuales de esta épica no deben modificar fórmulas, hooks públicos financieros, schema, RLS ni semántica de cobro.
- Si un futuro slice cambia una regla transversal de producto, UX, datos o seguridad, debe crear o actualizar una decisión del Product Brain y enlazarla desde esta épica.

## Related

- [[../plans/backlog-mayo-2026]]
- [[../context/ux-mobile-guardrails-20260504|ux-mobile-guardrails-20260504]]
- [[../context/ui-direction-v3-20260504|ui-direction-v3-20260504]]
- [[../context/design-system-caches-20260506|design-system-caches-20260506]]
- [[../decisions/ADR-0016-ux-mobile-financiera-operativa-acciones-contextuales|ADR-0016]]
- [[CACH-0032|CACH-0032]]
- [[CACH-0038|CACH-0038]]
- [[CACH-0041|CACH-0041]]
- [[CACH-0042|CACH-0042]]
- [[CACH-0045|CACH-0045]]
- [[CACH-0055|CACH-0055]]
- [[CACH-0063|CACH-0063]]

## Desarrollo

- Rama:
- PR:
- Estado actual: épica activa solo por deuda residual de patrón compartido.

## Notas de progreso

2026-05-13: Se consolida el aprendizaje de los slices cerrados en [[../decisions/ADR-0016-ux-mobile-financiera-operativa-acciones-contextuales|ADR-0016]] y se crea [[CACH-0063|CACH-0063]] como deuda residual concreta.

## Cambios de alcance y decisiones

La épica ya no debe usarse para "seguir compactando" de forma genérica. Cualquier nuevo trabajo debe entrar como slice con ruta, viewport, síntoma y criterio visual.

## Bloqueos

Sin bloqueos conocidos.

## Validación ejecutada

- `npm run pb:index` OK.
- `npm run pb:check` OK.

## Memoria

Actualizada en `.memory/feedback_product_brain.md`.
