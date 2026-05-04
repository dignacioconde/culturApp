---
id: ADR-0006
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0006
tags:
  - product-brain
  - adr
  - finance
---

# ADR-0006 — Definicion estricta de Caché bruto/hora

## Context

El KPI `Caché bruto/hora` pretende responder cuanto se esta cobrando realmente por horas de eventos. En el MVP se detecto un bug donde el calculo mezclaba meses y podia mostrar una cifra incorrecta.

Los ingresos directos de proyecto no tienen horas asociadas fiables, asi que incluirlos inflaria la metrica.

## Decision

El KPI `Caché bruto/hora` del dashboard usa solo:

- ingresos cobrados (`is_paid = true`);
- vinculados a eventos (`event_id` no nulo);
- antes de IRPF;
- dentro del mes seleccionado;
- divididos entre las horas de esos eventos, calculadas con `end_datetime - start_datetime`.

Se excluyen:

- ingresos directos de proyecto sin `event_id`;
- ingresos no cobrados;
- horas de eventos fuera del mes seleccionado;
- eventos sin duracion suficiente para calcular horas.

## Consequences

- La metrica mide cobro real por trabajo con hora, no facturacion general.
- El dashboard y ProjectDetail deben mantener la misma interpretacion cuando muestren bruto/hora.
- Las features Pro futuras pueden crear otras metricas, pero no deben cambiar esta definicion sin una ADR nueva.

## Alternatives Considered

- Usar ingresos previstos: da una señal de pipeline, pero no de cobro real.
- Incluir ingresos directos de proyecto: suma dinero relevante, pero rompe la division por horas.
- Calcular por mes de `paid_date`: util para caja, pero puede separar ingreso y evento; debe tratarse como metrica distinta.

## Related

- [[../context/data-finance-model-20260504|data-finance-model-20260504]]
- [[../issues/CACH-B0003|CACH-B0003]]
- [[../issues/CACH-B0009|CACH-B0009]]
- [[../issues/CACH-B0014|CACH-B0014]]
