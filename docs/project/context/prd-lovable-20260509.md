---
schema_version: 2
kind: context
id: PB-CTX-PRD-LOVABLE-20260509
title: PRD para Lovable — Cachés (rediseño UI)
lifecycle: active
created: '2026-05-09'
updated: '2026-05-09'
aliases:
  - PRD Lovable Cachés
  - PRD rediseño UI
tags:
  - product-brain
  - context
  - prd
  - lovable
  - design
generated: false
---

# PRD — Cachés (rediseño UI para Lovable)

## Resumen del producto

**Cachés** es una herramienta web para **profesionales culturales freelance**: músicos, actores, fotógrafos, diseñadores gráficos, gestores culturales y técnicos de espectáculos que trabajan por cuenta propia con múltiples trabajos simultáneos.

El objetivo central es que el usuario pueda saber en segundos:
- ¿Qué trabajos tengo activos ahora mismo?
- ¿Qué voy a cobrar este mes y qué ya he cobrado?
- ¿Cuánto me están quedando realmente estos trabajos?

No es una app de contabilidad completa. Es una **capa operativa** conectada: agenda + trabajos + dinero en un mismo lugar.

---

## Usuario objetivo

**Perfil principal:** profesional cultural freelance de entre 25 y 45 años. Combina varios tipos de trabajo: bolos, sesiones, proyectos de producción, clientes distintos. Usa el móvil en contexto de trabajo real (entre ensayos, en salas, viajando). Necesita poco tiempo para registrar algo y confiar en que sus datos estarán organizados.

**Frustraciones actuales del usuario:**
- La información vive en Excel, WhatsApp, notas y memoria.
- Los cobros pendientes se mezclan con los ya cobrados.
- Los gastos pequeños se pierden y distorsionan la rentabilidad real.
- El IRPF requiere cálculos manuales repetidos.
- En móvil, las herramientas genéricas de proyectos o contabilidad son demasiado lentas.

---

## Modelo de datos (simplificado)

```
Usuario (perfil)
  ├── Proyectos (rango de fechas, agrupan trabajo)
  │     ├── Eventos hijos (fecha/hora exactas)
  │     │     ├── Ingresos del evento
  │     │     └── Gastos del evento
  │     ├── Ingresos directos del proyecto
  │     └── Gastos directos del proyecto
  └── Eventos sin proyecto (fecha/hora exactas)
        ├── Ingresos del evento
        └── Gastos del evento
```

**Proyecto:** contenedor con rango de fechas (ej. "Gira de verano 2026"). Tiene nombre, cliente, categoría, estado, color identificador y notas.

**Evento:** ocurrencia concreta con fecha y hora exactas (ej. "Bolo en Sala Apolo, 21:00"). Puede pertenecer a un proyecto o existir de forma independiente.

**Ingreso:** vinculado a proyecto o evento. Campos: concepto, importe bruto, % IRPF, fecha prevista de cobro, fecha real de cobro, estado cobrado/pendiente.

**Gasto:** vinculado a proyecto o evento. Campos: concepto, importe, categoría (transporte, material, colaboradores...), fecha, deducible fiscalmente sí/no.

**Perfil de usuario:** nombre, profesión, % IRPF habitual (se usa como defecto en nuevos ingresos).

---

## Estados de un trabajo

| Estado | Significado |
|--------|-------------|
| Borrador | En conversación, no confirmado |
| Confirmado | Acordado pero sin empezar |
| En curso | Está pasando ahora |
| Completado | Finalizado |
| Cancelado | No se realizará |

---

## Pantallas de la aplicación

### 1. Autenticación

**Registro (`/register`):**
- Formulario: nombre completo, profesión, email, contraseña y código de invitación beta.
- La app está en fase beta cerrada; el código de invitación es obligatorio.
- Tras el registro, el usuario recibe email de confirmación.

**Login (`/login`):**
- Email y contraseña.
- Enlace a registro.
- Redirección automática al dashboard si ya hay sesión activa.

---

### 2. Dashboard / Inicio (`/dashboard`)

**Propósito:** vista semanal/mensual para saber cómo va el mes económicamente y qué trabajos son relevantes ahora.

**Selector de mes:** el usuario puede navegar mes a mes para ver datos históricos o futuros.

**Dos modos con segment control:**

**Modo "Caja del mes":**
- KPI principal: `A cobrar` = total de ingresos planificados para el mes seleccionado.
- KPI secundario: `Cobrado del plan` = lo ya marcado como cobrado dentro del plan del mes.
- KPI: `Pendiente` = diferencia entre lo planificado y lo cobrado.
- KPI: `Vencido` = ingresos cuya fecha prevista ya pasó y aún no están cobrados (solo en el mes actual real, no en meses futuros).
- KPI: `Gastos del mes` = suma de gastos del mes.
- KPI: `Beneficio neto estimado` = cobrado - gastos.
- KPI: `Cobro bruto/hora` = ingresos cobrados de eventos (con horas registradas), dividido entre horas trabajadas. Solo eventos, no ingresos directos de proyecto.
- Lista `Próximos cobros`: ingresos pendientes del mes ordenados por fecha prevista.
- Lista `Cobros vencidos`: ingresos sin cobrar cuya fecha prevista ya pasó.

**Modo "Trabajos":**
- Lista de proyectos activos ahora mismo con su deuda pendiente de cobro.
- Indica cuánto se ha cobrado vs. cuánto queda de cada proyecto activo.

**Comportamiento en móvil:** el KPI protagonista en móvil es el mayor importes a cobrar, con las submétricas debajo en compacto. Los KPIs de análisis (€/hora, neto) son secundarios.

---

### 3. Trabajos (`/work`)

**Propósito:** flujo principal para gestionar proyectos y eventos de forma unificada.

**Dos pestañas con URL addressable:**
- **Proyectos** (`/work?view=projects`): lista de proyectos agrupados con sus eventos hijos.
- **Eventos** (`/work?view=events`): lista de eventos (todos, con o sin proyecto), filtrable.

**Tarjeta de proyecto muestra:**
- Color identificador del proyecto (dot o barra lateral).
- Nombre del proyecto.
- Cliente.
- Rango de fechas.
- Estado (badge).
- Número de eventos hijos (si los tiene).
- Importe total previsto / cobrado.

**Tarjeta de evento (en lista o como hijo de proyecto) muestra:**
- Color.
- Nombre del evento.
- Fecha y hora.
- Cliente (si es independiente del proyecto).
- Estado.
- Importe previsto / cobrado (si tiene ingresos).

**Filtros disponibles:** por estado, categoría, rango de fechas.

**Acción principal:** botón "Nuevo proyecto" o "Nuevo evento" según la pestaña activa.

---

### 4. Detalle de proyecto (`/projects/:id`)

**Propósito:** ver y gestionar un proyecto completo: sus datos, eventos hijos, ingresos directos, gastos y rentabilidad.

**Header compact:**
- Nombre del proyecto, cliente, rango de fechas, estado, color.
- Acciones: Editar, Eliminar.
- Breadcrumb de vuelta a Trabajos / Proyectos.

**Resumen financiero (panel plegable en móvil):**
- Ingresos previstos (directos + de eventos hijos).
- Cobrado total.
- Pendiente.
- Gastos.
- Neto estimado.

**Sección "Eventos hijos":** lista de eventos del proyecto con acceso rápido a cada uno.

**Sección "Ingresos directos":**
- Lista de ingresos vinculados al proyecto directamente (no a eventos).
- Acción rápida para marcar como cobrado.
- Botón "Añadir ingreso".

**Sección "Gastos directos":**
- Lista de gastos del proyecto.
- Botón "Añadir gasto".

**Nota:** los ingresos y gastos de los eventos hijos se muestran en el resumen financiero agregado pero no son editables directamente desde aquí. Para editarlos, hay que ir al evento.

---

### 5. Detalle de evento (`/events/:id`)

**Propósito:** ver y gestionar un evento concreto con su información, ingresos y gastos.

**Header compact:**
- Nombre del evento, fecha/hora, cliente, estado, color.
- Si tiene proyecto: enlace visible al proyecto padre.
- Acciones: Editar, Eliminar.
- Breadcrumb de vuelta a Trabajos / Eventos (o al proyecto si se llega desde él).

**Resumen financiero:**
- Cobrado / Pendiente / Beneficio neto (tres cifras protagonistas).
- "Ver detalle financiero" para desplegar bruto, IRPF, gastos, neto completo y €/hora si aplica.

**Sección "Ingresos":**
- Lista de ingresos del evento.
- Toggle cobrado/pendiente por fila (acción rápida en móvil).
- Formulario inline de quick-add en móvil: concepto + importe + cobrado.
- Botón "Añadir ingreso" (abre modal/form completo en desktop).

**Sección "Gastos":**
- Lista de gastos del evento.
- Botón "Añadir gasto".

---

### 6. Formulario de proyecto (`/projects/new`, `/projects/:id/edit`)

**Campos:**
- Nombre (obligatorio).
- Cliente (texto libre).
- Categoría (selector): Música, Teatro, Danza, Audiovisual, Diseño, Fotografía, Gestión cultural, Otros.
- Estado: Borrador, Confirmado, En curso, Completado, Cancelado.
- Fecha de inicio (obligatorio).
- Fecha de fin (opcional).
- Color identificador (selector de paleta de colores predefinidos).
- Notas (textarea, opcional).

---

### 7. Formulario de evento (`/events/new`, `/events/:id/edit`)

**Campos:**
- Nombre (obligatorio).
- Proyecto al que pertenece (selector, opcional — "Sin proyecto" es una opción válida).
- Cliente (texto libre, opcional — puede heredar del proyecto).
- Categoría (mismo selector que proyectos).
- Estado: mismo que proyectos.
- Fecha y hora de inicio (obligatorio, formato 24h, default 08:00).
- Fecha y hora de fin (opcional, default 1 hora después del inicio).
- Evento de varios días (checkbox explícito — no es el comportamiento por defecto).
- Color identificador.
- Notas.

---

### 8. Calendario de eventos (`/calendar/events`)

**Propósito:** vista temporal con hora exacta para ver la agenda de eventos.

**Vistas disponibles:** Mes, Semana, Día.
- En desktop: las tres disponibles.
- En móvil: Mes y Día (la vista Semana en móvil tiene scroll horizontal aceptado como limitación).

**Comportamiento:**
- Los eventos aparecen como bloques coloreados (color del evento).
- Hacer clic en un evento abre un panel lateral (desktop) o un bottom sheet (móvil) con resumen del evento.
- El panel incluye nombre, fecha/hora, cliente, estado, ingresos cobrados/pendientes y enlace a detalle completo.
- Desde el calendario se puede crear un evento nuevo seleccionando un hueco vacío.
- La vista semanal/día empieza a las 08:00 (no a las 00:00).

---

### 9. Calendario de proyectos (`/calendar/projects`)

**Propósito:** vista anual para ver proyectos como rangos de tiempo.

**Comportamiento:**
- Muestra todos los meses del año con los proyectos como barras horizontales proporcionales a su duración.
- Selector de año.
- Hacer clic en un proyecto abre un panel lateral (desktop) o bottom sheet (móvil) con resumen y enlace a detalle.
- Color de cada barra = color del proyecto.

---

### 10. Ajustes / Perfil (`/settings`)

**Campos editables:**
- Nombre completo.
- Profesión.
- % IRPF habitual (se usa como valor por defecto al crear nuevos ingresos).

**Acción:** Cerrar sesión (disponible desde cualquier pantalla, en el sidebar o topbar).

---

### 11. Panel de administración beta (`/admin/invitaciones`)

**Solo visible para usuarios con rol `admin`.**

**Funcionalidad:**
- Ver lista de códigos de invitación activos.
- Crear nuevo código de invitación (nombre interno, máximo de usos, fecha de expiración).
- Revocar código activo.
- El código plano solo se muestra una vez al crearlo.

---

## Flujos principales

### Alta y primer acceso
1. Usuario entra a `/register`.
2. Introduce datos y código de invitación beta.
3. Recibe email de confirmación.
4. Confirma y accede a la app → Dashboard vacío con estado de bienvenida.
5. El primer estado vacío le invita a crear su primer proyecto o evento.

### Registrar un bolo (evento)
1. Desde `/work?view=events` o desde el calendario, pulsa "Nuevo evento".
2. Rellena nombre, fecha, hora y — opcionalmente — proyecto, cliente, categoría y color.
3. Guarda → aparece en lista de eventos, en el calendario y en el dashboard si es del mes actual.

### Registrar un cobro
1. Desde el detalle del evento o proyecto, pulsa "Añadir ingreso".
2. Introduce concepto, importe bruto, IRPF y fecha prevista de cobro.
3. Guarda → aparece en la sección de ingresos y en el dashboard del mes de la fecha prevista.
4. Cuando llega el cobro, el usuario pulsa "Marcar como cobrado" → introduce fecha real → el KPI "Cobrado del plan" sube en el dashboard.

### Revisar cómo va el mes
1. Usuario abre Dashboard.
2. Navega al mes actual (es el default).
3. Ve "A cobrar" (plan total del mes), "Cobrado del plan" (ya cobrado) y "Pendiente" (diferencia).
4. Puede ver "Vencido" si hay ingresos cuya fecha prevista ya pasó.
5. Desde "Próximos cobros" puede marcar directamente como cobrado.

### Revisar la rentabilidad de un proyecto
1. Usuario entra al proyecto desde `/work?view=projects` o desde el dashboard.
2. Ve el resumen financiero: ingresos del proyecto + de todos sus eventos.
3. Ve gastos totales.
4. Ve beneficio neto estimado.
5. Si tiene eventos con horas registradas, puede ver €/hora de cobro.

---

## Diseño visual — identidad y tokens

### Personalidad
La UI debe sentirse **cálida, editorial, cultural y profesional sin ser corporativa**. No es un SaaS azul/morado, no tiene gradientes decorativos, no tiene estética bancaria ni dashboard startup. Es una herramienta de trabajo para artistas: densa cuando hace falta, escaneable, con jerarquía clara y confianza visual.

### Paleta de color

| Rol | Hex | Uso |
|-----|-----|-----|
| Fondo papel | `#F5EFE0` | Fondo de página principal |
| Fondo papel oscuro | `#EBE3CE` | Secciones y alternancia |
| Borde papel | `#E2D9C2` | Bordes suaves, separadores |
| Texto principal | `#211C18` | Texto de cuerpo y títulos |
| Texto secundario | `#5C5149` | Labels, metadatos, fechas |
| Texto frío auxiliar | `#3D4A5C` | Datos financieros, tablas |
| Acción primaria | `#C94035` | Botones primarios, acción principal |
| Acción primaria hover | `#A8342B` | Estado hover del primario |
| Fondo acción suave | `#F9EDEB` | Badges rojo suave |
| Aviso / pendiente | `#D4921A` | Cobros pendientes, alertas |
| Aviso suave | `#FDF5E4` | Fondo de badges ámbar |
| Éxito / cobrado | `#2D6A4F` | Importes cobrados, éxito |
| Éxito suave | `#E8F4EF` | Fondo de badges verde |
| Superficie blanca | `#FFFFFF` | Cards, paneles, formularios |
| Superficie alternativa | `#FAF7F2` | Fondo de listas, alternas |
| Sidebar | `#2C2420` | Fondo de navegación lateral |

**Regla:** verde = cobrado/positivo, ámbar = pendiente/atención, rojo = vencido/gasto crítico/acción primaria.

### Tipografía

| Uso | Familia | Peso |
|-----|---------|------|
| Display (titulos grandes, marca, saludo) | DM Serif Display, Georgia, serif | Regular |
| UI (navegación, botones, labels, cuerpo) | Instrument Sans, system-ui, sans-serif | 400–600 |
| Números y datos (importes, fechas, horas, métricas) | DM Mono, monospace | 400–600 |

### Espaciado
Base 4px. Escala: 4 / 8 / 12 / 16 / 24 / 32.

### Radios
- `4px` — pills, pequeños badges.
- `8px` — botones, inputs, cards estándar.
- `12px` — cards grandes, paneles.
- `16px` — modales, drawers.

### Sombras
- Card en reposo: `0 1px 3px rgba(26,21,18,.08), 0 0 0 1px rgba(26,21,18,.06)`.
- Card hover: `0 4px 12px rgba(26,21,18,.12), 0 0 0 1px rgba(26,21,18,.08)`.
- Drawer lateral: `-4px 0 24px rgba(26,21,18,.18)`.

---

## Layout y navegación

### Desktop (> 900px)

```
┌──────────────────────────────────────────────────────────┐
│  Sidebar (240px)  │  Contenido principal                  │
│  ─────────────── │                                        │
│  Logo / marca     │  TopBar (título + usuario)             │
│  ─────────────── │  ─────────────────────────────────────│
│  · Dashboard      │                                        │
│  · Trabajos       │  Contenido de la página               │
│  · Calendario     │                                        │
│  · Ajustes        │                                        │
│                   │                                        │
│  [usuario]        │                                        │
│  [cerrar sesión]  │                                        │
└──────────────────────────────────────────────────────────┘
```

- Sidebar fijo, fondo oscuro (`#2C2420`), iconos + label.
- Item activo: fondo rojo primario, texto papel.
- Hover: fondo blanco con 8% opacidad.
- TopBar: 64px, fondo papel, título de la sección, avatar/nombre de usuario.

### Móvil (≤ 680px)

```
┌─────────────────────────┐
│  Header sticky           │
│  Marca | Título | ···   │
├─────────────────────────┤
│                          │
│  Contenido principal     │
│                          │
│                          │
│          [FAB]           │
├─────────────────────────┤
│  Tab bar inferior        │
│  Inicio · Agenda · Bolos · € │
└─────────────────────────┘
```

- Header sticky: logo pequeño, título de sección, menú de usuario.
- Tab bar inferior: 4 secciones (`Inicio`, `Agenda`, `Bolos`, `€`).
- FAB (Floating Action Button): acción principal de la pantalla (crear evento, crear proyecto...).
- No usar sidebar en móvil.

---

## Componentes clave

### Tarjeta de KPI (`KpiCard`)
- Icono + label.
- Valor principal en mono.
- Subtexto explicativo.
- Color semántico (verde, ámbar, rojo, neutro).
- Opcional: barra de progreso.

### Fila de cobro pendiente (`PendingPaymentRow`)
- Nombre del ingreso / trabajo.
- Fecha prevista.
- Importe bruto / neto.
- Badge de estado (Pendiente ámbar / Vencido rojo).
- Acción: "Marcar como cobrado" al swipe o en icono.

### Tarjeta de proyecto (`ProjectCard`)
- Barra o dot de color lateral.
- Nombre + cliente + rango de fechas.
- Badge de estado.
- Resumen financiero compacto (€ previstos / cobrados).
- Número de eventos hijos.

### Tarjeta de evento (`EventCard`)
- Color del evento.
- Nombre + fecha/hora + cliente.
- Badge de estado (solo si no es "Confirmado").
- Importe cobrado/pendiente si tiene ingresos.

### Fila de ingreso (`IncomeRow`)
- Concepto.
- Fecha prevista.
- Bruto / IRPF / Neto (columnas en desktop, apilado en móvil).
- Toggle cobrado/pendiente.

### Panel lateral / Drawer (desktop)
- Se abre al hacer clic en evento o proyecto en el calendario.
- Muestra resumen: nombre, fecha, cliente, estado, KPIs financieros básicos.
- Botón "Ver detalle completo" → navega al detalle.
- Botón "Editar" → abre formulario de edición.
- Cierre con Escape y clic exterior.

### Bottom sheet (móvil)
- Equivalente al panel lateral pero en móvil.
- Se desliza desde el borde inferior.
- Cierre con swipe hacia abajo o tap en el overlay.

### Bloque de evento en calendario
- Fondo con el color asignado al evento.
- Texto blanco, nombre del evento, hora.
- Radio 6px.

---

## Microcopy (Spanish UX)

**Usar:**
- `Nuevo bolo` / `Nuevo evento`
- `Nuevo proyecto`
- `Caja del mes`
- `A cobrar`
- `Cobrado del plan`
- `Pendiente`
- `Vencido`
- `Próximos cobros`
- `Cobros vencidos`
- `Gastos del mes`
- `Beneficio neto estimado`
- `Cobro bruto/hora`
- `Trabajos`
- `Sin proyecto`
- `Evento de varios días`
- `Marcar como cobrado`
- `Añadir ingreso`
- `Añadir gasto`
- `Ver detalle financiero`
- `Borrador` / `Confirmado` / `En curso` / `Completado` / `Cancelado`

**Evitar:**
- Revenue pipeline
- Business overview
- Financial intelligence
- Client success
- Advanced analytics
- Dashboard (usar "Inicio" en la UI)

**Tono:** español de España, tuteo, frases cortas, sin jerga contable.

---

## Requisitos no funcionales importantes para el diseño

- **Móvil primero operativamente:** el usuario usa la app en contexto de trabajo real. Las acciones principales (crear evento, registrar cobro, marcar como cobrado) deben ser accesibles en 2–3 taps desde cualquier pantalla en móvil.
- **Controles táctiles:** mínimo 44px en acciones frecuentes. No usar selects nativos del sistema: usar controles propios con opciones grandes.
- **Datos financieros con fuente mono:** todos los importes, porcentajes y horas deben mostrarse en fuente monoespaciada.
- **Calendario con hora real:** la vista semanal empieza a las 08:00, no a las 00:00.
- **Sin gradientes decorativos:** paleta plana, papel/tinta, sin efectos visuales de relleno.
- **Estados vacíos útiles:** cuando no hay datos, mostrar un estado vacío con icono, texto breve explicativo y CTA contextual para empezar.
- **Errores útiles:** los mensajes de error deben decir qué pasó y qué hacer, no solo "Error".

---

## Pantallas por ruta

| Ruta | Pantalla | Auth |
|------|----------|------|
| `/login` | Inicio de sesión | Pública |
| `/register` | Registro + código beta | Pública |
| `/dashboard` | Dashboard / Inicio | Privada |
| `/work` | Trabajos (proyectos + eventos) | Privada |
| `/projects/new` | Formulario nuevo proyecto | Privada |
| `/projects/:id` | Detalle del proyecto | Privada |
| `/projects/:id/edit` | Editar proyecto | Privada |
| `/events/new` | Formulario nuevo evento | Privada |
| `/events/:id` | Detalle del evento | Privada |
| `/events/:id/edit` | Editar evento | Privada |
| `/calendar/events` | Calendario de eventos | Privada |
| `/calendar/projects` | Calendario de proyectos | Privada |
| `/settings` | Perfil y ajustes | Privada |
| `/admin/invitaciones` | Panel admin beta | Privada (admin) |

---

## Preguntas abiertas para el rediseño

- ¿El término principal en UI debe ser `bolo`, `evento` o ambos según contexto?
- ¿El dashboard debe tener modo "semana" además de modo "mes"?
- ¿El FAB móvil debe ser único (crear lo más frecuente) o expandible con opciones?
- ¿El calendario debe unificarse (proyectos + eventos en una misma vista con filtros) o mantenerse separado?
- ¿Las listas de trabajos deben soportar drag-and-drop para reordenar?
- ¿El dashboard móvil debe tener su propia tab bar o reutilizar la general?
- ¿El onboarding interactivo debe existir como flujo guiado la primera vez?
