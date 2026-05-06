---
name: cultura-release-task-flow
description: "Acelerar tareas de CulturaApp que deben entrar en una release beta activa: detectar release, crear o actualizar issue CACH, enlazar Product Brain, validar, integrar rama de tarea por squash y preparar/push de release. Usar cuando el usuario diga 'mételo en beta', 'rama beta', 'esta tarea está terminada', 'crear nueva tarea para esta documentación', 'integrar en la release' o similar. No usar para implementación normal de app sin release activa ni para cambios remotos/destructivos sin confirmación."
---

# Cultura Release Task Flow

## Purpose

Reduce la latencia del flujo operativo de releases beta: decidir rápido si el trabajo pertenece a la release activa, crear o ajustar la trazabilidad mínima en Product Brain, validar coherencia y dejar la rama `release/*` construida con commits claros.

La skill prioriza comandos e inspección mínima. No sustituye una revisión técnica ni una implementación de producto.

## When to use this skill

- El usuario pide meter una o varias tareas en la beta actual.
- El usuario dice que una tarea `CACH-*` está terminada y falta integrarla en la rama de release.
- Hay documentación nueva que necesita issue trazable y asociación a `RELEASE-*`.
- Hay que consolidar una rama de tarea local en `release/<version>` mediante squash.
- Se trabaja sobre `docs/project/`, `.memory/`, `.agents/skills/` o proceso de release.

## When not to use this skill

- No usar para lanzar una feature nueva desde cero con agentes: usar `cultura-issue-launch`.
- No usar para code review: usar `cultura-code-review`.
- No usar para cambios de Supabase, secretos, producción o credenciales sin confirmación explícita.
- No crear una release nueva si no existe release activa salvo que el usuario lo pida.
- No empujar a remoto si el usuario solo pidió preparar cambios locales.

## Inputs to inspect

- `git status --short --branch`
- `.memory/MEMORY.md`
- `.memory/topics/agent-workflows.md`
- `docs/project/START_HERE.md`
- `docs/project/releases/CURRENT_RELEASE.md`
- La issue `docs/project/issues/CACH-*.md` relacionada, si existe.
- `docs/project/backlog/BACKLOG.md`
- `docs/project/indexes/issues.index.md`
- `docs/project/releases/RELEASE-*.md` de la release activa.

Solo leer otros archivos si aparecen en el diff o son necesarios para resolver conflictos.

## Procedure

1. Orientar en paralelo:
   - `git status --short --branch`
   - `sed -n '1,220p' docs/project/releases/CURRENT_RELEASE.md`
   - `sed -n '1,220p' .memory/topics/agent-workflows.md`
2. Determinar:
   - release activa (`release_branch`)
   - rama actual
   - issue existente o siguiente ID `CACH-XXXX`
   - si el trabajo pertenece explícitamente al scope de release
3. Si falta issue:
   - crear `docs/project/issues/CACH-XXXX.md`
   - `status: review` si el trabajo ya está hecho; `in-progress` si todavía se está editando
   - `release: RELEASE-...`
   - criterios de aceptación ya marcados solo si están verificados por diff/contexto
4. Actualizar trazabilidad mínima:
   - `docs/project/releases/CURRENT_RELEASE.md`
   - release activa en `docs/project/releases/`
   - `docs/project/backlog/BACKLOG.md`
   - `docs/project/indexes/issues.index.md`
   - índices adicionales solo si `npm run pb:check` lo exige o si ya formaban parte del cambio
5. Validar antes de integrar:
   - `npm run pb:check` si toca `docs/project/`
   - `git diff --check`
6. Commit en rama de tarea si hay cambios sin commit:
   - formato: `docs(CACH-XXXX): resumen` o `docs(CACH-XXXX+CACH-YYYY): resumen`
   - no añadir coautoría de IA
7. Integrar en release:
   - cambiar a la rama `release/<version>`
   - hacer `git merge --squash <rama-tarea>`
   - resolver conflictos conservando el estado más avanzado de la release y añadiendo el nuevo scope
   - repetir `npm run pb:check` y `git diff --check`
   - commitear con formato `docs(CACH-XXXX+CACH-YYYY): prepare <version> release docs`
8. Push:
   - si el usuario pidió que quede en la rama beta/remota o dijo "meter en beta", empujar `release/<version>` a `origin`
   - si no, dejar local y reportar comando sugerido
9. No cerrar issues ni marcar release como `Released` hasta que exista PR/merge a `main` o instrucción explícita.

## Output format

```
Release: <RELEASE-ID> / <branch>
Issues: <CACH-XXXX>, <CACH-YYYY>
Integración: local / pushed
Commits: <sha> — <subject>
Validación: pb:check OK, diff --check OK
Pendiente: PR release -> main / tag / producción si aplica
```

## Severity / priority model

- CRITICAL: conflicto que puede pisar trabajo ajeno, push destructivo, force push, secretos o cambios remotos sensibles.
- HIGH: Product Brain inconsistente, issue-release divergente, release branch equivocada.
- MEDIUM: conflicto de merge documental, índice/backlog incompleto, validación pendiente.
- LOW: wording, acentos ASCII/no ASCII, orden de índices, notas de release mejorables.

## Quality bar

- Cargar solo contexto mínimo y archivos tocados.
- Cada cambio queda trazado a issue `CACH-*` y release si aplica.
- `pb:check` y `git diff --check` pasan antes de commit final.
- La rama de release queda limpia y sincronizada si se empuja.
- El reporte final incluye commits y pendientes reales.

## Common mistakes to avoid

- Leer todo Product Brain antes de decidir.
- Crear una GitHub Issue cuando basta issue Markdown.
- Duplicar una issue existente porque no se revisó el índice.
- Meter trabajo fuera de scope en una release activa sin registrarlo en la release.
- Hacer merge normal de rama de tarea a release cuando el flujo pide squash.
- Marcar `Released` antes de PR a `main`, tag y cierre real.

## Safety notes

No usar `git reset --hard`, `git push --force`, borrado de ramas remotas, migraciones, Supabase, Vercel, secretos ni producción desde esta skill sin confirmación explícita del usuario. Si hay conflictos con cambios no propios, resolver sumando intención cuando sea claro o parar y reportar el bloqueo.
