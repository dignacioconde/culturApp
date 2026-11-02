---
id: T-001
title: Añadir slugify a las utilidades de texto de la demo
status: done
issue: CACH-0106
recommended_model: deepseek-free
---
# T-001 — Añadir slugify a las utilidades de texto de la demo

## Contexto mínimo

`examples/demo/text.mjs` es un módulo ESM sin dependencias ni punto y coma que hoy exporta solo `capitalize(text)`. `examples/demo/text.test.mjs` lo prueba con `node:test` y `node:assert/strict`. Hay que añadir y probar `export function slugify(text)`: pasa a minúsculas, quita tildes y diacríticos, convierte espacios y signos en guiones, y no deja guiones repetidos ni en los extremos.

## Ficheros afectados

- `examples/demo/text.mjs` — añadir y exportar `slugify(text)`; `capitalize` no cambia.
- `examples/demo/text.test.mjs` — ampliar el import y añadir `test('slugify', ...)`; el test de `capitalize` no cambia.

## Criterios de aceptación

- [ ] AC1: `slugify` devuelve exactamente estas salidas:

  | Entrada | Salida |
  | --- | --- |
  | `'Hola Mundo'` | `'hola-mundo'` |
  | `'Canción de Ñandú'` | `'cancion-de-nandu'` |
  | `'¿Qué tal, mundo?'` | `'que-tal-mundo'` |
  | `'  Teatro   y   danza  '` | `'teatro-y-danza'` |
  | `'uno---dos'` | `'uno-dos'` |
  | `'--hola--'` | `'hola'` |
  | `'Acto 2: Final'` | `'acto-2-final'` |
  | `'a_b.c/d'` | `'a-b-c-d'` |
  | `''` | `''` |
  | `'   '` | `''` |
  | `'¿?¡...'` | `''` |

- [ ] AC2: `examples/demo/text.test.mjs` incluye los 11 casos de AC1, con una aserción `assert.equal(slugify(...), ...)` por caso (sin bucles ni tablas), con las entradas y salidas escritas literalmente (sin secuencias `\u`), y pasa con `node --test`.
- [ ] AC3: `capitalize` y su test siguen funcionando igual.
- [ ] AC4: sin cambios fuera de los dos ficheros listados.

## Verificación

```bash
node --input-type=module -e "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; import {execFileSync,spawnSync} from 'node:child_process'; const {capitalize,slugify}=await import('./examples/demo/text.mjs'); const cases=[['Hola Mundo','hola-mundo'],['Canción de Ñandú','cancion-de-nandu'],['¿Qué tal, mundo?','que-tal-mundo'],['  Teatro   y   danza  ','teatro-y-danza'],['uno---dos','uno-dos'],['--hola--','hola'],['Acto 2: Final','acto-2-final'],['a_b.c/d','a-b-c-d'],['',''],['   ',''],['¿?¡...','']]; const src=readFileSync('examples/demo/text.test.mjs','utf8'); assert.ok(src.includes('capitalize(') && src.split('slugify(').length-1>=11,'faltan tests'); for (const [input,output] of cases) { assert.equal(slugify(input),output); assert.ok(src.includes(input) && src.includes(output),'caso sin test: '+input) } assert.equal(capitalize('cachés'),'Cachés'); const allowed=['examples/demo/text.mjs','examples/demo/text.test.mjs']; const extra=execFileSync('git',['status','--porcelain','--','.',':(exclude)node_modules'],{encoding:'utf8'}).split('\n').filter(Boolean).filter((line)=>allowed.includes(line.slice(3))===false); assert.deepEqual(extra,[],'cambios fuera de alcance'); assert.equal(spawnSync(process.execPath,['--test','examples/demo/text.test.mjs'],{stdio:'inherit'}).status,0,'node --test falla')"
```

## Notas para el obrero

- No añadas dependencias.
- No toques ficheros fuera de la lista.
- Estilo del módulo: ESM, sin punto y coma, dos espacios y un comentario JSDoc de una línea, como `capitalize`.
- Pista: `text.normalize('NFD')` separa los diacríticos, que se eliminan con `/\p{M}/gu`. Después, sustituye cada secuencia de caracteres fuera de `a-z0-9` por un guion y recorta los guiones de los extremos.
- El comando comprueba el código y los tests. Si falla, corrige el código o los tests; no cambies las salidas esperadas de AC1.
