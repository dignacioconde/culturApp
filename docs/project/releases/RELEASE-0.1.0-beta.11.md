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

# RELEASE-0.1.0-beta.11 — Desarrollo sin pasos manuales

## Estado

Active.

## Rama de release

`release/0.1.0-beta.11`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.11` queda abierta para avanzar tareas desarrollables y verificables desde repo sin depender de pasos manuales externos.

## Objetivo de la release

Desarrollar mejoras acotadas que puedan implementarse y validarse localmente o por CI, evitando bloqueos por Brevo, DNS, Supabase Dashboard o producción.

## Alcance funcional

- Pendiente de seleccionar issues `CACH-*` que no requieran pasos manuales externos.
- Cada issue añadida debe tener criterio de verificación local/CI claro.
- Si una tarea descubre una dependencia manual, debe salir de beta 11 o partirse.

## Áreas implicadas

- Producto.
- Frontend/backend según issue.
- Documentación de release.

## Scope

Sin issues incluidas todavía tras aplazar la deuda manual de email/remitente a [[RELEASE-0.1.0-beta.12]].

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| — | — | — | — |

## Fuera de alcance

- Validación de dominio/remitente transaccional, DNS y cambios manuales en Brevo/Supabase Auth SMTP. Se aplaza a [[RELEASE-0.1.0-beta.12]].
- Newsletters, campañas, audiencias, CRM y automatizaciones.
- Rediseño amplio de plantillas de email.

## Riesgos

- No añadir tareas a esta release sin crear o actualizar su issue `CACH-*`.
- No meter tareas que dependan de DNS, Brevo, Supabase Dashboard, Vercel producción u otro paso manual externo.
- Si la release queda sin scope concreto, escoger una issue pequeña del backlog antes de abrir PR.

## Decisiones relacionadas

- [[../issues/CACH-B0019|CACH-B0019]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [ ] Issues asociadas
- [x] Alcance definido como release sin pasos manuales
- [ ] Criterios de validación definidos por issue

## Checklist de desarrollo

- [ ] Todas las issues están en progreso o cerradas
- [ ] Commits preparados en rama release
- [ ] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
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

- Pendiente: issues sin pasos manuales externos.

### Cambiado

- La deuda manual de email/remitente sale de beta 11 y pasa a [[RELEASE-0.1.0-beta.12]].

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Técnico

- Pendiente según issues seleccionadas.

## Resultado final

Release abierta para trabajo desarrollable desde repo. La deuda manual de email/remitente queda fuera de este corte.
