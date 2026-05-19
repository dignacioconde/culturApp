---
schema_version: 2
kind: index
id: PB-START
title: Product Brain de Cachés
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - Product Brain
  - Cachés Product Brain
tags:
  - product-brain
  - caches
  - navigation
generated: false
---
# Product Brain de Cachés

Este es el centro de producto de **Cachés**. Vive versionado en el repo bajo `docs/project/` y se sincroniza manualmente con el vault de Obsidian en iCloud:

`/Users/diconde/Library/Mobile Documents/iCloud~md~obsidian/Documents/Product Brain Caches.es`

## Estructura

```
docs/project/
├── START_HERE.md          ← Este archivo
├── inbox/                 ← Capturas rápidas pendientes de curar
├── backlog/               ← Tablero operativo ligero
├── context/               ← Contexto estable del producto
├── knowledge/             ← Notas ZK e investigación
├── issues/                ← Backlog Markdown con prefijo CACH
├── decisions/             ← ADRs y decisiones importantes
├── releases/              ← Releases y criterios de salida
├── plans/                 ← Planes estratégicos y operativos
├── process/               ← Flujo de desarrollo, ramas, commits y agentes
├── indexes/               ← Índices tipo MOC
├── templates/             ← Plantillas reutilizables
├── prompts/               ← Prompts de trabajo
└── feedback/              ← Feedback cualitativo de beta
```

## Comandos npm

```bash
npm run pb:init      # Inicializar Product Brain (primera vez)
npm run pb:status   # Ver estado actual y archivos pendientes
npm run pb:orient    # Orientación mínima para agentes sin cargar todo el Brain
npm run pb:retrieve  # Retrieval local por perfil/query/issue para orientar agentes
npm run pb:check    # Validar frontmatter, índices y wikilinks internos
npm run pb:guard     # Validación completa para cambios en docs/project/ o scripts/brain/
npm run pb:ready-check -- CACH-XXXX # Antes de mover una issue a ready
npm run pb:sdd-check -- CACH-XXXX # Gate SDD por niveles de una issue ejecutable
npm run pb:close-check -- CACH-XXXX # Antes de cerrar una issue como done
npm run pb:pull     # Importar cambios del vault de iCloud
npm run pb:push     # Exportar cambios al vault de iCloud
```

## Ruta Mínima Para Agentes

Para tareas pequeñas (fixes, chores, mejoras menores):

1. Leer `AGENTS.md`.
2. Leer `.memory/MEMORY.md`.
3. Leer este archivo.
4. Leer la issue `CACH-*` relacionada, si existe.
5. Crear rama desde `main` y abrir PR a `main` al terminar; si la tarea pertenece a una release activa, salir de `release/<version>` y seguir el workflow de release.

Leer además solo si aplica:

- [[process/WORKFLOW|Workflow]] — si necesitas claridad sobre el flujo, validaciones o cuándo usar release branch.
- [[releases/CURRENT_RELEASE|Current Release]] — si la tarea pertenece a una release activa.
- [[plans/CURRENT_PLAN|Current Plan]] — si la tarea afecta planificación.
- [[backlog/BACKLOG|Backlog]] — si necesitas ver el estado del tablero.
- [[indexes/decisions.index|Decisions Index]] — si la tarea toca arquitectura, modelo de datos o decisiones duraderas.

Ejecutar `npm run pb:guard` antes de cerrar cambios en `docs/project/` o `scripts/brain/`. Para cambios documentales acotados, `npm run pb:check` sigue siendo útil como validación rápida.

La coherencia issue-release, el tablero, los wikilinks e indices se validan con `pb:guard`/`pb:check`. Si se mueven issues, ADRs, knowledge o releases, ejecutar tambien `npm run pb:index`. Antes de pasar una issue a `ready`, usar `pb:ready-check CACH-XXXX` y `pb:sdd-check CACH-XXXX`; antes de marcarla como `done`, usar `pb:close-check CACH-XXXX`.

Los IDs canónicos de issues son los nombres de archivo completos, por ejemplo `CACH-0026` y `CACH-B0001`. No usar formas cortas como `CACH-026` o `CACH-B001` en wikilinks.

## Índices

- [[backlog/BACKLOG|Backlog operativo]]
- [[indexes/issues.index|Issues (CACH)]]
- [[indexes/knowledge.index|Knowledge (ZK)]]
- [[indexes/decisions.index|Decisions (ADR)]]
- [[indexes/releases.index|Releases]]
- [[process/README|Process]]

## Planes activos

- [[plans/CURRENT_PLAN|Current Plan]]
- [[plans/backlog-mayo-2026|Backlog completo — Mayo 2026]]

## Release activa

- [[releases/CURRENT_RELEASE|Current Release]]

## GitHub Issues

Product Brain es la fuente de verdad de producto. GitHub Issues se crean solo cuando una issue vaya a implementarse con rama, agentes, PR y merge.

Las issues Markdown usan el prefijo `CACH`, por ejemplo [[issues/CACH-0026|CACH-0026]].

El flujo operativo completo vive en [[process/WORKFLOW|Workflow]]. Antes de implementar, los agentes deben confirmar release activa, rama esperada, issue relacionada y validacion cuando aplique.

## Normas De Sync

1. Ejecutar `npm run pb:pull` antes de curar contenido desde el repo.
2. Ejecutar `npm run pb:push` para publicar cambios del repo al vault.
3. Si hay conflictos, el script se detiene y no pisa archivos.
4. No se borran archivos automáticamente en v1.
5. Se excluyen `.obsidian/`, `.DS_Store` y temporales de iCloud.

## Modo Alfred

Antes de convertir una entrada en trabajo, clasificarla como `inbox`, `ZK`, `issue`, `ADR`, `release`, `contexto`, `duplicado` o `rechazado`.

Hacer challenge si la idea está repetida, contradice contexto, es demasiado grande, no tiene usuario/problema claro o parece prematura.
