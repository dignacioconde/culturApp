---
id: RELEASE-0.1.0-beta.11
type: release
status: Active
created: 2026-05-07
updated: 2026-05-08
release_branch: release/0.1.0-beta.11
release_tag: null
aliases:
  - RELEASE-0.1.0-beta.11
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.11 — Guardrails de agentes

## Estado

Active

## Rama de release

`release/0.1.0-beta.11`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.11` queda abierta para endurecer el flujo de agentes antes de usarlo como base de nuevas tareas de producto.

## Objetivo de la release

Hacer seguro el flujo OpenCode: planificacion draft read-only, ejecucion mutante explicita, permisos reales por tipo de agente y dry-run verificable.

## Alcance funcional

- Runners OpenCode para planner, agentes individuales y agentes en paralelo.
- Perfiles OpenCode con permisos explicitos.
- Documentacion operativa de agentes y skill de lanzamiento.
- Trazabilidad Product Brain de CACH-0039 y CACH-0040.

## Áreas implicadas

- Infraestructura de agentes.
- Product Brain.
- Documentacion operativa.

## Scope

- [[../issues/CACH-0039|CACH-0039]] — Respetar permisos reales en lanzadores OpenCode.
- [[../issues/CACH-0040|CACH-0040]] — Separar plan draft de ejecucion mutante.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-0039|CACH-0039]] | Respetar permisos reales en lanzadores OpenCode | In progress | `release/0.1.0-beta.11` |
| [[../issues/CACH-0040|CACH-0040]] | Separar plan draft de ejecucion mutante | In progress | `release/0.1.0-beta.11` |

## Fuera de alcance

- Email/DNS/Brevo/Supabase SMTP: queda fuera de esta beta y pasa a beta 12.
- Cambios visibles de producto/UX como CACH-0043, CACH-0044 y CACH-0045.
- Redisenar todo el sistema de agentes o cambiar modelos por defecto fuera del routing ya existente.

## Riesgos

- No reintroducir `CACH-B0020` ni pasos manuales de email en beta 11.
- No usar `--dangerously-skip-permissions` como default.
- Los modos read-only deben estar protegidos por script y perfil, no solo por prompt.

## Decisiones relacionadas

- [[../issues/CACH-B0010|CACH-B0010]]
- [[../issues/CACH-B0018|CACH-B0018]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validación definidos

## Checklist de desarrollo

- [ ] Todas las issues están en progreso o cerradas
- [ ] Commits preparados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin estado
- [ ] No hay decisiones importantes sin documentar

## Checklist de estabilización

- [ ] Build correcto
- [ ] Tests/checks correctos
- [ ] Revisión visual
- [ ] Revisión responsive
- [ ] Revisión accesibilidad básica
- [ ] Revisión de regresión básica
- [ ] Revisión de documentación

## Checklist de salida

- [ ] PR `release/0.1.0-beta.11` -> `main` abierta
- [ ] CI en verde
- [ ] Revisión aprobada
- [ ] PR mergeada en `main`
- [ ] Tag creado desde `main`
- [ ] Producción verificada si aplica
- [ ] Rama remota limpiada
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Current Release actualizado
- [ ] Backlog actualizado

## Release notes

### Añadido

- `agents:plan:draft` y `agents:plan:execute` como modos separados.
- `--dry-run` / `--print-command` para planner, run individual y run paralelo.

### Cambiado

- `agents:plan` pasa a ser draft read-only por defecto.
- Los runners dejan de pasar `--dangerously-skip-permissions` por defecto.

### Corregido

- Proteccion por script para agentes read-only frente a `--write` y dangerous opt-in.

### Eliminado

- Pendiente.

### Técnico

- Permisos explicitos en perfiles OpenCode y documentacion de uso seguro.

## Resultado final

Release en desarrollo con scope acotado a guardrails de agentes.
