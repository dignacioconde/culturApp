---
schema_version: 2
kind: prompt
id: PB-PROMPTS
title: Prompts
lifecycle: active
created: '2026-05-04'
updated: '2026-05-08'
aliases:
  - Prompts
tags:
  - product-brain
  - prompts
generated: false
---
# Prompts

Prompts reutilizables e históricos de Product Brain.

Load policy:
- Do not load this folder by default.
- Use active reusable prompts only when capturing or curating Product Brain.
- Historical prompts are not current instructions.
- Follow `docs/agent-context-policy.md` for context loading.

Prompts:
- `product-brain-capture.md` — Active reusable capture format for mobile/Product Brain input.
- `cach-b0019-operativa-supabase-brevo.md` — Active operations prompt for Supabase/Brevo transactional email handoff.
- `cach-0029-cerrar-huecos-b0016.md` — Historical task prompt; use only when investigating CACH-0029 or related past execution.
