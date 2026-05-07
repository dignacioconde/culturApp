---
name: cultura-agent-orchestration
description: "Orquestar agentes para tareas de CulturaApp desde Codex, Claude Code u OpenCode: decidir si usar subagentes nativos, agentes OpenCode, exploracion paralela, ownership de escritura y verificacion. Usar cuando el usuario pida agentes, subagentes, Codex agents, Claude agents, OpenCode agents, revisar un plan con agentes o acelerar una tarea con delegacion. No usar para tareas triviales ni para implementar directamente sin necesidad de delegacion."
---

# Cultura Agent Orchestration

## Purpose

Acelera decisiones de delegacion en CulturaApp sin obligar a pasar siempre por OpenCode. La skill ayuda a elegir entre subagentes nativos del entorno actual, agentes OpenCode y trabajo local directo, manteniendo trazabilidad, ownership y verificacion.

No sustituye las skills de dominio. Si la tarea es frontend, datos, seguridad, testing, release o review, combina esta skill con la skill especializada correspondiente.

## When to use this skill

- El usuario pide ejecutar, coordinar o lanzar agentes.
- El usuario menciona Codex agents, Claude agents, OpenCode agents, subagentes, agentes en paralelo o "revisa el plan con agentes".
- Una tarea de Beta/release necesita exploracion paralela antes de editar.
- Hay trabajo de implementacion suficientemente grande para dividir por ownership de archivos.
- Se quiere acelerar una revision usando agentes sin arrancar OpenCode.

## When not to use this skill

- No usar para cambios triviales que puede resolver un unico agente local.
- No usar para saltarse `cultura-issue-launch` cuando el usuario pide lanzar una tarea nueva sin issue.
- No usar para reemplazar `cultura-release-task-flow` cuando el trabajo es integrar una tarea terminada en una beta activa.
- No usar para pedir a agentes que manejen secretos, `.env.local`, Supabase remoto, Vercel produccion o acciones destructivas sin confirmacion explicita.

## Inputs to inspect

- `git status --short --branch`
- `AGENTS.md`
- `docs/agent-context-policy.md`
- `.memory/MEMORY.md`
- `.memory/topics/agent-workflows.md`
- `.opencode/README.md` solo si el usuario pide OpenCode o si hacen falta esos agentes concretos.
- Issue `docs/project/issues/CACH-*.md` y release activa si la tarea pertenece a una release.
- Diff actual si se revisa o verifica trabajo ya hecho.

## Procedure

1. Clasifica la peticion:
   - `directa`: tarea pequena o de bajo riesgo; trabaja localmente.
   - `Codex-native`: usa subagentes nativos de Codex/Claude cuando el usuario pida agentes en el entorno actual.
   - `revision paralela`: varias preguntas independientes; usa subagentes nativos si el entorno los ofrece.
   - `implementacion dividida`: solo delegar escritura si hay ownership disjunto claro.
   - `OpenCode solicitado`: usar `npm run agents:plan`, `npm run agents:run`, `npm run agents:parallel` o `npm run agents:verify`.
2. Antes de delegar, define el trabajo local inmediato. No mandes a un agente el bloqueo critico si tu siguiente paso depende de su respuesta.
3. Para subagentes nativos de Codex/Claude:
   - Usalos solo cuando el usuario haya pedido agentes, delegacion o trabajo paralelo.
   - Si necesitas un perfil Cultura, carga solo el `.opencode/agents/<rol>.md` relevante y pasalo como contexto de rol; no cargues todos los perfiles.
   - Trata el frontmatter de OpenCode (`mode`, `model`, `permission`) como metadata de OpenCode, no como permisos reales del subagente nativo.
   - Para challenge o revision, usa modo read-only: sin ediciones, sin estado compartido y sin operaciones remotas. Si el perfil menciona `.opencode/AGENT_STATE.md`, esa instruccion aplica solo a OpenCode.
   - Da prompts concretos, autocontenidos y con salida esperada.
   - Para exploracion, pide hallazgos con archivos/lineas y nivel de confianza.
   - Para escritura, asigna ownership disjunto por archivos o modulos y recuerda que no deben revertir cambios ajenos.
   - Si el entorno no ofrece subagentes nativos, trabaja directo o usa OpenCode solo cuando el usuario lo haya pedido o encaje como fallback explicito.
4. Para OpenCode:
   - Si no hay issue estructurada y el usuario pide lanzar implementacion, usa `npm run agents:plan -- "<prompt>"`.
   - Si ya hay issue/rama/contexto, usa `npm run agents:run -- "<tarea>"`.
   - Para revision paralela read-only, usa `npm run agents:parallel -- --agents <lista> "<tarea>"`.
   - Para cierre, usa `npm run agents:verify -- "<contexto>"`.
5. Siempre coordina por dominio:
   - UI, rutas, formularios, calendarios, responsive: frontend/UX.
   - Datos, hooks, Supabase, finanzas: data.
   - Auth, RLS, secretos, privacidad: security.
   - Checks, release readiness, regression matrix: testing.
   - Docs, Product Brain, memoria, skills: docs/release.
6. Integra resultados:
   - Contrasta recomendaciones entre agentes.
   - Decide y edita localmente o integra parches sin pisar cambios ajenos.
   - Ejecuta verificaciones acordes al cambio.
7. Cierre:
   - Resume agentes usados, hallazgos incorporados, cambios, verificaciones y riesgos.
   - Antes de PR, declarar `Memoria: actualizada` o `Memoria: no aplica`.

## Output format

```
Modo: directo / Codex-native / subagentes nativos / OpenCode / mixto
Agentes: <roles usados o "no aplica">
Ownership: <archivos/modulos si hubo escritura>
Resultado: <decision o cambios integrados>
Verificacion: <comandos/checks>
Memoria: actualizada / no aplica
Pendiente: <bloqueos reales o "nada">
```

## Severity / priority model

- CRITICAL: delegacion con secretos, acciones destructivas, force push, produccion o Supabase remoto sin confirmacion.
- HIGH: agentes escribiendo sobre los mismos archivos sin ownership, o trabajo fuera de scope de release.
- MEDIUM: prompts vagos, salida no accionable, verificacion insuficiente o resultados no integrados.
- LOW: uso de OpenCode cuando bastaban subagentes nativos, wording o formato de cierre.

## Quality bar

- La delegacion reduce riesgo o tiempo de forma concreta.
- Cada agente tiene una pregunta o ownership claro.
- Los perfiles OpenCode reutilizados desde Codex aportan rol y criterio, no enforcement de permisos.
- No hay duplicacion de trabajo entre agente principal y subagentes.
- Las recomendaciones se integran en una decision final, no quedan como opiniones sueltas.
- La verificacion corresponde al blast radius real.

## Common mistakes to avoid

- Lanzar agentes por reflejo cuando la tarea es pequena.
- Usar OpenCode aunque el usuario pidiera agentes desde Codex o Claude.
- Llamar "agente OpenCode" a un subagente Codex que solo reutiliza su perfil de rol.
- Asumir que Codex tiene el MCP o permisos de Claude/OpenCode.
- Pedir "revisa todo" sin ruta, scope, diff, criterio o salida.
- Delegar escritura paralela sin ownership disjunto.
- Esperar a subagentes mientras hay trabajo local independiente que puede avanzar.
- Guardar run logs o decisiones efimeras en `.memory/`.

## Safety notes

No incluir secretos, valores de `.env.local`, tokens, datos personales reales ni credenciales en prompts a agentes. No ejecutar acciones remotas, destructivas, de produccion, Supabase o Vercel sin confirmacion explicita. Si el entorno no ofrece subagentes nativos, usar OpenCode solo cuando encaje con la peticion o explicar el fallback.
