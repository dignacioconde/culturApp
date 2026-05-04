---
id: PB-ZK-20260504-RBC-HEIGHT
type: knowledge
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - React Big Calendar altura real
tags:
  - product-brain
  - zk
  - calendar
  - frontend
---

# React Big Calendar necesita altura real calculable

## Idea Principal

React Big Calendar puede renderizar toolbar y cabecera correctamente aunque las filas del mes colapsen a altura 0 si su contenedor interno no tiene una altura real calculable.

## Contexto

El riesgo aparece con combinaciones de `min-height`, `flex-1`, `min-h-0`, `overflow-hidden` o `height: 100%` sin una cadena de padres con altura computada.

## Verificacion

En bugs visuales de calendario:

- revisar alturas computadas de `.rbc-calendar`, `.rbc-month-view` y `.rbc-month-row`;
- confirmar con captura que las semanas/filas se ven;
- no considerar suficiente que pasen lint/build o que se vea la toolbar.

## Implicaciones

- Las tareas visuales de calendario necesitan verificacion de navegador.
- La vista semana mobile con scroll horizontal esta aceptada por ahora; una mejora futura debe abrir issue nueva con criterio visual concreto.

## Relacionado Con

- [[../context/ux-mobile-guardrails-20260504]]
- [[../issues/CACH-B007]]
- [[../issues/CACH-B014]]
