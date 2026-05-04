---
id: ADR-0005
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0005
tags:
  - product-brain
  - adr
  - ux
  - forms
---

# ADR-0005 — Controles propios para selectores, fechas y decimales

## Context

Cachés se usa mucho en mobile. Los selectores nativos del navegador/SO y los inputs de fecha nativos generan menus pequenos, inconsistentes y poco controlables para la UX del MVP.

Tambien hay requisitos de dominio: fechas en formato español, horas por defecto para eventos y decimales financieros con coma o punto.

## Decision

Las paginas de la app no deben introducir `<select>`, `input type="date"` ni `input type="datetime-local"` nativos directamente.

Se usan los controles compartidos de `src/components/ui/Input.jsx`:

- `Select`
- `Input type="date"`
- `Input type="datetime-local"`

Contrato UX/datos:

- `Input type="date"` muestra `DD/MM/YYYY` y emite `YYYY-MM-DD`.
- `Input type="datetime-local"` compone fecha y hora y emite `YYYY-MM-DDTHH:mm`.
- Los eventos empiezan por defecto a las `08:00`.
- La hora de fin parte de la hora de inicio si el usuario no ha elegido otra.
- Los eventos de varios dias son una opcion explicita antes de pedir fecha de fin distinta.
- Los decimales financieros usan entrada compatible con coma y punto mediante `parseDecimal()`.
- Los objetivos tactiles de selectores, checkboxes y swatches deben rondar 40-44px.

## Consequences

- La UX mobile es mas consistente y grande.
- La app mantiene compatibilidad con Supabase sin exponer formatos internos al usuario.
- Cualquier nuevo selector complejo debe extender el componente compartido en vez de resolverlo localmente.

## Alternatives Considered

- Usar controles nativos por simplicidad: reduce codigo, pero empeora mobile y fragmenta la experiencia.
- Crear controles ad hoc por pagina: resolveria casos puntuales, pero duplicaria reglas de fecha/hora y decimales.

## Related

- [[../context/ux-mobile-guardrails-20260504|ux-mobile-guardrails-20260504]]
- [[../issues/CACH-B0002|CACH-B0002]]
- [[../issues/CACH-B0007|CACH-B0007]]
- [[../issues/CACH-B0014|CACH-B0014]]
