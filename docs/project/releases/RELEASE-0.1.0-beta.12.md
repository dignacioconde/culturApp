---
id: RELEASE-0.1.0-beta.12
type: release
status: Planned
created: 2026-05-08
updated: 2026-05-08
release_branch: release/0.1.0-beta.12
release_tag: null
aliases:
  - RELEASE-0.1.0-beta.12
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.12 — Dominio email transaccional

## Estado

Planned.

## Rama de release

`release/0.1.0-beta.12`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.12` queda reservada para resolver la deuda manual de email/remitente transaccional aplazada desde beta 11.

## Objetivo de la release

Crear o activar un remitente real de Cachés, validarlo en Brevo, configurar DNS y sustituir el remitente temporal en Supabase Edge Function y Supabase Auth SMTP.

## Alcance funcional

- Email/alias real para el remitente definitivo.
- Dominio/remitente Brevo.
- DNS SPF/DKIM/DMARC.
- Remitente de Edge Function `send-beta-invite`.
- Remitente SMTP de Supabase Auth.
- Smoke test real de invitación y confirmación de cuenta.

## Áreas implicadas

- Operaciones.
- Supabase Auth.
- Supabase Edge Functions.
- Brevo.
- DNS.

## Scope

- [[../issues/CACH-B0020|CACH-B0020]] — Validar dominio de email transaccional y cambiar remitentes definitivos.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0020|CACH-B0020]] | Validar dominio de email transaccional y cambiar remitentes definitivos | Blocked | `release/0.1.0-beta.12` |

## Fuera de alcance

- Newsletters, campañas, audiencias, CRM y automatizaciones.
- Rediseño amplio de plantillas de email.

## Riesgos

- No cambiar Supabase Auth SMTP ni `EMAIL_FROM_ADDRESS` al remitente definitivo hasta que el email/alias exista y Brevo confirme el dominio/remitente.
- `caches.es` y `updates.caches.es` no presentaban DNS público resoluble el 8 de mayo de 2026; validar de nuevo antes de operar.
- No guardar ni imprimir direcciones personales, claves SMTP, claves Brevo ni secretos.

## Checklist de entrada

- [x] Release creada
- [ ] Rama de release creada
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
- [ ] Revisión de documentación
- [ ] Smoke test real de invitación
- [ ] Smoke test real de confirmación de cuenta

## Checklist de salida

- [ ] PR `release/0.1.0-beta.12` -> `main` abierta
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

- Scope manual de email/remitente aplazado desde beta 11.

### Cambiado

- Pendiente.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Técnico

- Pendiente: validación DNS/Brevo y smoke test Supabase/Brevo.

## Resultado final

Release planificada para ejecutar pasos manuales externos de email transaccional cuando el dominio/remitente definitivo esté listo.
