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

`RELEASE-0.1.0-beta.14` — Email definitivo transaccional.

## Rama activa

`release/0.1.0-beta.14`

## Ultimo corte

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

`RELEASE-0.1.0-beta.12` — pulido proyecto-evento y borrados seguros. Ver [[RELEASE-0.1.0-beta.12]].

`RELEASE-0.1.0-beta.13` — dashboard movil y estado Ahora. Ver [[RELEASE-0.1.0-beta.13]].

## Scope actual

Beta operativa para cerrar el email/remitente definitivo de Cachés, validando DNS, Brevo y Supabase Auth SMTP antes de seguir invitando usuarios reales. Este scope se ha trasladado de beta 13 a beta 14 para dejar beta 13 como corte normal de desarrollo.

Issues asociadas:

- [[../issues/CACH-B0020|CACH-B0020]] — Validar dominio de email transaccional y cambiar remitentes definitivos.

## Regla de trabajo para esta release

Crear o actualizar issue `CACH-*` antes de meter trabajo en `release/0.1.0-beta.14`.

## Como cerrar esta release

Cerrar CACH-B0020 con validacion real de dominio/remitente, DNS, Brevo, Edge Function y Supabase Auth SMTP. No mutar produccion sin confirmacion humana explicita.
