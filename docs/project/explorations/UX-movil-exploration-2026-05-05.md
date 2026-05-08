---
schema_version: 2
kind: exploration
id: PB-UX-MOBILE-EXPLORATION-20260505
title: CulturaApp
lifecycle: historical
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - PB-UX-MOBILE-EXPLORATION-20260505
tags:
  - ux
  - mobile
  - exploration
generated: false
---
# Exploración UX Móvil — CulturaApp

Exploración paralela en modo solo lectura: rutas principales y calendarios/formularios.

---

## Exploración 1/2: UX Móvil General

**Viewports analizados:** 360px, 390px (típico móvil), referencia breakpoint sm (640px)

### Hallazgos priorizados por severidad

#### Alta — Accesibilidad táctil comprometida

| Archivo | Línea | Problema | Síntoma | Solución |
|---------|-------|----------|---------|-----|
| `src/pages/Dashboard/Dashboard.jsx` | 140-148 | Botones de mes (`p-1.5`) demasiado pequeños | `ChevronLeft/Right` con padding de 6px (24px total) no alcanza 40px mínimos | Cambiar a `p-2.5 min-h-10` |
| `src/components/ui/Input.jsx` | 494 | Dropdown de Select con `max-h-72` sin scroll visible en pantalla pequeña | En 360px el desplegable de 288px puede cortarse | Añadir `overflow-y-auto` + `max-h-[60vh]` |
| `src/pages/Events/EventList.jsx` | 109-149 | 4 filtros apilados en móvil ocupan ~300px de altura | Filtros consumen casi medio viewport en 360px | Reducir a dropdown colapsable o 2+2 grid |

#### Media — Layout y desbordamiento

| Archivo | Línea | Problema | Síntoma | Solución |
|---------|-------|----------|---------|-----|
| `src/components/ui/Input.jsx` | 215 | El popup de calendario usa `min-w-[20rem]` (320px) | Desbordamiento horizontal en viewport de 360px | Reducir a `min-w-[280px]` o adaptar a breakpoints |
| `src/components/layout/PageWrapper.jsx` | 21 | Padding horizontal `px-4` en sidebar puede ser ajustado | En 360px el contenido necesita más espacio | Considerar `px-2` en móvil o `sm:px-4` |
| `src/pages/Calendar/CalendarEvents.jsx` | 159 | Altura fija de 560px en móvil | Ocupa demasiado espacio en pantalla pequeña | Reducir a `h-[480px]` o usar `calc()` con seguridad |
| `src/pages/Calendar/CalendarProjects.jsx` | 147 | Mismo problema de altura fija | Ocupa demasiado espacio en pantalla pequeña | Reducir a `h-[480px]` o usar `calc()` con seguridad |

#### Menor — Inconsistencias y textos

| Archivo | Línea | Problema | Síntoma | Solución |
|---------|-------|----------|---------|-----|
| `src/pages/Events/EventList.jsx` | 98 | Badge de estado con clases de color de Tailwind | En móvil puede verse diferente según el color | Verificar contraste en ambos viewports |
| `src/pages/Dashboard/Dashboard.jsx` | 162 | Etiquetas KPIs en móvil | Texto largo como "Ingresos previstos" puede cortarse | Usar truncamiento o labels cortos en móvil |
| `src/pages/Settings/Settings.jsx` | — | Formulario de settings en móvil | Verificar que los campos no excedan el viewport | Probar con datos reales largos |

---

## Exploración 2/2: UX Móvil de Calendarios y Formularios

**Rutas revisadas:** `/calendar/events`, `/calendar/projects`, `EventForm`, `ProjectForm`, `EventDetail`, `ProjectDetail`

### Hallazgos por severidad

#### Medio — Panel de proyecto truncado en CalendarEvents

- **Archivo:** `src/pages/Calendar/CalendarEvents.jsx:244`
- **Síntoma:** En el panel lateral de evento, el enlace al proyecto usa `max-w-44 truncate` (176px). Los nombres de proyecto largos se cortan sin elipsis visible.
- **Riesgo UX:** Usuario en móvil no puede ver el nombre completo del proyecto asociado.
- **Solución concreta:** Cambiar a `max-w-full truncate` o aumentar a `max-w-52` y añadir `text-ellipsis` explícito.

#### Menor — Inconsistencia visual de panel en Detail views

- **Archivos:** `src/pages/Events/EventDetail.jsx` vs `src/pages/Projects/ProjectDetail.jsx`
- **Síntoma:** ProjectDetail (línea 245) muestra el detalle extra `"Solo eventos cobrados · X h"` en la tarjeta de cobro/hora, mientras que EventDetail no lo muestra.
- **Riesgo UX:** Inconsistencia menor en la experiencia entre las dos vistas.
- **Solución concreta:** Opcional: revisar si debe ser consistente o si es intencional por la diferencia conceptual entre evento y proyecto.

---

## Verificaciones exitosas

### Lo Que Funciona Correctamente

| Área | Implementación | Veredicto |
|------|----------------|-----------|
| **Altura calendario** | Fija `560px` en móvil (`h-[560px] min-h-[560px]`) y no usa `height: 100%` con `min-height` | Correcto: evita el bug conocido de RBC |
| **Panel lateral móvil** | `fixed bottom-0` con toggle ChevronUp/Down | Correcto |
| **Vista semana móvil** | `availableViews = ['month', 'day']`; semana no disponible | Correcto: evita scroll horizontal problemático |
| **Selectores custom** | Usa `Select` de Input.jsx, no `<select>` nativo | Correcto: menús grandes en móvil |
| **Date picker custom** | `DateInput` con escritura manual DD/MM/YYYY y popup calendario | Correcto: cumple la memoria del proyecto |
| **Datetime picker** | `DateTimeInput` con selector de hora de 96 opciones en intervalos de 15 minutos | Correcto: `scrollIntoView` ayuda |
| **Hora por defecto 08:00** | `defaultTime="08:00"` en EventForm línea 180 | Correcto: cumple la memoria del proyecto |
| **Checkbox "varios días"** | EventForm líneas 194-203, oculta datetime fin hasta marcar | Correcto |
| **Colores táctiles** | 10 colores, botones 40px (`h-10 w-10`), ring en seleccionado | Correcto: targets adecuados |
| **Modales móvil** | `flex items-end` en móvil, centrado en desktop | Correcto |
| **Tablas responsive** | Desktop: `<table>`; móvil: cards colapsables con grid 2x2 | Correcto |
| **Finanzas colapsables** | `hidden sm:grid` con botón "Ver resumen completo" | Correcto |

---

## Resumen ejecutivo

### Hallazgos accionables

La implementación de UX móvil de CulturaApp está bien resuelta en líneas generales. Los hallazgos accionables se reducen a:

1. **Fiabilidad alta:** Botones de navegación de mes en Dashboard demasiado pequeños para objetivo táctil — cambiar padding y min-height.
2. **Prioridad media:** Dropdown de Select puede cortarse en pantalla pequeña — ajustar max-height y overflow.
3. **Prioridad media:** Filtros de EventList ocupan demasiado espacio vertical — colapsar o reacomodar en grid.
4. **Prioridad media:** Popup de calendario con desbordamiento horizontal en viewports pequeños — reducir ancho mínimo.
5. **Menor:** Nombre de proyecto truncado en panel lateral del calendario — ampliar max-width.

### Recomendaciones

- **Issue opcional para truncamiento:** El truncamiento del nombre de proyecto en el panel lateral del calendario de eventos puede crear una issue CACH si se considera relevante para prioridad.
- **Verificar en viewports reales:** Los viewports probados son 360px y 390px; verificar con dispositivo real si hay discrepancia.
- **Validar consistencia de textos:** Revisar si las diferencias de texto entre EventDetail y ProjectDetail son intencionales.

### Estado

*Modo solo lectura — sin cambios ejecutados. Exploración completada.*

---

*Exploración ejecutada por @cultura-review en paralelo (2 exploraciones) — 2026-05-05*
