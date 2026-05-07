---
id: RELEASE-0.1.0-beta.6
type: release
status: Stabilizing
created: 2026-05-07
updated: 2026-05-07
release_branch: release/0.1.0-beta.6
release_tag: v0.1.0-beta.6
aliases:
  - RELEASE-0.1.0-beta.6
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.6 — Estabilización visual y mobile financiero

## Estado

Stabilizing

## Rama de release

`release/0.1.0-beta.6`

## Tag

`v0.1.0-beta.6`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.6` es un corte iterativo mergeable centrado en confianza visual, lectura mobile y consistencia de UI.

## Objetivo de la release

Cerrar la deuda visual más evidente tras consolidar el sistema de diseño y hacer que la experiencia financiera móvil sea más escaneable antes de abordar portabilidad, onboarding o cambios de modelo de datos.

Beta 6 no activa una nueva arquitectura de datos: prepara una base visual y mobile más fiable para que las siguientes betas puedan trabajar portabilidad y primera sesión con menos ruido de interfaz.

## Alcance funcional

- Homogeneizar componentes y pantallas pendientes con la paleta, tipografías y tokens del sistema de diseño.
- Revisar badges, botones, selects, calendarios y superficies que todavía mezclan estilos antiguos.
- Compactar la lectura financiera en móvil en dashboard y detalles.
- Mejorar listas/cards mobile de ingresos y gastos con acciones claras y targets táctiles razonables.
- Verificar responsive en desktop y mobile, con atención especial a calendarios si se tocan estilos compartidos.

## Inventario cerrado CACH-0030

- Componentes: `Button`, `Card`, `Badge`, `Modal`, `Input`, `Select`.
- Pantallas: `Dashboard`, `Work`, `ProjectDetail`, `EventDetail`, `CalendarEvents`, `CalendarProjects`.
- Formularios: `ProjectForm`, `EventForm` y formularios/modales financieros dentro de detalles.
- Regla visual: usar tokens de `src/index.css`; hex directos solo para colores dinámicos de entidades/proyectos/eventos.
- No hacer migración masiva de todos los `gray-*` si no afecta al inventario cerrado.

## Restricciones CACH-0038

- Cambios solo de presentación y ergonomía.
- No cambiar schema Supabase, RLS, hooks, contratos de datos, fórmulas financieras, `profiles.tax_rate`, `is_paid`, `paid_date`, cobro/hora ni lógica de agregación.
- Reutilizar mutaciones y confirmaciones existentes.
- En móvil, mostrar `Cobrado`, `Pendiente` y `Neto` en resumen de proyecto y evento; métricas secundarias solo bajo detalle expandible.
- No añadir acciones destructivas en filas mobile; exponer `Eliminar` dentro del modal de edición con confirmación.

## Scope

- [[../issues/CACH-0030|CACH-0030]] — Homogeneizar diseño con nueva paleta de colores y fuentes.
- [[../issues/CACH-0038|CACH-0038]] — Compactar mobile financiero y detalles accionables.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0030|CACH-0030]] | Homogeneizar diseño con nueva paleta de colores y fuentes | Review | `release/0.1.0-beta.6` |
| [[../issues/CACH-0038|CACH-0038]] | Compactar mobile financiero y detalles accionables | Review | `release/0.1.0-beta.6` |

## Fuera de alcance

- Importación/exportación y portabilidad de datos de [[../issues/CACH-B0005|CACH-B0005]].
- Onboarding, invitaciones, consentimiento de analítica o acceso beta de [[../issues/CACH-B0006|CACH-B0006]].
- Contratantes, facturación, liquidación neta o migraciones de modelo financiero de [[../issues/CACH-B0004|CACH-B0004]].
- Calendario unificado con filtros de [[../issues/CACH-B0007|CACH-B0007]], salvo ajustes visuales menores derivados de CACH-0030.
- PWA/offline, notificaciones, features Pro, perfil público, referidos o gestión documental.

## Riesgos

- CACH-0030 puede crecer demasiado si se convierte en rediseño general; se mitiga limitándolo a tokens, consistencia y QA visual.
- CACH-0038 puede solaparse con la issue madre CACH-B0002; se mitiga dejando B0002 como épica/backlog y cerrando solo esta porción verificable.
- Cambios visuales globales pueden romper calendarios por altura o densidad; se mitiga con verificación explícita de toolbar, cabeceras, filas/celdas y eventos.
- Cambios de UI financiera pueden confundirse con cambios de semántica; se mitiga prohibiendo cambios en hooks, cálculos, mutaciones y datos.

## Decisiones relacionadas

- [[../decisions/ADR-0002-beta-trust-before-pro|ADR-0002]]
- [[../decisions/ADR-0005-custom-form-controls-and-date-inputs|ADR-0005]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validación definidos

## Checklist de desarrollo

- [x] Todas las issues están en progreso o cerradas
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilización

- [x] Build correcto
- [x] Tests/checks correctos (`npm run test`, `npm run lint`, `npm run build`, `npm run pb:check`, `git diff --check`)
- [ ] Revisión visual autenticada
- [ ] Revisión responsive autenticada
- [x] Revisión accesibilidad
- [x] Revisión de regresión básica
- [x] Revisión de documentación

## Checklist de salida

- [ ] PR `release/0.1.0-beta.6` -> `main` abierta
- [ ] CI en verde
- [ ] Revisión aprobada
- [ ] PR mergeada en `main`
- [ ] `main` actualizado en local
- [ ] Tag `v0.1.0-beta.6` creado desde `main`
- [ ] Producción verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.6` eliminada
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Documento de release actualizado como cerrado

## Release notes

### Añadido

- Pendiente.

### Cambiado

- Componentes base, formularios, dashboard, calendarios y detalles usan tokens visuales de forma más consistente.
- Los resúmenes financieros móviles de proyecto y evento muestran `Cobrado`, `Pendiente` y `Neto` por defecto.
- Ingresos y gastos móviles usan filas compactas con edición por tap; el borrado vive dentro del modal de edición.

### Corregido

- `--font-mono` deja de ser autorreferente y `--color-gray-950` queda definido en tokens.

### Eliminado

- Pendiente.

### Técnico

- Validación esperada: `npm run test`, `npm run lint`, `npm run build`, `npm run pb:check`, `git diff --check` y verificación visual responsive.
- Validación ejecutada: `npm run test`, `npm run lint`, `npm run build`, `npm run pb:check`, `git diff --check`.
- QA visual autenticada pendiente: Playwright local confirma redirección a `/login` en rutas privadas sin sesión.

## Resultado final

Pendiente hasta cerrar la release.
