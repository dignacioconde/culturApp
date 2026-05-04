# Product Brain repo-native

El Product Brain vive en `docs/project/` del repo, sincronizado manualmente con el vault de Obsidian en iCloud.

Nombre canónico del producto: **Cachés**. Usar `CACH` como prefijo de issues Markdown.

## Scripts npm

```bash
npm run pb:init     # Inicializar Product Brain (primera vez)
npm run pb:status   # Ver estado actual
npm run pb:check    # Validar frontmatter, índices y wikilinks internos
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

## Captura por agentes

- Usar la skill portable `product-brain-capture` cuando el usuario diga `PB inbox:`, `PB idea:`, `PB issue:`, `PB decisión:`, `PB contexto:`, "mete esto en el brain" o "captura esto".
- El flujo de captura es: leer `docs/project/START_HERE.md`, ejecutar `npm run pb:status`, parar ante drift/conflicto raro, ejecutar `npm run pb:capture -- "..."` y hacer `npm run pb:push` solo si el usuario quiere verlo en Obsidian.
- No crear GitHub Issues salvo que el usuario pida implementación. No usar `.memory/` como backlog del Product Brain.
- No capturar secretos ni datos sensibles de clientes sin confirmación explícita.
- En barridos del Product Brain, revisar tambien que `decisions/` y `releases/` tengan las decisiones y cortes de producto realmente duraderos; no quedarse solo en `context/`, `knowledge/` e `issues/`.

## Lectura IA y consistencia

- `docs/project/START_HERE.md` debe mantener una ruta mínima de lectura para agentes: leer START_HERE, elegir índice por tipo de tarea, abrir solo enlaces relevantes y ejecutar `npm run pb:check` antes de cerrar cambios.
- Los IDs canónicos de issues Markdown son los nombres de archivo completos, por ejemplo `CACH-0026` y `CACH-B0001`. No usar wikilinks cortos como `CACH-026` o `CACH-B001`.
- Antes de abrir PR que toque `docs/project/`, ejecutar `npm run pb:check`; el validador cubre frontmatter de issues, índices principales y wikilinks internos.

Actualizado: 2026-05-04
