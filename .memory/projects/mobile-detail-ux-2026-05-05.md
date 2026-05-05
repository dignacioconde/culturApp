# Memoria — Mejoras UI Móvil EventDetail y ProjectDetail

Sesión del 2026-05-05 de iteración UX/móvil en EventDetail y ProjectDetail.

## Problema original

El usuario reportó que la pantalla de detalle de evento (`EventDetail`) se sentía concurrida y las ediciones simples eran más difíciles de lo necesario, especialmente en móvil.

## Cambios implementados en esta sesión

### EventDetail.jsx

1. **Quick Income Modal** (`src/pages/Events/EventDetail.jsx`)
   - Concepto automático (nombre del evento)
   - Solo importe + checkbox "cobrado"
   - Se abre desde botón "Cobro rápido" en móvil

2. **Quick Expense Modal** (`src/pages/Events/EventDetail.jsx`)
   - Concepto automático (nombre del evento)
   - Importe + categoría
   - Se abre desde botón "Gasto rápido" en móvil

3. **Bottom bar móvil** (`src/pages/Events/EventDetail.jsx`)
   - Fija en la parte inferior de la pantalla
   - 4 botones: Cobro, Gasto, Editar, Eliminar
   - Padding inferior (`pb-20`) para no cortarse
   - Estilo tipo app nativa (bg rojo para Editar)

4. **Cabecera compacta** (`src/pages/Events/EventDetail.jsx`)
   - Datos del evento en formato minimalista
   - Proyecto vinculado como enlace sutil
   - Botones de acción abajo en móvil

5. **Listas minimalistas** (`src/pages/Events/EventDetail.jsx`)
   - Ingresos mobile: solo concepto + importe por línea
   - Gastos mobile: solo concepto + importe por línea
   - Borde inferior sutil entre líneas
   - Tabla completa solo en desktop

### ProjectDetail.jsx

Replicado el mismo patrón:

1. **Quick Income Modal** (`src/pages/Projects/ProjectDetail.jsx`)
2. **Quick Expense Modal** (`src/pages/Projects/ProjectDetail.jsx`)
3. **Bottom bar móvil** (`src/pages/Projects/ProjectDetail.jsx`)
   - Cobro (quick income), Gasto (quick expense), Editar, Eliminar
4. **Listas minimalistas** (`src/pages/Projects/ProjectDetail.jsx`)
   - directIncomes y directExpenses en formato línea simple
5. **Botones de tabla eliminados** (`src/pages/Projects/ProjectDetail.jsx`)
   - Eliminados "Añadir ingreso" y "Añadir gasto" de las secciones

## Decisiones de diseño documentadas

- **Bottom bar fija**: Prioriza accesibilidad y acciones frecuentes en móvil. Estilo app nativa feeling.
- **Quick modals**: Concepto por defecto = nombre del evento/proyecto. Solo campos mínimos (importe + pagado/categoría).
- **Listas minimalistas móvil**: Solo concepto + importe. Información detallada en desktop via tabla.
- **Desktop**: Botones abren quick modals, igual que móvil. Consistencia.
- **Padding inferior**: `pb-20` en contenedor para evitar que bottom bar corte contenido.

## Código modificado (fuentes)

- `src/pages/Events/EventDetail.jsx` — ~350 líneas añadidas/modificadas
- `src/pages/Projects/ProjectDetail.jsx` — ~200 líneas añadidas/modificadas

## Notas para futuras iteraciones

- El patrón de bottom bar + listas minimalistas puede replicarse en otras vistas de detalle (ej: Settings)
- Los quick modals usan el mismo concepto por defecto (entidad.name)
- Los modales de income/expense completos siguen disponibles pero no hay botón visible en móvil
- futura oportunidad: añadir también quick-add desde evento a proyecto y viceversa

## Source

- Sesión de trabajo directo con usuario en local (http://localhost:5174/)
- Feedback iterativo sobre diseño móvil/desktop
- Decisiones tomadas in-situ con validación visual del usuario