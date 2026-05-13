# Agentes OpenCode para CulturaApp

Esta carpeta define agentes especializados para ejecutar CulturaApp con OpenCode.
Todos usan `opencode/minimax-m2.5-free` como modelo por defecto.

## Sistema de memoria

El proyecto tiene memoria persistente en `.memory/` (directorio en la raíz del repo, versionado en git).

Los agentes deben usar `AGENTS.md` como contrato corto de entrada y `docs/agent-context-policy.md` como politica canonica de carga de contexto.

Regla base: lee indices primero, carga detalle solo cuando sea relevante, no cargues historico por defecto y prefiere archivos o secciones concretas frente a carpetas completas.

`.memory/MEMORY.md` es un indice de memoria versionada. Leelo para decidir que memoria selectiva cargar por dominio; no cargues toda `.memory/` por defecto.

**`cultura-docs` es el unico agente que escribe en memoria.** El lead lo activa cuando se detecta algo que merece persistirse: preferencias del usuario, correcciones, decisiones no obvias o recursos externos.

No guardes en memoria: convenciones de codigo, rutas de archivos, historial git o estado efimero de la tarea. Eso vive en `AGENTS.md`, el codigo y `AGENT_STATE.md`.

## Check de contexto

```bash
npm run context:check
npm run context:metrics
```

Revisa presupuestos de tamano, estimacion aproximada de tokens y posibles regresiones de carga amplia de contexto. Es un check orientado a warnings y sigue `docs/agent-context-policy.md`.

## Ejecucion recomendada

Para tareas sin issue estructurada, la entrada por defecto es un draft seguro:

```bash
npm run agents:plan -- "Describe la tarea"
```

`agents:plan` es equivalente a `agents:plan:draft`: genera una propuesta Product Brain-first sin crear ramas, GitHub Issues, commits, pushes ni runs de implementacion.

Cuando quieras que el planner pueda mutar repo local, preparar rama o lanzar agentes, usa el modo explicito:

```bash
npm run agents:plan:execute -- "Describe la tarea"
```

Si un flujo no interactivo necesita autoaprobar permisos de OpenCode, el bypass peligroso debe declararse de forma visible:

```bash
npm run agents:plan:execute -- --dangerously-skip-permissions "Describe la tarea"
```

No uses ese flag con agentes read-only ni para exploracion/review.

Cuando ya existe issue estructurada y rama de tarea preparada, usa el lanzador estandar:

```bash
npm run agents:run -- "Describe la tarea"
```

Sin flags adicionales, `agents:run` lanza un contrato de solo lectura. Para permitir escritura local hay que declarar `--write` y `--ownership` concreto:

```bash
npm run agents:run -- --write --scope "src/pages/Events" --ownership "frontend:src/pages/Events" "Implementa filtros avanzados de eventos"
```

Este comando envuelve la peticion en un contrato operativo con objetivo, autonomia, contexto, alcance, ownership, verificacion y salida esperada. Internamente usa `cultura-lead`, pero `cultura-lead` debe actuar como dispatcher minimo: enruta a subagentes, coordina dependencias y cierra con verificacion.

Cuando el usuario pida ejecutar agentes, no hagas una revision manual previa del codigo salvo que sea imprescindible para construir el comando, definir ownership seguro o resolver un bloqueo real. Los agentes deben usar `AGENTS.md` como contrato corto, seguir `docs/agent-context-policy.md`, leer `.opencode/AGENT_STATE.md` como estado vivo y revisar el codigo necesario. El detalle adicional se carga bajo demanda; backlog, releases, historico, issues cerradas y Product Brain completo no se cargan por defecto.

Cuando se descubra un problema nuevo, el flujo por defecto es: issue Product Brain `CACH-*` -> rama de tarea desde `main` actualizado -> agentes con contexto de la issue -> fix verificado -> commit -> push -> PR a `main` -> merge -> verificacion de produccion si aplica -> borrado de rama de trabajo -> cierre de la issue Product Brain con resumen/commit/verificaciones. GitHub Issues quedan como soporte operativo solo si el usuario las pide o una integracion externa las requiere. Toda issue resuelta debe quedar enlazada permanentemente al trabajo que la resuelve:
- **Si hay PR abierta**: enlazar la issue en la descripcion de la PR con `Closes #N`, `Fixes #N` o equivalente; la issue permanece ABIERTA hasta merge y se cierra solo cuando la PR se mergee a `main`.
- **Si no hay PR**: enlazarla desde el commit o comentario de cierre y cerrarla solo tras commit pusheado + comentario con resumen/commit/verificacion + memoria/docs declarada.

Las ramas de PR generan Vercel Preview Deployments. Un preview no cuenta como produccion ni como cierre completo si el usuario espera ver el cambio en la app publicada. Salvo bloqueo real o instruccion explicita de dejar la PR abierta, la tarea debe terminar con PR mergeada a `main`, el alias de produccion verificado y la rama de trabajo borrada. La rama remota se borra automaticamente tras merge a `main` mediante `.github/workflows/delete-branch.yml`; la rama local debe borrarse despues de cambiar a `main` actualizado.

Antes de abrir una PR, todos los agentes deben completar el **checkpoint de memoria pre-PR**: revisar issue, diff y commits contra la base; activar `@cultura-docs` si hay preferencias, decisiones duraderas, gotchas recurrentes o reglas de trabajo que guardar; o declarar `Memoria: no aplica`. Si `.memory/` cambia, esos archivos deben quedar commiteados y pusheados antes de crear la PR. La descripcion de PR debe incluir `Memoria: actualizada` o `Memoria: no aplica`.

Ejemplo con alcance explicito y escritura:

```bash
npm run agents:run -- --write --scope "src/pages/Events,src/hooks" --ownership "frontend:src/pages/Events; data:src/hooks" "Implementa filtros avanzados de eventos"
```

Usa `opencode run` directamente solo para depuracion o pruebas de agentes.

## Permisos reales y dry-run

Los runners no pasan `--dangerously-skip-permissions` por defecto. Ese flag solo se acepta como opt-in explicito en modos mutantes.

Perfiles protegidos por script:

- `cultura-review`, `cultura-security`, `cultura-ux-mobile` y `cultura-ux-desktop` son read-only: no admiten `--write` ni bypass peligroso.
- `cultura-testing` y `verification-agent` pueden ejecutar bash de verificacion, pero no editar.
- `cultura-frontend`, `cultura-data`, `cultura-docs` y `cultura-release` requieren escritura declarada y ownership cuando se lanzan desde runners.
- `cultura-lead` tiene `edit: deny`; su funcion es coordinar y delegar.

Para revisar el comando efectivo sin lanzar OpenCode ni escribir `.opencode/runs/`:

```bash
npm run agents:plan -- --dry-run "Describe la tarea"
npm run agents:run -- --dry-run --agent cultura-review "Revisa el diff"
npm run agents:parallel -- --dry-run --agents review,security "Revisa riesgos"
```

Los dry-runs incluyen `promptMetrics` y `costEstimate` aproximado. Si un prompt se acerca al limite, reduce agentes, divide la tarea, acota ownership o usa `--concise` cuando sea seguro.

Para ahorrar tokens en salidas no sensibles, los runners aceptan `--concise` o `--caveman` y tambien lo detectan en el texto de la tarea. Solo comprime la salida: no reduce razonamiento ni omite hallazgos de seguridad, RLS, finanzas, SQL, migraciones, reviews con lineas, verificaciones ni acciones remotas/destructivas.

## Agentes primarios

| Agente | Comando | Uso |
| --- | --- | --- |
| `cultura-lead` | `npm run agents:run -- "tarea"` | Dispatcher principal: enruta a subagentes y cierra con verificacion |
| `cultura-planner` | `npm run agents:plan -- "tarea"` | Draft read-only Product Brain-first |
| `cultura-planner-execute` | `npm run agents:plan:execute -- "tarea"` | Modo mutante explicito para issue/rama/agentes |
| `verification-agent` | `npm run agents:verify -- "contexto"` | Verificacion post-implementacion: lint, build, tests, issue, PR readiness |

## Agente principal

```bash
opencode --agent cultura-lead
```

`cultura-lead` existe por una limitacion practica: OpenCode no ejecuta directamente los archivos con `mode: subagent`. No debe ser el implementador principal. Su funcion es enrutar:

- UI -> `@cultura-frontend`
- Datos/hooks/Supabase -> `@cultura-data`
- Verificacion -> `@cultura-testing`
- Revision tecnica -> `@cultura-review`
- Seguridad -> `@cultura-security`
- Release -> `@cultura-release`
- Docs/agentes -> `@cultura-docs`

Para ejecuciones no interactivas:

```bash
opencode run --agent cultura-lead "Tu tarea aqui"
```

Preferible:

```bash
npm run agents:run -- "Tu tarea aqui"
```

## Subagentes disponibles

| Agente | Uso |
| --- | --- |
| `cultura-frontend` | React, rutas, formularios, UI, calendario y experiencia en espanol |
| `cultura-ux-desktop` | Criterio UX/UI desktop, layouts amplios, jerarquia visual, tablas y productividad |
| `cultura-ux-mobile` | Criterio UX/UI mobile, navegacion tactil, formularios compactos y responsive |
| `cultura-data` | Supabase, RLS, SQL, hooks de datos, ingresos/gastos y modelo conceptual |
| `cultura-testing` | Lint, build, smoke tests, casos borde y regresiones |
| `cultura-review` | Revision tecnica, riesgos, seguridad, accesibilidad y mantenibilidad |
| `cultura-security` | Auth, RLS, secretos, privacidad, exposicion de datos y riesgos de deploy |
| `cultura-release` | Deploy en Vercel, variables de entorno, checklist pre-release |
| `cultura-docs` | README, TECHDOC, AGENTS.md y documentacion operativa |
| `verification-agent` | Verificacion post-implementacion: lint, build, tests, issue closeability, PR readiness |

## Adaptador Codex-native

Cuando el usuario pida agentes de Codex, Codex puede usar subagentes nativos reutilizando un perfil de `.opencode/agents/*.md` como contexto de rol. Esto no ejecuta OpenCode ni convierte esos archivos en skills portables.

Reglas:

- `AGENTS.md` sigue siendo el contrato corto de entrada.
- `docs/agent-context-policy.md` sigue siendo la politica canonica de carga.
- Carga solo el perfil relevante para la tarea; no cargues todos los agentes.
- Los perfiles OpenCode aportan rol, ownership y criterio operativo.
- El frontmatter OpenCode (`mode`, `model`, `permission`) no aplica permisos reales en Codex.
- Las skills de `.agents/skills/*/SKILL.md` siguen siendo workflows portables y se activan por sus triggers propios.
- Los subagentes Codex heredan solo las herramientas de la sesion Codex. Si Codex no tiene Supabase MCP, sus subagentes tampoco lo tienen.
- En challenge o revision, usa modo read-only: sin ediciones, sin `.opencode/AGENT_STATE.md` y sin operaciones remotas. Si un perfil pide leer `.opencode/AGENT_STATE.md`, esa parte aplica solo a OpenCode.
- Supabase remoto sigue `docs/project/process/supabase-db-access.md`: MCP acotado al proyecto cuando exista, SQL exacto y confirmacion humana antes de mutar produccion.
- Usa `npm run agents:*` solo cuando el usuario pida OpenCode o cuando falten subagentes nativos y se declare el fallback.

Ejemplo dentro de OpenCode:

```text
@cultura-data revisa si el modelo de ingresos/gastos cubre eventos independientes y proyectos.
@cultura-ux-mobile revisa si el flujo de alta de evento es claro en 375 px.
@cultura-ux-desktop revisa si ProjectDetail aprovecha bien el espacio sin saturar la vista.
@cultura-testing prepara una matriz de pruebas para el flujo proyecto -> evento -> ingreso.
@cultura-security revisa si hay riesgos de fuga de datos entre usuarios o secretos expuestos.
```

## Ejecucion paralela

Para tareas de revision o exploracion, puedes lanzar varios agentes a la vez desde procesos independientes:

```bash
npm run agents:parallel -- "Revisa riesgos antes del deploy"
```

Por defecto ejecuta `cultura-data`, `cultura-testing`, `cultura-review` y `cultura-security` en modo solo lectura. En ese modo no deben editar codigo, docs, memoria ni `.opencode/AGENT_STATE.md`. Cada proceso usa `cultura-lead` y le pide delegar en un unico subagente, porque OpenCode no ejecuta directamente los archivos con `mode: subagent`.

Puedes elegir agentes concretos:

```bash
npm run agents:parallel -- --agents frontend,data,testing "Evalua esta mejora de formularios"
npm run agents:parallel -- --agents ux-mobile,ux-desktop,frontend "Evalua la UX responsive de dashboard y propone ajustes accionables"
```

Para revisar problemas responsive de calendarios, incluye siempre ux-mobile, ux-desktop, frontend, testing y review:

```bash
npm run agents:parallel -- --agents ux-mobile,ux-desktop,frontend,testing,review "Revisa que /calendar/events y /calendar/projects sigan visibles y usables en responsive"
```

Los agentes UX son revisores de criterio visual y experiencia, no implementadores por defecto. Deben entregar decisiones y tareas accionables; `cultura-frontend` implementa los cambios en React/Tailwind.

Para bugs visuales, no pidas solo "revisa responsividad". Incluye ruta, viewport, captura o descripcion visual exacta y criterio de aceptacion. Ejemplo:

```text
En /calendar/events con ventana compacta, React Big Calendar muestra toolbar y cabecera Sun-Mon-Tue, pero no pinta las filas del mes. Inspecciona alturas computadas de .rbc-calendar, .rbc-month-view y .rbc-month-row. No basta con cambiar min-h del card; verifica con screenshot que las semanas son visibles.
```

Nota especifica de calendarios: `react-big-calendar` necesita una altura real en su contenedor interno. `height: 100%` dentro de padres con solo `min-height`, `flex-1`, `min-h-0` u `overflow-hidden` puede dejar visibles toolbar/cabecera y colapsar la rejilla del mes.

Lecciones recientes de UX móvil:

- No usar `<select>` nativo ni `input type="date"` / `input type="datetime-local"` directamente en pantallas o modales. En móvil los menús nativos salieron demasiado pequeños. Usar los wrappers compartidos de `src/components/ui/Input.jsx`.
- `Select` debe mostrar opciones completas, sin truncar años o rangos como `2...` o `30 ...`, y al abrir debe hacer scroll hasta el valor seleccionado cuando haya muchas opciones.
- Los eventos deben partir de un horario útil: `08:00` como hora inicial por defecto y formato 24h. Evitar que formularios o calendarios empiecen visualmente en horas de madrugada salvo selección explícita.
- La vista semana móvil de `/calendar/events` quedó aceptada con scroll horizontal tras la issue `#3`. Si se reabre, los agentes deben crear o usar una issue nueva y evaluar alternativas como agenda móvil, 3 días, carrusel por días o fallback a día/agenda.

Los resultados se guardan en `.opencode/runs/<timestamp>/`, con un archivo Markdown por agente.

Para cambios de codigo en paralelo, usa `--write` solo cuando la tarea ya este dividida por ownership de archivos o modulos. No se permite `--write` con agentes read-only:

```bash
npm run agents:parallel -- --write --ownership "frontend:src/pages/Events; data:src/hooks" --agents frontend,data "Implementad la mejora sin modificar archivos fuera de vuestro ownership."
```

Flujo recomendado:

1. Ejecuta exploracion paralela sin `--write`.
2. Integra las recomendaciones en una unica decision de implementacion.
3. Si necesitas escritura paralela, reparte ownership disjunto por archivos.
4. Cierra con `cultura-testing` y `cultura-review`.

## Plantilla de directriz

Para maxima autonomia, escribe tareas con esta forma. Tambien esta disponible como `.opencode/AGENT_TASK_TEMPLATE.md`.

```text
OBJETIVO:
Que debe quedar funcionando.

AUTONOMIA:
No preguntes salvo bloqueo real. Decide con AGENTS.md, docs/agent-context-policy.md, codigo y pruebas.

CONTEXTO:
Usa AGENTS.md como contrato corto y docs/agent-context-policy.md como politica canonica. Lee .opencode/AGENT_STATE.md como estado vivo. Carga memoria, Product Brain, backlog, releases o historico solo si son relevantes para la tarea y desde archivos/secciones concretas.

ALCANCE:
Archivos, carpetas o modulos que se pueden tocar. Indica tambien lo que queda fuera.

OWNERSHIP:
Si hay varios agentes escribiendo, reparte ownership disjunto por archivos o modulos.

VERIFICACION:
Comandos esperados, por ejemplo npm run lint y npm run build.

SALIDA:
Subagentes usados, cambios, verificacion y riesgos/bloqueos.
Si la tarea termina en PR, incluye tambien `Memoria: actualizada/no aplica` y el estado de limpieza de rama tras el merge.
```

Ejemplo:

```text
OBJETIVO:
Anadir exportacion CSV de ingresos y gastos.

AUTONOMIA:
No preguntes salvo bloqueo real. No tocar Supabase remoto.

ALCANCE:
src/pages, src/hooks, src/lib. Fuera de alcance: deploy y migraciones SQL.

OWNERSHIP:
frontend: pantallas y botones; data: hooks/export helpers; testing: lint/build.

VERIFICACION:
npm run lint y npm run build.

SALIDA:
Resumen breve con archivos tocados, pruebas y riesgos.
```

## Estado compartido entre agentes

`.opencode/AGENT_STATE.md` funciona como pizarra compartida de estado operativo vivo. Todos los agentes deben leerla al empezar y pueden actualizarla para publicar senales sin esperar a `cultura-lead`. No es historico ni memoria durable.

Ejemplo: si `cultura-data` cambia el schema o la firma de un hook, publica `schema_changed` o `api_changed`. Entonces `cultura-frontend`, `cultura-testing` y `cultura-security` pueden reaccionar directamente al leer esa senal.

Reglas de uso:

- Actualiza solo tu bloque en `Estado por agente`.
- Anade una entrada breve en `Eventos`.
- Antes de escribir, relee el archivo.
- No guardes secretos ni valores de `.env.local`.
- Usa la pizarra para coordinacion; la fuente de verdad siguen siendo `AGENTS.md`, `docs/agent-context-policy.md`, el codigo y las pruebas.

## Verificacion post-implementacion

Cuando la implementacion este lista, lanzar el agente de verificacion:

```bash
npm run agents:verify -- "Verifica la implementacion de <tarea>. Rama: <rama>. Issue: <URL si existe>."
```

El agente ejecuta lint, build y tests segun lo que haya cambiado, usa `pb:close-check` cuando vaya a cerrar una issue y devuelve un bloque estandar con resultado `Ready`, `Ready with warnings` o `Blocked`.

Tambien se puede invocar desde `cultura-lead` en sesion interactiva:

```text
@verification-agent verifica el estado actual antes de abrir PR.
```

## Prueba de agentes

Estado verificado el 02/05/2026:

- `opencode --version`: `1.14.29`
- `opencode models opencode` incluye `opencode/minimax-m2.5-free`
- `opencode agent list` reconoce `cultura-lead`, `cultura-planner`, `verification-agent` y los nueve subagentes
- `cultura-lead` carga correctamente con `opencode/minimax-m2.5-free`
- Desde `cultura-lead`, cargan correctamente:
  - `cultura-frontend`
  - `cultura-ux-desktop`
  - `cultura-ux-mobile`
  - `cultura-data`
  - `cultura-testing`
  - `cultura-review`
  - `cultura-security`
  - `cultura-release`
  - `cultura-docs`

Comando usado para la prueba completa:

```bash
opencode run --agent cultura-lead "Haz una prueba de carga de estos subagentes: @cultura-frontend, @cultura-ux-desktop, @cultura-ux-mobile, @cultura-data, @cultura-testing, @cultura-review, @cultura-security, @cultura-release y @cultura-docs. Cada subagente debe responder solo 'OK <nombre> cargado'. No ejecutes comandos ni edites archivos. Devuelve una lista breve con los nueve resultados."
```

Resultado esperado:

```text
OK cultura-frontend cargado
OK cultura-ux-desktop cargado
OK cultura-ux-mobile cargado
OK cultura-data cargado
OK cultura-testing cargado
OK cultura-review cargado
OK cultura-security cargado
OK cultura-release cargado
OK cultura-docs cargado
```

Nota: los archivos con `mode: subagent` no se lanzan directamente con `opencode run --agent cultura-testing`. OpenCode avisa que son subagentes y vuelve al agente por defecto. La ruta correcta es ejecutar `cultura-lead` y pedirle que invoque los subagentes con `@cultura-*`.

Si `opencode agent list` falla con `PRAGMA wal_checkpoint(PASSIVE)` o `attempt to write a readonly database`, no es un problema de estos agentes: OpenCode necesita escribir en su estado local (`~/.local/share/opencode` y `~/.local/state/opencode`). Ejecuta el comando desde un entorno con permiso de escritura para esas rutas.

## Nota sobre el modelo

Si tu instalacion de OpenCode lista MiniMax M2.5 Free con otro identificador, compruebalo con:

```bash
opencode models opencode
```

Y cambia el campo `model` en los agentes.

## Routing de modelos

El routing inteligente de modelos se trata como piloto controlado, no como default irreversible. El objetivo es reducir coste y latencia en tareas simples sin perder calidad de cierre.

Regla base:

- `GPT-5.5`: lead/orquestador, planificacion, ambiguedad, arquitectura, Product Brain, cambios multi-area, datos/RLS, seguridad, finanzas, calendarios complejos, review, verificacion final, PR/release y cualquier accion sensible.
- `GPT-5.3-Codex-Spark`: worker rapido para tareas locales, pequenas, con ownership explicito, patrones claros, bajo riesgo y verificacion objetiva. Encaja para copy, refactors mecanicos, fixes simples, exploracion read-only y cambios acotados de codigo.
- Escalada a `GPT-5.5`: si Spark falla verificacion, toca zona sensible, necesita mas de 1 retry, devuelve un diff demasiado amplio o necesita decidir producto/arquitectura.

Mientras Spark siga en preview o sin precio/SLAs estables, no debe ser dependencia operativa base. Usalo como acelerador experimental medido.

Los lanzadores aceptan metadatos para el piloto:

```bash
npm run agents:run -- \
  --task-type frontend \
  --routing-reason "cambio local de bajo riesgo con ownership claro" \
  --model-lead gpt-5.5 \
  --model-worker gpt-5.3-codex-spark \
  --model-reviewer gpt-5.5 \
  "Ajusta el copy de estados vacios en /work"
```

Cada run escribe `metadata.json` en `.opencode/runs/<timestamp>/` con tipo de tarea, motivo de routing, modelos esperados, ownership, verificacion esperada, estado, duracion, `promptMetrics` y un `costEstimate` aproximado basado solo en prompt. Tokens de salida, coste real, retries y escalaciones quedan como telemetria operativa para completar durante el piloto; no se guardan en `.memory/`.

Promociona Spark solo si el piloto de 20-30 tareas demuestra:

- 25-40% menos coste o latencia en tareas simples.
- Sin aumento de CI rojo, bugs post-merge ni findings severos de review.
- Fallback claro si Spark no esta disponible o cambia sus condiciones de preview.
