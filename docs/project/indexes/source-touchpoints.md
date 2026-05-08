---
schema_version: 2
kind: index
id: PB-SOURCE-TOUCHPOINTS
title: Source Touchpoints
lifecycle: active
created: 2026-05-08
updated: 2026-05-08
aliases:
  - Source Touchpoints
tags:
  - product-brain
  - index
  - source-map
generated: true
---
# Source Touchpoints

Mapa operativo para orientar agentes sin leer el Brain completo.

| Globs | Area | Componentes | Contexto relevante | Checks |
|---|---|---|---|---|
| src/pages/Work.jsx, src/pages/ProjectDetail.jsx, src/pages/EventDetail.jsx | frontend | work, projects, events | [[../context/ui-direction-v3-20260504]], [[../decisions/ADR-0001-project-event-finance-model]] | lint, build, responsive smoke |
| src/pages/Dashboard.jsx, src/hooks/useFinancialSummary.js | frontend/data | dashboard, finance | [[../decisions/ADR-0006-gross-cache-per-hour]], [[../context/data-finance-model-20260504]] | lint, build, finance regression |
| src/pages/Calendar*.jsx, src/components/*Calendar* | frontend | calendar, events, projects | [[../knowledge/PB-ZK-20260504-rbc-height]], [[../context/ux-mobile-guardrails-20260504]] | desktop/mobile visual check |
| src/hooks/**, supabase/migrations/** | data/security | supabase, finance, auth-onboarding | [[../process/supabase-db-access]], [[../decisions/ADR-0004-profile-data-source-and-hooks]] | lint, build, test:db when relevant |
| .opencode/**, .agents/skills/**, docs/agent-context-policy.md | brain | agents, product-brain | [[../process/WORKFLOW]], [[../indexes/issues-open.index]] | verify:agents, verify:skills, context:check |
| docs/project/**, scripts/brain/** | brain | product-brain, agents | [[../process/frontmatter-schema]], [[../decisions/ADR-0010-frontmatter-schema]] | pb:check, verify:brain, git diff --check |
