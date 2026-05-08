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

# RELEASE-0.1.0-beta.11 — Dominio email transaccional

## Estado

Active

## Rama de release

`release/0.1.0-beta.11`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.11` queda abierta para cerrar la operativa de email/remitente transaccional antes de seguir invitando usuarios reales.

## Objetivo de la release

Crear o activar un remitente real de Cachés, validarlo en Brevo y sustituir el remitente personal temporal confirmado en Brevo.

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

- [[../issues/CACH-B0020|CACH-B0020]] — Validación del dominio transaccional como máxima prioridad para el **8 de mayo de 2026**.

## Issues incluidas

| Issue | Título | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0020|CACH-B0020]] | Validar dominio de email transaccional y cambiar remitentes definitivos | Ready | `release/0.1.0-beta.11` |

## Fuera de alcance

- Newsletters, campañas, audiencias, CRM y automatizaciones.
- Rediseño amplio de plantillas de email.

## Riesgos

- No añadir tareas a esta release sin crear o actualizar su issue `CACH-*`.
- Mientras el remitente definitivo no esté validado, los correos pueden funcionar en pruebas pero fallar en entrega real o reputación.
- No cambiar Supabase Auth SMTP ni `EMAIL_FROM_ADDRESS` al remitente definitivo hasta que el email/alias exista y Brevo confirme el dominio/remitente.

## Decisiones relacionadas

- [[../issues/CACH-B0019|CACH-B0019]]

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

- Issue [[../issues/CACH-B0020|CACH-B0020]] como scope único inicial de la release.

### Cambiado

- Pendiente: remitentes transaccionales definitivos.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Técnico

- Pendiente: validación DNS/Brevo y smoke test Supabase/Brevo.

## Resultado final

Release abierta para cerrar la deuda operativa de beta 10 antes de invitar a más usuarios reales.
