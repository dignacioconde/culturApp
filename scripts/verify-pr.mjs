#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { repoRoot } from './brain/lib.mjs'

const args = process.argv.slice(2)
const jsonOutput = args.includes('--json')
const softIssueCheck = args.includes('--soft-issue-check')
const base = valueFor('--base') ?? 'origin/main'
const issue = valueFor('--issue')
const results = []

function valueFor(name) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : null
}

function run(command, commandArgs, options = {}) {
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
    required: options.required ?? true,
  }
  if (jsonOutput) {
    entry.stdout = result.stdout.trim()
    entry.stderr = result.stderr.trim()
  }
  results.push(entry)
  return entry.ok || entry.required === false
}

let ok = true
ok = run('git', ['diff', '--check', `${base}...HEAD`]) && ok
ok = run('npm', ['run', 'verify:ci']) && ok

if (issue) {
  ok = run('npm', ['run', 'pb:close-check', '--', issue, '--json'], { required: !softIssueCheck }) && ok
}

if (jsonOutput) {
  console.log(JSON.stringify({ ok, base, issue: issue ?? null, softIssueCheck, results }, null, 2))
} else if (ok) {
  console.log(`[verify:pr] OK: preflight contra ${base} paso`)
} else {
  console.error(`[verify:pr] ERROR: preflight contra ${base} fallo`)
}

process.exitCode = ok ? 0 : 1
