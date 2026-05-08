---
id: RELEASE-0.1.0-beta.14
type: release
status: Active
created: 2026-05-08
updated: 2026-05-08
release_branch: release/0.1.0-beta.14
release_tag: null
aliases:
  - RELEASE-0.1.0-beta.14
tags:
  - product-brain
  - release
  - beta
---

# RELEASE-0.1.0-beta.14 — Email definitivo transaccional

## Estado

Active

## Rama de release

`release/0.1.0-beta.14`

## Tag

Pendiente.

## Ciclo

`0.1` es el ciclo organizativo. `0.1.0-beta.14` queda reservado para la operativa manual de email definitivo tras el corte de desarrollo normal de beta 13.

## Objetivo de la release

Dejar un email/remitente definitivo real de Cachés operativo para emails transaccionales, eliminando el remitente personal temporal confirmado en Brevo.

## Alcance funcional

- Crear o activar el email/alias real de Cachés.
- Validar dominio/remitente en Brevo.
- Configurar DNS SPF, DKIM y DMARC requeridos.
- Actualizar remitentes de Edge Function y Supabase Auth SMTP solo tras validacion.
- Verificar invitacion beta y confirmacion de cuenta con smoke test real.

## Scope

- [[../issues/CACH-B0020|CACH-B0020]] — Validar dominio de email transaccional y cambiar remitentes definitivos.

## Issues incluidas

| Issue | Titulo | Estado | Rama |
|---|---|---|---|
| [[../issues/CACH-B0020|CACH-B0020]] | Validar dominio de email transaccional y cambiar remitentes definitivos | In progress | `release/0.1.0-beta.14` |

## Fuera de alcance

- Cambios de UX de dashboard movil, cubiertos por `RELEASE-0.1.0-beta.13`.
- Cambios de UX de proyecto-evento, cubiertos por `RELEASE-0.1.0-beta.12`.
- Newsletter, CRM, automatizaciones y redisenos de plantillas.
- Cambios de tooling de agentes o verificadores.

## Riesgos

- No cambiar remitentes a un email de Cachés hasta que exista y Brevo lo marque como validado.
- No exponer secretos, tokens, SMTP ni valores de `.env.local`.
- No ejecutar mutaciones de produccion sin confirmacion humana explicita.

## Checklist de entrada

- [x] Release creada
- [ ] Rama de release creada
- [x] Issues asociadas
- [x] Alcance definido
- [x] Criterios de validacion definidos

## Checklist de desarrollo

- [ ] Todas las issues estan en progreso o cerradas
- [ ] Commits preparados en rama release
- [ ] No hay cambios sueltos fuera de release
- [ ] No hay issues sin estado
- [ ] No hay decisiones importantes sin documentar

## Checklist de estabilizacion

- [ ] DNS verificado
- [ ] Brevo valida dominio/remitente
- [ ] Edge Function usa remitente definitivo
- [ ] Supabase Auth SMTP usa remitente definitivo
- [ ] Invitacion beta verificada
- [ ] Confirmacion de cuenta verificada
- [ ] Documentacion actualizada

## Checklist de salida

- [ ] PR `release/0.1.0-beta.14` -> `main` abierta si hay cambios versionados
- [ ] CI en verde si aplica
- [ ] Revision aprobada
- [ ] PR mergeada en `main` si aplica
- [ ] Tag creado desde `main` si aplica
- [ ] Produccion verificada si aplica
- [ ] Release notes actualizadas
- [ ] Issues marcadas como `Released`
- [ ] Current Release actualizado
- [ ] Backlog actualizado

## Release notes

### Aniadido

- Pendiente.

### Cambiado

- Pendiente.

### Corregido

- Pendiente.

### Eliminado

- Pendiente.

### Tecnico

- Pendiente.

## Resultado final

Release activa.
