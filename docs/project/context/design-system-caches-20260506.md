---
id: PB-CTX-DESIGN-SYSTEM-CACHES-20260506
type: context
status: Active
created: 2026-05-06
updated: 2026-05-06
aliases:
  - Sistema de diseño Cachés 2026-05-06
  - Design system Cachés
tags:
  - product-brain
  - context
  - design
  - ui
---

# Sistema de Diseño — Cachés

## Principios de Diseño

- Claridad financiera: importes, estados de cobro, vencidos y netos deben entenderse en segundos.
- Rapidez de uso: crear, editar, cobrar y registrar gastos debe requerir poca fricción, especialmente en móvil.
- Confianza: el usuario debe sentir que sus datos económicos son trazables y no se mezclan.
- Calma visual: la interfaz acompaña trabajos, fechas y dinero sin parecer un dashboard corporativo.
- Agenda como centro operativo: fechas, eventos, proyectos y cobros deben estar conectados.
- Utilidad antes que decoración: cada panel debe ayudar a decidir o actuar.

## Personalidad Visual

Cachés debe sentirse cálida, editorial, cultural y profesional. La dirección confirmada vive en [[ui-direction-v3-20260504]] y ya se refleja parcialmente en `src/index.css`: fondo papel, tinta oscura, rojo como acción principal, ámbar para atención y verde para cobrado/positivo.

La UI debe evitar estética SaaS genérica azul/morada, gradientes decorativos, tarjetas excesivamente promocionales y composición de landing. Es una herramienta de trabajo: densa cuando hace falta, escaneable, con jerarquía clara y sin ruido visual.

## Paleta de Color

### Confirmada en código

Los tokens principales están definidos en `src/index.css`:

| Rol | Token actual | Valor |
|---|---|---|
| Fondo papel | `--color-paper` | `#F5EFE0` |
| Fondo papel oscuro | `--color-paper-dark` | `#EBE3CE` |
| Borde papel | `--color-paper-mid` | `#E2D9C2` |
| Texto principal | `--color-ink` | `#211C18` |
| Texto secundario | `--color-ink-muted` | `#5C5149` |
| Texto frío auxiliar | `--color-ink-light` | `#3D4A5C` |
| Acción primaria | `--color-red` | `#C94035` |
| Acción primaria hover | `--color-red-hover` | `#A8342B` |
| Fondo acción suave | `--color-red-light` | `#F9EDEB` |
| Aviso/pendiente | `--color-amber` | `#D4921A` |
| Aviso suave | `--color-amber-light` | `#FDF5E4` |
| Éxito/cobrado | `--color-green` | `#2D6A4F` |
| Éxito suave | `--color-green-light` | `#E8F4EF` |
| Superficie | `--color-surface` | `#FFFFFF` |
| Superficie alternativa | `--color-surface-alt` | `#FAF7F2` |
| Sidebar | `--color-bg-sidebar` | `#211C18` |

### Tokens semánticos recomendados

| Rol | Token recomendado | Valor base |
|---|---|---|
| App background | `--surface-page` | `var(--color-paper)` |
| Panel/card | `--surface-card` | `var(--color-surface)` |
| Panel suave | `--surface-muted` | `var(--color-surface-alt)` |
| Texto principal | `--text-primary` | `var(--color-ink)` |
| Texto secundario | `--text-secondary` | `var(--color-ink-muted)` |
| Borde suave | `--border-subtle` | `var(--color-paper-mid)` |
| Acento principal | `--accent-primary` | `var(--color-red)` |
| Acento hover | `--accent-primary-hover` | `var(--color-red-hover)` |
| Éxito | `--semantic-success` | `var(--color-green)` |
| Aviso | `--semantic-warning` | `var(--color-amber)` |
| Error | `--semantic-danger` | `var(--color-red)` |
| Información | `--semantic-info` | `#2855A0` |
| Ingresos/cobrado | `--finance-income` | `var(--color-green)` |
| Gastos/vencido | `--finance-expense` | `var(--color-red)` |
| Pendiente | `--finance-pending` | `var(--color-amber)` |
| Proyecto | `--entity-project` | `#4f98a3` por defecto |
| Evento | `--entity-event` | color asignado por usuario |

### Estados de calendario

- Hoy: `--color-calendar-today: var(--color-amber-light)`.
- Evento/proyecto: color asignado (`DEFAULT_PROJECT_COLORS` en `src/lib/constants.js`).
- Bloque de evento: fondo color de entidad, texto blanco, radio 6px.
- Selección/acción: rojo primario o rojo suave.

## Tipografía

### Confirmada en tokens

`src/index.css` define:

- Display: `DM Serif Display`, Georgia, serif.
- UI: `Instrument Sans`, system-ui, sans-serif.
- Mono: `DM Mono`, `Cascadia Code`, monospace.

La app todavía depende de disponibilidad de esas fuentes; si no se cargan externamente, cae en stacks del sistema. Recomendación: confirmar carga real de webfonts o declarar oficialmente la pila de sistema.

### Escala recomendada

| Uso | Tamaño | Peso | Notas |
|---|---:|---:|---|
| Título de página | `18px` | 600 | Compacto, operativo |
| Sección | `16px` | 600 | Dentro de paneles |
| Cuerpo | `14px` | 400-500 | Listas, texto auxiliar |
| Label | `14px` | 500 | Formularios y filtros |
| Caption | `12px` | 400-500 | Fechas, metadata |
| KPI desktop | `24px` | 600 | Importes principales |
| KPI móvil destacado | `30px` | 600 | Solo métrica protagonista |
| Datos financieros | `14-24px` | 500-600 | Preferible mono si se activa |

Regla: no usar hero-scale type dentro de cards, sidebars o dashboards compactos.

## Espaciado y Layout

La escala existe en `src/index.css` desde `--space-1` hasta `--space-16`. Mantener base 4px:

- `4px`: micro gaps internos.
- `8px`: separación entre controles relacionados.
- `12px`: filas compactas y grupos densos.
- `16px`: padding estándar de cards y formularios.
- `24px`: separación entre secciones.
- `32px+`: solo para respiración de página o pantallas vacías.

Layout confirmado:

- Sidebar desktop: `15rem`.
- Topbar: `4rem`.
- Contenido protegido dentro de `PageWrapper`.
- Cards con borde suave y sombra mínima.
- Dashboard con grids responsive.
- Calendarios con altura explícita y contenedores scrollables.

Reglas:

- No meter cards dentro de cards salvo casos de items repetidos.
- Mantener secciones como bandas o layouts sin marco cuando no sean unidades repetibles.
- En móvil, usar listas compactas y bottom bars/paneles cuando el detalle sea accionable.

## Componentes Base

### Botones

Implementados en `src/components/ui/Button.jsx`.

- Variantes actuales: `primary`, `secondary`, `danger`, `ghost`.
- Tamaños actuales: `sm`, `md`, `lg`.
- Radio: 8px.
- Foco visible con ring rojo.
- Usar icono de Lucide cuando el botón sea herramienta o acción compacta.

Recomendación: añadir `IconButton` para acciones de solo icono y reducir clases duplicadas en páginas.

### Inputs

Implementados en `src/components/ui/Input.jsx`.

- `Input` base con label, error y `aria-describedby`.
- `Textarea`.
- Date picker propio: muestra `DD/MM/YYYY`, emite `YYYY-MM-DD`.
- DateTime picker propio: compone fecha + hora, emite `YYYY-MM-DDTHH:mm`.
- Mantener `inputMode="decimal"` y normalizadores para importes e IRPF cuando aplique.

### Selects custom

`Select` usa listbox propio con botón, opciones grandes, scroll al seleccionado y cierre por Escape/click exterior. No introducir `<select>` nativo en páginas.

### Checkboxes

Usados en `EventForm` para multi-día y en formularios financieros. Deben mantener target mínimo de 44px, label clicable y foco visible.

### Swatches

Usados en `ProjectForm` y `EventForm` con `DEFAULT_PROJECT_COLORS`. Deben tener `aria-label`, selección visible y tamaño táctil mínimo de 40px.

### Cards

Implementadas en `src/components/ui/Card.jsx`.

- Uso: KPIs, paneles de dashboard, bloques de proyecto, estados vacíos y modales.
- Radio actual: 8px en componente; tokens CSS también definen `--radius-xl` 12px para `.card`. Conviene unificar.

### Tablas/Listas

- Desktop puede usar tablas o grids de columnas.
- Mobile debe preferir cards/list rows compactas.
- `table-scroll` existe en CSS para overflow horizontal, pero los flujos financieros móviles deberían tender a filas escaneables.

### Modales

Implementados en `src/components/ui/Modal.jsx` y protegidos por `useScrollLock.jsx`.

- Cierre con Escape y click exterior.
- Contenido scrollable.
- Usar `dvh` y bottom sheet cuando el contexto sea móvil.
- Si hay modales apilados, preservar patrón de contador en scroll lock.

### Badges

Implementados en `src/components/ui/Badge.jsx`.

- `StatusBadge` usa `STATUS_COLORS` y `STATUS_LABELS`.
- Estados: `Borrador`, `Confirmado`, `En curso`, `Completado`, `Cancelado`.
- En flujos densos, ocultar `Confirmado` si no aporta señal.

### Estados vacíos, loading y errores

- Estados vacíos con icono Lucide, texto breve y CTA contextual.
- Loading con skeletons cuando hay paneles de datos.
- Errores en cajas claras con rojo suave y texto accionable.

### Toolbars y navegación

- Sidebar con iconos Lucide y label.
- Topbar con título y usuario.
- Segment controls para alternar vistas (`Caja del mes` / `Trabajos`, tabs de `/work`).
- Navegación temporal con flechas iconográficas y selector de año.

## Componentes de Producto

### Tarjeta de proyecto

- Punto o barra de color del proyecto.
- Nombre, cliente, rango de fechas y estado relevante.
- Eventos hijos visibles cuando el contexto es `/work`.
- Acción de apertura compacta.

### Tarjeta de evento

- Icono o color de evento.
- Nombre, fecha/hora, cliente y estado si aporta señal.
- Relación con proyecto visible cuando exista.
- En móvil, fila tocable con contenido mínimo.

### Resumen financiero

- Mostrar bruto/plan, cobrado, pendiente, vencido, gastos y neto según contexto.
- Jerarquía: primero lo que requiere acción; después detalle analítico.
- Usar verde para cobrado, ámbar para pendiente, rojo para vencido/gasto crítico.

### KPI del dashboard

Implementado en `src/pages/Dashboard/KpiCard.jsx`.

- Icono, título, valor y subtítulo.
- Color semántico.
- Progreso opcional para avance de cobro.
- En móvil, un KPI protagonista y submétricas compactas.

### Calendario de eventos

- React Big Calendar.
- Toolbar localizada.
- Hora útil desde `08:00`.
- Día/semana con formato 24h.
- Móvil: mes y día; semana móvil con scroll horizontal aceptada si se reintroduce.

### Calendario de proyectos

- Vista anual con meses y rangos.
- Selector de año.
- Panel de resumen.
- En móvil, mantener legibilidad de meses y selección.

### Formularios de ingreso/gasto

- Concepto + importe como campos principales.
- IRPF visible en ingresos.
- Estado cobrado con fecha real coherente.
- Validación de importes positivos y decimales europeos.
- Default de concepto en quick-add: nombre del proyecto/evento, cuando aplique.

### Selector proyecto/evento

- Evento puede ser `Sin proyecto`.
- En contexto financiero, aclarar si el ingreso/gasto se vincula a proyecto o evento.
- No mezclar edición directa de finanzas agregadas de eventos dentro de ProjectDetail.

### Vista de detalle

- Header compacto con identidad, relación proyecto/evento y acciones.
- Resumen financiero reducido primero; detalle ampliable cuando haya más métricas.
- Mobile: bottom bar de acciones principales y listas mínimas para ingresos/gastos.

## Calendarios

Reglas visuales:

- Toolbar visible y usable en desktop y móvil.
- Cabeceras de días con contraste suficiente.
- Filas/celdas deben tener altura real: no confiar solo en `height: 100%` si los padres no tienen altura calculable.
- Eventos con texto blanco sobre color asignado; evitar colores demasiado claros sin ajuste.
- Panel lateral en desktop; bottom sheet en móvil.
- En móvil, priorizar no romper layout aunque haya scroll horizontal aceptado.

Criterio de QA visual:

- En `/calendar/events`, verificar toolbar, cabeceras, filas del mes, eventos y panel.
- En `/calendar/projects`, verificar año, meses, rangos, selector de año y panel.
- Probar al menos 390x844 y desktop ancho.

## Finanzas

Reglas de presentación:

- Moneda siempre con `formatCurrency` en EUR/es-ES.
- Fechas con `formatDate`, horas con `formatDatetime`.
- Importes principales alineados y con suficiente contraste.
- `Cobrado`: verde.
- `Pendiente`: ámbar o tinta según urgencia.
- `Vencido`: rojo.
- `Gasto`: rojo solo cuando implique alerta; si es registro neutral, usar tinta y contexto.
- `Neto`: verde si positivo, rojo si negativo, tinta si neutro.
- IRPF: mostrar porcentaje y retención calculada cuando el contexto sea detalle financiero.
- €/h: etiquetar como `Cobro bruto/hora` para no confundirlo con neto.

No mostrar gastos como vencidos hasta que el modelo tenga estado de pago o fecha de vencimiento.

## Copy y Microcopy

Voz:

- Español de España.
- Tuteo natural.
- Frases cortas.
- Sin jerga contable innecesaria.
- Mensajes de error útiles y específicos.

Preferir:

- `Nuevo proyecto`
- `Nuevo evento`
- `Caja del mes`
- `A cobrar`
- `Cobrado`
- `Pendiente`
- `Vencido`
- `Próximos cobros`
- `Trabajos`
- `Sin proyecto`
- `Evento de varios días`
- `Marcar como cobrado`

Evitar:

- `Revenue`
- `Pipeline`
- `Business overview`
- `Financial intelligence`
- `Advanced analytics`
- `Cliente success`

## Accesibilidad

- Mantener contraste mínimo AA en texto y controles.
- Usar foco visible en botones, enlaces, inputs, selects y swatches.
- Labels visibles en formularios.
- `aria-label` en botones iconográficos.
- `aria-expanded`, `aria-controls` y roles en selects/listbox.
- Targets táctiles recomendados: 44px en acciones frecuentes.
- No depender solo de color para estado: acompañar con texto o label.
- Calendarios deben conservar navegación y lectura razonable aunque React Big Calendar limite semántica perfecta.

## Tokens Recomendados

| Categoría | Tokens |
|---|---|
| Color | `--surface-page`, `--surface-card`, `--text-primary`, `--text-secondary`, `--border-subtle`, `--accent-primary`, `--semantic-success`, `--semantic-warning`, `--semantic-danger`, `--finance-income`, `--finance-expense` |
| Spacing | `--space-1`, `--space-2`, `--space-3`, `--space-4`, `--space-6`, `--space-8`, `--space-12` |
| Radius | `--radius-sm`, `--radius-md`, `--radius-lg`, `--radius-xl`, `--radius-full` |
| Shadow | `--shadow-sm`, `--shadow-md`, `--shadow-xl` |
| Font size | `--text-xs`, `--text-sm`, `--text-base`, `--text-lg`, `--text-2xl`, `--text-3xl` |
| Z-index | `--z-dropdown: 80`, `--z-popover: 90`, `--z-modal: 100`, `--z-toast: 110` |
| Breakpoints | usar Tailwind: `sm`, `md`, `lg`, `xl`; documentar mobile crítico en 390x844 |

## Deuda Visual Detectada

- Hay tokens centrales en `src/index.css`, pero muchas páginas todavía usan colores hardcodeados (`#C94035`, `#211C18`, grises Tailwind, etc.).
- La nomenclatura de tokens recomendada en [[ui-direction-v3-20260504]] no coincide exactamente con los tokens actuales `--color-*`.
- Radios de cards no están totalmente unificados: `Card.jsx` usa `rounded-lg` mientras `.card` usa `--radius-xl`.
- Algunas páginas declaran clases de botón propias en vez de usar siempre `Button`.
- `CalendarEvents.jsx` y `CalendarProjects.jsx` duplican lógica `useIsMobile` y patrones de panel.
- Los importes no usan todavía una regla tipográfica mono consistente.
- La app mezcla `gray-*` de Tailwind con tokens cálidos, lo que puede enfriar visualmente algunas vistas.
- Faltan componentes formales para `IconButton`, `SegmentControl`, `Panel`, `ListRow`, `FinanceRow` y `BottomActionBar`.

## Recomendaciones de Implementación

- Consolidar tokens semánticos en `src/index.css` sin romper los `--color-*` actuales.
- Migrar gradualmente colores hardcodeados a tokens, empezando por `Dashboard`, `Work`, calendarios y formularios.
- Añadir componentes compartidos: `IconButton`, `SegmentControl`, `Panel`, `ListRow`, `FinanceSummary`, `BottomActionBar`.
- Unificar radio y sombra entre `Card.jsx` y clases CSS.
- Extraer patrones repetidos de panel móvil de calendario.
- Confirmar carga real de fuentes o ajustar documentación a la pila disponible.
- Mantener `src/lib/formatters.js` como única entrada de moneda, fecha y hora.
- Para cada cambio visual, verificar móvil y desktop, especialmente calendarios.
- No introducir librería UI pesada sin decisión explícita.

## Preguntas abiertas

- ¿La marca debe adoptar oficialmente `DM Serif Display`, `Instrument Sans` y `DM Mono` cargadas como webfonts?
- ¿El radio principal de cards debe ser 8px o 12px?
- ¿Debemos usar `Bolo` en UI o mantener `Evento` como término principal?
- ¿Qué colores de proyecto/evento requieren validación de contraste automática?
- ¿El dashboard móvil debe tener navegación inferior propia o conservar solo sidebar/drawer actual?
- ¿Cuándo conviene convertir las tablas financieras desktop en componentes compartidos formales?
