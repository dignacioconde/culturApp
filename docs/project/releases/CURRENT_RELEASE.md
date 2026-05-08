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

`RELEASE-0.1.0-beta.11` — Desarrollo sin pasos manuales.

## Rama activa

`release/0.1.0-beta.11`

## Ultimo corte

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

## Scope actual

Beta 11 queda reservada para tareas desarrollables y verificables desde repo, sin pasos manuales externos en Brevo, DNS, Supabase Dashboard o producción.

La deuda manual de email/remitente queda aplazada a [[RELEASE-0.1.0-beta.12]] con [[../issues/CACH-B0020|CACH-B0020]].

## Regla de trabajo para esta release

Crear o actualizar issue `CACH-*` antes de meter trabajo en `release/0.1.0-beta.11`.

## Como cerrar esta release

Añadir una o varias issues `CACH-*` sin pasos manuales externos, implementarlas y verificarlas localmente, abrir PR `release/0.1.0-beta.11` -> `main`, esperar CI verde, mergear, etiquetar y verificar producción si aplica.
