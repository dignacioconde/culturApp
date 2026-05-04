---
id: ADR-0007
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0007
tags:
  - product-brain
  - adr
  - workflow
---

# ADR-0007 — pb:push usa --delete para sincronizar borrados al vault

## Context

El Product Brain vive en el repo y se sincroniza manualmente con el vault de Obsidian en iCloud. La primera version del sync escribia archivos nuevos o modificados, pero no borraba en el vault los archivos eliminados del repo.

Eso dejo duplicados huerfanos en iCloud, por ejemplo numeraciones antiguas y copias de issues ya normalizadas.

## Decision

`npm run pb:push` conserva el modo seguro por defecto: exporta nuevos y modificados sin borrar nada del vault.

Cuando se quiera que el vault refleje borrados del repo, usar:

```bash
npm run pb:push -- --delete
```

Ese flag exporta cambios y borra del vault los archivos que ya no existan en el repo.

## Consequences

- La sincronizacion destructiva es explicita.
- La curacion del inbox puede borrar entradas en repo y luego limpiar el vault con `--delete`.
- Antes de usar `--delete`, hay que revisar `npm run pb:status`.

## Alternatives Considered

- Borrar siempre en `pb:push`: mas fiel, pero demasiado arriesgado para iCloud/Obsidian.
- No soportar borrados: seguro, pero deja basura permanente tras curaciones y renombres.

## Related

- [[ADR-0003-repo-native-product-brain|ADR-0003-repo-native-product-brain]]
- [[../issues/CACH-0028|CACH-0028]]
- [[../issues/CACH-B0010|CACH-B0010]]
