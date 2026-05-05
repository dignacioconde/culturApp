---
id: PB-DEFINITION-DONE
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Definition of Done
tags:
  - product-brain
  - process
  - done
---

# Definition of Done

Una issue esta hecha cuando el cambio esta integrado, verificable y el brain no miente.

## Criterios

- Codigo o docs terminados dentro del alcance.
- `npm run lint` pasa si toca app o scripts lintados.
- `npm run build` pasa si toca app.
- `npm run test` pasa si toca logica cubierta por tests.
- `npm run pb:check` pasa si toca `docs/project/`.
- La issue y la release reflejan el estado real.
- Si abre PR, incluye checkpoint de memoria: actualizada o no aplica.

## Nota

Un preview no cuenta como produccion. Si el usuario espera verlo publicado, hay que mergear a `main` y verificar alias de produccion.
