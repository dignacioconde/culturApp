---
name: brain-orient
description: Orientación rápida en el Product Brain de CulturaApp. Leer DIGEST.md y devolver un briefing estructurado del estado actual: release, plan, tablero y próxima acción. Usar cuando el usuario diga "¿qué hay en el cerebro?", "oriéntame", "lee el brain", "dame contexto del proyecto", o cuando un agente necesite orientarse antes de empezar una tarea.
---

# Brain Orient

## Purpose

Proporciona un briefing compacto del estado actual del Product Brain de CulturaApp en una sola pasada. Reemplaza leer manualmente CURRENT_RELEASE + CURRENT_PLAN + BACKLOG + START_HERE en sesiones donde solo se necesita orientación rápida.

## When to use this skill

- El usuario pregunta por el estado actual del proyecto o del cerebro.
- Un agente necesita contexto antes de empezar una tarea y no tiene un CACH-ID específico.
- El usuario dice "oriéntame", "¿qué hay pendiente?", "lee el brain", "dame el estado".
- Se inicia una sesión de trabajo sin tarea concreta todavía.

## When not to use this skill

- Hay un CACH-ID concreto — en ese caso leer directamente `docs/project/issues/CACH-XXXX.md`.
- La tarea es de implementación directa — en ese caso usar `cultura-issue-launch`.
- Se necesita revisión de código — usar `cultura-code-review`.

## Procedure

1. Leer `docs/project/DIGEST.md`.
   - Si no existe, ejecutar `npm run pb:digest` para generarlo primero.
2. Si el usuario mencionó un CACH-ID concreto, leer también `docs/project/issues/<CACH-ID>.md`.
3. Producir un briefing con las secciones siguientes (sin copiar literalmente el DIGEST, sintetizar):

```
## Orientación — <fecha>

**Release activa:** <valor>
**Foco del plan:** <1 frase>

**Tablero:**
- Inbox: <IDs o "vacío">
- In progress: <IDs o "vacío">
- Review: <IDs o "vacío">
- Próximas p1: <IDs del backlog>

**Próxima acción:** <del DIGEST>

**Issues activas:** <lista compacta con ID + título solo para no-done/no-wontfix>
```

4. Si el DIGEST tiene más de 7 días de antigüedad (campo `updated`), avisar: "El DIGEST tiene X días — considera regenerarlo con `npm run pb:digest`."

## Output format

Briefing en texto plano, sin código blocks innecesarios, en español. Máximo 300 palabras. Si el usuario necesita más detalle de un área concreta, indicar qué fichero leer (ej. `docs/project/plans/CURRENT_PLAN.md`).

## Quality bar

- No inventar estado. Solo reportar lo que está en DIGEST.md y los ficheros leídos.
- No reemplazar la lectura de la issue CACH cuando hay una tarea concreta en curso.
- Si el DIGEST no existe y `pb:digest` falla, leer directamente CURRENT_RELEASE.md + CURRENT_PLAN.md + BACKLOG.md como fallback.
