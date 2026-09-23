# UX móvil y modales

## 2026-05-03 — Modales y viewport

- Reutilizar `ScrollLockProvider`: el contador evita desbloquear el fondo cuando hay modales apilados.
- Usar `dvh` y comprobar teclado, foco, scroll restaurado y contenido accesible en viewport móvil real.
- No bloquear gestos globalmente con `touch-action: none`; conservar desplazamiento útil, especialmente `pan-x pan-y` en calendarios.

## 2026-05-10 — Navegación y detalle

- La navegación móvil global usa barra inferior; ocultarla en detalles de proyecto/evento para no solaparla con acciones contextuales.
- En detalles, priorizar acciones compactas, alta rápida y filas mínimas; dejar formularios completos y métricas secundarias bajo demanda.
- Mantener targets táctiles de al menos 44 px y estado activo perceptible sin depender solo del color.

## 2026-05-13 — Contenido guiado

- Onboarding, checklists y ayudas deben ser compactos, cerrables o colapsables y mostrar una sola acción siguiente sin scroll largo.
- Validar visualmente en móvil; lint y build no detectan fallos de teclado, viewport o superposición.
