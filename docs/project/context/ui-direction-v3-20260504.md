---
id: PB-CTX-UI-DIRECTION-V3-20260504
type: context
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Dirección visual UI v3
tags:
  - product-brain
  - context
  - ui
  - design
---

# Direccion visual UI v3 — 2026-05-04

## Norte De Producto

Cachés no debe parecer un SaaS corporativo frio, un dashboard generico azul/morado, un CRM enterprise, una app bancaria ni un panel startup con gradientes.

Debe sentirse calida, editorial, clara, cultural, artesanal y profesional sin ser corporativa.

Frase guia:

> Esta herramienta entiende la vida real de un profesional cultural: fechas, cachés, cobros, gastos, ensayos, clientes, proyectos y bolos.

## Tokens Visuales

Paleta base:

- `--paper: #F5EFE0`
- `--ink: #211C18`
- `--slate: #3D4A5C`
- `--red: #C94035`
- `--amber: #D4921A`
- `--paper-dark: #EBE3CE`
- `--paper-mid: #E2D9C2`
- `--ink-muted: #5C5149`
- `--red-hover: #A8342B`
- `--red-light: #F9EDEB`
- `--amber-light: #FDF5E4`
- `--green: #2D6A4F`
- `--green-light: #E8F4EF`
- `--surface: #FFFFFF`
- `--surface-alt: #FAF7F2`

Sidebar v3:

- `--nav-bg: #2C2420`
- `--nav-border: rgba(245,239,224,.08)`
- `--nav-text: rgba(245,239,224,.75)`
- `--nav-text-muted: rgba(245,239,224,.38)`
- `--nav-hover: rgba(245,239,224,.08)`
- `--nav-active-bg: var(--red)`
- `--nav-active-txt: #F5EFE0`

Tipografias:

- Display: `DM Serif Display`, Georgia, serif para marca, titulos, saludos, fechas destacadas y numero de dia.
- UI: `Instrument Sans`, system-ui, sans-serif para navegacion, botones, labels y cuerpo.
- Mono: `DM Mono`, `Cascadia Code`, monospace para importes, fechas, metricas, meses y horas.

Radios:

- `--r-sm: 4px`
- `--r-md: 8px`
- `--r-lg: 12px`
- `--r-xl: 16px`

Sombras:

- `--shadow-card: 0 1px 3px rgba(26,21,18,.08), 0 0 0 1px rgba(26,21,18,.06)`
- `--shadow-hover: 0 4px 12px rgba(26,21,18,.12), 0 0 0 1px rgba(26,21,18,.08)`
- `--shadow-drawer: -4px 0 24px rgba(26,21,18,.18)`

## Breakpoints

- Mobile: `<= 680px`
- Tablet/compact: `<= 900px`
- Desktop: `> 900px`

## Componentes Esperados

Layout:

- `AppShell`
- `DesktopLayout`
- `MobileLayout`
- `Sidebar`
- `TopBar`
- `PageContainer`
- `MobileHeader`
- `MobileTabBar`

Navegacion:

- `NavItem`
- `MonthNavigator`
- `SegmentControl`
- `LayerToggle`
- `LayerChip`

Botones:

- `Button`
- `IconButton`
- `FloatingActionButton`

Tarjetas, paneles y filas:

- `KpiCard`
- `Panel`
- `PanelHeader`
- `ListRow`
- `BoloRow`
- `PendingPaymentRow`
- `IncomeRow`
- `EmptyState`

Estados:

- `StatusPill`
- `PaidBadge`
- `ProgressBar`
- `ColorDot`
- `ProjectColorBar`

Calendario:

- `WeeklyCalendar`
- `CalendarHeader`
- `CalendarDayHeader`
- `CalendarTimeColumn`
- `CalendarDayColumn`
- `CalendarEventBlock`
- `CurrentTimeLine`
- `ProjectBand`
- `CalendarLegend`
- `MobileWeekStrip`
- `MobileAgendaDay`

Drawer:

- `BoloDetailDrawer`
- `DrawerOverlay`
- `DrawerHeader`
- `DrawerKpiGrid`
- `DrawerSection`
- `DrawerRow`
- `DrawerFooter`

Tablas:

- `IncomeTable`
- `Table`
- `TableHeader`
- `TableRow`
- `TableCell`

## Patrones De Pantalla

Dashboard/Inicio:

- Saludo editorial.
- Selector de mes.
- Segment control para `Cobros` y `Proyectos`.
- KPIs de ingresos previstos, ingresos cobrados, gastos, caché bruto/hora y próximos bolos.
- Panel de cobros pendientes.
- Panel de próximos bolos.
- KPIs desktop en grid de 5, tablet en 2 columnas y mobile en 2 columnas.
- Cantidades y datos con fuente mono.

Agenda semanal:

- Dias como columnas y horas como filas.
- Eventos como bloques coloreados.
- Linea de hora actual.
- Leyenda de proyectos.
- Toggles de capas para bolos, ensayos, tareas y cobros.
- Bandas de proyecto.
- Dia actual con tratamiento visual claro.

Bolos:

- Lista con fecha, mes, nombre, cliente, hora, estado, importe y color de proyecto.
- Click abre drawer en desktop y full-screen/bottom sheet en mobile.
- Estados: `Confirmado`, `Borrador`, `En curso`, `Completado`, `Cancelado`.

Ingresos:

- Tabla limpia con concepto, proyecto, fecha, bruto, IRPF, neto y estado.
- Badge `Cobrado`/`Pendiente`.
- Fuente mono para cantidades.
- Header uppercase.

Mobile:

- Header sticky.
- Marca pequena.
- Titulo de pagina.
- Tab bar inferior: `Inicio`, `Agenda`, `Bolos`, `€`.
- FAB de accion principal.
- Agenda en week strip.
- Listas compactas.

## Microcopy

Usar:

- `Nuevo bolo`
- `Ingresos previstos`
- `Ingresos cobrados`
- `Gastos del mes`
- `Caché bruto / hora`
- `Próximos bolos`
- `Cobros pendientes`
- `Pendiente`
- `Cobrado`
- `Sin ingresos registrados`
- `Ver detalle`
- `Editar`
- `Añadir gasto`
- `Marcar como cobrado`

Evitar:

- `Revenue pipeline`
- `Business overview`
- `Financial intelligence`
- `Client success`
- `Advanced analytics`

## Reglas De Implementacion

No hacer:

- Pegar HTML del prototipo.
- Usar estilos inline sin justificacion.
- Crear componentes de mas de 700 lineas.
- Hardcodear colores fuera de tokens.
- Usar negro puro en sidebar.
- Usar azul corporativo como primario.
- Introducir librerias UI pesadas sin aprobacion.

Hacer:

- Tokens centralizados.
- Componentes reutilizables.
- Props limpias.
- Datos reales.
- Estados vacios, loading y error.
- Responsive real.
- Accesibilidad basica.

## Relacionado Con

- [[../issues/CACH-B001]]
- [[../issues/CACH-B002]]
- [[../issues/CACH-B007]]
- [[ux-mobile-guardrails-20260504]]
