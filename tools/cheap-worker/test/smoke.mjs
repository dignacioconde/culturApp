#!/usr/bin/env node
// Smoke test por stdio del MCP `cheap-worker`.
//   node tools/cheap-worker/test/smoke.mjs                      → protocolo, parsers y errores (sin coste)
//   node tools/cheap-worker/test/smoke.mjs --live [--model X]   → delegación real de una tarea mínima
import assert from 'node:assert/strict'
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises'
import path from 'node:path'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { REPO_ROOT, runCommand } from '../../lib/run.mjs'
import { LOG_FILE, parseEnv, parseTask } from '../worker.mjs'

const live = process.argv.includes('--live')
const modelArg = process.argv[process.argv.indexOf('--model') + 1]
const model = process.argv.includes('--model') ? modelArg : undefined

const ok = (message) => console.log(`ok  ${message}`)
const json = (result) => JSON.parse(result.content[0].text)

// Parsers puros.
assert.deepEqual(parseEnv('A=1\n# c\nB="dos"\nC=\n  D = x '), { A: '1', B: 'dos', C: '', D: 'x' })
const sample = '---\nid: T-123\ntitle: Prueba\nrecommended_model: deepseek\n---\n# T\n\n## Verificación\n\n```bash\nnode --test x\n```\n'
assert.deepEqual(
  (({ id, title, recommendedModel, verifyCommand }) => ({ id, title, recommendedModel, verifyCommand }))(parseTask(sample, 'T-123.md')),
  { id: 'T-123', title: 'Prueba', recommendedModel: 'deepseek', verifyCommand: 'node --test x' },
)
assert.throws(() => parseTask(sample.replace('node --test x', 'a\nb'), 'T-123.md'), /único comando/)
ok('parseEnv y parseTask')

const client = new Client({ name: 'cheap-worker-smoke', version: '1.0.0' })
await client.connect(new StdioClientTransport({ command: 'node', args: ['tools/cheap-worker/server.mjs'], cwd: REPO_ROOT, stderr: 'inherit' }))

try {
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ['delegate_task', 'list_models', 'usage_report'])
  ok('listTools: delegate_task, list_models, usage_report')

  const models = json(await client.callTool({ name: 'list_models', arguments: {} }))
  assert.ok(models.chain.length > 0)
  for (const alias of models.chain) assert.ok(models.models.some((row) => row.alias === alias), `alias de la cadena sin definir: ${alias}`)
  ok(`list_models: cadena ${models.chain.join(' → ')}`)
  for (const row of models.models) console.log(`    ${row.available ? '✔' : '✘'} ${row.alias.padEnd(14)} ${row.model}${row.reason ? `  (${row.reason})` : ''}`)

  const report = json(await client.callTool({ name: 'usage_report', arguments: {} }))
  assert.ok('total' in report)
  ok(`usage_report: ${report.models.length} modelos en ${path.relative(REPO_ROOT, report.log)}`)

  const missing = await client.callTool({ name: 'delegate_task', arguments: { task_file: 'docs/tasks/T-000-no-existe.md' } })
  assert.equal(missing.isError, true)
  ok('delegate_task con tarea inexistente → error')

  const outside = await client.callTool({ name: 'delegate_task', arguments: { task_file: '../../etc/passwd' } })
  assert.equal(outside.isError, true)
  ok('delegate_task fuera del repo → rechazado')

  if (live) await liveDelegation()
  console.log('smoke cheap-worker: OK')
} finally {
  await client.close()
}

async function liveDelegation() {
  // La tarea vive en logs/ (ignorado): no ensucia el repo ni hace falta commitearla.
  const taskFile = path.join('logs', 'smoke', 'T-999-smoke-sum.md')
  await mkdir(path.join(REPO_ROOT, 'logs', 'smoke'), { recursive: true })
  await writeFile(path.join(REPO_ROOT, taskFile), `---
id: T-999
title: Crear sum() de smoke test
status: todo
---
# T-999 — Crear sum() de smoke test

## Contexto mínimo

Smoke test de cheap-worker. Crea un módulo ESM mínimo.

## Ficheros afectados

- \`tmp-smoke/sum.mjs\` — nuevo; exporta \`sum(a, b)\` que devuelve \`a + b\`.

## Criterios de aceptación

- [ ] AC1: \`sum(2, 3) === 5\`.

## Verificación

\`\`\`bash
node -e "import('./tmp-smoke/sum.mjs').then((m) => process.exit(m.sum(2, 3) === 5 ? 0 : 1))"
\`\`\`
`)

  const linesBefore = (await readFile(LOG_FILE, 'utf8').catch(() => '')).split('\n').filter(Boolean).length
  const result = await client.callTool({ name: 'delegate_task', arguments: { task_file: taskFile, model, max_retries: 1, budget_s: 900 } })
  const outcome = result.isError ? { error: result.content[0].text } : json(result)
  console.log(JSON.stringify({ ...outcome, diff: undefined }, null, 2))

  try {
    assert.notEqual(result.isError, true)
    assert.equal(outcome.passed, true, 'la delegación no pasó la verificación')
    assert.match(outcome.branch, /^worker\/T-999-/)
    assert.ok(outcome.commit, 'sin commit en la rama worker')
    const current = (await runCommand('git', ['rev-parse', '--abbrev-ref', 'HEAD'], { cwd: REPO_ROOT })).stdout.trim()
    assert.ok(!current.startsWith('worker/'), 'el checkout principal no debe cambiar de rama')
    ok(`delegate_task real: ${outcome.model_used} en ${outcome.attempts.length} intento(s), ${outcome.total_cost_usd} USD`)

    const logLines = (await readFile(LOG_FILE, 'utf8')).split('\n').filter(Boolean)
    const newEntries = logLines.slice(linesBefore).map((line) => JSON.parse(line))
    assert.equal(newEntries.length, outcome.attempts.length)
    assert.ok(newEntries.every((entry) => entry.cost_usd !== null && entry.tokens), 'intento sin coste/tokens registrados')
    ok(`logs/worker.jsonl: ${newEntries.length} intento(s) con coste y tokens`)
  } finally {
    if (outcome.worktree) {
      await runCommand('git', ['worktree', 'remove', '--force', outcome.worktree], { cwd: REPO_ROOT })
      await runCommand('git', ['branch', '-D', outcome.branch], { cwd: REPO_ROOT })
    }
    await rm(path.join(REPO_ROOT, 'logs', 'smoke'), { recursive: true, force: true })
  }
}
