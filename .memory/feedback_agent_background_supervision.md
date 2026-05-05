---
name: Supervisión de agentes OpenCode en background
description: Reglas para detectar y supervisar agentes opencode lanzados con npm run agents:run, evitar duplicados y no perder control
type: feedback
---

## Feedback — Supervisión de agentes OpenCode

Cuando se ejecuta `npm run agents:run`, OpenCode puede correr en background y escribir el output real en un archivo JSONL/transcript en lugar de mostrar progreso legible por stdout.

Esto puede hacer que parezca que el agente está bloqueado o vacío aunque siga trabajando.

**Regla operativa:**

- Antes de lanzar un segundo agente, comprobar si ya hay uno activo.
- Antes de lanzar `agents:run`, avisar al usuario si ya hay una ejecución activa reciente.
- Antes de matar un proceso, identificar cuál está progresando.
- Revisar el transcript/log de OpenCode antes de asumir fallo.
- Evitar agentes duplicados para la misma tarea.
- Si no hay feedback visible, consultar el log/transcript en vez de relanzar.
- El problema es de supervisión/output, no necesariamente del agente.

**Preferencia:**

Mejorar el flujo para que `agents:run` muestre checkpoints o tail del transcript en stdout, o añadir un comando claro tipo `agents:status` / `agents:logs`.

**Why:** Un agente duplicado llevó a matar el que hacía progreso y mantener el zombi, perdiendo control del flujo. El `.output` del task aparece vacío aunque el proceso esté activo porque la transcripción va al JSONL de opencode.

**How to apply:** Antes de relanzar, verificar con `ps aux | grep "agents:run\|opencode"` y revisar `~/.local/share/opencode/log/<timestamp>.log` para confirmar actividad real.
