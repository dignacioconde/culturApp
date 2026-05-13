#!/usr/bin/env node
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { buildPromptCostEstimate, measurePrompt } from "../../scripts/context-metrics.mjs"

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)))
const RUNS_DIR = resolve(repoRoot, ".opencode/runs")
const PROMPT_TOKEN_SOFT_LIMIT = parseInt(process.env.AGENT_PROMPT_SOFT_LIMIT ?? "3500", 10)
const MODEL_DEFAULTS = {
  lead: process.env.AGENT_MODEL_LEAD ?? "frontmatter/default",
  worker: process.env.AGENT_MODEL_WORKER ?? "frontmatter/default",
  reviewer: process.env.AGENT_MODEL_REVIEWER ?? "frontmatter/default",
}

function usage() {
  console.log(`Uso:
  node .opencode/scripts/run-planner.mjs [--draft|--execute] [opciones] "prompt rough de la tarea"

Por defecto usa --draft: genera una propuesta read-only sin crear ramas,
GitHub Issues ni lanzar agentes mutantes.

Opciones:
  --draft                       Modo read-only por defecto
  --execute                     Modo mutante explicito; puede preparar issue/rama/agentes
  --dry-run                     Imprime el comando efectivo sin lanzar OpenCode ni escribir runs
  --print-command               Alias de --dry-run
  --concise | --caveman         Pide salida breve cuando sea seguro; no aplica a bloques sensibles
  --dangerously-skip-permissions Opt-in explicito al bypass de permisos; solo con --execute
  --help                        Muestra esta ayuda.

Ejemplos:
  npm run agents:plan -- "quiero filtrar eventos por categoria"
  npm run agents:plan:draft -- "el calendario en movil no muestra bien las semanas"
  npm run agents:plan:execute -- "anadir exportacion de ingresos a CSV desde el dashboard"
`)
}

function parseArgs(argv) {
  const options = {
    mode: "draft",
    dryRun: false,
    concise: false,
    dangerouslySkipPermissions: false,
    prompt: "",
  }
  const promptParts = []

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true
      continue
    }

    if (arg === "--draft") {
      options.mode = "draft"
      continue
    }

    if (arg === "--execute") {
      options.mode = "execute"
      continue
    }

    if (arg === "--dry-run" || arg === "--print-command") {
      options.dryRun = true
      continue
    }

    if (arg === "--concise" || arg === "--caveman") {
      options.concise = true
      continue
    }

    if (arg === "--dangerously-skip-permissions") {
      options.dangerouslySkipPermissions = true
      continue
    }

    promptParts.push(arg)
  }

  options.prompt = promptParts.join(" ").trim()
  if (/caveman|menos tokens|responde breve|se mas conciso|sé más conciso/i.test(options.prompt)) {
    options.concise = true
  }
  return options
}

function validateOptions(options) {
  if (options.dangerouslySkipPermissions && options.mode !== "execute") {
    throw new Error("--dangerously-skip-permissions solo puede usarse con --execute.")
  }
}

function conciseBlock(enabled) {
  return enabled
    ? [
        "",
        "MODO DE SALIDA CONCISO:",
        "Resume breve cuando sea seguro. No comprimas seguridad/RLS/finanzas/SQL/migraciones/review con lineas/verificacion exacta/acciones remotas.",
      ]
    : []
}

function buildDraftContract(prompt, options) {
  return [
    "TAREA DE PLANIFICACION DRAFT READ-ONLY:",
    prompt,
    "",
    "MODO:",
    "Solo lectura. No edites archivos, no crees issues, no crees ramas, no ejecutes git/gh, no hagas push y no lances npm run agents:run.",
    ...conciseBlock(options.concise),
    "",
    "OBJETIVO:",
    "Transforma el prompt en una propuesta lista para Product Brain: issue Markdown sugerida, alcance, ownership, criterios de aceptacion, validacion y riesgos.",
    "",
    "REGLAS:",
    "1. Lee AGENTS.md, docs/agent-context-policy.md y .memory/MEMORY.md como indice.",
    "2. Carga solo memoria o detalle relevante. No cargues backlog, releases completas, historico ni Product Brain completo por defecto.",
    "3. Para contexto Product Brain, prefiere npm run pb:orient -- --json y abre solo enlaces relevantes.",
    "4. Si recomiendas crear una issue, entrega frontmatter Product Brain v2 plano y cuerpo como propuesta, no lo escribas.",
    "5. GitHub es soporte operativo, no fuente primaria de backlog. Product Brain primero.",
    "6. Si la tarea requiere ejecucion mutante, indica que debe relanzarse con npm run agents:plan:execute.",
    "",
    "SALIDA:",
    "Devuelve una propuesta concisa y verificable. No arranques agentes de implementacion.",
    "Incluye: Contexto leído; Product Brain leído; Product Brain actualizado; Validación PB; Feedback/Memory.",
  ].join("\n")
}

function buildExecuteContract(prompt, options) {
  return [
    "TAREA DE PLANIFICACION EXECUTE:",
    prompt,
    "",
    "MODO:",
    "Ejecucion mutante explicita. Puedes preparar trazabilidad local, rama y agentes solo si el worktree y el scope lo permiten.",
    ...conciseBlock(options.concise),
    "",
    "Sigue el protocolo del agente cultura-planner-execute:",
    "1. Lee AGENTS.md, docs/agent-context-policy.md y .memory/MEMORY.md como indice.",
    "2. Clasifica el dominio y carga solo memoria o detalle relevante. No cargues backlog, release, historico ni Product Brain completo por defecto; DIGEST solo si la tarea requiere contexto de producto o planificacion.",
    "3. Para contexto Product Brain, prefiere npm run pb:orient -- --json y abre solo enlaces relevantes.",
    "4. Product Brain primero: crea o actualiza issue Markdown v2 en docs/project/issues/ salvo que ya exista una issue relacionada.",
    "5. Crea GitHub Issue solo si el usuario lo pidio explicitamente o si la ejecucion inmediata con PR lo requiere.",
    "6. Prepara una rama desde main actualizado o desde la release activa si aplica; si el worktree esta sucio, reporta bloqueo.",
    "7. Lanza npm run agents:run con --write y --ownership concreto solo si el scope de escritura esta claro.",
    "",
    "SALIDA:",
    "Incluye: Contexto leído; Product Brain leído; Product Brain actualizado; Validación PB; Feedback/Memory.",
    "",
    "ROUTING DE MODELOS:",
    "GPT-5.5 conserva planificacion, ambiguedad, arquitectura, datos/RLS, seguridad, finanzas, review, verificacion final y PR/release.",
    "GPT-5.3-Codex-Spark puede usarse solo como worker rapido para tareas locales, acotadas, con ownership claro y verificacion objetiva.",
    "Escala a GPT-5.5 si Spark falla verificacion, toca zona sensible, necesita mas de 1 retry o devuelve un diff demasiado amplio.",
  ].join("\n")
}

function buildOpenCodeArgs(options, contract) {
  const agent = options.mode === "execute" ? "cultura-planner-execute" : "cultura-planner"
  const title = options.mode === "execute" ? "cultura-plan-execute" : "cultura-plan-draft"
  const args = ["run", "--agent", agent, "--title", title, "--dir", repoRoot]

  if (options.dangerouslySkipPermissions) {
    args.push("--dangerously-skip-permissions")
  }

  args.push(contract)
  return { agent, title, args }
}

function printDryRun(options, contract, command) {
  const promptMetrics = measurePrompt("planner contract", contract, { softLimit: PROMPT_TOKEN_SOFT_LIMIT })
  console.log(
    JSON.stringify(
      {
        mode: options.mode,
        agent: command.agent,
        title: command.title,
        dangerouslySkipPermissions: options.dangerouslySkipPermissions,
        concise: options.concise,
        writesRunFiles: false,
        command: ["opencode", ...command.args.map((arg) => (arg === contract ? "<prompt>" : arg))],
        promptMetrics,
        costEstimate: buildPromptCostEstimate(promptMetrics),
        promptPreview: contract.split("\n").slice(0, 18).join("\n"),
      },
      null,
      2,
    ),
  )
}

async function writeMetadata(metadataPath, payload) {
  await writeFile(metadataPath, JSON.stringify(payload, null, 2), "utf-8").catch(() => {})
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help || !options.prompt) {
    usage()
    process.exitCode = options.help ? 0 : 1
    return
  }

  validateOptions(options)

  const contract = options.mode === "execute" ? buildExecuteContract(options.prompt, options) : buildDraftContract(options.prompt, options)
  const promptMetrics = measurePrompt("planner contract", contract, { softLimit: PROMPT_TOKEN_SOFT_LIMIT })
  const command = buildOpenCodeArgs(options, contract)

  if (options.dryRun) {
    printDryRun(options, contract, command)
    return
  }

  const startedAt = new Date().toISOString()
  const timestamp = startedAt.replace(/[:.]/g, "-")
  const runDir = resolve(RUNS_DIR, timestamp)
  const metadataPath = resolve(runDir, "metadata.json")
  await mkdir(runDir, { recursive: true })
  console.log(`[${timestamp}] Prompt tokens estimate: ~${promptMetrics.estimatedTokens}`)
  if (promptMetrics.estimatedTokens > PROMPT_TOKEN_SOFT_LIMIT) {
    console.warn(`[${timestamp}] Prompt token estimate exceeds soft limit ${PROMPT_TOKEN_SOFT_LIMIT}. Consider narrowing scope, splitting the task or using --concise when safe.`)
  }
  await writeMetadata(metadataPath, {
    startedAt,
    endedAt: null,
    elapsedMs: null,
    status: "running",
    mode: options.mode,
    dangerouslySkipPermissions: options.dangerouslySkipPermissions,
    concise: options.concise,
    title: command.title,
    agent: command.agent,
    taskType: options.mode === "execute" ? "planning-execute" : "planning-draft",
    routingReason: options.mode === "execute" ? "explicit mutating planning flow" : "read-only issue draft",
    models: MODEL_DEFAULTS,
    promptMetrics,
    result: null,
    costEstimate: buildPromptCostEstimate(promptMetrics),
    retries: "not-recorded",
    escalations: "not-recorded",
    notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
  })

  const child = spawn("opencode", command.args, { cwd: repoRoot, stdio: "inherit" })

  child.on("close", async (code) => {
    await writeMetadata(metadataPath, {
      startedAt,
      endedAt: new Date().toISOString(),
      elapsedMs: Date.now() - new Date(startedAt).getTime(),
      status: code === 0 ? "done" : "error",
      mode: options.mode,
      dangerouslySkipPermissions: options.dangerouslySkipPermissions,
      concise: options.concise,
      title: command.title,
      agent: command.agent,
      taskType: options.mode === "execute" ? "planning-execute" : "planning-draft",
      routingReason: options.mode === "execute" ? "explicit mutating planning flow" : "read-only issue draft",
      models: MODEL_DEFAULTS,
      promptMetrics,
      result: code === 0 ? "success" : "error",
      exitCode: code ?? 1,
      costEstimate: buildPromptCostEstimate(promptMetrics),
      retries: "not-recorded",
      escalations: "not-recorded",
      notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
    })
    process.exitCode = code ?? 1
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
