---
name: AGENT_STATE.md — limpieza de secciones transitorias
description: Tras cada tarea completada, limpiar Eventos y Señales activas; no borrar Estado por agente
type: feedback
updated: 2026-05-05
---

**Regla actual (desde 2026-05-05):**
- Las secciones `## Senales activas` y `## Eventos` deben QUEDAR VACÍAS tras cada tarea completada
- El historial permanente vive en git y GitHub (commits, PRs, issues), no en este archivo
- Este archivo es solo una pizarra operativa transitoria

**Qué NO borrar:**
- La sección `## Estado por agente` con los 9 bloques de agentes (debe mantenerse siempre)

**Regla antigua (obsoleta):**
Antes se pensaba que los agentes no debían "resetear" el archivo (borrando todo), pero la práctica demostró que limpiar las secciones transitorias es correcto porque el historial ya vive en git/GitHub.
