---
name: cultura-learning-loop
description: Aprender de una conversación, bug, incidente, revisión o fallo de proceso en CulturaApp; usar cuando el usuario pida "aprende de esto", "reflexiona con agentes", "haz retrospectiva/postmortem", "revisa la conversación y aplica correcciones" o quiera convertir una lección en cambios de proceso, memoria, tests, docs o pequeñas correcciones. No usar para implementación normal sin petición de aprendizaje ni para mutaciones remotas/destructivas sin confirmación.
---

# Cultura Learning Loop

## Purpose

Convertir una conversación o incidente reciente en aprendizaje operativo para CulturaApp. La skill busca causa raíz, separa hechos de suposiciones, contrasta con agentes cuando procede, y aplica correcciones pequeñas en memoria, Product Brain, proceso, tests o documentación.

El objetivo no es escribir un run log. Es dejar guardrails útiles para que el mismo fallo no se repita.

## When to use this skill

- El usuario pide "aprende de esto", "aprende de la conversación", "reflexiona con agentes" o "revisa la conversación".
- El usuario pide una retrospectiva, postmortem, análisis de causa raíz o lecciones aprendidas.
- Una tarea acaba de descubrir un fallo de proceso, verificación, memoria, release, Supabase, seguridad, agentes o documentación.
- El usuario quiere "aplicar correcciones" tras una conversación, revisión o incidente.

## When not to use this skill

- No usar para implementar una feature normal si el usuario no pide aprendizaje o retrospectiva.
- No usar para guardar histórico operativo, logs, ramas, commits o cronologías completas en `.memory/`.
- No usar para reemplazar una code review normal; usa `cultura-code-review` si lo pedido es revisar un diff.
- No usar para mutaciones de Supabase, Vercel, GitHub, producción o acciones destructivas sin confirmación explícita.
- No usar para persistir secretos, datos personales sensibles, `.env.local`, tokens o credenciales.

## Inputs to inspect

- Conversación reciente y petición exacta del usuario.
- `AGENTS.md`, `docs/agent-context-policy.md`, `.memory/MEMORY.md` y `.memory/core.md`.
- Skills relacionadas según dominio: `cultura-agent-orchestration`, `memory-protocol`, `product-brain-orient`, `cultura-data-finance-review`, `cultura-testing-release-check`, `cultura-security-privacy-review`, `cultura-frontend-review` o `cultura-code-review`.
- Diff actual con `git status --short` y `git diff` si ya hay cambios.
- Issue/release/Product Brain relacionado si el incidente toca planificación, cierre o criterios.
- Logs, comandos, rutas, migraciones, tests o archivos afectados, solo si son relevantes.

## Procedure

1. Clasifica el aprendizaje:
   - `incidente`: algo falló en producción, datos, seguridad, release o verificación.
   - `proceso`: una checklist, skill, agente o documento permitió cerrar algo mal.
   - `producto`: una decisión o expectativa de usuario quedó ambigua.
   - `técnico`: bug, test gap, migración, contrato de datos o integración.
   - `colaboración`: preferencia durable del usuario o forma de trabajo.
2. Carga solo contexto mínimo: memoria índice, regla canónica y archivos directamente relacionados. No leas histórico amplio por defecto.
3. Reconstruye hechos verificables: qué se esperaba, qué ocurrió, cómo se detectó, qué evidencia existe y qué quedó asumido sin comprobar.
4. Si el usuario pidió agentes, usa `cultura-agent-orchestration` y delega investigaciones read-only con preguntas distintas. Si no pidió agentes, trabaja directo salvo que la conversación actual autorice subagentes.
5. Busca la brecha real:
   - aceptación marcada sin verificación real;
   - mock que sustituyó a smoke real;
   - migración local no aplicada;
   - memoria/proceso desactualizado;
   - issue/release con estado contradictorio;
   - test o guard faltante;
   - instrucciones ambiguas entre docs.
6. Decide el tipo de corrección más pequeño que evita repetición:
   - actualizar `.memory/` con una lección reusable;
   - actualizar Product Brain/process si la regla debe ser canónica;
   - crear o ajustar un test/check si puede automatizarse;
   - corregir una skill si el flujo pertenece a agentes;
   - proponer una issue CACH si el arreglo es grande;
   - declarar `Memoria: no aplica` si no hay aprendizaje durable.
7. Antes de editar, anuncia qué vas a cambiar y por qué.
8. Aplica cambios acotados. No mezcles refactors ni limpieza no relacionada.
9. Verifica según el tipo de cambio:
   - Product Brain: `npm run pb:check` y, si toca docs generados/proceso, `npm run pb:guard`.
   - Skills: `npm run verify:skills`, `quick_validate.py` si aplica, y `git diff --check`.
   - Memoria: revisar legibilidad, privacidad y punteros.
   - Código/tests: comandos relevantes al blast radius.
10. Cierra con síntesis honesta: causa raíz, correcciones aplicadas, verificaciones y riesgos restantes.

## Output format

Para análisis sin edición:

- Causa raíz: una frase clara.
- Evidencia: archivos, logs, líneas o comandos que sostienen la conclusión.
- Brecha: qué permitió que pasara.
- Correcciones recomendadas: ordenadas por impacto.
- Memoria/Product Brain: actualizar / no aplica.

Para análisis con edición:

- Agentes: roles usados o `no aplica`.
- Causa raíz: resumen.
- Cambios aplicados: archivos y propósito.
- Verificación: comandos y resultado.
- Aprendizaje durable: dónde quedó guardado.
- Pendiente: riesgos o follow-ups reales.

## Severity / priority model

- CRITICAL: exposición de datos, pérdida de datos, producción rota, RLS/seguridad rota, secreto filtrado o acción irreversible.
- HIGH: release marcada como lista sin funcionalidad real, migración remota pendiente, smoke falso, estado Product Brain engañoso o bug recurrente sin guardrail.
- MEDIUM: gap de test, checklist débil, memoria/proceso ambiguo, documentación stale o agente mal enrutado.
- LOW: wording, catálogo, salida final incompleta o mejora de ergonomía.

## Quality bar

- Distingue hechos, inferencias y decisiones.
- No convierte la memoria en diario; guarda solo lecciones reutilizables.
- La corrección vive en la fuente adecuada: código, test, Product Brain, skill, memoria o issue.
- Si usa agentes, sus preguntas son concretas, read-only y no duplicadas.
- Todo cambio queda verificado con el comando más cercano al riesgo.
- La respuesta final incluye qué se aprendió y cómo se impedirá la repetición.

## Common mistakes to avoid

- Culpar al síntoma visible en lugar del gate que falló.
- Marcar "aprendido" sin cambiar nada persistente cuando sí hay una regla reusable.
- Guardar cronologías, logs o ramas en `.memory/`.
- Usar subagentes sin autorización explícita del usuario o con prompts vagos.
- Tratar un smoke mockeado como validación de producción.
- Cerrar una release como funcional si depende de una migración remota pendiente.
- Tocar Supabase remoto, Vercel o GitHub sin confirmación explícita.

## Safety notes

No incluir secretos, credenciales, `.env.local`, tokens, datos personales reales ni información sensible en memoria, prompts a agentes o documentos. Las mutaciones remotas y destructivas requieren confirmación explícita y SQL/comandos exactos antes de ejecutar. Las lecciones deben ser auditables en Markdown o verificables en tests/checks.

## Product Brain v2 Contract

When this workflow touches Product Brain, use flat v2 frontmatter: `schema_version: 2`, `kind`, `lifecycle`, and domain fields such as `issue_workflow`, `work_type`, `work_level`, `size`, `components`, `parent`, `release`, and `theme`. Do not create new `type/status` top-level Product Brain documents.

Prefer `npm run pb:orient -- --json` before reading Product Brain detail. Read only the related issue, parent, release, ADR or source-touchpoint. Generated files such as `DIGEST.md` and generated indexes are regenerated by scripts, not edited manually.

Close every Product Brain-aware response with: `Contexto leído`, `Product Brain leído`, `Product Brain actualizado`, `Validación PB`, and `Feedback/Memory`.
