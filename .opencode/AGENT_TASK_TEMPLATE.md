# Plantilla De Directriz Para Agentes

Usa esta plantilla cuando quieras que OpenCode ejecute con minima intervencion humana.

```text
OBJETIVO:
Describe que debe quedar funcionando o revisado.

AUTONOMIA:
No preguntes salvo bloqueo real: credenciales, accion destructiva, cambio remoto, decision de producto irreversible u ownership ambiguo.

CONTEXTO:
Usa `AGENTS.md` como contrato corto y `docs/agent-context-policy.md` como politica canonica. Lee `.opencode/AGENT_STATE.md` como estado vivo.
Carga memoria, Product Brain, backlog, releases o historico solo si son relevantes para la tarea y desde archivos/secciones concretas.
Si necesitas orientar Product Brain, usa `npm run pb:orient -- --json` y abre solo la issue, parent, release o source-touchpoint relevante.
Si la tarea toca formularios, selectores o calendarios, revisa bajo demanda las lecciones documentadas sobre `Input.jsx`, horarios desde 08:00 y semana movil.

ALCANCE:
Indica archivos, carpetas o modulos permitidos. Indica tambien lo que queda fuera.

RAMA Y PR:
Parte de `main` actualizado y trabaja en una rama de tarea. La PR debe apuntar a `main`. No apiles cambios en ramas antiguas salvo instruccion explicita. Tras merge correcto contra `main`, borra la rama remota y borra la rama local solo despues de cambiar a `main` actualizado.

OWNERSHIP:
Si hay varios agentes escribiendo, reparte ownership disjunto.
Ejemplo: frontend -> src/pages/Events; data -> src/hooks; docs -> README.md.

VERIFICACION:
Indica comandos esperados. Por defecto, npm run lint y npm run build si se toca codigo.

MEMORIA PRE-PR:
Si el siguiente paso es abrir PR, revisa issue, diff y commits contra base. Actualiza `.memory/` si hay contexto durable o declara `Memoria: no aplica`. No abras PR hasta que esa decision este reflejada.

CIERRE DE ISSUE:
- Toda issue resuelta debe quedar enlazada permanentemente al trabajo que la resuelve.
- Si hay PR abierta: enlazar la issue en la descripcion de la PR con `Closes #N`, `Fixes #N` o equivalente; issue permanece ABIERTA hasta merge y se cierra solo cuando la PR se mergee a `main`.
- Si no hay PR: enlazar desde commit o comentario y cerrar tras commit pusheado + comentario con resumen/commit/verificacion + memoria/docs declarada.
- Si el cambio debe verse en la app publicada, mergea la PR a `main` cuando las verificaciones pasen y verifica produccion. Un preview de Vercel no cuenta como produccion.
- Tras merge correcto contra `main`, confirma que la rama remota fue eliminada y borra la rama local desde `main` actualizado.

SALIDA:
Subagentes usados, cambios realizados, verificacion ejecutada, PR/merge/produccion, limpieza de rama y riesgos/bloqueos restantes.
Incluye obligatoriamente `Contexto leído`, `Product Brain leído`, `Product Brain actualizado`, `Validación PB` y `Feedback/Memory`.
```

Ejemplo corto:

```text
OBJETIVO:
Mejorar el formulario de eventos para seleccionar proyecto asociado y validar fechas.

AUTONOMIA:
No preguntes salvo bloqueo real. No tocar Supabase remoto.

ALCANCE:
src/pages/Events, src/hooks/useEvents.js si hace falta, src/lib/formatters.js solo si hay bug.

OWNERSHIP:
frontend -> src/pages/Events; data -> src/hooks/useEvents.js; testing -> verificacion.

VERIFICACION:
npm run lint y npm run build.

MEMORIA PRE-PR:
Actualizar memoria si aparecen preferencias, decisiones duraderas o gotchas; si no, declarar no aplica.

SALIDA:
Resumen breve con cambios, pruebas y riesgos.
```
