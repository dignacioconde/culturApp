---
schema_version: 2
kind: process
id: PB-RELEASE-FLOW
title: Release flow
lifecycle: active
created: '2026-05-05'
updated: '2026-05-08'
aliases:
  - Release flow
tags:
  - product-brain
  - process
  - release
generated: false
---
# Release flow

## Regla

Cada release es un corte pequeno y mergeable. Evitar ramas eternas.

## Flujo

1. Crear release desde plantilla.
2. Definir `## Scope` con issues concretas.
3. Crear rama `release/x.y.z-channel.n`.
4. Trabajar en ramas de tarea locales desde la release solo si pertenecen a su scope.
5. Revisar diff/log e integrar cada tarea en la release con squash.
6. Validar lint, tests, build y `pb:check`.
7. Abrir PR unica `release/x.y.z-channel.n` -> `main`.
8. Tras mergear la PR, actualizar `main`, crear tag desde `main`, crear GitHub Release desde ese tag y borrar la rama remota de release.
9. Verificar produccion si aplica.

## TODO

El job de `supabase test db` queda pendiente de cablear en CI cuando haya migraciones completas y Supabase CLI configurado en GitHub Actions.
