---
schema_version: 2
kind: inbox
id: PB-INBOX-20260506-105949
title: Mejoras infraestructura agentes OpenCode 2026-05-06
lifecycle: active
created: '2026-05-06'
updated: '2026-05-08'
aliases:
  - Mejoras infraestructura agentes OpenCode 2026-05-06
tags:
  - product-brain
  - inbox
  - agentes
  - infraestructura
  - memoria
generated: false
capture_intent: inbox
---
# Mejoras infraestructura agentes OpenCode 2026-05-06

Sesión 2026-05-06: diagnóstico y fixes de agentes OpenCode. (1) Timeout 45min en run-agent.mjs, 30min en run-parallel-agents.mjs via AGENT_TIMEOUT_MS. (2) .opencode/runs/current.json actualizado en cada checkpoint con status/lastLines/elapsedMin — legible desde Claude Code con Read. (3) Sección 'Contexto mínimo por agente' añadida al final de AGENTS.md: bloques de 15-20 líneas por subagente para evitar leer 810 líneas completas. (4) Routing de memoria formal en cultura-frontend.md, cultura-data.md, cultura-release.md, cultura-docs.md: tabla explícita de si-toca-X-carga-.memory/Y. (5) Nueva skill memory-orient: briefing de memoria task-scoped, lee solo archivos relevantes según keywords de la tarea, disponible como /memory-orient. Causa raíz ejecuciones 2-3h: minimax-m2.5-free con rate limits + AGENTS.md completo por agente sin timeout.
