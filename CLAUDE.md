# CLAUDE.md — CulturaApp

Archivo de contexto para Claude Code.

**OBLIGATORIO al inicio de cada conversación:**
1. Leer `.memory/MEMORY.md` y los archivos enlazados que sean relevantes.
2. Guardar proactivamente cualquier preferencia, decisión o contexto nuevo sin que el usuario lo pida.

**Fuente de verdad del proyecto:** `AGENTS.md` — contiene arquitectura, stack, modelo de datos, convenciones, flujo de agentes y estado del proyecto. Léelo completo antes de tocar cualquier archivo.

**Sistema de memoria:** `.memory/` — directorio en la raíz del repo (versionado en git). Preferencias, decisiones y contexto acumulado que persiste entre conversaciones y sesiones de agentes. `cultura-docs` es el único agente con permiso de escritura; Claude Code puede leer y escribir directamente.
