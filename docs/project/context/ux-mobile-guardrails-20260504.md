---
id: PB-CTX-UX-MOBILE-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Guardrails UX mobile 2026-05-04
tags:
  - product-brain
  - context
  - ux
  - mobile
---

# Guardrails UX y mobile — 2026-05-04

## Voz Y Lenguaje

- UI en español de España.
- Tuteo natural.
- Copys cortos y operativos; Cachés debe sentirse como herramienta de trabajo, no como landing de marketing.

## Formularios Y Selectores

- No usar `<select>` nativo en pantallas de app.
- No usar `input type="date"` ni `input type="datetime-local"` directamente en páginas.
- Usar `Select`, `Input type="date"` e `Input type="datetime-local"` de `src/components/ui/Input.jsx`.
- Los selectores propios deben mantener objetivos táctiles amplios y valores compatibles con Supabase.
- Fechas: mostrar `DD/MM/YYYY`, emitir `YYYY-MM-DD`.
- Datetime: emitir `YYYY-MM-DDTHH:mm`.
- Decimales financieros: aceptar coma y punto con `parseDecimal()`.

## Eventos Y Fechas

- Hora inicial habitual de evento: `08:00`.
- Evento de un día por defecto.
- La hora de fin parte de la hora de inicio cuando el usuario no ha elegido otra.
- Los eventos multi-día son una excepción explícita mediante “Evento de varios días”.

## Calendarios

- React Big Calendar necesita altura real calculable en el contenedor interno.
- En bugs visuales de calendario, verificar que se ven las filas/semanas, no solo toolbar y cabecera.
- La vista semana móvil de `/calendar/events` usa scroll horizontal y está aceptada por ahora.
- Si se reabre la mejora mobile del calendario, abrir nueva issue con ruta, viewport, captura y criterio visual.

## Mobile Financiero

El usuario necesita consultar y actuar rápido desde móvil. La densidad financiera actual sirve para MVP, pero el backlog prioriza reducir fricción:

- Resumen financiero colapsable o reducido.
- Tablas convertibles a cards/listas en viewport móvil.
- Botones de editar/eliminar menos dominantes.
- Cobro rápido sin entrar al detalle completo.
- Cards y cajas más compactas sin bajar de targets táctiles seguros.
- Dashboard mobile tan escaneable como Events y Projects.
- Padding/gaps deben revisarse desde legibilidad real, no solo desde densidad.

## Relacionado Con

- [[../issues/CACH-B0002|CACH-B0002]]
- [[../issues/CACH-B0003|CACH-B0003]]
- [[../issues/CACH-B0007|CACH-B0007]]
- [[../plans/backlog-mayo-2026|backlog-mayo-2026]]
- [[ui-direction-v3-20260504|ui-direction-v3-20260504]]
- [[../decisions/ADR-0005-custom-form-controls-and-date-inputs|ADR-0005-custom-form-controls-and-date-inputs]]
- [[../knowledge/PB-ZK-20260504-rbc-height|PB-ZK-20260504-rbc-height]]
