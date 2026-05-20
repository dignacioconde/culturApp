#!/usr/bin/env node
import { existsSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { spawnSync } from 'node:child_process'
import { performance } from 'node:perf_hooks'
import { repoRoot } from './lib.mjs'

const args = process.argv.slice(2)
const jsonOutput = args.includes('--json')
const updateBaseline = args.includes('--update-baseline')
const fixturesRoot = join(repoRoot, 'scripts', 'brain', 'fixtures')
const retrievalCasesPath = join(fixturesRoot, 'metrics-retrieval-cases.json')
const sddCasesPath = join(fixturesRoot, 'metrics-sdd-cases.json')
const baselinePath = join(fixturesRoot, 'metrics-baseline.json')
const retrieveScript = join(repoRoot, 'scripts', 'brain', 'retrieve.mjs')
const readyCheckScript = join(repoRoot, 'scripts', 'brain', 'ready-check.mjs')
const sddCheckScript = join(repoRoot, 'scripts', 'brain', 'sdd-check.mjs')

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'))
}

function tryReadJson(path) {
  if (!existsSync(path)) return null
  return readJson(path)
}

function runNode(script, scriptArgs, env = {}) {
  const started = performance.now()
  const result = spawnSync(process.execPath, [script, ...scriptArgs], {
    cwd: repoRoot,
    encoding: 'utf8',
    env: { ...process.env, ...env },
  })
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
    duration_ms: Math.round(performance.now() - started),
  }
}

function parseCommandJson(command, label) {
  try {
    return JSON.parse(command.stdout)
  } catch (error) {
    throw new Error(`${label} no devolvio JSON parseable: ${error.message}`)
  }
}

function percentile(values, percentileValue) {
  if (values.length === 0) return 0
  const sorted = [...values].sort((a, b) => a - b)
  const index = Math.min(sorted.length - 1, Math.ceil(percentileValue * sorted.length) - 1)
  return sorted[index]
}

function latencyStats(durations) {
  return {
    min_ms: Math.min(...durations),
    median_ms: percentile(durations, 0.5),
    p95_ms: percentile(durations, 0.95),
  }
}

function firstRelevantRank(results, expected) {
  const ranks = expected
    .map((rel) => results.findIndex((item) => item.rel === rel))
    .filter((index) => index >= 0)
    .map((index) => index + 1)
  return ranks.length ? Math.min(...ranks) : null
}

function runRetrievalCase(testCase, config) {
  const iterations = testCase.iterations ?? config.iterations ?? 3
  const limit = testCase.limit ?? config.limit ?? 10
  const durations = []
  let parsed = null

  for (let index = 0; index < iterations; index += 1) {
    const commandArgs = ['--profile', testCase.profile, '--limit', String(limit), '--json']
    if (testCase.query) commandArgs.push('--query', testCase.query)
    if (testCase.issue) commandArgs.push('--issue', testCase.issue)

    const command = runNode(retrieveScript, commandArgs)
    durations.push(command.duration_ms)
    if (!command.ok) {
      return {
        id: testCase.id,
        ok: false,
        errors: [`pb:retrieve fallo con status ${command.status}: ${command.stderr || command.stdout}`],
        warnings: [],
        durations,
      }
    }
    parsed = parseCommandJson(command, `retrieval ${testCase.id}`)
  }

  const topResults = parsed.results ?? []
  const expected = testCase.expected_top10 ?? []
  const forbidden = testCase.forbidden_top10 ?? []
  const expectedMissing = expected.filter((rel) => !topResults.some((item) => item.rel === rel))
  const forbiddenHits = forbidden.filter((rel) => topResults.some((item) => item.rel === rel))
  const rank = firstRelevantRank(topResults, expected)
  const stats = latencyStats(durations)
  const warnings = []

  if (expectedMissing.length > 0) warnings.push(`faltan esperados top10: ${expectedMissing.join(', ')}`)
  if (forbiddenHits.length > 0) warnings.push(`aparecen prohibidos top10: ${forbiddenHits.join(', ')}`)

  return {
    id: testCase.id,
    ok: true,
    profile: testCase.profile,
    query: testCase.query ?? null,
    issue: testCase.issue ?? null,
    count: parsed.count,
    excluded_count: parsed.excluded_count,
    hit_rate_at_10: expected.length ? Number(((expected.length - expectedMissing.length) / expected.length).toFixed(3)) : 1,
    mrr: rank ? Number((1 / rank).toFixed(3)) : 0,
    expected_missing: expectedMissing,
    forbidden_hits: forbiddenHits,
    latency: stats,
    top_results: topResults.map((item) => ({
      rel: item.rel,
      id: item.id,
      score: item.score,
      reason: item.reason,
    })),
    warnings,
    errors: [],
  }
}

function yamlScalar(value) {
  if (value === null) return 'null'
  if (typeof value === 'boolean') return value ? 'true' : 'false'
  if (typeof value === 'number') return String(value)
  return JSON.stringify(String(value))
}

function yamlFrontmatter(data) {
  const lines = []
  for (const [key, value] of Object.entries(data)) {
    if (Array.isArray(value)) {
      if (value.length === 0) lines.push(`${key}: []`)
      else {
        lines.push(`${key}:`)
        for (const item of value) lines.push(`  - ${yamlScalar(item)}`)
      }
    } else {
      lines.push(`${key}: ${yamlScalar(value)}`)
    }
  }
  return lines.join('\n')
}

function issueMarkdown(testCase) {
  const frontmatter = {
    schema_version: 2,
    kind: 'issue',
    id: testCase.issue_id,
    title: testCase.title,
    lifecycle: 'active',
    created: '2026-05-20',
    updated: '2026-05-20',
    aliases: [testCase.issue_id],
    tags: ['product-brain', 'issue', 'fixture'],
    generated: false,
    ...testCase.frontmatter,
  }
  const sections = Object.entries(testCase.sections)
    .map(([heading, content]) => `## ${heading}\n\n${content.trim()}`)
    .join('\n\n')
  return `---\n${yamlFrontmatter(frontmatter)}\n---\n# ${testCase.issue_id} - ${testCase.title}\n\n${sections}\n`
}

function includesAny(values, expectedFragments) {
  return expectedFragments.every((fragment) => values.some((value) => String(value).includes(fragment)))
}

function runSddCases(config) {
  const tempRoot = join(tmpdir(), `cultura-pb-metrics-${process.pid}`)
  rmSync(tempRoot, { recursive: true, force: true })
  mkdirSync(join(tempRoot, 'issues'), { recursive: true })

  try {
    for (const testCase of config.cases) {
      writeFileSync(join(tempRoot, 'issues', `${testCase.issue_id}.md`), issueMarkdown(testCase))
    }

    return config.cases.map((testCase) => runSddCase(testCase, tempRoot))
  } finally {
    rmSync(tempRoot, { recursive: true, force: true })
  }
}

function runSddCase(testCase, tempRoot) {
  const env = { PRODUCT_BRAIN_REPO_PATH: tempRoot }
  const expect = testCase.expect ?? {}
  const result = {
    id: testCase.id,
    issue: testCase.issue_id,
    ready: null,
    sdd: null,
    warnings: [],
    errors: [],
  }

  if (expect.run_ready !== false) {
    const readyCommand = runNode(readyCheckScript, [testCase.issue_id, '--json'], env)
    const ready = parseCommandJson(readyCommand, `ready ${testCase.id}`)
    result.ready = {
      ok: ready.ok,
      status: readyCommand.status,
      duration_ms: readyCommand.duration_ms,
      errors: ready.errors ?? [],
    }
    if (typeof expect.ready_ok === 'boolean' && ready.ok !== expect.ready_ok) {
      result.errors.push(`ready-check esperaba ok=${expect.ready_ok} y devolvio ok=${ready.ok}`)
    }
    if (expect.ready_errors_contain && !includesAny(ready.errors ?? [], expect.ready_errors_contain)) {
      result.errors.push(`ready-check no incluyo errores esperados: ${expect.ready_errors_contain.join(', ')}`)
    }
  }

  const sddCommand = runNode(sddCheckScript, [testCase.issue_id, '--json'], env)
  const sdd = parseCommandJson(sddCommand, `sdd ${testCase.id}`)
  result.sdd = {
    ok: sdd.ok,
    status: sddCommand.status,
    duration_ms: sddCommand.duration_ms,
    errors: sdd.errors ?? [],
    warnings: sdd.warnings ?? [],
  }
  if (typeof expect.sdd_ok === 'boolean' && sdd.ok !== expect.sdd_ok) {
    result.errors.push(`sdd-check esperaba ok=${expect.sdd_ok} y devolvio ok=${sdd.ok}`)
  }
  if (expect.sdd_errors_contain && !includesAny(sdd.errors ?? [], expect.sdd_errors_contain)) {
    result.errors.push(`sdd-check no incluyo errores esperados: ${expect.sdd_errors_contain.join(', ')}`)
  }
  if (expect.sdd_warnings_contain && !includesAny(sdd.warnings ?? [], expect.sdd_warnings_contain)) {
    result.errors.push(`sdd-check no incluyo warnings esperados: ${expect.sdd_warnings_contain.join(', ')}`)
  }

  return result
}

function compareWithBaseline(metrics, baseline) {
  const warnings = []
  if (!baseline) {
    warnings.push('baseline ausente; ejecuta npm run pb:metrics -- --update-baseline para crearla')
    return warnings
  }

  const baselineRetrieval = baseline.retrieval?.cases ?? {}
  for (const testCase of metrics.retrieval.cases) {
    const previous = baselineRetrieval[testCase.id]
    if (!previous) {
      warnings.push(`retrieval ${testCase.id}: sin baseline`)
      continue
    }
    if (testCase.hit_rate_at_10 < previous.hit_rate_at_10) {
      warnings.push(`retrieval ${testCase.id}: hit_rate@10 bajo de ${previous.hit_rate_at_10} a ${testCase.hit_rate_at_10}`)
    }
    if (testCase.mrr < previous.mrr) {
      warnings.push(`retrieval ${testCase.id}: mrr bajo de ${previous.mrr} a ${testCase.mrr}`)
    }
    if (previous.p95_ms > 0 && testCase.latency.p95_ms > Math.round(previous.p95_ms * 1.5 + 25)) {
      warnings.push(`retrieval ${testCase.id}: p95 subio de ${previous.p95_ms}ms a ${testCase.latency.p95_ms}ms`)
    }
  }

  const baselineSdd = baseline.sdd?.cases ?? {}
  for (const testCase of metrics.sdd.cases) {
    const previous = baselineSdd[testCase.id]
    if (!previous) {
      warnings.push(`sdd ${testCase.id}: sin baseline`)
      continue
    }
    if (previous.ready_ok !== (testCase.ready?.ok ?? null)) {
      warnings.push(`sdd ${testCase.id}: ready_ok cambio de ${previous.ready_ok} a ${testCase.ready?.ok ?? null}`)
    }
    if (previous.sdd_ok !== testCase.sdd.ok) {
      warnings.push(`sdd ${testCase.id}: sdd_ok cambio de ${previous.sdd_ok} a ${testCase.sdd.ok}`)
    }
  }

  return warnings
}

function baselineFrom(metrics) {
  return {
    schema_version: 1,
    mode: 'advisory',
    retrieval: {
      cases: Object.fromEntries(metrics.retrieval.cases.map((testCase) => [testCase.id, {
        hit_rate_at_10: testCase.hit_rate_at_10,
        mrr: testCase.mrr,
        expected_missing_count: testCase.expected_missing.length,
        forbidden_hits_count: testCase.forbidden_hits.length,
        count: testCase.count,
        excluded_count: testCase.excluded_count,
        p95_ms: testCase.latency.p95_ms,
      }])),
    },
    sdd: {
      cases: Object.fromEntries(metrics.sdd.cases.map((testCase) => [testCase.id, {
        ready_ok: testCase.ready?.ok ?? null,
        sdd_ok: testCase.sdd.ok,
        ready_duration_ms: testCase.ready?.duration_ms ?? null,
        sdd_duration_ms: testCase.sdd.duration_ms,
      }])),
    },
  }
}

function printHuman(metrics) {
  console.log('[pb:metrics] Retrieval')
  for (const testCase of metrics.retrieval.cases) {
    const marker = testCase.warnings.length ? 'WARN' : 'OK'
    console.log(`${marker}  ${testCase.id}  hit@10=${testCase.hit_rate_at_10} mrr=${testCase.mrr} p95=${testCase.latency.p95_ms}ms excluded=${testCase.excluded_count}`)
    for (const warning of testCase.warnings) console.log(`      warning: ${warning}`)
    for (const error of testCase.errors) console.log(`      error: ${error}`)
  }

  console.log('')
  console.log('[pb:metrics] SDD/ready')
  for (const testCase of metrics.sdd.cases) {
    const marker = testCase.errors.length ? 'ERROR' : 'OK'
    const ready = testCase.ready ? `ready=${testCase.ready.ok ? 'OK' : 'FAIL'}:${testCase.ready.duration_ms}ms` : 'ready=SKIP'
    const sdd = `sdd=${testCase.sdd.ok ? 'OK' : 'FAIL'}:${testCase.sdd.duration_ms}ms`
    console.log(`${marker}  ${testCase.id}  ${ready} ${sdd}`)
    for (const error of testCase.errors) console.log(`      error: ${error}`)
  }

  if (metrics.warnings.length) {
    console.log('')
    console.log('[pb:metrics] Advisory warnings')
    for (const warning of metrics.warnings) console.log(`WARN  ${warning}`)
  }

  if (metrics.baseline.updated) {
    console.log('')
    console.log(`[pb:metrics] baseline actualizada: ${metrics.baseline.path}`)
  }

  console.log('')
  console.log(`[pb:metrics] ${metrics.ok ? 'OK' : 'ERROR'}: ${metrics.error_count} errores criticos, ${metrics.warning_count} warnings advisory`)
}

function main() {
  const retrievalConfig = readJson(retrievalCasesPath)
  const sddConfig = readJson(sddCasesPath)
  const baseline = tryReadJson(baselinePath)
  const retrievalCases = retrievalConfig.cases.map((testCase) => runRetrievalCase(testCase, retrievalConfig))
  const sddCases = runSddCases(sddConfig)
  const errors = [
    ...retrievalCases.flatMap((testCase) => testCase.ok ? [] : testCase.errors),
    ...sddCases.flatMap((testCase) => testCase.errors),
  ]

  const metrics = {
    ok: errors.length === 0,
    error_count: errors.length,
    warning_count: 0,
    errors,
    warnings: [],
    baseline: {
      path: 'scripts/brain/fixtures/metrics-baseline.json',
      loaded: Boolean(baseline),
      updated: false,
    },
    retrieval: {
      cases: retrievalCases,
    },
    sdd: {
      temp_root_used: true,
      cases: sddCases,
    },
  }

  metrics.warnings.push(...retrievalCases.flatMap((testCase) => testCase.warnings))
  if (!updateBaseline) metrics.warnings.push(...compareWithBaseline(metrics, baseline))
  metrics.warning_count = metrics.warnings.length

  if (updateBaseline && metrics.ok) {
    writeFileSync(baselinePath, `${JSON.stringify(baselineFrom(metrics), null, 2)}\n`)
    metrics.baseline.updated = true
    metrics.baseline.loaded = true
  }

  if (jsonOutput) console.log(JSON.stringify(metrics, null, 2))
  else printHuman(metrics)

  process.exitCode = metrics.ok ? 0 : 1
}

try {
  main()
} catch (error) {
  const payload = {
    ok: false,
    error_count: 1,
    warning_count: 0,
    errors: [error.message],
    warnings: [],
  }
  if (jsonOutput) console.log(JSON.stringify(payload, null, 2))
  else console.error(`[pb:metrics] ERROR: ${error.message}`)
  process.exitCode = 1
}
