---
id: PB-PROCESS-RELEASE-PROCESS
type: process
status: Active
created: 2026-05-05
updated: 2026-05-05
aliases:
  - Release Process
  - Proceso de releases
tags:
  - product-brain
  - process
  - releases
---

# Release Process

Una release agrupa issues con un objetivo de producto, rama de integracion, checklist de validacion y release notes.

Las releases deben ser cortes pequenos y mergeables a `main`. Evitar ramas de release eternas: si tras mergear a `main` hay que seguir iterando, crear el siguiente corte (`RELEASE-0.1.0-beta.2`, `RELEASE-0.1.0-beta.3`, etc.).

## Versionado de ciclos

Regla canonica:

- `0.1` representa un ciclo de producto u organizativo.
- `0.1.0-beta.1`, `0.1.0-beta.2`, etc. son cortes iterativos mergeables a `main`.
- `0.1.0` es el cierre consolidado del ciclo `0.1`.
- `0.1.1` es un patch/hotfix posterior al cierre de `0.1.0`.
- `0.2.0` inicia el siguiente ciclo funcional u organizativo.

Cada corte `beta.N` debe tener su release y rama propias. Al cerrar el ciclo, el changelog de `0.1.0` consolida lo que entro en todos los cortes `beta.N`.

## Crear release

1. Crear documento desde [[../templates/RELEASE_TEMPLATE|Release Template]].
2. Definir objetivo y resultado esperado.
3. Asignar issues iniciales.
4. Definir rama `release/<version>` derivada del ID de release.
5. Actualizar [[../indexes/releases.index|Releases Index]].

Ejemplo:

```text
docs/project/releases/RELEASE-0.1.0-beta.1.md
release/0.1.0-beta.1
```

## Activar release

Actualizar [[../releases/CURRENT_RELEASE|Current Release]]:

- release activa;
- rama activa;
- estado;
- objetivo;
- issues incluidas;
- reglas de trabajo.

Crear rama si no existe:

```bash
git switch main
git pull
git switch -c release/0.1.0-beta.1
git push -u origin release/0.1.0-beta.1
```

## Asociar issues

Cada issue incluida debe tener:

- `release: RELEASE-...` en frontmatter;
- estado claro;
- rama sugerida;
- criterios de aceptacion;
- dependencias;
- validacion.

Actualizar tambien:

- [[../backlog/BACKLOG|Backlog]]
- documento de release;
- [[../plans/CURRENT_PLAN|Current Plan]]

## Desarrollo

Las ramas de feature/fix salen de la release activa y vuelven a ella.

```bash
git switch release/0.1.0-beta.1
git pull
git switch -c feature/CACH-B0003-quick-paid-action
```

Al terminar:

```bash
git switch release/0.1.0-beta.1
git merge feature/CACH-B0003-quick-paid-action
```

## Estabilizacion

Antes de cerrar:

- todas las issues estan `Ready for Release` o `Released`;
- `npm run lint` y `npm run build` pasan si toca app;
- `npm run pb:check` pasa si toca Product Brain;
- QA visual/responsive/accesibilidad hecho si toca UI;
- release notes completas;
- ADRs creadas para decisiones importantes.

## Merge final a main

```bash
git switch main
git pull
git merge release/0.1.0-beta.1
git push
```

Despues:

- marcar issues como `Released`;
- actualizar release a `Released`;
- actualizar [[../releases/CURRENT_RELEASE|Current Release]];
- actualizar estado del producto;
- verificar produccion si aplica;
- limpiar ramas ya mergeadas.

## Checklist de release

### Entrada

- [ ] Release creada.
- [ ] Rama de release definida.
- [ ] Issues asociadas.
- [ ] Alcance definido.
- [ ] Criterios de validacion definidos.

### Desarrollo

- [ ] Issues en progreso o cerradas.
- [ ] Commits integrados en rama release.
- [ ] No hay cambios sueltos fuera de release.
- [ ] No hay issues sin estado.
- [ ] Decisiones importantes documentadas.

### Estabilizacion

- [ ] Build correcto.
- [ ] Tests/checks correctos.
- [ ] Revision visual.
- [ ] Revision responsive.
- [ ] Revision accesibilidad.
- [ ] Regression smoke.
- [ ] Documentacion revisada.

### Salida

- [ ] Release mergeada a `main`.
- [ ] Release notes actualizadas.
- [ ] Issues marcadas como `Released`.
- [ ] Estado actual actualizado.
- [ ] Current Release actualizado.
- [ ] Backlog actualizado.
- [ ] Proximos pasos documentados.

## Release notes

Mantener secciones:

- Aniadido
- Cambiado
- Corregido
- Eliminado
- Tecnico

No cerrar una release con release notes vacias.

## Changelog consolidado de ciclo

Cuando un ciclo se da por completado:

1. Crear o actualizar la release final del ciclo, por ejemplo `RELEASE-0.1.0`.
2. Agrupar las release notes de `RELEASE-0.1.0-beta.1`, `RELEASE-0.1.0-beta.2`, etc.
3. Marcar las issues incluidas como `Released` si ya llegaron a `main`.
4. Actualizar `CURRENT_RELEASE.md`, `CURRENT_PLAN.md` y `BACKLOG.md`.
5. Abrir el siguiente ciclo si procede, por ejemplo `RELEASE-0.2.0-beta.1`.
