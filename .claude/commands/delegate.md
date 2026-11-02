---
description: Delega una tarea docs/tasks/T-xxx a un modelo barato vía MCP cheap-worker (worktree aislado, sin merge)
argument-hint: <T-xxx> [alias-modelo] [--no-fallback]
---

Argumentos: $ARGUMENTS

1. Si no hay argumentos, responde solo con el uso (`/delegate T-xxx [alias] [--no-fallback]`) y la lista de tareas `status: todo` de `docs/tasks/`. No llames a ninguna herramienta MCP.
2. Localiza el fichero `docs/tasks/<T-xxx>-*.md`. Si no existe o su `status` no es `todo` ni `redo`, para y avisa.
3. Comprobación previa: si la tarea toca auth, RLS, migraciones, secretos o cálculos financieros, o tiene `recommended_model: brain`, **no la delegues**; explica por qué y propón implementarla tú.
4. Si se indica un alias, valídalo con `list_models` (MCP `cheap-worker`) y avisa si no está disponible.
5. Llama a `delegate_task` con `task_file`, `model` (si se indicó) y `no_fallback: true` si se pasó `--no-fallback`. Puede tardar varios minutos.
6. Si `passed` es true, cambia `status: todo|redo` → `status: review` en el fichero de la tarea.
7. Resume:
   - resultado (`passed`), modelo usado, intentos (modelo, resultado, coste) y coste total;
   - rama, worktree y `diff_stat`;
   - si no pasó: última salida de verificación y modelos saltados con el motivo;
   - siguiente paso: `/task-review <T-xxx>`.

Nunca hagas merge ni cherry-pick aquí.
