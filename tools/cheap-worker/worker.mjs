// Lógica de cheap-worker: config, disponibilidad de modelos, delegación en worktree
// con reintentos y fallback, y registro de consumo. Ver ADR-002 y ADR-004.
import { existsSync } from 'node:fs'
import { appendFile, mkdir, mkdtemp, readFile, rm, symlink, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import YAML from 'yaml'
import { REPO_ROOT, resolveRepoPath, runCommand, tail } from '../lib/run.mjs'

const OPENCODE_BIN = process.env.OPENCODE_BIN || 'opencode'
const WORKER_IDENTITY = ['-c', 'user.name=cheap-worker', '-c', 'user.email=cheap-worker@culturapp.local']
const SECRET_PATTERN = /\b(sk-[A-Za-z0-9_-]{20,}|sk-or-v1-[A-Za-z0-9]{20,})\b/

// Checkout principal (comparte .git con todos los worktrees). Ahí viven .env y logs/,
// así sirven igual desde culturApp, culturApp-orchestra o .worktrees/T-xxx.
async function findMainRoot() {
  const result = await runCommand('git', ['rev-parse', '--path-format=absolute', '--git-common-dir'], { cwd: REPO_ROOT })
  return result.code === 0 ? path.dirname(result.stdout.trim()) : REPO_ROOT
}

export const MAIN_ROOT = await findMainRoot()
export const LOG_FILE = path.join(MAIN_ROOT, 'logs', 'worker.jsonl')

// --- .env ------------------------------------------------------------------------

export function parseEnv(text) {
  const vars = {}
  for (const line of text.split('\n')) {
    const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/)
    if (!match) continue
    vars[match[1]] = match[2].replace(/^(['"])(.*)\1$/, '$2')
  }
  return vars
}

// Prioridad: variable de entorno no vacía > .env del checkout actual > .env del principal.
export async function loadEnv() {
  const env = {}
  for (const root of [...new Set([MAIN_ROOT, REPO_ROOT])]) {
    const file = path.join(root, '.env')
    if (!existsSync(file)) continue
    for (const [key, value] of Object.entries(parseEnv(await readFile(file, 'utf8')))) {
      if (value) env[key] = value
    }
  }
  for (const [key, value] of Object.entries(process.env)) {
    if (value) env[key] = value
  }
  return env
}

// --- Config y disponibilidad -----------------------------------------------------

export async function loadConfig() {
  const config = YAML.parse(await readFile(path.join(REPO_ROOT, 'config', 'models.yaml'), 'utf8'))
  for (const [alias, model] of Object.entries(config.models)) {
    model.alias = alias
    model.provider = model.model.split('/')[0]
  }
  return config
}

async function ollamaHasModel(baseUrl, name) {
  try {
    const response = await fetch(`${baseUrl}/api/tags`, { signal: AbortSignal.timeout(2000) })
    const { models = [] } = await response.json()
    return models.some((model) => model.name === name || model.name === `${name}:latest`)
  } catch {
    return false
  }
}

export async function checkAvailability(model, env) {
  if (model.provider === 'ollama') {
    const baseUrl = env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'
    const name = model.model.slice('ollama/'.length)
    return (await ollamaHasModel(baseUrl, name))
      ? { available: true }
      : { available: false, reason: `Ollama no responde en ${baseUrl} o falta \`ollama pull ${name}\`` }
  }
  if (model.env && !env[model.env]) return { available: false, reason: `falta ${model.env} en .env` }
  return { available: true }
}

// --- Config aislada de OpenCode ------------------------------------------------

export function buildOpencodeConfig(config, env) {
  const output = config.defaults.output_tokens
  const provider = {}
  for (const model of Object.values(config.models)) {
    const id = model.model.slice(model.provider.length + 1)
    provider[model.provider] ??= { models: {} }
    provider[model.provider].models[id] = { limit: { context: model.context, output } }
  }
  provider.ollama = {
    npm: '@ai-sdk/openai-compatible',
    name: 'Ollama',
    options: { baseURL: `${env.OLLAMA_BASE_URL || 'http://127.0.0.1:11434'}/v1` },
    models: Object.fromEntries(
      Object.entries(provider.ollama?.models ?? {}).map(([id, value]) => [id, { name: id, ...value }]),
    ),
  }
  return {
    $schema: 'https://opencode.ai/config.json',
    autoupdate: false,
    share: 'disabled',
    provider,
    permission: {
      edit: 'allow',
      webfetch: 'deny',
      external_directory: 'deny',
      read: { '*': 'allow', '*.env': 'deny', '*.env.*': 'deny', '*.env.example': 'allow' },
      bash: {
        '*': 'allow',
        'git commit*': 'deny',
        'git push*': 'deny',
        'git merge*': 'deny',
        'git rebase*': 'deny',
        'git reset*': 'deny',
        'git checkout*': 'deny',
        'git switch*': 'deny',
        'git worktree*': 'deny',
        'env': 'deny',
        'env *': 'deny',
        'printenv*': 'deny',
        'curl *': 'deny',
        'wget *': 'deny',
      },
    },
  }
}

// Entorno mínimo para el obrero: sin claves de otros proveedores ni de Supabase.
function workerEnv(env, model, opencodeConfigPath) {
  const keep = ['PATH', 'HOME', 'USER', 'SHELL', 'LANG', 'TMPDIR', 'TERM']
  const result = Object.fromEntries(keep.filter((key) => env[key]).map((key) => [key, env[key]]))
  if (model.env) result[model.env] = env[model.env]
  if (env.OLLAMA_BASE_URL) result.OLLAMA_BASE_URL = env.OLLAMA_BASE_URL
  result.OPENCODE_CONFIG = opencodeConfigPath
  result.NO_COLOR = '1'
  return result
}

function verifyEnv(env) {
  const keep = ['PATH', 'HOME', 'USER', 'SHELL', 'LANG', 'TMPDIR', 'TERM']
  return { ...Object.fromEntries(keep.filter((key) => env[key]).map((key) => [key, env[key]])), CI: '1', NO_COLOR: '1' }
}

// --- Tareas ----------------------------------------------------------------------

export function parseTask(text, file) {
  const frontmatter = text.match(/^---\n([\s\S]*?)\n---/)
  const meta = frontmatter ? YAML.parse(frontmatter[1]) ?? {} : {}
  const id = meta.id || path.basename(file).match(/^T-\d{3}/)?.[0]
  if (!id || !/^T-\d{3}$/.test(id)) throw new Error(`La tarea no tiene id T-xxx válido: ${file}`)
  const verification = text.match(/##\s*Verificaci[oó]n[\s\S]*?```(?:bash|sh)\n([\s\S]*?)```/)
  const command = verification?.[1].trim()
  if (!command || command.includes('\n')) {
    throw new Error('El bloque "## Verificación" debe tener un único comando bash (ver docs/tasks/README.md).')
  }
  return { id, title: meta.title || id, recommendedModel: meta.recommended_model, verifyCommand: command, body: text }
}

function buildPrompt(task, previousFailure) {
  const lines = [
    'Eres un obrero de implementación. Trabajas en un worktree git aislado.',
    'Reglas: implementa exactamente la tarea; toca solo los ficheros que lista; no añadas dependencias;',
    'no hagas commit, push, merge ni cambies de rama; no leas ni crees ficheros .env; no toques node_modules.',
    `Cuando termines, ejecuta \`${task.verifyCommand}\` y corrige hasta que termine con código 0.`,
    'Responde al final con un resumen de 1-3 líneas de lo que cambiaste.',
    '',
    '--- TAREA ---',
    task.body,
  ]
  if (previousFailure) {
    lines.push('', '--- EL INTENTO ANTERIOR NO PASÓ LA VERIFICACIÓN ---', 'Los cambios del intento anterior siguen en el worktree. Salida del comando:', previousFailure)
  }
  return lines.join('\n')
}

// --- Git -------------------------------------------------------------------------

const git = (cwd, args, options = {}) => runCommand('git', args, { cwd, timeoutMs: 120_000, ...options })

async function mustGit(cwd, args) {
  const result = await git(cwd, args)
  if (result.code !== 0) throw new Error(`git ${args.join(' ')} falló:\n${result.stderr}`)
  return result.stdout.trim()
}

async function createWorktree(taskId, alias, base) {
  const baseSha = await mustGit(REPO_ROOT, ['rev-parse', '--verify', `${base}^{commit}`])
  for (let n = 1; n < 100; n++) {
    const suffix = n === 1 ? '' : `-${n}`
    const name = `${taskId}-${alias}${suffix}`
    const branch = `worker/${name}`
    const dir = path.join(REPO_ROOT, '.worktrees', name)
    const exists = (await git(REPO_ROOT, ['rev-parse', '--verify', '--quiet', `refs/heads/${branch}`])).code === 0
    if (exists || existsSync(dir)) continue
    await mustGit(REPO_ROOT, ['worktree', 'add', '-b', branch, dir, baseSha])
    // node_modules compartido para que el comando de verificación funcione sin reinstalar.
    const nodeModules = path.join(REPO_ROOT, 'node_modules')
    if (existsSync(nodeModules)) await symlink(nodeModules, path.join(dir, 'node_modules'))
    return { dir, branch, baseSha }
  }
  throw new Error(`Demasiados worktrees para ${taskId}-${alias}`)
}

const EXCLUDE_NODE_MODULES = ['--', '.', ':(exclude)node_modules']

async function resetWorktree(dir, baseSha) {
  await mustGit(dir, ['reset', '--hard', baseSha])
  await mustGit(dir, ['clean', '-fd', '-e', 'node_modules'])
}

// Sin trim(): en `--porcelain` la primera columna puede ser un espacio (" M ruta").
async function changedFiles(dir) {
  const result = await git(dir, ['status', '--porcelain', ...EXCLUDE_NODE_MODULES])
  if (result.code !== 0) throw new Error(`git status falló:\n${result.stderr}`)
  return result.stdout.split('\n').filter(Boolean).map((line) => line.slice(3))
}

function containsSecret(diff, env) {
  if (SECRET_PATTERN.test(diff)) return true
  return Object.entries(env).some(([key, value]) => /KEY|TOKEN|SECRET/.test(key) && value.length >= 12 && diff.includes(value))
}

// --- Ejecución del obrero --------------------------------------------------------

function parseEvents(stdout) {
  let sessionId = null
  let error = null
  let text = ''
  for (const line of stdout.split('\n')) {
    if (!line.startsWith('{')) continue
    try {
      const event = JSON.parse(line)
      sessionId ??= event.sessionID ?? null
      if (event.type === 'error') error = event.error?.message || JSON.stringify(event.error)
      if (event.type === 'text' && event.part?.text) text = event.part.text
    } catch {
      // Línea que no es JSON: se ignora.
    }
  }
  return { sessionId, error, text }
}

// `opencode run --format json` no siempre emite el evento final con tokens; el
// export de la sesión sí trae coste y tokens acumulados.
async function sessionUsage(sessionId, cwd, env) {
  if (!sessionId) return null
  const result = await runCommand(OPENCODE_BIN, ['session', 'export', sessionId, '--standalone'], { cwd, env, timeoutMs: 60_000 })
  if (result.code !== 0) return null
  try {
    const { info } = JSON.parse(result.stdout)
    const tokens = info.tokens ?? {}
    return {
      cost_usd: info.cost ?? 0,
      tokens: {
        input: tokens.input ?? 0,
        output: tokens.output ?? 0,
        reasoning: tokens.reasoning ?? 0,
        cache_read: tokens.cache?.read ?? 0,
        cache_write: tokens.cache?.write ?? 0,
      },
    }
  } catch {
    return null
  }
}

async function logAttempt(entry) {
  await mkdir(path.dirname(LOG_FILE), { recursive: true })
  await appendFile(LOG_FILE, `${JSON.stringify(entry)}\n`)
}

async function runWorker({ model, task, dir, env, opencodeConfigPath, previousFailure, timeoutMs }) {
  const args = ['run', '--standalone', '--auto', '--format', 'json', '-m', model.model, buildPrompt(task, previousFailure)]
  const runEnv = workerEnv(env, model, opencodeConfigPath)
  const result = await runCommand(OPENCODE_BIN, args, { cwd: dir, env: runEnv, timeoutMs })
  const events = parseEvents(result.stdout)
  const usage = await sessionUsage(events.sessionId, dir, runEnv)
  let error = events.error
  if (!error && result.code !== 0 && !result.timedOut) error = tail(result.stderr || result.stdout, 2000) || `opencode salió con código ${result.code}`
  return { ...result, ...events, error, usage }
}

// --- API pública -----------------------------------------------------------------

export async function listModels() {
  const [config, env] = await Promise.all([loadConfig(), loadEnv()])
  const rows = []
  for (const model of Object.values(config.models)) {
    const position = config.chain.indexOf(model.alias)
    rows.push({
      alias: model.alias,
      model: model.model,
      chain_position: position === -1 ? null : position + 1,
      ...(await checkAvailability(model, env)),
      cost_usd_per_mtok: model.cost,
      uses: model.uses,
      notes: model.notes,
    })
  }
  return { chain: config.chain, defaults: config.defaults, models: rows }
}

export async function delegateTask({ taskFile, model: requested, timeoutS, maxRetries, budgetS, base = 'HEAD', noFallback = false }) {
  const startedAt = Date.now()
  const [config, env] = await Promise.all([loadConfig(), loadEnv()])
  const taskPath = resolveRepoPath(taskFile)
  const task = parseTask(await readFile(taskPath, 'utf8'), taskPath)

  const first = requested || task.recommendedModel
  if (first && !config.models[first]) throw new Error(`Modelo desconocido: ${first}. Usa list_models.`)
  const order = noFallback && first ? [first] : [...new Set([first, ...config.chain].filter(Boolean))]

  const skipped = []
  const candidates = []
  for (const alias of order) {
    const availability = await checkAvailability(config.models[alias], env)
    if (availability.available) candidates.push(config.models[alias])
    else skipped.push({ model: alias, reason: availability.reason })
  }
  if (!candidates.length) throw new Error(`Ningún modelo disponible: ${JSON.stringify(skipped)}`)

  const retries = maxRetries ?? Number(env.WORKER_MAX_RETRIES ?? config.defaults.max_retries)
  const attemptTimeoutMs = (timeoutS ?? Number(env.WORKER_DEFAULT_TIMEOUT_S ?? config.defaults.timeout_s)) * 1000
  const deadline = startedAt + (budgetS ?? config.defaults.budget_s) * 1000
  const verifyTimeoutMs = config.defaults.verify_timeout_s * 1000

  const { dir, branch, baseSha } = await createWorktree(task.id, first || 'chain', base)
  const configDir = await mkdtemp(path.join(tmpdir(), 'cheap-worker-'))
  const opencodeConfigPath = path.join(configDir, 'opencode.json')
  await writeFile(opencodeConfigPath, JSON.stringify(buildOpencodeConfig(config, env), null, 2))

  const attempts = []
  let success = null
  let lastVerifyOutput = ''
  try {
    outer: for (const [index, model] of candidates.entries()) {
      if (index > 0) await resetWorktree(dir, baseSha)
      let previousFailure = null
      for (let attempt = 1; attempt <= retries + 1; attempt++) {
        const remaining = deadline - Date.now()
        if (remaining < 30_000) break outer
        const run = await runWorker({ model, task, dir, env, opencodeConfigPath, previousFailure, timeoutMs: Math.min(attemptTimeoutMs, remaining) })

        let outcome
        let verifyOutput = ''
        if (run.timedOut) outcome = 'timeout'
        else if (run.error) outcome = 'provider_error'
        else {
          const verify = await runCommand('sh', ['-c', task.verifyCommand], { cwd: dir, env: verifyEnv(env), timeoutMs: verifyTimeoutMs })
          verifyOutput = tail(`${verify.stdout}\n${verify.stderr}`.trim(), 4000)
          outcome = verify.code === 0 ? 'passed' : 'verification_failed'
        }

        const entry = {
          ts: new Date().toISOString(),
          task: task.id,
          branch,
          model: model.alias,
          model_id: model.model,
          attempt,
          outcome,
          duration_ms: run.durationMs,
          session_id: run.sessionId,
          cost_usd: run.usage?.cost_usd ?? null,
          tokens: run.usage?.tokens ?? null,
          error: run.error ? tail(run.error, 500) : undefined,
        }
        await logAttempt(entry)
        attempts.push(entry)

        if (outcome === 'passed') {
          success = { model, summary: run.text }
          break outer
        }
        lastVerifyOutput = verifyOutput || run.error || ''
        // Error del proveedor o timeout: no tiene sentido reintentar con el mismo modelo.
        if (outcome !== 'verification_failed') break
        previousFailure = verifyOutput
      }
    }

    const files = await changedFiles(dir)
    let commit = null
    let secretBlocked = false
    if (success && files.length) {
      await mustGit(dir, ['add', '-A', ...EXCLUDE_NODE_MODULES])
      const staged = (await git(dir, ['diff', '--cached'])).stdout
      if (containsSecret(staged, env)) {
        secretBlocked = true
        await mustGit(dir, ['reset', '--quiet'])
      } else {
        const message = `worker(${task.id}): ${task.title}\n\nModel: ${success.model.model}\nAttempts: ${attempts.length}`
        await mustGit(dir, [...WORKER_IDENTITY, 'commit', '--quiet', '-m', message])
        commit = await mustGit(dir, ['rev-parse', 'HEAD'])
      }
    }

    const diffArgs = commit ? ['diff', `${baseSha}..${commit}`] : ['diff', 'HEAD']
    const diff = (await git(dir, diffArgs)).stdout
    const stat = (await git(dir, [...diffArgs, '--stat'])).stdout.trim()
    const totalCost = attempts.reduce((sum, entry) => sum + (entry.cost_usd ?? 0), 0)

    return {
      task: task.id,
      passed: Boolean(success) && !secretBlocked,
      model_used: success?.model.alias ?? null,
      branch,
      worktree: path.relative(REPO_ROOT, dir),
      commit,
      base: baseSha,
      changed_files: files,
      secret_blocked: secretBlocked,
      attempts: attempts.map(({ model, attempt, outcome, cost_usd, duration_ms, error }) => ({ model, attempt, outcome, cost_usd, duration_ms, error })),
      skipped_models: skipped,
      total_cost_usd: Number(totalCost.toFixed(6)),
      duration_s: Math.round((Date.now() - startedAt) / 1000),
      worker_summary: success?.summary ?? null,
      verification_output: success ? undefined : lastVerifyOutput,
      diff_stat: stat,
      diff: tail(diff, 60_000),
    }
  } finally {
    await rm(configDir, { recursive: true, force: true })
  }
}

export async function usageReport({ days } = {}) {
  if (!existsSync(LOG_FILE)) return { log: LOG_FILE, attempts: 0, models: [], total: null }
  const since = days ? Date.now() - days * 86_400_000 : 0
  const entries = (await readFile(LOG_FILE, 'utf8'))
    .split('\n')
    .filter(Boolean)
    .map((line) => JSON.parse(line))
    .filter((entry) => Date.parse(entry.ts) >= since)

  const empty = () => ({ attempts: 0, passed: 0, verification_failed: 0, provider_error: 0, timeout: 0, cost_usd: 0, unknown_cost: 0, input: 0, output: 0, reasoning: 0, cache_read: 0 })
  const add = (acc, entry) => {
    acc.attempts++
    acc[entry.outcome] = (acc[entry.outcome] ?? 0) + 1
    if (entry.cost_usd == null) acc.unknown_cost++
    acc.cost_usd += entry.cost_usd ?? 0
    for (const key of ['input', 'output', 'reasoning', 'cache_read']) acc[key] += entry.tokens?.[key] ?? 0
  }

  const byModel = {}
  const total = empty()
  for (const entry of entries) {
    add((byModel[entry.model] ??= empty()), entry)
    add(total, entry)
  }
  const round = (acc) => ({ ...acc, cost_usd: Number(acc.cost_usd.toFixed(6)) })
  return {
    log: LOG_FILE,
    since: since ? new Date(since).toISOString() : null,
    tasks: new Set(entries.map((entry) => entry.task)).size,
    models: Object.entries(byModel).map(([model, acc]) => ({ model, ...round(acc) })).sort((a, b) => b.cost_usd - a.cost_usd),
    total: round(total),
  }
}
