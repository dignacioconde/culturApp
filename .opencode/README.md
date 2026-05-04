# Agentes OpenCode para CulturaApp

Esta carpeta define agentes especializados para ejecutar CulturaApp con OpenCode.
Todos usan `opencode/minimax-m2.5-free` como modelo por defecto.

## Sistema de memoria

El proyecto tiene memoria persistente en `.memory/` (directorio en la raíz del repo, versionado en git).

**Todos los agentes deben leer `.memory/MEMORY.md` al inicio de cada tarea** para conocer preferencias activas y decisiones de proyecto antes de ejecutar.

**`cultura-docs` es el unico agente que escribe en memoria.** El lead lo activa cuando se detecta algo que merece persistirse: preferencias del usuario, correcciones, decisiones no obvias o recursos externos.

No guardes en memoria: convenciones de codigo, rutas de archivos, historial git o estado efimero de la tarea. Eso vive en `AGENTS.md`, el codigo y `AGENT_STATE.md`.

## Ejecucion recomendada

La entrada por defecto debe ser el lanzador estandar:

```bash
npm run agents:run -- "Describe la tarea"
```

Este comando envuelve la peticion en un contrato operativo con objetivo, autonomia, contexto, alcance, ownership, verificacion y salida esperada. Internamente usa `cultura-lead`, pero `cultura-lead` debe actuar como dispatcher minimo: enruta a subagentes, coordina dependencias y cierra con verificacion.

Cuando el usuario pida ejecutar agentes, no hagas una revision manual previa del codigo salvo que sea imprescindible para construir el comando, definir ownership seguro o resolver un bloqueo real. Los agentes deben leer `AGENTS.md`, `.opencode/AGENT_STATE.md` y el codigo necesario, diagnosticar y devolver hallazgos o cambios por si mismos.

Cuando se descubra un problema nuevo, el flujo por defecto es: issue en GitHub -> agentes con contexto de la issue -> fix verificado -> commit -> push -> comentario en la issue con resumen/commit/verificaciones. Cerrar segun criterio:
- **Si hay PR abierta**: issue permanece ABIERTA hasta merge. Cerrar solo despues de que la PR se mergee a main.
- **Si no hay PR**: cerrar tras commit pusheado + comentario con resumen/commit/verificacion + memoria/docs declarada.

Antes de abrir una PR, todos los agentes deben completar el **checkpoint de memoria pre-PR**: revisar issue, diff y commits contra la base; activar `@cultura-docs` si hay preferencias, decisiones duraderas, gotchas recurrentes o reglas de trabajo que guardar; o declarar `Memoria: no aplica`. Si `.memory/` cambia, esos archivos deben quedar commiteados y pusheados antes de crear la PR. La descripcion de PR debe incluir `Memoria: actualizada` o `Memoria: no aplica`.

Ejemplo con alcance explicito:

```bash
npm run agents:run -- --scope "src/pages/Events,src/hooks" --ownership "frontend: src/pages/Events; data: src/hooks" "Implementa filtros avanzados de eventos"
```

Usa `opencode run` directamente solo para depuracion o pruebas de agentes.

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

Por defecto ejecuta `cultura-data`, `cultura-testing`, `cultura-review` y `cultura-security` en modo solo lectura. Cada proceso usa `cultura-lead` y le pide delegar en un unico subagente, porque OpenCode no ejecuta directamente los archivos con `mode: subagent`.

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

Para cambios de codigo en paralelo, usa `--write` solo cuando la tarea ya este dividida por ownership de archivos o modulos:

```bash
npm run agents:parallel -- --write --agents frontend,data "Frontend toca src/pages/Events; data toca src/hooks. Implementad la mejora sin modificar archivos fuera de vuestro ownership."
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
No preguntes salvo bloqueo real. Decide con AGENTS.md, codigo y pruebas.

ALCANCE:
Archivos, carpetas o modulos que se pueden tocar. Indica tambien lo que queda fuera.

OWNERSHIP:
Si hay varios agentes escribiendo, reparte ownership disjunto por archivos o modulos.

VERIFICACION:
Comandos esperados, por ejemplo npm run lint y npm run build.

SALIDA:
Subagentes usados, cambios, verificacion y riesgos/bloqueos.
Si la tarea termina en PR, incluye tambien `Memoria: actualizada/no aplica`.
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

`.opencode/AGENT_STATE.md` funciona como pizarra compartida. Todos los agentes deben leerla al empezar y pueden actualizarla para publicar senales sin esperar a `cultura-lead`.

Ejemplo: si `cultura-data` cambia el schema o la firma de un hook, publica `schema_changed` o `api_changed`. Entonces `cultura-frontend`, `cultura-testing` y `cultura-security` pueden reaccionar directamente al leer esa senal.

Reglas de uso:

- Actualiza solo tu bloque en `Estado por agente`.
- Anade una entrada breve en `Eventos`.
- Antes de escribir, relee el archivo.
- No guardes secretos ni valores de `.env.local`.
- Usa la pizarra para coordinacion; la fuente de verdad siguen siendo `AGENTS.md`, el codigo y las pruebas.

## Prueba de agentes

Estado verificado el 02/05/2026:

- `opencode --version`: `1.14.29`
- `opencode models opencode` incluye `opencode/minimax-m2.5-free`
- `opencode agent list` reconoce `cultura-lead` y los nueve subagentes
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
