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

`RELEASE-0.1.0-beta.11` — Guardrails de agentes.

## Rama activa

`release/0.1.0-beta.11`

## Ultimo corte

`RELEASE-0.1.0-beta.10` — emails transaccionales beta con Brevo. Ver [[RELEASE-0.1.0-beta.10]].

## Scope actual

Beta de desarrollo local para endurecer el flujo OpenCode antes de apoyar más trabajo en agentes especializados.

Issues asociadas:

- [[../issues/CACH-0039|CACH-0039]] — Respetar permisos reales en lanzadores OpenCode.
- [[../issues/CACH-0040|CACH-0040]] — Separar plan draft de ejecucion mutante.

## Regla de trabajo para esta release

Crear o actualizar issue `CACH-*` antes de meter trabajo en `release/0.1.0-beta.11`.

## Como cerrar esta release

Cerrar CACH-0039 y CACH-0040, validar runners con dry-run, `context:check`, `agents:status`, lint/build y abrir PR `release/0.1.0-beta.11` -> `main`.
