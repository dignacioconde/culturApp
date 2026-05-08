#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const result = spawnSync('node', ['scripts/brain/capture.mjs', ...process.argv.slice(2)], {
  cwd: repoRoot,
  stdio: 'inherit',
})

process.exitCode = result.status ?? 1
