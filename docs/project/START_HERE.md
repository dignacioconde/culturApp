---
id: PB-START
type: index
status: Active
created: 2026-05-04
updated: 2026-05-04
aliases:
  - Product Brain
  - Cachés Product Brain
tags:
  - product-brain
  - caches
---

# Product Brain de Cachés

Este es el centro de producto de **Cachés**. Vive versionado en el repo bajo `docs/project/` y se sincroniza manualmente con el vault de Obsidian en iCloud:

`/Users/diconde/Library/Mobile Documents/iCloud~md~obsidian/Documents/Product Brain Caches.es`

## Estructura

```
docs/project/
├── START_HERE.md          ← Este archivo
├── inbox/                 ← Capturas rápidas pendientes de curar
├── context/               ← Contexto estable del producto
├── knowledge/             ← Notas ZK e investigación
├── issues/                ← Backlog Markdown con prefijo CACH
├── decisions/             ← ADRs y decisiones importantes
├── releases/              ← Releases y criterios de salida
├── plans/                 ← Planes estratégicos y operativos
├── indexes/               ← Índices tipo MOC
├── templates/             ← Plantillas reutilizables
└── prompts/               ← Prompts de trabajo
```

## Comandos npm

```bash
npm run pb:init      # Inicializar Product Brain (primera vez)
npm run pb:status   # Ver estado actual y archivos pendientes
npm run pb:pull     # Importar cambios del vault de iCloud
npm run pb:push     # Exportar cambios al vault de iCloud
```

## Índices

- [[indexes/issues.index|Issues]]
- [[indexes/knowledge.index|Knowledge]]
- [[indexes/decisions.index|Decisions]]
- [[indexes/releases.index|Releases]]

## Planes activos

- [[plans/backlog-mayo-2026|Backlog completo — Mayo 2026]]

## GitHub Issues

Product Brain es la fuente de verdad de producto. GitHub Issues se crean solo cuando una issue vaya a implementarse con rama, agentes, PR y merge.

Las issues Markdown usan el prefijo `CACH`, por ejemplo [[issues/CACH-026|CACH-026]].

## Normas De Sync

1. Ejecutar `npm run pb:pull` antes de curar contenido desde el repo.
2. Ejecutar `npm run pb:push` para publicar cambios del repo al vault.
3. Si hay conflictos, el script se detiene y no pisa archivos.
4. No se borran archivos automáticamente en v1.
5. Se excluyen `.obsidian/`, `.DS_Store` y temporales de iCloud.

## Modo Alfred

Antes de convertir una entrada en trabajo, clasificarla como `inbox`, `ZK`, `issue`, `ADR`, `release`, `contexto`, `duplicado` o `rechazado`.

Hacer challenge si la idea está repetida, contradice contexto, es demasiado grande, no tiene usuario/problema claro o parece prematura.
