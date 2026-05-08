---
schema_version: 2
kind: context
id: PB-CTX-PRD-CACHES-20260506
title: Cachés
lifecycle: active
created: '2026-05-06'
updated: '2026-05-08'
aliases:
  - PRD Cachés 2026-05-06
  - PRD producto Cachés
tags:
  - product-brain
  - context
  - product
  - prd
generated: false
---
# PRD — Cachés

## Resumen

Cachés es una herramienta web para profesionales culturales freelance y pequeños equipos que necesitan gestionar en un mismo lugar trabajos, agenda, ingresos previstos, cobros reales, gastos y rentabilidad básica.

El producto ya existe como MVP en React/Vite/Supabase con autenticación, rutas protegidas, vista de trabajos, proyectos, eventos, calendarios, dashboard financiero, ingresos, gastos y ajustes de perfil. La evidencia principal está en `src/App.jsx`, `src/pages/`, `src/hooks/`, `src/lib/dashboardFinance.js`, `README.md`, `TECHDOC.md` y [[product-snapshot-20260504]].

## Usuarios Objetivo

- Músicos que combinan bolos, ensayos, cachés, pagos pendientes y gastos de desplazamiento o producción.
- Actores y performers con funciones, sesiones, contratos puntuales y cobros diferidos.
- Fotógrafos con sesiones, entregas, gastos de material, clientes y fechas de cobro.
- Diseñadores y creativos con proyectos largos, hitos, ingresos directos y costes asociados.
- Gestores culturales que coordinan varios trabajos simultáneos y necesitan visibilidad operativa.
- Pequeños equipos culturales que todavía no necesitan un ERP ni un CRM complejo.

## Problemas Principales

- La información vive repartida entre Excel, papel, calendario personal, notas y memoria.
- El usuario necesita distinguir rápido qué trabajos están activos, qué eventos tienen fecha concreta y qué cobros están pendientes.
- Los ingresos previstos y los cobros reales suelen mezclarse, haciendo difícil entender caja del mes.
- Los gastos pequeños se pierden y distorsionan la rentabilidad real del trabajo.
- El seguimiento de IRPF y neto recibido requiere cálculos manuales repetidos.
- La agenda cultural no siempre encaja en herramientas genéricas de proyectos o facturación.
- En móvil, muchas acciones ocurren en contexto de trabajo real: viajes, ensayos, salas, reuniones o producción.

## Propuesta de Valor

Cachés ofrece una capa operativa pensada para el sector cultural: agenda, trabajos y dinero conectados. Frente a Excel o papel, reduce duplicación y errores porque proyectos, eventos, ingresos y gastos comparten modelo. Frente a herramientas genéricas, prioriza conceptos naturales para el usuario: cachés, fechas, trabajos, cobros pendientes, IRPF habitual, eventos con hora exacta y proyectos con rango.

La propuesta no es contabilidad completa. Es control práctico para saber qué hay que hacer, qué se va a cobrar, qué ya se ha cobrado y si un trabajo está saliendo rentable.

## Modelo de Producto

**Proyecto:** contenedor con rango de fechas. Agrupa eventos, puede tener ingresos y gastos directos, aparece en el calendario interno de proyectos y tiene estado, categoría, cliente, color y notas. Implementado en `projects`, `src/pages/Projects/` y `src/components/calendar/ProjectYearView.jsx`.

**Evento:** ocurrencia concreta con fecha y hora exactas. Puede pertenecer a un proyecto o existir sin proyecto. Aparece en el calendario de eventos y tiene estado, categoría, cliente, color y notas. Implementado en `events` y `src/pages/Events/`.

**Ingreso:** registro económico vinculado a proyecto o evento. Incluye concepto, importe bruto, IRPF, fecha prevista, fecha real de cobro y estado cobrado/pendiente. Implementado en `incomes`, `useIncomes` y formularios financieros en detalles de proyecto/evento.

**Gasto:** coste vinculado a proyecto o evento. Incluye concepto, importe, categoría, fecha y deducibilidad. Implementado en `expenses`, `useExpenses` y detalles de proyecto/evento.

**Perfil:** datos del usuario profesional: nombre, profesión e IRPF habitual. `profiles.tax_rate` es fuente canónica para el IRPF por defecto. Implementado en `src/hooks/useProfile.js` y `src/pages/Settings/Settings.jsx`.

**Dashboard:** vista mensual para caja y trabajos. Muestra plan de cobros, cobrado, pendiente, vencido, trabajos relevantes y próximos cobros. Implementado en `src/pages/Dashboard/Dashboard.jsx` y `src/lib/dashboardFinance.js`.

**Calendario de proyectos:** vista interna por año/rangos para planificación de proyectos. Implementado en `src/pages/Calendar/CalendarProjects.jsx` y `src/components/calendar/ProjectYearView.jsx`.

**Calendario de eventos:** calendario con fecha/hora exacta usando React Big Calendar. Implementado en `src/pages/Calendar/CalendarEvents.jsx`.

## Flujos Principales

**Alta y acceso:** el usuario se registra o inicia sesión en `/register` o `/login`; las rutas privadas redirigen según sesión en `src/App.jsx`. Supabase Auth crea sesión y el trigger documentado debe crear `profiles`.

**Creación de proyecto:** el usuario crea proyecto desde listas, trabajos o calendario. El formulario exige nombre y fecha de inicio, permite cliente, categoría, estado, rango, color y notas. Confirmado en `src/pages/Projects/ProjectForm.jsx`.

**Creación de evento:** el usuario crea evento desde lista o seleccionando hueco en calendario. El evento exige nombre e inicio; por defecto usa hora inicial `08:00`, fin una hora después y multi-día como excepción explícita. Confirmado en `src/pages/Events/EventForm.jsx` y `src/pages/Calendar/CalendarEvents.jsx`.

**Registro de ingresos:** desde detalle de proyecto o evento se añaden ingresos con concepto, importe, IRPF, fecha prevista y estado cobrado. Los formularios usan normalizadores compartidos para decimales y pago en `src/lib/financeForms.ts`.

**Registro de gastos:** desde detalle de proyecto o evento se añaden gastos con concepto, importe, categoría, fecha y deducibilidad. Los gastos se agregan a KPIs de detalle y dashboard cuando aplican.

**Consulta de dashboard:** el usuario navega por mes/año y alterna entre `Caja del mes` y `Trabajos`. La vista prioriza cobros pendientes, vencidos y trabajos con deuda.

**Navegación por calendarios:** el usuario consulta eventos por mes/día/semana en desktop, mes/día en móvil, y proyectos en vista anual. Puede abrir panel de resumen y saltar al detalle completo.

**Revisión de rentabilidad:** en detalles de proyecto/evento se agregan ingresos, retenciones, gastos, neto y, cuando hay eventos con horas, cobro bruto por hora.

## Requisitos Funcionales

### Autenticación

- Registro, login, logout y persistencia de sesión con Supabase.
- Rutas privadas protegidas y redirección de rutas públicas si ya existe sesión.
- Perfil asociado al usuario autenticado.

### Proyectos

- Crear, listar, filtrar, editar y eliminar proyectos.
- Campos mínimos: nombre, fecha de inicio, estado, categoría y color.
- Campos opcionales: cliente, fecha de fin y notas.
- Mostrar proyectos en `/work`, `/projects`, detalle y calendario de proyectos.
- Permitir ingresos/gastos directos y agregación de eventos hijos.

### Eventos

- Crear, listar, filtrar, editar y eliminar eventos.
- Permitir evento sin proyecto.
- Permitir relación opcional con proyecto.
- Usar fecha/hora exacta y formato 24h.
- Mantener `08:00` como hora inicial habitual.
- Tratar multi-día como opción explícita.

### Ingresos

- Crear, editar y eliminar ingresos vinculados a proyecto o evento.
- Guardar bruto, IRPF, fecha prevista, estado cobrado y fecha real.
- Marcar/desmarcar cobrado de forma coherente con `paid_date`.
- Aceptar decimales con coma o punto.
- Usar IRPF habitual desde `profiles.tax_rate`.

### Gastos

- Crear, editar y eliminar gastos vinculados a proyecto o evento.
- Registrar importe, categoría, fecha y deducibilidad.
- Agregar gastos en dashboard y detalles.
- No mostrar vencimiento de gastos hasta que el esquema tenga `is_paid`, `paid_date` o `due_date`.

### Dashboard

- Permitir selección de mes y año.
- Mostrar caja del mes: a cobrar, cobrado del plan, pendiente y vencido.
- Arrastrar vencidos anteriores solo cuando el mes seleccionado es el mes actual.
- Mostrar cobros próximos/vencidos del plan mensual.
- Mostrar trabajos relevantes y deuda por trabajo.
- No duplicar eventos hijos como trabajos separados cuando ya pertenecen a un proyecto.

### Calendarios

- Calendario de eventos con React Big Calendar, localización española y mensajes en español.
- Crear evento desde selección de hueco.
- Respetar altura real calculable para evitar colapso de filas.
- Calendario de proyectos anual por rangos.
- Panel de resumen con salto a detalle.

### Perfil y Configuración

- Leer y actualizar nombre, profesión e IRPF habitual desde `useProfile`.
- No leer/escribir `profiles` directamente desde componentes.
- Manejar el caso de perfil faltante como origen probable de error 409 al crear proyecto/evento.

### Responsive/Mobile

- Mantener controles táctiles amplios.
- Evitar selectores nativos en páginas.
- Usar bottom sheets/paneles compactos en calendario.
- Priorizar en móvil awareness operativo: próximos trabajos, cobros pendientes y acciones rápidas.

### Exportación y Reporting

- No implementado en el MVP.
- Propuesta pendiente: exportación CSV/PDF, portabilidad de datos y reporting básico, relacionada con [[../issues/CACH-B0005]].

## Requisitos No Funcionales

**Seguridad:** RLS obligatorio en tablas por usuario; cliente solo con anon key; no usar service role en frontend. Confirmado en `README.md`.

**Acceso a datos:** la UI debe usar hooks de `src/hooks/`; los componentes no deben llamar a Supabase directamente.

**Rendimiento:** el MVP no incluye paginación ni virtualización. Si crecen listas de proyectos/eventos/ingresos, habrá que introducir paginación o filtros server-side.

**Accesibilidad:** formularios con labels visibles, foco visible, botones con `aria-label` cuando son iconográficos, targets táctiles razonables y estados de error legibles.

**Responsive:** desktop denso pero claro; mobile centrado en acciones frecuentes y lectura rápida. Calendarios requieren verificación visual real.

**Mantenibilidad:** lógica financiera compartida en `src/lib/`, hooks especializados por tabla, componentes UI reutilizables y Product Brain versionado.

**Idioma:** español de España, tono cercano y tuteo.

**Despliegue:** Vercel con fallback SPA para rutas protegidas; ver memoria de routing/deploy y `TECHDOC.md`.

## Reglas de Negocio

- `user_id` debe venir del usuario autenticado, no de input editable.
- Todo proyecto/evento/ingreso/gasto pertenece a un usuario y está protegido por RLS.
- Un ingreso o gasto debe vincularse a proyecto o evento.
- Un evento puede existir sin proyecto.
- Un proyecto puede tener ingresos/gastos directos y también agregar ingresos/gastos de sus eventos.
- ProjectDetail agrega finanzas directas del proyecto y de eventos hijos, pero mantiene editables solo las tablas directas para no mezclar niveles.
- Dashboard agrega ingresos/gastos de eventos y proyectos directos salvo reglas específicas de KPIs.
- Cobro bruto/hora usa solo ingresos cobrados con `event_id`, antes de IRPF, dividido entre horas de eventos con `end_datetime`.
- Ingresos directos de proyecto no entran en el numerador de €/h.
- `profiles.tax_rate` es la fuente canónica del IRPF habitual.
- `Caja del mes` incluye ingresos planificados del mes seleccionado y vencidos anteriores solo cuando el mes seleccionado es el mes actual.
- `A cobrar` debe equivaler a `Cobrado del plan` + `Pendiente` + `Vencido`.
- No proyectar deuda anterior hacia meses futuros.
- Los gastos actuales no permiten detectar pagos salientes vencidos porque el esquema no guarda estado de pago ni fecha de vencimiento.
- Error 409 al crear proyecto/evento suele indicar fila faltante en `profiles`.

## Métricas de Éxito

- Tiempo medio para crear un proyecto o evento desde móvil.
- Porcentaje de ingresos con fecha prevista registrada.
- Porcentaje de ingresos marcados como cobrados con `paid_date`.
- Número de usuarios que consultan dashboard semanalmente.
- Ratio de trabajos con ingresos/gastos completos frente a trabajos solo registrados.
- Reducción de cobros vencidos sin revisar.
- Frecuencia de uso de `/work` frente a listas separadas.
- Activación: usuario crea al menos un proyecto o evento, un ingreso y consulta dashboard.
- Retención: usuario vuelve después de registrar sus primeros cobros.

## Riesgos y Ambigüedades

- La distinción proyecto/evento es potente pero puede generar fricción si la UI no explica bien cuándo usar cada uno.
- `client` es texto libre; no existe entidad contratante ni datos de facturación.
- La importación/exportación no existe, pero es clave para confianza beta.
- La vista de calendarios separada funciona, aunque el backlog apunta a calendario unificado con filtros.
- No hay onboarding específico para enseñar el modelo mental.
- No hay modo offline, PWA ni notificaciones.
- La semántica de gastos es limitada: deducible no equivale a pagado ni vencido.
- Hay deuda visual por valores hardcodeados y mezcla de tokens con clases directas.

## Roadmap Sugerido

**Fase 1 — Estabilización:** cerrar homogeneización visual, pulir dashboard móvil, verificar calendarios responsive, reforzar tests de cálculo financiero y mantener `pb:check`, lint y build verdes.

**Fase 2 — Mejora UX:** consolidar `/work` como flujo principal, reducir fricción en detalles, añadir cobro rápido, mejorar navegación proyecto-evento y hacer onboarding breve del modelo mental.

**Fase 3 — Reporting y portabilidad:** exportación CSV/PDF, resumen mensual, datos descargables y garantías de portabilidad antes de beta amplia.

**Fase 4 — Colaboración ligera:** contratantes como entidad, datos de facturación, liquidación neta, adjuntos básicos y gestión documental por trabajo.

**Fase 5 — Producción y monetización:** métricas de uso, feedback beta, límites de plan, features Pro de inteligencia financiera, notificaciones y PWA/offline si el uso móvil lo justifica.

## Preguntas abiertas

- ¿Debe el lenguaje principal ser `trabajo`, `bolo`, `proyecto/evento` o una combinación según contexto?
- ¿El calendario unificado debe reemplazar o convivir con los calendarios separados?
- ¿Qué nivel de facturación necesita la beta: datos de contratante, facturas completas o solo reporting?
- ¿La exportación mínima debe ser CSV, PDF o ambas?
- ¿Qué acciones rápidas son imprescindibles en móvil: cobrar, gasto, editar, duplicar, compartir?
- ¿Cómo se quiere explicar al usuario la diferencia entre ingreso previsto, cobrado real, neto e IRPF?
