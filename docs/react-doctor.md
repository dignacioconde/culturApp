# React Doctor

React Doctor es una herramienta externa de diagnóstico para proyectos React. En CulturaApp se usa como escaneo advisory de salud del frontend: detecta patrones de React, accesibilidad, rendimiento, arquitectura y dead code, pero no sustituye las validaciones propias del repo.

- Repositorio upstream: https://github.com/millionco/react-doctor
- Integración local: scripts npm en `package.json`
- Skill portable: `.agents/skills/react-doctor/SKILL.md`
- Exposición Claude Code: `.claude/skills/react-doctor -> ../../.agents/skills/react-doctor`

## Comandos

```bash
npm run doctor:react
npm run doctor:react:diff
```

`doctor:react` ejecuta un escaneo completo:

```bash
npx -y react-doctor@latest . --full --offline --fail-on none
```

`doctor:react:diff` ejecuta un escaneo acotado a cambios contra `main`:

```bash
npx -y react-doctor@latest . --diff main --offline --fail-on none
```

## Decisiones De Integración

- Se usa `npx -y react-doctor@latest` para evitar añadir una dependencia fija al proyecto en esta fase.
- Se añade `--offline` para evitar telemetría o score remoto; aun así, `npx` puede descargar el paquete desde npm si no está cacheado.
- Se añade `--fail-on none` porque por ahora React Doctor es una señal de calidad, no una compuerta de CI.
- No se vendorea código, reglas ni skill text de React Doctor. La skill local resume el workflow adaptado a CulturaApp.
- Si se convierte en check de CI, hay que fijar una versión concreta en lugar de usar `@latest`.

## Cuándo Usarlo

Úsalo:

- Al terminar cambios React de UI, hooks o formularios cuando quieras una segunda lectura heurística.
- Antes de una PR si el cambio toca principalmente `src/`.
- Para auditorías de cleanup, dead code, accesibilidad, efectos o rendimiento.

No lo uses como sustituto de:

- `npm run lint`
- `npm run build`
- `npm run test` cuando aplique
- `npm run pb:check` si se toca `docs/project/`
- Las skills específicas de CulturaApp para frontend, datos/finanzas, seguridad, testing o review.

## Baseline Inicial

Escaneo ejecutado el 12 de mayo de 2026:

```text
react-doctor v0.1.6
Score: 77 / 100 Great
464 issues across 41/81 files
```

Resumen por categorías:

| Categoría | Issues | Notas |
| --- | ---: | --- |
| Architecture | 348 | Principalmente paleta Tailwind por defecto, ejes `w-* h-*` redundantes y nombres genéricos de handlers. |
| Dead Code | 48 | Exports, types y archivos no usados; revisar antes de borrar porque puede haber entry points de scripts. |
| Performance | 47 | Iteraciones combinables, `Intl` en funciones y accesos profundos repetidos. |
| State & Effects | 11 | Componentes candidatos a `useReducer`, estados encadenados y lógica de evento en `useEffect`. |
| Accessibility | 5 | Labels no asociados y handlers click en elementos no interactivos. |

El score puede cambiar aunque el código no cambie si `react-doctor@latest` añade reglas nuevas. Usa este baseline como fotografía inicial, no como contrato estable.

## Interpretación En CulturaApp

- Las warnings de estilo masivo no autorizan refactors amplios fuera de alcance.
- Prioriza hallazgos que afecten seguridad, datos, accesibilidad real, hooks compartidos o flujos visibles.
- En calendarios, React Doctor no sustituye la verificación visual de toolbar, cabeceras, filas/celdas y eventos.
- En datos y finanzas, los diagnósticos de performance no deben cambiar fórmulas sin revisar los criterios de negocio.
- En skills/agentes, cualquier cambio debe mantener `.agents/skills` como fuente real y `.claude/skills` como symlink.

## Validación De La Integración

Comandos ejecutados al integrar:

```bash
npm run doctor:react
npm run doctor:react:diff
python3 /Users/diconde/.codex/skills/.system/skill-creator/scripts/quick_validate.py .agents/skills/react-doctor
npm run verify:skills
git diff --check
```

Resultado:

- `doctor:react`: OK, score inicial `77 / 100 Great`.
- `doctor:react:diff`: OK; sin archivos fuente React cambiados contra `main` en ese momento.
- `quick_validate.py`: OK para `.agents/skills/react-doctor`.
- `verify:skills`: OK.
- `git diff --check`: OK.
