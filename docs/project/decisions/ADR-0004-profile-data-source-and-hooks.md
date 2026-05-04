---
id: ADR-0004
type: decision
status: Accepted
created: 2026-05-04
updated: 2026-05-04
aliases:
  - ADR-0004
tags:
  - product-brain
  - adr
  - data
  - profile
---

# ADR-0004 — Perfil, IRPF y datos de perfil pasan por useProfile

## Context

El perfil del usuario contiene datos que afectan a comportamiento financiero, especialmente `profiles.tax_rate`. Durante el MVP se detectaron dos riesgos:

- `Settings.jsx` llamaba a Supabase directamente para perfil.
- Algunos formularios de ingresos usaban `user.user_metadata.tax_rate` como valor por defecto.

Eso permite inconsistencias silenciosas: el usuario puede cambiar su IRPF en ajustes y aun asi ver formularios con un valor antiguo.

## Decision

`profiles.tax_rate` es la fuente canonica del IRPF habitual. Las lecturas y escrituras de perfil deben pasar por `src/hooks/useProfile.js`.

Las paginas y componentes no deben llamar a Supabase directamente para datos de perfil. Si hace falta un nuevo dato de perfil, se extiende `useProfile` y se mantiene el contrato de `loading`, `error` y `data`.

## Consequences

- Los formularios de ingresos de evento y proyecto usan el mismo origen de IRPF.
- Settings queda alineado con el resto de hooks de datos.
- Los bugs de perfil se pueden testear y corregir en un punto central.
- `auth.user_metadata` queda reservado para datos de auth, no para configuracion editable de producto.

## Alternatives Considered

- Leer `user_metadata` desde formularios: rapido, pero desincroniza ajustes y finanzas.
- Permitir llamadas directas desde paginas: menos codigo inicial, pero rompe el patron de hooks y complica RLS/debug.

## Related

- [[../context/data-finance-model-20260504]]
- [[../knowledge/PB-ZK-20260504-profile-409]]
- [[../issues/CACH-B0014]]
