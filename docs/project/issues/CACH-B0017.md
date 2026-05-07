---
id: CACH-B0017
title: Panel admin para invitaciones beta
type: feature
status: review
cycle: beta-1
release: RELEASE-0.1.0-beta.9
priority: p1
estimate: m
area: db
created_at: 2026-05-07
updated_at: 2026-05-07
aliases:
  - CACH-B0017
tags:
  - product-brain
  - issue
  - beta
  - admin
  - security
  - privacy
---

# CACH-B0017 — Panel admin para invitaciones beta

## Summary

Operacionalizar las invitaciones beta desde la app con rol admin, RPCs seguras y una pantalla interna para crear, listar y revocar códigos.

## Context

Beta 8 dejó el acceso por invitación funcionando, pero la generación de códigos quedó manual por SQL. Beta 9 convierte esa operación en una herramienta interna sin abrir waitlist pública ni service role en cliente.

## Problem

Crear códigos manualmente por SQL es suficiente para validar beta 8, pero no es operativo si hay que invitar usuarios reales con rapidez y seguridad.

## Proposed Solution

- Añadir rol `admin` al perfil, con primer admin asignado manualmente por SQL.
- Crear RPCs seguras para listar, crear y revocar invitaciones sin exponer hashes ni tablas al cliente.
- Añadir `/admin/invitaciones` como ruta privada solo admin.
- Mostrar el código plano solo una vez al crearlo; después solo se listan etiqueta, estado, usos, caducidad y resumen de redenciones.
- Mantener usuarios normales sin lectura de `beta_invites` ni `beta_invite_redemptions`.

## Acceptance Criteria

- [x] Admin puede crear, listar y revocar invitaciones desde `/admin/invitaciones`.
- [x] Usuario normal no puede acceder a `/admin/invitaciones`.
- [x] Usuario normal no puede leer `beta_invites` ni `beta_invite_redemptions`.
- [x] Código creado desde panel permite registrar un usuario beta.
- [x] Código revocado, usado, caducado, vacío o inválido falla con mensaje genérico.
- [x] El código plano solo aparece una vez al crear.
- [x] `/admin/invitaciones` funciona en 375px y desktop.
- [x] El flujo de operaciones directas de Supabase queda documentado con MCP como vía preferida y SQL Editor como fallback.
- [x] `npm run lint`, `npm run test`, `npm run build`, `npm run pb:check` y `git diff --check` pasan.

## Validation

- Ejecutado `npm run lint`, `npm run test`, `npm run build`, `npm run pb:check` y `git diff --check`.
- Revisión local de seguridad: el cliente usa RPCs y no consulta `beta_invites`/`beta_invite_redemptions` directamente.
- Añadida migración hotfix para resolver `pgcrypto` en Supabase cuando la extensión vive en `extensions`.
- La migración no se ha aplicado contra Supabase remoto desde el agente.

## Out of Scope

- Envío de emails.
- Waitlist pública.
- Dashboard público de invitaciones.
- Analítica real o telemetría.
- Referidos, growth, calendario unificado o features Pro.

## Related

- [[CACH-B0006|CACH-B0006]]
