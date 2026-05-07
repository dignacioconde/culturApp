---
id: CACH-B0018
title: Adaptador Codex-native para perfiles Cultura
type: chore
status: done
cycle: beta-1
release: RELEASE-0.1.0-beta.9
priority: p2
estimate: s
area: infra
created_at: 2026-05-07
updated_at: 2026-05-07
aliases:
  - CACH-B0018
tags:
  - product-brain
  - issue
  - beta
  - agents
  - tooling
---

# CACH-B0018 — Adaptador Codex-native para perfiles Cultura

## Summary

Documentar cómo Codex puede lanzar subagentes nativos reutilizando perfiles de `.opencode/agents/*.md` como contexto de rol, sin ejecutar OpenCode salvo petición explícita.

## Context

Durante beta 9 se usaron agentes Codex para hacer challenge de decisiones de tooling y Supabase. El flujo funciona, pero necesita trazabilidad y reglas claras para no confundir subagentes Codex con agentes OpenCode ni asumir capacidades MCP de otros entornos.

## Problem

Los perfiles OpenCode contienen rol, criterio y restricciones de trabajo útiles, pero no son controles de permisos dentro de Codex. Si el flujo queda implícito, los agentes pueden cargar contexto de más, ejecutar OpenCode sin necesidad o asumir que tienen MCP Supabase cuando la sesión Codex no lo expone.

## Proposed Solution

- Documentar el modo Codex-native como uso de subagentes nativos con perfiles Cultura como contexto de rol.
- Mantener OpenCode CLI solo para cuando el usuario lo pida explícitamente o falten subagentes nativos.
- Aclarar que `AGENTS.md` y `docs/agent-context-policy.md` siguen mandando.
- Cargar solo el perfil `.opencode/agents/<role>.md` relevante, no todos los perfiles.
- Tratar frontmatter OpenCode (`mode`, `model`, `permission`) como metadata de OpenCode, no como enforcement en Codex.
- Mantener Supabase remoto y MCP bajo confirmación explícita, con fallback SQL Editor cuando Codex no tenga MCP.

## Acceptance Criteria

- [x] `.opencode/README.md` documenta el adaptador Codex-native de forma corta.
- [x] `.agents/skills/cultura-agent-orchestration/SKILL.md` incluye el modo `Codex-native`.
- [x] No se crea nueva skill portable para este adaptador.
- [x] `AGENTS.md` queda intacto salvo necesidad mínima.
- [x] `.memory/reference_supabase_mcp.md` no incluye dato personal innecesario y apunta al documento canónico.
- [x] La release beta 9, backlog e índices incluyen `CACH-B0018`.
- [x] `npm run context:check`, `npm run pb:check` y `git diff --check` pasan.

## Validation

- Ejecutado `npm run context:check`: OK sin errores; mantiene warnings conocidos de broad-loading.
- Ejecutado `npm run pb:check`: OK.
- Ejecutado `git diff --check`: OK.
- Smoke Codex-native con perfiles `cultura-data` y `cultura-security`: OK, sin hallazgos bloqueantes.
- Mergeada a `main` por PR #88. Incluida en `v0.1.0-beta.9`.

## Out of Scope

- Configurar Supabase MCP.
- Crear un servidor MCP propio.
- Ejecutar OpenCode para validar este flujo.
- Convertir perfiles OpenCode en skills portables.

## Related

- [[CACH-B0017|CACH-B0017]]
- [[../process/supabase-db-access|Acceso directo seguro a Supabase]]
