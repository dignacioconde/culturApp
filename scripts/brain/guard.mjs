#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { repoRoot } from './lib.mjs'

const args = process.argv.slice(2)
const jsonOutput = args.includes('--json')
const issue = valueFor('--issue')
const phase = valueFor('--phase')
const results = []

function valueFor(name) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : null
}

function run(command, commandArgs) {
  const startedAt = Date.now()
  const result = spawnSync(command, commandArgs, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: jsonOutput ? 'pipe' : 'inherit',
  })
  const entry = {
    command: [command, ...commandArgs].join(' '),
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
ok = run('npm', ['run', 'pb:check', '--', '--strict', '--json']) && ok
ok = run('npm', ['run', 'verify:brain']) && ok
ok = run('npm', ['run', 'pb:index', '--', '--check', '--json']) && ok
ok = run('npm', ['run', 'pb:digest', '--', '--check', '--json']) && ok

if (issue && phase === 'ready') ok = run('npm', ['run', 'pb:ready-check', '--', issue, '--json']) && ok
if (issue && phase === 'close') ok = run('npm', ['run', 'pb:close-check', '--', issue, '--json']) && ok

if (jsonOutput) {
  console.log(JSON.stringify({ ok, issue: issue ?? null, phase: phase ?? null, results }, null, 2))
} else if (ok) {
  console.log('[pb:guard] OK: Product Brain coherente y artefactos generados frescos')
} else {
  console.error('[pb:guard] ERROR: Product Brain no pasa guardrails')
}

process.exitCode = ok ? 0 : 1
