---
name: Branch protection en main — lección aprendida
description: Los agentes mergearon PRs con CI rojo porque no había branch protection. Ahora está activo.
type: feedback
---

Branch protection activado en `main` en GitHub (mayo 2026) después de que agentes mergearon PRs con CI fallando y el código llegó a Vercel sin pasar checks.

**Why:** Sin branch protection, GitHub permite mergear aunque el CI falle. Vercel despliega en cada push a main sin esperar CI. Resultado: código roto en producción.

**How to apply:** Si en el futuro hay que crear o revisar branch protection, los checks obligatorios son:
- Status check requerido: job `app` (lint + pb:check + test + build)
- No añadir `e2e` como requerido (solo corre en PRs, no en push directo)
- Bypass list vacía (o sin roles de agentes)
- Branches up to date before merging: activado

La causa recurrente del CI rojo ha sido doble: (1) variables sin usar dejadas por agentes (`no-unused-vars`), (2) archivos del Product Brain referenciados en BACKLOG/indexes pero no commiteados antes de mergear.
