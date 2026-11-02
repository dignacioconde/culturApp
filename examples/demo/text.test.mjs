import assert from 'node:assert/strict'
import { test } from 'node:test'
import { capitalize, slugify, truncate } from './text.mjs'

test('capitalize', () => {
  assert.equal(capitalize('cachés'), 'Cachés')
  assert.equal(capitalize(''), '')
})

test('slugify', () => {
  assert.equal(slugify('Hola Mundo'), 'hola-mundo')
  assert.equal(slugify('Canción de Ñandú'), 'cancion-de-nandu')
  assert.equal(slugify('¿Qué tal, mundo?'), 'que-tal-mundo')
  assert.equal(slugify('  Teatro   y   danza  '), 'teatro-y-danza')
  assert.equal(slugify('uno---dos'), 'uno-dos')
  assert.equal(slugify('--hola--'), 'hola')
  assert.equal(slugify('Acto 2: Final'), 'acto-2-final')
  assert.equal(slugify('a_b.c/d'), 'a-b-c-d')
  assert.equal(slugify(''), '')
  assert.equal(slugify('   '), '')
  assert.equal(slugify('¿?¡...'), '')
})

test('truncate', () => {
  assert.equal(truncate('Hola mundo', 20), 'Hola mundo')
  assert.equal(truncate('Hola mundo', 10), 'Hola mundo')
  assert.equal(truncate('Hola mundo', 9), 'Hola mun…')
  assert.equal(truncate('Hola mundo', 6), 'Hola …')
  assert.equal(truncate('Hola mundo', 5), 'Hola…')
  assert.equal(truncate('Hola mundo', 2), 'H…')
  assert.equal(truncate('Hola mundo', 1), '…')
  assert.equal(truncate('Hola mundo', 0), '')
  assert.equal(truncate('Hola mundo', -1), '')
  assert.equal(truncate('', 5), '')
  assert.equal(truncate('', 0), '')
  assert.equal(truncate('a', 1), 'a')
  assert.equal(truncate('ab', 1), '…')
})
