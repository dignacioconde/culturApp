#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { repoRoot } from './brain/lib.mjs'

const jsonOutput = process.argv.includes('--json')
const steps = [
  ['npm', ['run', 'lint']],
  ['npm', ['run', 'test']],
  ['npm', ['run', 'verify:version-history']],
  ['npm', ['run', 'build']],
  ['npm', ['run', 'pb:check', '--', '--strict', '--json']],
  ['npm', ['run', 'verify:brain']],
  ['npm', ['run', 'verify:skills']],
  ['npm', ['run', 'verify:agents']],
]
const results = []

function runStep(command, args) {
  const startedAt = Date.now()
  const result = spawnSync(command, args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: jsonOutput ? 'pipe' : 'inherit',
  })
  const entry = {
    command: [command, ...args].join(' '),
    ok: result.status === 0,
    status: result.status ?? 1,
    elapsed_ms: Date.now() - startedAt,
  }
  if (jsonOutput) {
    entry.stdout = result.stdout.trim()
    entry.stderr = result.stderr.trim()
  }
  results.push(entry)
  return entry.ok
}

let ok = true
for (const [command, args] of steps) {
  if (!runStep(command, args)) {
    ok = false
    break
  }
}

if (jsonOutput) {
  console.log(JSON.stringify({ ok, results }, null, 2))
} else if (ok) {
  console.log('[verify:ci] OK: checks locales equivalentes al job app pasaron')
} else {
  console.error('[verify:ci] ERROR: fallo un check local equivalente al job app')
}

process.exitCode = ok ? 0 : 1
