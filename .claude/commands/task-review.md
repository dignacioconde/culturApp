---
description: Revisa la rama worker de una tarea T-xxx contra sus criterios y decide aprobar, pedir cambios o rehacer
argument-hint: <T-xxx> [--codex]
---

Argumentos: $ARGUMENTS

1. Localiza `docs/tasks/<T-xxx>-*.md` y la rama más reciente `worker/<T-xxx>-*` (`git branch --list 'worker/<T-xxx>-*'`) con su worktree en `.worktrees/`.
2. Revisa el diff de la rama contra su base (`git log` y `git diff <base>..worker/...`):
   - ¿cumple cada criterio de aceptación?
   - ¿toca solo los ficheros listados?
   - ¿bugs, regresiones, código muerto, dependencias nuevas?
   - reglas de `AGENTS.md`: hooks para Supabase, formatters, controles de `Input.jsx`, UI en español con tuteo.
3. Ejecuta tú el comando de `## Verificación` dentro del worktree para confirmar que pasa.
4. Pide segunda opinión a Codex con `codex_review` (`commit: <sha de la rama>`, `cwd: <worktree>`, `prompt: "Revisa contra los criterios de docs/tasks/<fichero>. Prioriza bugs, regresiones y cambios fuera de alcance."`) si se pasó `--codex` o si el diff toca hooks, datos, más de un fichero o lógica no trivial.
5. Veredicto, con motivos concretos (fichero:línea):
   - **aprobar**: explica cómo integrarlo y **pide confirmación al usuario** antes de hacerlo. Al confirmar: si la rama actual es `main`, para y pide crear una rama de trabajo; si no, `git cherry-pick <sha>` en la rama actual, `git worktree remove --force .worktrees/<nombre>` (el worktree tiene un enlace a `node_modules` sin seguimiento), `git branch -D worker/<nombre>` y `status: done` en la tarea.
   - **pedir cambios**: añade a la tarea una sección `## Revisión` con los cambios concretos y pon `status: redo`; siguiente paso `/delegate <T-xxx>`.
   - **rehacer con modelo mejor**: igual que pedir cambios, sugiriendo un alias más capaz de `list_models` o implementarla tú si no es delegable.
6. Si el veredicto no es aprobar, el worktree se queda para inspección; indica cómo borrarlo.

Nunca hagas merge a `main` ni push.
