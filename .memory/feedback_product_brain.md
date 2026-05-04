# Product Brain repo-native

El Product Brain vive en `docs/project/` del repo, sincronizado manualmente con el vault de Obsidian en iCloud.

Nombre canónico del producto: **Cachés**. Usar `CACH` como prefijo de issues Markdown.

## Scripts npm

```bash
npm run pb:init     # Inicializar Product Brain (primera vez)
npm run pb:status   # Ver estado actual
npm run pb:pull    # Importar cambios del vault de iCloud
npm run pb:push    # Exportar cambios al vault de iCloud
npm run pb:capture # Capturar nota (argumento o stdin)
```

## Estructura

- `START_HERE.md` — Índice principal con frontmatter y wikilinks
- `inbox/` — Notas pendientes de procesar
- `context/` — Contexto del proyecto
- `knowledge/` — Base de conocimiento técnico
- `issues/` — Issues markdown con prefijo CACH
- `decisions/` — Decisiones de producto
- `releases/` — Notas de release
- `plans/` — Planes a futuro
- `indexes/` — Índices transversales
- `templates/` — Plantillas reutilizables
- `prompts/` — Prompts para agentes

## Norma de sync

- Sync manual: `pb:pull` antes de trabajar, `pb:push` al terminar
- Conflictos: aviso y no se borra nada automáticamente en v1
- Excluidos: `.obsidian/`, `.DS_Store`, `*.tmp`, temporales de iCloud
- Vault por defecto: `/Users/diconde/Library/Mobile Documents/iCloud~md~obsidian/Documents/Product Brain Caches.es`
- Variable opcional: `ICLOUD_OBSIDIAN_VAULT` o `ICL_OBSIDIAN_VAULT`

Actualizado: 2026-05-04
