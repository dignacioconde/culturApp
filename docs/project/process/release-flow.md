---
id: PB-RELEASE-FLOW
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Release flow
tags:
  - product-brain
  - process
  - release
---

# Release flow

## Regla

Cada release es un corte pequeno y mergeable. Evitar ramas eternas.

## Flujo

1. Crear release desde plantilla.
2. Definir `## Scope` con issues concretas.
3. Crear rama `release/x.y.z-channel.n`.
4. Trabajar en ramas de tarea desde la release.
5. Validar lint, tests, build y `pb:check`.
6. Mergear release a `main`.
7. Verificar produccion si aplica.

## TODO

El job de `supabase test db` queda pendiente de cablear en CI cuando haya migraciones completas y Supabase CLI configurado en GitHub Actions.
