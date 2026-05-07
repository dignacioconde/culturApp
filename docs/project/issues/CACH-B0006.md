---
id: CACH-B0006
title: Onboarding y acceso beta
type: feature
status: done
cycle: unassigned
release: RELEASE-0.1.0-beta.8
priority: p1
estimate: m
area: frontend
created_at: 2026-05-04
updated_at: 2026-05-07
aliases:
  - CACH-B0006
tags:
  - product-brain
  - issue
  - beta
  - gtm
  - data
  - security
  - privacy
---

# CACH-B0006 — Onboarding y acceso beta

## Summary

Preparar Cachés para una beta privada con onboarding corto, acceso por invitación y una postura básica de privacidad/datos, sin analítica real ni nuevo sistema de releases.

## Context

Recorte para [[../releases/RELEASE-0.1.0-beta.8|RELEASE-0.1.0-beta.8]]. Esta beta cubre la parte ejecutable de primera sesión y acceso beta privado. Las ideas históricas sobre sistema de releases, analítica real e i18n quedan fuera de este corte.

## Problem

La beta necesita controlar quién entra y ayudar a una persona nueva a entender el modelo mental antes de crear su primer trabajo. También debe dejar clara la postura de datos y privacidad antes de abrir la app a usuarios externos.

## Proposed Solution

- Acceso beta privado con invitación o código, sin service role en cliente ni `user_id` editable.
- Onboarding de 3-4 pasos sobre evento, proyecto, caché e ingresos, orientado al primer trabajo.
- Estado inicial claro para usuarios nuevos: perfil, primer proyecto/evento y siguiente acción.
- Texto básico de privacidad/uso de datos para la beta privada, sin capturar eventos analíticos reales en este corte.
- Preparación mínima de UI y rutas para que el acceso beta no rompa registro, login ni perfil.

## Areas

- Frontend: registro/login, onboarding, estados vacíos y primera sesión.
- Data: perfil de usuario, ownership y bootstrap sin introducir datos compartidos entre usuarios.
- Security/privacy: invitaciones, privacidad visible y mantenimiento de RLS; no usar service role en cliente.

## Acceptance Criteria

- [x] Nuevo usuario entiende evento, proyecto y caché antes de crear su primer trabajo.
- [x] La beta puede limitarse por invitación o código sin exponer datos de otros usuarios.
- [x] Registro/login/perfil siguen funcionando para usuarios existentes.
- [x] La app muestra una postura clara de privacidad para beta privada, sin implementar analítica real.
- [x] Onboarding y estados vacíos usan español de España y tuteo.
- [x] `npm run lint`, `npm run build` y `npm run pb:check` pasan.

## Validation

- Ejecutado `npm run lint`, `npm run test`, `npm run build`, `npm run pb:check` y `git diff --check`.
- CI en verde en PR #87, incluidos job `app` y job `e2e`.
- Vercel preview en verde para la rama `release/0.1.0-beta.8`.

## Implemented

- Registro con código beta obligatorio, editable desde `?invite=...` y enviado solo como metadata de alta.
- Migración Supabase para `beta_invites`, `beta_invite_redemptions`, consumo atómico en `handle_new_user()` y RLS sin lectura pública de invitaciones.
- Perfil ampliado con onboarding, consentimiento de uso y referencia a invitación, gestionado desde `useProfile`.
- Ruta privada `/onboarding` con tres pasos y `ProfileGate` para bloquear rutas privadas hasta completar primera sesión.
- Ajustes en Settings para revisar consentimiento de uso sin activar analítica real.
- Correcciones preflight: gasto rápido con `parseDecimal`, copy CSV más claro y cierre documental de arrastres beta 6.

## Out of Scope

- Sistema básico de releases: ya existe en Product Brain y no se reimplementa en esta beta.
- Analítica real, tracking de eventos, dashboards de uso o almacenamiento de telemetría.
- Consent manager completo para analítica futura.
- i18n o traducción multiidioma.
- Growth, referidos, perfil público o campañas de invitación.

## Related

- [[CACH-B0005|CACH-B0005]]

## Resultado

Released en [[../releases/RELEASE-0.1.0-beta.8|RELEASE-0.1.0-beta.8]]. Integrado en `main` mediante PR #87.
