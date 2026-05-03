---
name: Memoria centralizada en .memory/
description: La memoria persistente se movió de la ruta de Claude a .memory/ en la raíz del repo para que sea accesible a todos los agentes
type: project
---
La memoria persistente del proyecto se centralizó el 2026-05-03 en `.memory/` (raíz del repo, versionada en git).

**Why:** La ruta antigua (`.claude/projects/-Users-diconde-Documents-GitHub-culturApp/memory/`) estaba fuera del repo, era solo accesible a Claude Code, y los agentes OpenCode tenían que hardcodear un path frágil. Ahora todos los agentes leen desde `.memory/MEMORY.md` con una ruta relativa al repo.

**How to apply:** Leer siempre `.memory/MEMORY.md` al inicio. No referenciar jamás la ruta antigua `.claude/projects/...`. `CLAUDE.md` es una redirección corta hacia `AGENTS.md`; la fuente de verdad del proyecto es `AGENTS.md`.
