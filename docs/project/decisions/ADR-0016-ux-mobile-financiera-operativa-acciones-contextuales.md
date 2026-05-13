---
schema_version: 2
kind: decision
id: ADR-0016
title: 'UX móvil financiera: operativa primero y acciones contextuales'
lifecycle: active
created: '2026-05-13'
updated: '2026-05-13'
aliases:
  - ADR-0016
tags:
  - product-brain
  - adr
  - ux
  - mobile
  - finance
generated: false
decision_status: Accepted
---
# ADR-0016 — UX móvil financiera: operativa primero y acciones contextuales

## Decision status

Accepted.

## Contexto

`CACH-B0002` se ejecutó en varios slices entre beta 6 y beta 18. Las decisiones duraderas quedaron repartidas entre issues cerradas y memoria, pero no estaban capturadas como decisión canónica del Product Brain.

La app necesita que el móvil sea rápido para consultar agenda, cobros, ingresos y gastos sin convertir los detalles financieros en pantallas densas ni tocar fórmulas financieras.

## Decision

La UX móvil financiera de Cachés sigue estas reglas:

- El dashboard móvil prioriza operativa diaria: estado "Ahora", próximos trabajos y cobros urgentes antes que KPIs completos.
- Los KPIs financieros completos son secundarios en móvil; deben ser compactos y no dominar el primer pantallazo.
- Los detalles de proyecto y evento muestran por defecto un resumen financiero compacto con `Cobrado`, `Pendiente` y `Neto`.
- El detalle financiero ampliado queda bajo demanda cuando haya métricas secundarias.
- En móvil, ingresos y gastos se presentan como listas compactas y accionables, no como tablas densas.
- Las acciones frecuentes usan quick actions o modales ligeros con concepto editable, importe y estado cobrado/pendiente cuando aplique.
- Las acciones destructivas no viven como acción principal y siempre requieren confirmación explícita.
- La navegación inferior global se oculta en detalles cuando hay barra contextual para no competir con acciones de proyecto/evento.
- Los cambios de esta línea UX no alteran schema, RLS, hooks públicos financieros, fórmulas, semántica de cobro ni `cobro bruto/hora`.

## Consecuencias

- Las futuras mejoras de `CACH-B0002` deben crear slices pequeñas y verificables en lugar de reabrir una épica genérica de "compactar".
- Las nuevas pantallas financieras móviles deben reutilizar patrones compartidos de lista, quick action y barra contextual cuando existan.
- Cualquier cambio que toque fórmula financiera, semántica de cobro, RLS, schema o contratantes pertenece a `CACH-B0004` u otra issue de datos, no a esta decisión UX.
- La verificación de estos cambios necesita rutas y viewports móviles concretos, especialmente 320 px y 390 px.

## Alternativas consideradas

- Mantener KPIs financieros como protagonista móvil: conserva paridad con desktop, pero retrasa las respuestas operativas que se necesitan en movimiento.
- Usar tablas financieras también en móvil: reduce diferencias de implementación, pero empeora escaneo y acciones táctiles.
- Convertir cada ajuste móvil en decisión local de issue: acelera cada slice, pero vuelve difícil saber qué patrón debe seguir el siguiente agente.

## Fecha

2026-05-13

## Relacionado con

- [[../issues/CACH-B0002]]
- [[../issues/CACH-0032]]
- [[../issues/CACH-0038]]
- [[../issues/CACH-0041]]
- [[../issues/CACH-0042]]
- [[../issues/CACH-0045]]
- [[../issues/CACH-0055]]
- [[../context/ux-mobile-guardrails-20260504]]
- [[../context/design-system-caches-20260506]]
