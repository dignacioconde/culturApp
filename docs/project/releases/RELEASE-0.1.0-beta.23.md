---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.23
title: Tokens Lovable y visual total
lifecycle: active
created: '2026-05-13'
updated: '2026-05-14'
aliases:
  - RELEASE-0.1.0-beta.23
tags:
  - product-brain
  - release
  - beta
  - design-system
generated: false
release_phase: released
release_current: false
release_branch: release/0.1.0-beta.23
release_tag: v0.1.0-beta.23
release_pr: https://github.com/dignacioconde/culturApp/pull/110
---
# RELEASE-0.1.0-beta.23 — Tokens Lovable y visual total

## Estado

Released.

## Rama de release

`release/0.1.0-beta.23`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.23` es un corte para preparar compatibilidad visual con el diseno exportado desde Lovable y aplicar una unificacion visual total sin absorber su stack completo ni funcionalidades nuevas.

## Objetivo de la release

Dejar versionada una capa de tokens, aliases y primitivas visuales que permita trasladar estilo de `artistic-rhythm` a Cachés, y usarla en un pulido visual total de la app sin cambios funcionales.

## Alcance funcional

- Compatibilidad Tailwind con tokens semanticos del export Lovable.
- Alias de fuentes, superficies, texto, acentos, estados y sidebar.
- Utilidades visuales inertes para futuros componentes (`card-lift`, `skeleton`).
- Visual total en shell/navegacion, Dashboard, Work, proyectos/eventos, calendarios, pantallas secundarias, auth/onboarding/settings y admin.
- Inventario Product Brain de gaps funcionales Lovable que quedan fuera de beta 23.
- Sin cambio funcional, import de stack Lovable ni nuevas funcionalidades.

## Scope

- [[../issues/CACH-0076|CACH-0076]] — Alinear tokens de diseno con export Lovable.
- [[../issues/CACH-0077|CACH-0077]] — Aplicar tokens Lovable al shell y navegacion.
- [[../issues/CACH-0078|CACH-0078]] — Pulir Trabajos y listas con visual Lovable acotada.
- [[../issues/CACH-0079|CACH-0079]] — Pulir Dashboard financiero con visual Lovable acotada.
- [[../issues/CACH-0080|CACH-0080]] — Inventariar gaps funcionales Lovable fuera de beta 23.
- [[../issues/CACH-0081|CACH-0081]] — Unificar visual Lovable tras comparacion real.
- [[../issues/CACH-0082|CACH-0082]] — Auditar visual total Lovable y matriz QA.
- [[../issues/CACH-0083|CACH-0083]] — Crear primitivas UI para visual total Lovable.
- [[../issues/CACH-0084|CACH-0084]] — Unificar detalles y formularios de proyectos y eventos.
- [[../issues/CACH-0085|CACH-0085]] — Unificar calendarios con visual Lovable sin cambiar comportamiento.
- [[../issues/CACH-0086|CACH-0086]] — Unificar pantallas secundarias operativas.
- [[../issues/CACH-0087|CACH-0087]] — Unificar admin gates y layout global.
- [[../issues/CACH-0088|CACH-0088]] — QA final de beta 23 visual total.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0076|CACH-0076]] | Alinear tokens de diseno con export Lovable | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0077|CACH-0077]] | Aplicar tokens Lovable al shell y navegacion | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0078|CACH-0078]] | Pulir Trabajos y listas con visual Lovable acotada | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0079|CACH-0079]] | Pulir Dashboard financiero con visual Lovable acotada | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0080|CACH-0080]] | Inventariar gaps funcionales Lovable fuera de beta 23 | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0081|CACH-0081]] | Unificar visual Lovable tras comparacion real | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0082|CACH-0082]] | Auditar visual total Lovable y matriz QA | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0083|CACH-0083]] | Crear primitivas UI para visual total Lovable | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0084|CACH-0084]] | Unificar detalles y formularios de proyectos y eventos | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0085|CACH-0085]] | Unificar calendarios con visual Lovable sin cambiar comportamiento | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0086|CACH-0086]] | Unificar pantallas secundarias operativas | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0087|CACH-0087]] | Unificar admin gates y layout global | done | `release/0.1.0-beta.23` |
| [[../issues/CACH-0088|CACH-0088]] | QA final de beta 23 visual total | done | `release/0.1.0-beta.23` |

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
- La unificacion visual total no debe convertirse en funcionalidades Lovable nuevas.
- Calendarios deben mantener altura real, `react-big-calendar`, `overflow-x-auto`, `touch-action: pan-x pan-y` y scroll horizontal movil.
- Finanzas, datos, Supabase, auth y admin no deben cambiar contratos ni calculos.

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
- [x] Revision visual total de `/dashboard`, `/work`, `/projects`, `/projects/:id`, `/events`, `/events/:id`, `/calendar/events`, `/calendar/projects`, `/contractors`, `/settings`, `/data`, `/novedades`, `/login`, `/register`, `/onboarding` y `/admin/invitaciones` en 390x844, 768x1024 y 1440x900.

Validacion parcial ya ejecutada para `CACH-0076`: `lint`, `test`, `build`, `pb:guard`, `release:status`, `release:sync-check`, `verify:pr` y `git diff --check`.

## Checklist de salida

- [x] PR `release/0.1.0-beta.23` -> `main` abierta
- [x] CI en verde
- [x] PR mergeada en `main`
- [x] Tag `v0.1.0-beta.23` creado desde `main`
- [x] Produccion verificada con smoke postdeploy
- [x] Rama remota `release/0.1.0-beta.23` eliminada
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
- Issues de visual total `CACH-0082` a `CACH-0088` para cubrir primitivas, detalles, calendarios, secundarias, admin/layout y QA final.

### Cambiado

- Shell privado, navegacion desktop/mobile, top bar y bottom nav migran a tokens semanticos Lovable sin cambiar rutas.
- Botones, cards, badges, modales, inputs, toast y barras de accion adoptan surfaces, textos, bordes, foco y acentos coherentes.
- `/work`, `/projects` y `/events` pulen listas, filtros, tarjetas, loading/error/empty states y metadatos sin cambiar CRUD ni datos.
- `/dashboard` pule KPIs, panel "Ahora", controles e ingresos pendientes sin tocar formulas financieras.
- `/settings`, `/login`, `/register` y `/onboarding` sustituyen restos visuales grises por superficies, texto, radios y acentos semanticos.
- La release se amplia de visual acotada a visual total por decision explicita de producto, manteniendo fuera funcionalidades Lovable nuevas.
- `/projects/:id`, `/events/:id`, calendarios, `/contractors`, `/data`, `/novedades`, gates y `/admin/invitaciones` migran a tokens Lovable sin cambiar datos, formulas ni rutas funcionales.

### Corregido

- No aplica.

### Eliminado

- No aplica.

### Tecnico

- `src/index.css` queda preparado para clases como `bg-surface-page`, `text-text-primary`, `border-border-subtle`, `text-accent-primary` y `font-display`.
- `CACH-0080` fija la frontera de alcance funcional: beta 23 no incluye shadcn/Radix/TanStack, Supabase/RLS/data, formulas financieras, calendario custom ni dark mode.

## Resultado final

Release publicada mediante PR #110 a `main` y tag `v0.1.0-beta.23`. Produccion verificada en `https://app.caches.es` con smoke postdeploy publico.
