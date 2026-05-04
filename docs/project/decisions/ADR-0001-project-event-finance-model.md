---
id: ADR-0001
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0001
tags:
  - product-brain
  - adr
  - data
  - finance
---

# ADR-0001 — Mantener el modelo proyecto-evento con finanzas en ambos niveles

## Context

Cachés modela trabajos culturales con dos niveles: proyectos como contenedores/rangos y eventos como ocurrencias con fecha y hora exactas. Los ingresos y gastos pueden pertenecer a un evento o directamente a un proyecto.

Esta distincion ya esta implementada en Supabase, hooks, dashboard, detalles y calendarios.

## Decision

Mantener el modelo dual:

- `Proyecto`: agrupa, da vision global y puede tener costes o ingresos generales.
- `Evento`: representa trabajo concreto con hora exacta y puede existir sin proyecto.
- `Ingreso` y `gasto`: pueden estar vinculados a proyecto o evento.

No forzar todos los ingresos/gastos a evento ni todos a proyecto sin una decision nueva de liquidacion y facturacion.

## Consequences

- El usuario conserva trazabilidad entre trabajo concreto y contexto de proyecto.
- Los KPIs deben distinguir entre agregados de proyecto y tablas directas editables.
- El bruto/hora debe seguir excluyendo ingresos directos de proyecto para no inflar la metrica.
- La UI tiene que explicar bien la diferencia para no generar duplicidad cognitiva.

## Alternatives Considered

- Tratar todo como evento unico: simplifica datos, pero pierde vision de produccion y costes generales.
- Tratar todo como proyecto: simplifica jerarquia, pero vuelve imprecisa la agenda compartible y el calculo por hora.

## Related

- [[../context/product-snapshot-20260504]]
- [[../context/data-finance-model-20260504]]
- [[../issues/CACH-B0001]]
- [[../issues/CACH-B0004]]
- [[../issues/CACH-B0007]]
