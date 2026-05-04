---
name: cultura-issue-launch
description: Lanzar una tarea de CulturaApp convirtiendo un prompt rough en una issue de GitHub estructurada, creando rama desde main y arrancando agentes con el modelo barato. Usar cuando el usuario diga "lanza esto", "crea una issue para", "quiero que los agentes hagan", "implementa X" o similar. No usar para revisiones, auditorías ni preguntas de contexto puro.
---

# Cultura Issue Launch

## Purpose

Convierte el prompt del usuario en una issue de GitHub estructurada, prepara una rama de tarea desde `main` y lanza los agentes de implementación sin que el usuario tenga que formatear nada manualmente. El paso de planificación lo ejecuta el agente `cultura-planner` con el modelo barato (Kimi), no Claude Code.

## When to use this skill

- El usuario pide implementar una funcionalidad, fix o mejora concreta.
- El usuario dice "lanza", "crea issue", "que los agentes hagan X", "quiero que se implemente".
- Hay una tarea clara pero sin estructura de issue todavía.

## When not to use this skill

- El usuario solo quiere una revisión de código (usa `cultura-code-review`).
- La tarea ya tiene issue abierta con estructura completa — en ese caso crear o reutilizar una rama desde `main` para esa issue y usar `agents:run` con la URL de la issue.
- El usuario quiere solo consultar contexto o hacer preguntas.
- La tarea afecta secretos, producción remota o es destructiva — confirmar antes de lanzar.

## Inputs to inspect

Ninguno. No investigues el repo antes de lanzar. El agente `cultura-planner` lee `AGENTS.md` y la memoria relevante por sí mismo.

## Procedure

1. Extrae el prompt en bruto del usuario tal como lo escribió. No lo reformatees ni lo amplíes.
2. Ejecuta:
   ```bash
   npm run agents:plan -- "<prompt del usuario>"
   ```
3. `cultura-planner` (Kimi, modelo barato) hará:
   - Clasificar el dominio de la tarea
   - Cargar solo la memoria relevante para ese dominio
   - Generar la issue estructurada
   - Crear la issue en GitHub con `gh`
   - Crear una rama de tarea desde `main` actualizado
   - Lanzar `npm run agents:run` con el objetivo, la URL y el contrato de PR a `main`
4. Informa al usuario del resultado: URL de la issue creada, rama creada y confirmación de que los agentes arrancaron.

## Output format

```
Issue creada: <URL>
Rama: <branch>
Agentes lanzados con: <OBJETIVO resumido>
```

Si `gh` no está disponible, `cultura-planner` mostrará la issue generada para creación manual.

## Quality bar

- El prompt se pasa sin modificar — no hay que "mejorar" el input, eso lo hace el planificador.
- No se hace ningún trabajo de código ni exploración antes de llamar al script.
- El resultado debe terminar en PR a `main` y merge cuando las verificaciones pasen, salvo bloqueo o instrucción explícita de dejar la PR abierta.
- Si el cambio debe verse en la app publicada, un Vercel Preview Deployment no es suficiente: hay que verificar producción después del merge.
- Si el usuario da un prompt de menos de 5 palabras sin verbo claro, pedir una aclaración mínima antes de lanzar.

## Common mistakes to avoid

- Explorar el repo antes de lanzar — el planificador ya lo hace.
- Reformatear el prompt del usuario antes de pasarlo — perderías la señal de dominio.
- Lanzar `agents:run` directamente sin pasar por `agents:plan` cuando no hay issue estructurada.
- Crear la issue manualmente con Claude Code en lugar de dejar que `cultura-planner` lo haga.

## Safety notes

- No ejecutar si la tarea implica cambios remotos en Supabase, Vercel o credenciales sin confirmación explícita del usuario.
- No pasar secretos ni valores de `.env.local` en el prompt.
- `agents:plan` crea rama desde `main` y lanza `agents:run` automáticamente al final — confirmar con el usuario si hay duda sobre si debe arrancar inmediatamente.
