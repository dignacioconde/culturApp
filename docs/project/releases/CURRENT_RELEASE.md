---
id: PB-CURRENT-RELEASE
type: release-status
status: Active
created: 2026-05-05
updated: 2026-05-08
aliases:
  - Current Release
tags:
  - product-brain
  - release
  - current
---

# Current Release

## Release activa

`RELEASE-0.1.0-beta.11` — Dominio email transaccional.

## Rama activa

`release/0.1.0-beta.11`

## Ultimo corte

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

## Scope actual

Máxima prioridad para el **8 de mayo de 2026**: crear o activar un remitente real de Cachés, validar dominio/remitente transaccional en Brevo, cambiar remitentes temporales y verificar invitación + confirmación de cuenta. Issue asociada: [[../issues/CACH-B0020|CACH-B0020]].

## Regla de trabajo para esta release

Crear o actualizar issue `CACH-*` antes de meter trabajo en `release/0.1.0-beta.11`.

## Como cerrar esta release

Cerrar [[../issues/CACH-B0020|CACH-B0020]], verificar invitación + confirmación con el remitente definitivo, abrir PR `release/0.1.0-beta.11` -> `main`, esperar CI verde, mergear, etiquetar y verificar producción si aplica.
