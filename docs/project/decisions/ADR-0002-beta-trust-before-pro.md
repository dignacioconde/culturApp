---
id: ADR-0002
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0002
tags:
  - product-brain
  - adr
  - beta
---

# ADR-0002 — Beta prioriza confianza antes que features Pro

## Context

El MVP ya permite crear proyectos, eventos, ingresos, gastos y ver KPIs. La siguiente tentacion natural es añadir inteligencia financiera, automatizaciones y features Pro.

Pero una beta con datos de agenda y dinero necesita confianza antes que sofisticacion.

## Decision

La primera beta debe priorizar:

- Correccion de agenda y cobros.
- Portabilidad de datos.
- Onboarding que explique el modelo mental.
- Mobile financiero usable.
- Consentimiento claro antes de analitica o automatizaciones.

Las features Pro quedan despues de que el usuario pueda confiar en los datos basicos.

## Consequences

- Los bugs de exactitud tienen prioridad sobre mejoras vistosas.
- Exportacion/importacion bloquea beta mas que inteligencia financiera avanzada.
- La release beta debe tener criterios de salida propios.
- Las ideas Pro se conservan, pero no entran en el primer corte salvo que reduzcan riesgo de confianza.

## Alternatives Considered

- Lanzar beta con MVP actual: mas rapido, pero arriesga que el usuario pierda confianza si ve horas/cobros incorrectos.
- Empujar features Pro primero: puede diferenciar el producto, pero se apoya en datos todavia demasiado fragiles.

## Related

- [[../context/beta-readiness-risk-map-20260504]]
- [[../releases/RELEASE-0.1-beta]]
- [[../issues/CACH-B0014]]
- [[../issues/CACH-B0005]]
- [[../issues/CACH-B0006]]
- [[../issues/CACH-B0009]]
