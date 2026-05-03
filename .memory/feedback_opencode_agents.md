---
name: Usar agentes OpenCode para implementación
description: En este proyecto usar npm run agents:run o agents:parallel, no sub-agentes internos de Claude
type: feedback
---
Para tareas de implementación, diagnóstico o revisión de código, usar siempre el flujo de OpenCode:

```bash
npm run agents:run -- "tarea concreta"
npm run agents:parallel -- --agents frontend,data "tarea"
```

No lanzar sub-agentes internos de Claude para trabajo que pueda hacer OpenCode.

**Why:** AGENTS.md lo especifica explícitamente. OpenCode usa su propio modelo (más barato en tokens de Claude Code) y los agentes del proyecto tienen contexto específico del dominio en `.opencode/agents/`.

**How to apply:** Siempre que el usuario pida implementar, arreglar, revisar o diagnosticar código del proyecto. Solo hacer trabajo directo si la tarea es tan trivial que el overhead de lanzar un agente no vale la pena.
