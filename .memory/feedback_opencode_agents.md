---
name: Usar flujo obligatorio de issues y planner para implementación
description: Ante tareas de implementación, usar siempre issue + agents:plan + agentes. Excepción solo si el usuario lo dice explícitamente o es pregunta/revisión sin implementación.
type: feedback
updated: 2026-05-04
---

## Flujo obligatorio para implementación

Ante cualquier tarea de implementacion (nueva funcionalidad, fix, mejora), Codex y Claude Code deben seguir este flujo:

1. **Crear o localizar una issue** en GitHub con contexto, alcance y criterios de aceptación.
2. **Ejecutar `npm run agents:plan -- "prompt"`** para que el planner (`cultura-planner`) genere la issue estructurada (si no existe) y lance los agentes de implementación automáticamente.
3. **Ejecutar los agentes** con ownership claro y verificación obligatoria.

### Excepciones

- Solo saltar este flujo si el usuario lo dice **explícitamente** (p.ej. "hazlo tú directamente", "no necesito issue").
- Solo saltar este flujo si la tarea es **pura pregunta, revisión o consulta** sin implementación.

### Fallback ante bloqueo técnico del planner

Si `agents:plan` falla por bloqueo técnico (no por decisión del usuario):
- Declarar el bloqueo explícitamente.
- Usar fallback: crear issue estructurada manualmente + ejecutar `agents:run` directamente.
- **NO** derivar a implementación manual silenciosa sin issue.

### Por qué es obligatorio

- Las issues estructuradas dan contexto, ownership y criterios de aceptación a los agentes.
- El planner (`cultura-planner`) usa modelo barato (Kimi) y carga solo memoria relevante.
- Evita trabajo duplicado y ensure trazabilidad entre problema → solución → PR.
- Si el planner no está disponible o falla, el fallback mantiene la regla: issue + agentes, nunca implementación directa sin issue.

**How to apply:** Siempre que el usuario pida implementar algo. Ejecutar `npm run agents:plan -- "prompt"` en lugar de `agents:run` directamente cuando no hay issue estructurada. Ver skill `cultura-issue-launch` para más detalles.

**Excepciones:** Solo si el usuario dice explícitamente "hazlo tú", "sin issue", o si es una pregunta/revisión sin implementación.
