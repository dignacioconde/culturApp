---
id: RELEASE-0.1.0-beta.8
type: release
status: Released
created: 2026-05-07
updated: 2026-05-07
release_branch: release/0.1.0-beta.8
release_tag: v0.1.0-beta.8
aliases:
  - RELEASE-0.1.0-beta.8
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.8 — Onboarding y acceso beta privado

## Estado

Released

## Rama de release

`release/0.1.0-beta.8`

## Tag

`v0.1.0-beta.8`

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.8` es un corte iterativo mergeable centrado en primera sesión, acceso beta privado y confianza básica de datos.

## Objetivo de la release

Preparar Cachés para que una persona invitada pueda entrar en una beta privada, entender el modelo mental inicial y crear su primer trabajo con una postura de privacidad clara.

Beta 8 no añade analítica real ni reabre el sistema de releases: usa el workflow de Product Brain ya existente y se centra en onboarding/acceso.

## Alcance funcional

- Acceso beta privado con invitación o código.
- Onboarding corto sobre evento, proyecto, caché e ingresos.
- Estados iniciales y copy de primera sesión para orientar el primer trabajo.
- Revisión de perfil/bootstrap para evitar fricción de usuario nuevo.
- Texto básico de privacidad para la beta privada, sin tracking real.
- Verificación de registro/login/perfil para usuarios nuevos y existentes.

## Areas implicadas

- Frontend: rutas, formularios, estados vacíos, onboarding y copy.
- Data: perfil, ownership y bootstrap de usuario autenticado.
- Security/privacy: invitaciones, RLS, ausencia de service role en cliente y transparencia de datos.

## Restricciones CACH-B0006

- No implementar analítica real, tracking persistente ni dashboard de uso.
- No crear un sistema básico de releases; Product Brain ya cubre agrupación de cambios.
- No aceptar `user_id` desde input editable.
- No usar service role en cliente.
- No cambiar schema Supabase salvo criterio explícito en la issue o subtarea.
- No mezclar onboarding con growth, referidos, perfil público ni i18n.

## Scope

- [[../issues/CACH-B0006|CACH-B0006]] — Onboarding y acceso beta.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0006|CACH-B0006]] | Onboarding y acceso beta | Released | `release/0.1.0-beta.8` |

## Fuera de alcance

- Sistema básico de releases.
- Analítica real, eventos de uso, telemetría, dashboards o consentimiento avanzado.
- Importación/exportación adicional de datos de [[../issues/CACH-B0005|CACH-B0005]].
- Contratantes, facturación y liquidación neta de [[../issues/CACH-B0004|CACH-B0004]].
- Calendario unificado, PWA/offline, notificaciones, features Pro, perfil público, referidos o gestión documental.

## Riesgos

- El acceso por invitación puede tocar auth y seguridad; se mitiga manteniendo RLS, usuario autenticado y sin service role en cliente.
- El onboarding puede crecer hasta rediseñar la app; se mitiga limitándolo a primera sesión y primer trabajo.
- El consentimiento puede confundirse con analítica real; se mitiga dejando solo copy/privacidad básica y sacando telemetría del scope.
- El perfil inicial puede reproducir errores 409 si falta bootstrap; se mitiga revisando el flujo de perfil y usando hooks existentes.

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
- [x] Revisión visual autenticada
- [x] Revisión responsive autenticada
- [x] Revisión accesibilidad
- [x] Revisión de regresión básica
- [x] Revisión de documentación

## Checklist de salida

- [x] PR `release/0.1.0-beta.8` -> `main` abierta: https://github.com/dignacioconde/culturApp/pull/87
- [x] CI en verde
- [x] Revisión aprobada
- [x] PR mergeada en `main`
- [x] `main` actualizado en local
- [x] Tag `v0.1.0-beta.8` creado desde `main`
- [x] Producción verificada si aplica
- [x] Rama remota `release/0.1.0-beta.8` eliminada
- [x] Release notes actualizadas
- [x] Issues marcadas como `Released`
- [x] Estado actual actualizado
- [x] Current Release actualizado
- [x] Backlog actualizado
- [x] Documento de release actualizado como cerrado

## Release notes

### Añadido

- Acceso beta privado con tabla de invitaciones, redenciones y consumo atómico del código al crear usuario.
- Campo de código beta en registro, precargable con `?invite=...`, sin consultas de invitaciones desde cliente.
- Onboarding privado de tres pasos para primera sesión.
- Consentimiento básico de uso de datos en onboarding y ajustes, sin analítica real.

### Cambiado

- `ProfileGate` bloquea rutas privadas si falta perfil y redirige a onboarding si la primera sesión no está completada.
- `useProfile` centraliza los nuevos campos de onboarding/consentimiento y mantiene compatibilidad con esquemas antiguos durante el despliegue.
- Copy de `/data` diferencia exportación CSV para hoja de cálculo de importación con plantilla.

### Corregido

- Gasto rápido en detalle de proyecto usa `parseDecimal`, rechaza vacío/cero/ambiguo y guarda `amount` numérico.
- Drift documental de beta 6 para `CACH-0030` y `CACH-0038` queda cerrado fuera del scope funcional de beta 8.

### Eliminado

- No se incluye panel admin de invitaciones, analítica real, waitlist pública ni sistema nuevo de releases en este corte.

### Técnico

- Validado localmente: `npm run lint`, `npm run test`, `npm run build`, `npm run pb:check` y `git diff --check`.

## Resultado final

Release cerrada y mergeada a `main` el 2026-05-07 en PR #87. Tag `v0.1.0-beta.8` creado desde `main`.
