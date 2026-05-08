---
name: product-brain-orient
description: Orientar agentes sobre Product Brain v2 sin cargar docs/project completo. Usar al empezar tareas de producto, issues, backlog, releases, agentes o documentación que necesiten contexto CACH. No usar como captura ni como migrador.
---

# Product Brain Orient

## Purpose

Obtener contexto minimo y accionable del Product Brain v2 para que un agente pueda ejecutar una tarea sin leer backlog completo, releases cerradas ni historico.

## When to use this skill

- La tarea menciona Product Brain, CACH, backlog, release, ADR, `pb:*`, agentes o skills.
- Hay una issue CACH relacionada y necesitas saber parent, release, componentes o checks.
- Un agente necesita orientarse antes de planificar, implementar, revisar o verificar.

## When not to use this skill

- No usar para capturar ideas: usa `product-brain-capture`.
- No usar para escribir o migrar todo el Brain.
- No usar para tareas pequeñas puramente de app que ya tienen issue y contexto suficiente.

## Inputs to inspect

- `AGENTS.md`
- `docs/agent-context-policy.md`
- `.memory/MEMORY.md`
- `npm run pb:orient -- --json`
- La issue `docs/project/issues/CACH-*.md` si está citada.
- `docs/project/indexes/source-touchpoints.md` si la tarea toca código.

## Procedure

1. Ejecuta `npm run pb:orient -- --json`.
2. Identifica si hay issue, parent, release, componentes o source-touchpoints relevantes.
3. Abre solo esos archivos concretos.
4. Si una issue está `ready`, puede ejecutarse con la issue, su parent si existe y los touchpoints relevantes.
5. Si una issue está `done`, usa `npm run pb:close-check -- CACH-XXXX` solo cuando estés cerrando o verificando cierre.
6. Si una issue va a pasar a `ready`, usa `npm run pb:ready-check -- CACH-XXXX`.
7. No edites `DIGEST.md` a mano; se regenera con `npm run pb:digest`.

## Output format

Devuelve:

- Contexto leído: archivos/secciones consultados.
- Product Brain leído: salida de orient, issue, parent, release o índice.
- Product Brain actualizado: rutas o `no aplica`.
- Validación PB: checks ejecutados o `no aplica`.
- Feedback/Memory: memoria actualizada o `Memoria: no aplica`.

## Severity / priority model

- CRITICAL: cargar todo `docs/project/`, leer secretos o mutar vault/producción sin confirmación.
- HIGH: crear issue v1 con `type/status`, cerrar issue sin `pb:close-check`, o ignorar parent/release.
- MEDIUM: leer backlog completo por defecto, omitir componentes o no declarar PB actualizado.
- LOW: wording, orden de salida o enlaces mejorables.

## Quality bar

- La orientación tarda poco y devuelve pocas rutas.
- La issue ejecutable se entiende sin leer backlog completo.
- No hay `type/status` top-level en nuevos documentos.
- Los agentes declaran lectura, actualización y validación PB al cerrar.

## Common mistakes to avoid

- Abrir `docs/project/` entero.
- Usar `DIGEST.md` como fuente editable.
- Confundir `lifecycle` del documento con `issue_workflow` de una issue.
- Usar `related` como jerarquía; la jerarquía vive en `parent`.
- Crear `size: l`; si parece grande, partir en slices.

## Safety notes

No ejecutar `pb:push`, `pb:pull`, acciones remotas, GitHub, Supabase o Vercel desde esta skill sin petición explícita y confirmación cuando aplique.
