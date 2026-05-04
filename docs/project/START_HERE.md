---
title: Product Brain - Cachés
type: index
created: 2026-05-04
last_updated: 2026-05-04
owner: CulturaApp
vault_sync: manual
status: active
---

# Product Brain 🚀

Bienvenido al Product Brain de **Cachés**. Este es el centro de conocimiento del proyecto, sincronizado manualmente con el vault de Obsidian en iCloud.

## Estructura

```
docs/project/
├── START_HERE.md          ← Este archivo
├── inbox/                  ← Notas pendientes de procesar
├── context/               ← Contexto del proyecto (decisiones clave)
├── knowledge/             ← Base de conocimiento técnico
├── issues/               ← Issues markdown (CACH-*)
├── decisions/             ← Decisiones de producto documentadas
├── releases/             ← Notas de release
├── plans/                ← Planes a futuro
├── indexes/              ← Índices transversales
├── templates/            ← Plantillas reutilizables
└── prompts/              ← Prompts para agentes
```

## Comandos npm

```bash
npm run pb:init      # Inicializar Product Brain (primera vez)
npm run pb:status   # Ver estado actual y archivos pendientes
npm run pb:pull     # Importar cambios del vault de iCloud
npm run pb:push     # Exportar cambios al vault de iCloud
```

## GitHub Issues

Los issues de implementación viven en GitHub. Usa el prefijo **CACH** para las issues markdown aqui:
- [[issues/CACH-001-initial-setup|]]
- [[issues/CACH-002-...|]]

## Normas de sync

1. **Sync manual**: siempre ejecutá `pb:pull` antes de trabajar y `pb:push` al terminar
2. **Conflictos**: si hay conflictos, se avisa y no se borra nada automáticamente (v1)
3. **Excluidos**: `.obsidian/`, `.DS_Store`, `*.tmp`, temporales de iCloud
4. **Observabilidad**: `pb:status` muestra qué archivos cambiaronlocalmente vs vault remoto

## Véase también

- [[indexes/knowledge-index|Conocimiento técnico]]
- [[indexes/decisions-index|Decisiones de producto]]
- [[decisions/product-decisions|]]
- [[knowledge/stack-y-tecnologias|]]