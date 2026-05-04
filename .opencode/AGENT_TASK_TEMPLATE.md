# Plantilla De Directriz Para Agentes

Usa esta plantilla cuando quieras que OpenCode ejecute con minima intervencion humana.

```text
OBJETIVO:
Describe que debe quedar funcionando o revisado.

AUTONOMIA:
No preguntes salvo bloqueo real: credenciales, accion destructiva, cambio remoto, decision de producto irreversible u ownership ambiguo.

CONTEXTO:
Lee AGENTS.md y .opencode/AGENT_STATE.md. AGENTS.md es la fuente principal.
Si la tarea toca formularios, selectores o calendarios, revisa tambien las lecciones documentadas sobre `Input.jsx`, horarios desde 08:00 y la memoria de semana movil.

ALCANCE:
Indica archivos, carpetas o modulos permitidos. Indica tambien lo que queda fuera.

OWNERSHIP:
Si hay varios agentes escribiendo, reparte ownership disjunto.
Ejemplo: frontend -> src/pages/Events; data -> src/hooks; docs -> README.md.

VERIFICACION:
Indica comandos esperados. Por defecto, npm run lint y npm run build si se toca codigo.

MEMORIA PRE-PR:
Si el siguiente paso es abrir PR, revisa issue, diff y commits contra base. Actualiza `.memory/` si hay contexto durable o declara `Memoria: no aplica`. No abras PR hasta que esa decision este reflejada.

SALIDA:
Subagentes usados, cambios realizados, verificacion ejecutada y riesgos/bloqueos restantes.
Si aplica, incluye `Memoria: actualizada/no aplica`.
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
