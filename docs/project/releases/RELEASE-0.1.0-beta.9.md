---
id: RELEASE-0.1.0-beta.9
type: release
status: Active
created: 2026-05-07
updated: 2026-05-07
release_branch: release/0.1.0-beta.9
release_tag: v0.1.0-beta.9
aliases:
  - RELEASE-0.1.0-beta.9
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.9 — Panel admin de invitaciones

## Estado

Active

## Rama de release

`release/0.1.0-beta.9`

## Tag

`v0.1.0-beta.9`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.9` es un corte técnico corto para hacer operativo el acceso beta privado.

## Objetivo de la release

Permitir gestionar invitaciones beta desde una pantalla interna segura, con rol admin real y sin exponer códigos, hashes ni redenciones a usuarios normales.

## Alcance funcional

- Rol `admin` en perfiles.
- RPCs seguras para listar, crear y revocar invitaciones.
- Pantalla privada `/admin/invitaciones` solo para administradores.
- Acceso al panel desde Ajustes solo para cuentas admin.
- Hardening de acceso alrededor de invitaciones y perfil.

## Areas implicadas

- Data: perfiles, invitaciones, redenciones y RPCs.
- Security/privacy: RLS, security definer, rol admin y ausencia de service role en cliente.
- Frontend: ruta privada, pantalla admin y enlace condicional desde Ajustes.

## Restricciones CACH-B0017

- No implementar analítica real.
- No crear waitlist pública.
- No enviar emails automáticos.
- No incluir referidos, calendario unificado, mobile financiero ni features Pro.
- No exponer `code_hash` ni códigos ya creados.
- No usar service role en cliente.

## Scope

- [[../issues/CACH-B0017|CACH-B0017]] — Panel admin para invitaciones beta.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0017|CACH-B0017]] | Panel admin para invitaciones beta | Review | `release/0.1.0-beta.9` |

## Fuera de alcance

- Analítica real, telemetría o consentimiento avanzado.
- Waitlist pública, referidos, campañas o perfil público.
- Calendario unificado de [[../issues/CACH-B0007|CACH-B0007]].
- Mobile financiero de [[../issues/CACH-B0002|CACH-B0002]].
- Tooling interno de [[../issues/CACH-B0010|CACH-B0010]].

## Riesgos

- Escalada de privilegios si `profiles.role` fuera editable por usuarios normales; se mitiga con trigger de inmutabilidad para sesiones autenticadas.
- Exposición de invitaciones si se añaden policies directas; se mitiga usando RPCs con comprobación admin y sin devolver hashes.
- Confusión operativa si el primer admin no existe; se mitiga documentando SQL manual.

## Decisiones relacionadas

- [[../decisions/ADR-0002-beta-trust-before-pro|ADR-0002]]

## Checklist de entrada

- [x] Release creada
- [x] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validación definidos

## Checklist de desarrollo

- [x] Todas las issues están en progreso o cerradas
- [x] Commits preparados en rama release
- [x] No hay cambios sueltos fuera de release
- [x] No hay issues sin estado
- [x] No hay decisiones importantes sin documentar

## Checklist de estabilización

- [x] Build correcto
- [x] Tests/checks correctos (`npm run lint`, `npm run test`, `npm run build`, `npm run pb:check`, `git diff --check`)
- [ ] Revisión visual `/admin/invitaciones`
- [ ] Revisión responsive 375px y desktop
- [ ] Revisión accesibilidad
- [x] Revisión de regresión básica
- [x] Revisión de documentación

## Checklist de salida

- [ ] PR `release/0.1.0-beta.9` -> `main` abierta
- [ ] CI en verde
- [ ] Revisión aprobada
- [ ] PR mergeada en `main`
- [ ] `main` actualizado en local
- [ ] Tag `v0.1.0-beta.9` creado desde `main`
- [ ] Producción verificada si aplica
- [ ] Rama remota `release/0.1.0-beta.9` eliminada
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Estado actual actualizado
- [ ] Current Release actualizado
- [ ] Backlog actualizado
- [ ] Documento de release actualizado como cerrado

## Release notes

### Añadido

- Rol `admin` en perfiles, con protección para que usuarios autenticados no puedan cambiar su propio rol.
- RPCs seguras para listar, crear y revocar invitaciones beta sin exponer hashes.
- Ruta privada `/admin/invitaciones` para crear, listar y revocar códigos.
- Enlace a administración beta desde Ajustes solo para perfiles admin.
- Documento operativo para acceso directo seguro a Supabase con MCP y fallback SQL Editor.

### Cambiado

- `useProfile` lee `role` y mantiene `user` como valor por defecto compatible.
- La generación operativa de códigos pasa de SQL manual a panel interno admin.

### Corregido

- Usuarios normales quedan fuera de `/admin/invitaciones` aunque conozcan la URL.
- `create_beta_invite()` y `handle_new_user()` resuelven `pgcrypto` cuando Supabase instala la extensión en el schema `extensions`.

### Eliminado

- No se incluye waitlist pública, emails automáticos, analítica real, calendario unificado ni features Pro.

### Técnico

- Validado localmente: `npm run lint`, `npm run test`, `npm run build`, `npm run pb:check` y `git diff --check`.
- La migración hotfix `20260507193000_fix_beta_invite_pgcrypto_schema.sql` debe aplicarse en Supabase remoto antes de probar creación de códigos en producción.

## Resultado final

Lista para PR `release/0.1.0-beta.9` -> `main`. La release no debe marcarse como `Released` ni etiquetarse hasta mergear en `main` y validar CI.
