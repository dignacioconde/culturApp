---
id: T-002
title: Añadir truncate a las utilidades de texto de la demo
status: done
issue: CACH-0106
recommended_model: deepseek-free
---
# T-002 — Añadir truncate a las utilidades de texto de la demo

## Contexto mínimo

**Depende de T-001:** toca los mismos dos ficheros, así que debe partir de una base que ya contenga `slugify` (rama de T-001 o T-001 ya integrada). `examples/demo/text.mjs` es un módulo ESM sin dependencias ni punto y coma que exporta `capitalize(text)` y `slugify(text)`; `examples/demo/text.test.mjs` los prueba con `node:test` y `node:assert/strict`. Hay que añadir y probar `export function truncate(text, max)`: si `text` supera `max` caracteres, lo corta y termina en `…` sin pasar de `max`. El `…` es un único carácter (U+2026) y cuenta para el límite.

## Ficheros afectados

- `examples/demo/text.mjs` — añadir y exportar `truncate(text, max)`; `capitalize` y `slugify` no cambian.
- `examples/demo/text.test.mjs` — ampliar el import y añadir `test('truncate', ...)`; los tests existentes no cambian.

## Criterios de aceptación

- [ ] AC1: `truncate` devuelve exactamente estas salidas:

  | `text` | `max` | Salida | Motivo |
  | --- | --- | --- | --- |
  | `'Hola mundo'` | `20` | `'Hola mundo'` | no supera `max` |
  | `'Hola mundo'` | `10` | `'Hola mundo'` | longitud igual a `max` |
  | `'Hola mundo'` | `9` | `'Hola mun…'` | corta a `max - 1` y añade `…` |
  | `'Hola mundo'` | `6` | `'Hola …'` | no recorta espacios antes de `…` |
  | `'Hola mundo'` | `5` | `'Hola…'` | corta a `max - 1` y añade `…` |
  | `'Hola mundo'` | `2` | `'H…'` | `max` pequeño |
  | `'Hola mundo'` | `1` | `'…'` | solo cabe `…` |
  | `'Hola mundo'` | `0` | `''` | no cabe nada |
  | `'Hola mundo'` | `-1` | `''` | `max` negativo |
  | `''` | `5` | `''` | texto vacío |
  | `''` | `0` | `''` | texto vacío y `max` 0 |
  | `'a'` | `1` | `'a'` | longitud igual a `max` |
  | `'ab'` | `1` | `'…'` | supera `max` |

- [ ] AC2: en los casos de AC1, el resultado nunca tiene más de `max` caracteres cuando `max >= 0`. El contrato cubre `text` de tipo string y `max` entero; otros tipos, fracciones y `NaN` quedan fuera de alcance.
- [ ] AC3: `examples/demo/text.test.mjs` incluye los 13 casos de AC1, con una aserción `assert.equal(truncate(...), ...)` por caso (sin bucles ni tablas), con las salidas escritas literalmente (`…` como carácter, no como secuencia de escape), y pasa con `node --test`.
- [ ] AC4: `capitalize`, `slugify` y sus tests siguen funcionando igual.
- [ ] AC5: sin cambios fuera de los dos ficheros listados.

## Verificación

```bash
node --input-type=module -e "import assert from 'node:assert/strict'; import {readFileSync} from 'node:fs'; import {execFileSync,spawnSync} from 'node:child_process'; const {capitalize,slugify,truncate}=await import('./examples/demo/text.mjs'); assert.equal(typeof slugify,'function','falta slugify: la base debe incluir T-001'); const cases=[['Hola mundo',20,'Hola mundo'],['Hola mundo',10,'Hola mundo'],['Hola mundo',9,'Hola mun…'],['Hola mundo',6,'Hola …'],['Hola mundo',5,'Hola…'],['Hola mundo',2,'H…'],['Hola mundo',1,'…'],['Hola mundo',0,''],['Hola mundo',-1,''],['',5,''],['',0,''],['a',1,'a'],['ab',1,'…']]; const src=readFileSync('examples/demo/text.test.mjs','utf8'); assert.ok(src.includes('capitalize(') && src.split('slugify(').length-1>=11 && src.split('truncate(').length-1>=13,'faltan tests'); for (const [text,max,output] of cases) { const result=truncate(text,max); assert.equal(result,output); assert.ok(result.length<=Math.max(max,0),'supera max'); assert.ok(src.includes(text) && src.includes(output) && src.includes(String(max)),'caso sin test: '+text+' '+max) } assert.equal(capitalize('cachés'),'Cachés'); assert.equal(slugify('Canción de Ñandú'),'cancion-de-nandu'); const allowed=['examples/demo/text.mjs','examples/demo/text.test.mjs']; const extra=execFileSync('git',['status','--porcelain','--','.',':(exclude)node_modules'],{encoding:'utf8'}).split('\n').filter(Boolean).filter((line)=>allowed.includes(line.slice(3))===false); assert.deepEqual(extra,[],'cambios fuera de alcance'); assert.equal(spawnSync(process.execPath,['--test','examples/demo/text.test.mjs'],{stdio:'inherit'}).status,0,'node --test falla')"
```

## Notas para el obrero

- No añadas dependencias.
- No toques ficheros fuera de la lista.
- Estilo del módulo: ESM, sin punto y coma, dos espacios y un comentario JSDoc de una línea, como `capitalize`.
- Usa `text.length` y `text.slice`; los emojis y otros pares sustitutos quedan fuera de alcance.
- Si `slugify` no existe, la base es incorrecta: no la implementes; deja la tarea sin completar e indícalo en tu resumen.
- El comando comprueba el código y los tests. Si falla, corrige el código o los tests; no cambies las salidas esperadas de AC1.
