import assert from 'node:assert/strict'
import { test } from 'node:test'
import { capitalize } from './text.mjs'

test('capitalize', () => {
  assert.equal(capitalize('cachés'), 'Cachés')
  assert.equal(capitalize(''), '')
})
