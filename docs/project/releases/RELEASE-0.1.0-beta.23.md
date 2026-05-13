---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.23
title: Tokens Lovable y visual acotada
lifecycle: active
created: '2026-05-13'
updated: '2026-05-13'
aliases:
  - RELEASE-0.1.0-beta.23
tags:
  - product-brain
  - release
  - beta
  - design-system
generated: false
release_phase: active
release_current: true
release_branch: release/0.1.0-beta.23
release_tag: v0.1.0-beta.23
release_pr: null
---
# RELEASE-0.1.0-beta.23 — Tokens Lovable y visual acotada

## Estado

Active.

## Rama de release

`release/0.1.0-beta.23`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.23` es un corte pequeno para preparar compatibilidad visual con el diseno exportado desde Lovable y aplicar una capa visual acotada sin absorber su stack completo.

## Objetivo de la release

Dejar versionada una capa de tokens y aliases visuales que permita trasladar estilo de `artistic-rhythm` a Cachés de forma incremental, y usarla en un pulido visual limitado de pantallas core sin cambios funcionales.

## Alcance funcional

- Compatibilidad Tailwind con tokens semanticos del export Lovable.
- Alias de fuentes, superficies, texto, acentos, estados y sidebar.
- Utilidades visuales inertes para futuros componentes (`card-lift`, `skeleton`).
- Visual acotada en shell/navegacion, Dashboard, Work y listas de proyectos/eventos existentes.
- Inventario Product Brain de gaps funcionales Lovable que quedan fuera de beta 23.
- Sin cambio funcional, redisenos masivos ni import de stack Lovable.

## Scope

- [[../issues/CACH-0076|CACH-0076]] — Alinear tokens de diseno con export Lovable.
- [[../issues/CACH-0077|CACH-0077]] — Aplicar tokens Lovable al shell y navegacion.
- [[../issues/CACH-0078|CACH-0078]] — Pulir Trabajos y listas con visual Lovable acotada.
- [[../issues/CACH-0079|CACH-0079]] — Pulir Dashboard financiero con visual Lovable acotada.
- [[../issues/CACH-0080|CACH-0080]] — Inventariar gaps funcionales Lovable fuera de beta 23.
- [[../issues/CACH-0081|CACH-0081]] — Unificar visual Lovable tras comparacion real.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0076|CACH-0076]] | Alinear tokens de diseno con export Lovable | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0077|CACH-0077]] | Aplicar tokens Lovable al shell y navegacion | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0078|CACH-0078]] | Pulir Trabajos y listas con visual Lovable acotada | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0079|CACH-0079]] | Pulir Dashboard financiero con visual Lovable acotada | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0080|CACH-0080]] | Inventariar gaps funcionales Lovable fuera de beta 23 | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0081|CACH-0081]] | Unificar visual Lovable tras comparacion real | done | `release/0.1.0-beta.23` |

## Fuera de alcance

- Importar componentes shadcn/Radix del repo Lovable.
- Migrar la app a TanStack Start.
- Cambios de Supabase, RLS, hooks, datos o migraciones.
- Cambiar formulas financieras.
- Calendario custom, unificacion de calendarios o reemplazo de React Big Calendar.
- Activar tema oscuro.
- Navegacion origin-aware, command palette, FAB/sheets, busqueda/tab de ano en Work, preferencias fiscales nuevas, notificaciones, soporte, privacidad o about.

## Riesgos

- Tailwind v4 debe aceptar los tokens `@theme inline` sin romper el build.
- La visual acotada no debe alterar comportamiento, calculos ni rutas.
- El lenguaje visual debe seguir siendo sobrio y operativo, no una landing decorativa.
- El alcance visual debe quedarse en shell, Dashboard y listas; calendarios quedan fuera de esta beta.

## Decisiones relacionadas

- [[../context/design-system-caches-20260506|Sistema de Diseno — Cachés]]
- [[../issues/CACH-0030|CACH-0030]] — Homogeneizar diseno con nueva paleta de colores y fuentes.

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [x] Todas las issues estan en progreso o cerradas
- [x] Commits integrados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin `issue_workflow`
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [x] `npm run lint`
- [x] `npm run test`
- [x] `npm run build`
- [x] `npm run pb:guard`
- [x] `npm run release:status`
- [x] `npm run verify:pr -- --base origin/main`
- [x] `git diff --check`
- [x] Revision visual de `/dashboard`, `/work`, `/projects`, `/events`, `/settings`, `/login`, `/register` y `/onboarding` en 390x844, 768x1024 y 1440x900.

Validacion parcial ya ejecutada para `CACH-0076`: `lint`, `test`, `build`, `pb:guard`, `release:status`, `release:sync-check`, `verify:pr` y `git diff --check`.

## Checklist de salida

- [ ] PR `release/0.1.0-beta.23` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag `v0.1.0-beta.23` creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/0.1.0-beta.23` eliminada si aplica
- [x] Release notes actualizadas
- [x] Issues marcadas como `done`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Proximos pasos documentados

## Release notes

### Aniadido

- Tokens Tailwind compatibles con el export Lovable para fuentes, superficies, texto, acentos, estados y sidebar.
- Aliases semanticos CSS que preservan los tokens existentes de Cachés.
- Utilidades `card-lift` y `skeleton` para componentes visuales futuros.
- Issues de visual acotada para shell/navegacion, Work/listas y Dashboard.
- Inventario de gaps funcionales Lovable que quedan fuera de beta 23.
- Slice de unificacion visual tras comparar contra el export Lovable real.

### Cambiado

- Shell privado, navegacion desktop/mobile, top bar y bottom nav migran a tokens semanticos Lovable sin cambiar rutas.
- Botones, cards, badges, modales, inputs, toast y barras de accion adoptan surfaces, textos, bordes, foco y acentos coherentes.
- `/work`, `/projects` y `/events` pulen listas, filtros, tarjetas, loading/error/empty states y metadatos sin cambiar CRUD ni datos.
- `/dashboard` pule KPIs, panel "Ahora", controles e ingresos pendientes sin tocar formulas financieras.
- `/settings`, `/login`, `/register` y `/onboarding` sustituyen restos visuales grises por superficies, texto, radios y acentos semanticos.

### Corregido

- No aplica.

### Eliminado

- No aplica.

### Tecnico

- `src/index.css` queda preparado para clases como `bg-surface-page`, `text-text-primary`, `border-border-subtle`, `text-accent-primary` y `font-display`.
- `CACH-0080` fija la frontera de alcance: beta 23 no incluye shadcn/Radix/TanStack, Supabase/RLS/data, formulas financieras, calendario custom ni dark mode.

## Resultado final

Release implementada y validada en la rama `release/0.1.0-beta.23`. Pendiente abrir PR, merge a `main`, tag `v0.1.0-beta.23` y verificacion de produccion si aplica.
