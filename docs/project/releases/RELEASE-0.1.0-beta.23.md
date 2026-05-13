---
schema_version: 2
kind: release
id: RELEASE-0.1.0-beta.23
title: Tokens Lovable para sistema visual
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
# RELEASE-0.1.0-beta.23 — Tokens Lovable para sistema visual

## Estado

Active.

## Rama de release

`release/0.1.0-beta.23`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.23` es un corte pequeno para preparar compatibilidad visual con el diseno exportado desde Lovable sin absorber su stack completo.

## Objetivo de la release

Dejar versionada una capa de tokens y aliases visuales que permita trasladar estilo de `artistic-rhythm` a Cachés de forma incremental, manteniendo el sistema actual estable.

## Alcance funcional

- Compatibilidad Tailwind con tokens semanticos del export Lovable.
- Alias de fuentes, superficies, texto, acentos, estados y sidebar.
- Utilidades visuales inertes para futuros componentes (`card-lift`, `skeleton`).
- Sin cambio funcional ni redisenos masivos de pantallas.

## Scope

- [[../issues/CACH-0076|CACH-0076]] — Alinear tokens de diseno con export Lovable.

## Issues incluidas

| Issue | Titulo | Workflow | Rama |
|---|---|---|---|
| [[../issues/CACH-0076|CACH-0076]] | Alinear tokens de diseno con export Lovable | done | `release/0.1.0-beta.23` |

## Fuera de alcance

- Importar componentes shadcn/Radix del repo Lovable.
- Migrar la app a TanStack Start.
- Activar tema oscuro.
- Cambiar navegacion, calendarios, formularios o flujos financieros.
- Supabase, RLS, migraciones o datos.

## Riesgos

- Tailwind v4 debe aceptar los nuevos tokens `@theme inline` sin romper el build.
- Las utilidades nuevas no deben alterar componentes existentes salvo que se usen explicitamente.
- El lenguaje visual debe seguir siendo sobrio y operativo, no una landing decorativa.

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
- [x] `npm run verify:pr -- --base origin/main --issue CACH-0076`
- [x] `git diff --check`
- [x] Revision visual basica de alcance: sin rediseño visible previsto; cambio limitado a tokens/aliases.

## Checklist de salida

- [ ] PR `release/0.1.0-beta.23` -> `main` abierta
- [ ] CI en verde
- [ ] PR mergeada en `main`
- [ ] Tag `v0.1.0-beta.23` creado desde `main` si aplica
- [ ] Produccion verificada o marcada no aplica
- [ ] Rama remota `release/0.1.0-beta.23` eliminada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `done`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Proximos pasos documentados

## Release notes

### Aniadido

- Tokens Tailwind compatibles con el export Lovable para fuentes, superficies, texto, acentos, estados y sidebar.
- Aliases semanticos CSS que preservan los tokens existentes de Cachés.
- Utilidades `card-lift` y `skeleton` para componentes visuales futuros.

### Cambiado

- No aplica en UI visible por defecto.

### Corregido

- No aplica.

### Eliminado

- No aplica.

### Tecnico

- `src/index.css` queda preparado para clases como `bg-surface-page`, `text-text-primary`, `border-border-subtle`, `text-accent-primary` y `font-display`.

## Resultado final

Pendiente hasta cerrar la release.
