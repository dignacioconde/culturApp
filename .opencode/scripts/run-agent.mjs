#!/usr/bin/env node
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { buildPromptCostEstimate, measurePrompt } from "../../scripts/context-metrics.mjs"

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)))

const CHECKPOINT_INTERVAL = 30000
const AGENT_TIMEOUT_MS = parseInt(process.env.AGENT_TIMEOUT_MS ?? "2700000", 10)
const PROMPT_TOKEN_SOFT_LIMIT = parseInt(process.env.AGENT_PROMPT_SOFT_LIMIT ?? "3500", 10)
const DEFAULT_SCOPE = "Debe inferirse desde AGENTS.md, la tarea y el codigo real; carga detalle bajo demanda."
const DEFAULT_OWNERSHIP = "El lead debe definir ownership antes de delegar escritura si hay varios dominios."
const READ_ONLY_AGENTS = new Set([
  "cultura-review",
  "cultura-security",
  "cultura-testing",
  "cultura-ux-desktop",
  "cultura-ux-mobile",
  "verification-agent",
])
const MODEL_DEFAULTS = {
  lead: process.env.AGENT_MODEL_LEAD ?? "frontmatter/default",
  worker: process.env.AGENT_MODEL_WORKER ?? "frontmatter/default",
  reviewer: process.env.AGENT_MODEL_REVIEWER ?? "frontmatter/default",
}

function usage() {
  console.log(`Uso:
  node .opencode/scripts/run-agent.mjs [opciones] "tarea"

Opciones:
  --agent cultura-lead         Agente primario a lanzar. Por defecto: cultura-lead
  --title titulo               Titulo de la ejecucion. Por defecto: cultura-task
  --scope "src/hooks,src/pages" Alcance permitido o esperado
  --ownership "frontend:src/pages; data:src/hooks"
  --write                      Permite escritura local; requiere ownership concreto
  --verify "npm run lint && npm run build"
  --task-type frontend|data|docs     Tipo de tarea para telemetria. Por defecto: unspecified
  --routing-reason "bajo riesgo"     Motivo de routing de modelos para el run
  --model-lead gpt-5.5               Modelo esperado para lead/orquestador
  --model-worker gpt-5.3-codex-spark Modelo esperado para workers acotados
  --model-reviewer gpt-5.5           Modelo esperado para review/verificacion
  --dry-run                    Imprime el comando efectivo sin lanzar OpenCode ni escribir runs
  --print-command              Alias de --dry-run
  --concise | --caveman        Pide salida breve cuando sea seguro; no aplica a bloques sensibles
  --dangerously-skip-permissions Opt-in explicito al bypass de permisos de OpenCode; solo con --write
  --no-verify                  Indica que no se requiere verificacion automatica
  --help                       Muestra esta ayuda.

Ejemplos:
  npm run agents:run -- --dry-run --agent cultura-review "Revisa riesgos"
  npm run agents:run -- --write --scope "src/pages/Events" --ownership "frontend:src/pages/Events" "Implementa filtros de eventos"
`)
}

function parseArgs(argv) {
  const options = {
    agent: "cultura-lead",
    title: "cultura-task",
    scope: DEFAULT_SCOPE,
    ownership: DEFAULT_OWNERSHIP,
    verify: "npm run lint y npm run build si se toca codigo.",
    taskType: "unspecified",
    routingReason: "sin motivo declarado",
    models: { ...MODEL_DEFAULTS },
    write: false,
    dryRun: false,
    concise: false,
    dangerouslySkipPermissions: false,
    task: "",
  }

  const taskParts = []

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--help" || arg === "-h") {
      options.help = true
      continue
    }

    if (arg === "--write") {
      options.write = true
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

    if (arg === "--no-verify") {
      options.verify = "No se requiere verificacion automatica; explicar el motivo si se toca codigo."
      continue
    }

    if (["--agent", "--title", "--scope", "--ownership", "--verify", "--task-type", "--routing-reason", "--model-lead", "--model-worker", "--model-reviewer"].includes(arg)) {
      const key = arg.slice(2)
      const value = argv[i + 1]
      if (!value) throw new Error(`Falta valor para ${arg}`)
      assignOption(options, key, value)
      i += 1
      continue
    }

    const inline = arg.match(/^--(agent|title|scope|ownership|verify|task-type|routing-reason|model-lead|model-worker|model-reviewer)=(.*)$/)
    if (inline) {
      assignOption(options, inline[1], inline[2])
      continue
    }

    taskParts.push(arg)
  }

  options.task = taskParts.join(" ").trim()
  if (/caveman|menos tokens|responde breve|se mas conciso|sé más conciso/i.test(options.task)) {
    options.concise = true
  }
  return options
}

const RUNS_DIR = resolve(repoRoot, ".opencode/runs")

function assignOption(options, key, value) {
  if (key === "task-type") {
    options.taskType = value
    return
  }

  if (key === "routing-reason") {
    options.routingReason = value
    return
  }

  if (key === "model-lead") {
    options.models.lead = value
    return
  }

  if (key === "model-worker") {
    options.models.worker = value
    return
  }

  if (key === "model-reviewer") {
    options.models.reviewer = value
    return
  }

  options[key] = value
}

function validateOptions(options) {
  const isReadOnlyAgent = READ_ONLY_AGENTS.has(options.agent)

  if (isReadOnlyAgent && options.write) {
    throw new Error(`${options.agent} es read-only por politica; no puede ejecutarse con --write.`)
  }

  if (isReadOnlyAgent && options.dangerouslySkipPermissions) {
    throw new Error(`${options.agent} es read-only por politica; no puede usar --dangerously-skip-permissions.`)
  }

  if (options.dangerouslySkipPermissions && !options.write) {
    throw new Error("--dangerously-skip-permissions solo puede usarse junto con --write.")
  }

  if (options.write && options.ownership === DEFAULT_OWNERSHIP) {
    throw new Error("--write requiere --ownership concreto, por ejemplo: --ownership \"frontend:src/pages/Events\".")
  }
}

function buildContract(options) {
  const mode = options.write
    ? [
        "MODO DE EJECUCION:",
        "WRITE EXPLICITO. Puedes editar solo dentro del ownership declarado. Si el ownership es ambiguo, detente y reporta bloqueo.",
        "No ejecutes acciones remotas, destructivas, git push, gh issue/pr ni Supabase/Vercel sin confirmacion humana explicita.",
      ]
    : [
        "MODO DE EJECUCION:",
        "SOLO LECTURA. No edites codigo, docs, memoria ni .opencode/AGENT_STATE.md. No crees ramas, commits, issues, PRs ni runs adicionales.",
        "Puedes inspeccionar archivos y proponer cambios. Testing/verificacion puede ejecutar checks locales si su perfil lo permite, sin modificar archivos tracked.",
      ]

  const conciseMode = options.concise
    ? [
        "",
        "MODO DE SALIDA CONCISO:",
        "Usa estilo caveman/lite solo para resumenes y updates: breve, directo y sin relleno.",
        "No comprimas seguridad, privacidad, RLS, finanzas, SQL, migraciones, hallazgos de review con archivo/linea, verificacion exacta ni confirmaciones de acciones remotas/destructivas.",
      ]
    : []

  return [
    "DIRECTRIZ ESTANDAR PARA CULTURAAPP",
    "",
    ...mode,
    ...conciseMode,
    "",
    "OBJETIVO:",
    options.task,
    "",
    "AUTONOMIA:",
    "No preguntes salvo bloqueo real: credenciales, accion destructiva, cambio remoto, decision de producto irreversible u ownership ambiguo.",
    "",
    "CONTEXTO:",
    "Usa AGENTS.md como contrato corto y docs/agent-context-policy.md como politica canonica de carga. Lee .opencode/AGENT_STATE.md como estado vivo solo si el modo permite coordinar ejecucion; carga memoria, Product Brain, backlog, releases o historico solo bajo demanda y desde archivos/secciones concretas.",
    "Para orientar Product Brain sin cargarlo completo, usa npm run pb:orient -- --json y abre solo issue, parent, release o source-touchpoints relevantes.",
    "",
    "ALCANCE:",
    options.scope,
    "",
    "RAMA Y PR:",
    options.write
      ? "Trabaja en la rama actual salvo instruccion explicita. No cambies de rama con worktree sucio. No abras PR ni hagas push sin confirmacion explicita."
      : "No cambies de rama ni prepares PR en modo solo lectura.",
    "",
    "OWNERSHIP:",
    options.ownership,
    "",
    "ENRUTADO:",
    "Usa cultura-lead como dispatcher minimo. Delega por dominio a @cultura-frontend, @cultura-data, @cultura-testing, @cultura-review, @cultura-security, @cultura-release o @cultura-docs.",
    "Respeta permisos reales: review, security y UX son read-only; testing/verificacion pueden ejecutar checks; workers solo escriben con --write y ownership concreto.",
    "El lead decide el modelo por riesgo y complejidad: GPT-5.5 para planificacion, ambiguedad, seguridad, datos/RLS, finanzas, review, verificacion final, PR/release o cambios multi-area; GPT-5.3-Codex-Spark solo como worker rapido para tareas locales, acotadas, con ownership claro y verificacion objetiva.",
    "Escala a GPT-5.5 si un worker Spark falla verificacion, toca una zona sensible, necesita mas de 1 retry o devuelve un diff demasiado amplio.",
    "",
    "TELEMETRIA DE ROUTING:",
    `Tipo de tarea: ${options.taskType}`,
    `Motivo de routing: ${options.routingReason}`,
    `Modelo lead esperado: ${options.models.lead}`,
    `Modelo worker esperado: ${options.models.worker}`,
    `Modelo reviewer esperado: ${options.models.reviewer}`,
    "En la salida, declara modelo usado por rol si lo conoces, escalaciones, retries, verificaciones ejecutadas, resultado y riesgos.",
    "",
    "VERIFICACION:",
    options.verify,
    "",
    "SALIDA:",
    "Resume subagentes usados, archivos/cambios principales, verificacion ejecutada, PR/merge/produccion y riesgos o bloqueos restantes.",
    "Incluye obligatoriamente: Contexto leído; Product Brain leído; Product Brain actualizado; Validación PB; Feedback/Memory.",
  ].join("\n")
}

function buildOpenCodeArgs(options, prompt) {
  const args = ["run", "--agent", options.agent, "--title", options.title, "--dir", repoRoot]

  if (options.dangerouslySkipPermissions) {
    args.push("--dangerously-skip-permissions")
  }

  args.push(prompt)
  return args
}

function printDryRun(options, prompt, args) {
  const promptMetrics = measurePrompt("opencode contract", prompt, { softLimit: PROMPT_TOKEN_SOFT_LIMIT })
  console.log(
    JSON.stringify(
      {
        mode: options.write ? "write" : "read-only",
        agent: options.agent,
        title: options.title,
        dangerouslySkipPermissions: options.dangerouslySkipPermissions,
        concise: options.concise,
        writesRunFiles: false,
        command: ["opencode", ...args.map((arg) => (arg === prompt ? "<prompt>" : arg))],
        scope: options.scope,
        ownership: options.ownership,
        promptMetrics,
        costEstimate: buildPromptCostEstimate(promptMetrics),
        promptPreview: prompt.split("\n").slice(0, 18).join("\n"),
      },
      null,
      2,
    ),
  )
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help || !options.task) {
    usage()
    process.exitCode = options.help ? 0 : 1
    return
  }

  validateOptions(options)

  const prompt = buildContract(options)
  const promptMetrics = measurePrompt("opencode contract", prompt, { softLimit: PROMPT_TOKEN_SOFT_LIMIT })
  const opencodeArgs = buildOpenCodeArgs(options, prompt)

  if (options.dryRun) {
    printDryRun(options, prompt, opencodeArgs)
    return
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const runDir = resolve(RUNS_DIR, timestamp)
  await mkdir(runDir, { recursive: true })
  const outputPath = resolve(runDir, "output.txt")
  const metadataPath = resolve(runDir, "metadata.json")
  const currentPath = resolve(RUNS_DIR, "current.json")
  const startedAt = new Date().toISOString()

  console.log(`[${timestamp}] Starting: ${options.title}`)
  console.log(`[${timestamp}] Mode: ${options.write ? "write" : "read-only"}`)
  console.log(`[${timestamp}] Dangerous permissions: ${options.dangerouslySkipPermissions ? "yes" : "no"}`)
  console.log(`[${timestamp}] Output: ${outputPath}`)
  console.log(`[${timestamp}] Timeout: ${AGENT_TIMEOUT_MS / 60000} min`)
  console.log(`[${timestamp}] Prompt tokens estimate: ~${promptMetrics.estimatedTokens}`)
  if (promptMetrics.estimatedTokens > PROMPT_TOKEN_SOFT_LIMIT) {
    console.warn(`[${timestamp}] Prompt token estimate exceeds soft limit ${PROMPT_TOKEN_SOFT_LIMIT}. Consider narrowing scope, splitting the task or using --concise when safe.`)
  }

  const buildMetadata = (status, extra = {}) => ({
    startedAt,
    endedAt: extra.endedAt ?? null,
    elapsedMs: extra.elapsedMs ?? null,
    status,
    mode: options.write ? "write" : "read-only",
    dangerouslySkipPermissions: options.dangerouslySkipPermissions,
    concise: options.concise,
    title: options.title,
    agent: options.agent,
    taskType: options.taskType,
    routingReason: options.routingReason,
    models: options.models,
    scope: options.scope,
    ownership: options.ownership,
    verificationExpected: options.verify,
    promptMetrics,
    result: extra.result ?? null,
    exitCode: extra.exitCode ?? null,
    retries: extra.retries ?? "not-recorded",
    escalations: extra.escalations ?? "not-recorded",
    costEstimate: extra.costEstimate ?? buildPromptCostEstimate(promptMetrics),
    notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
  })

  const writeMetadata = async (status, extra = {}) => {
    await writeFile(metadataPath, JSON.stringify(buildMetadata(status, extra), null, 2), "utf-8").catch(() => {})
  }

  const writeCurrentJson = async (status, lastLines = []) => {
    const elapsed = Math.round((Date.now() - new Date(startedAt).getTime()) / 60000)
    await writeFile(
      currentPath,
      JSON.stringify(
        {
          startedAt,
          agent: options.agent,
          title: options.title,
          mode: options.write ? "write" : "read-only",
          dangerouslySkipPermissions: options.dangerouslySkipPermissions,
          taskType: options.taskType,
          routingReason: options.routingReason,
          models: options.models,
          promptTokensEstimate: promptMetrics.estimatedTokens,
          elapsedMin: elapsed,
          lastCheckpoint: new Date().toISOString(),
          lastLines,
          status,
        },
        null,
        2,
      ),
      "utf-8",
    ).catch(() => {})
  }

  await writeCurrentJson("running")
  await writeMetadata("running")

  const child = spawn("opencode", opencodeArgs, { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] })

  let stdout = ""
  let stderr = ""
  let checkpointCount = 0
  let lastSize = 0
  let didTimeout = false

  const getLastLines = () => stdout.split("\n").filter(Boolean).slice(-10)

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString()
    if (stdout.length - lastSize > 5000) {
      lastSize = stdout.length
      checkpointCount += 1
      const tail = getLastLines().join("\n")
      console.log(`\n--- Checkpoint #${checkpointCount} ---`)
      console.log(tail)
      console.log("-----------------------\n")
    }
  })

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString()
  })

  const checkpointInterval = setInterval(async () => {
    if (!child.killed) {
      checkpointCount += 1
      const lastLines = getLastLines()
      const tail = lastLines.join("\n")
      console.log(`\n[${new Date().toLocaleTimeString()}] Checkpoint #${checkpointCount} (tail):`)
      console.log(tail)
      console.log("-----------------------\n")
      await writeCurrentJson("running", lastLines)
    }
  }, CHECKPOINT_INTERVAL)

  const agentTimeout = setTimeout(async () => {
    if (!child.killed) {
      console.error(`\n[TIMEOUT] Agente supero ${AGENT_TIMEOUT_MS / 60000} min. Matando proceso...`)
      didTimeout = true
      child.kill("SIGTERM")
      await writeCurrentJson("timeout", getLastLines())
      await writeMetadata("timeout", { endedAt: new Date().toISOString(), elapsedMs: Date.now() - new Date(startedAt).getTime(), result: "timeout", exitCode: 124 })
      await writeFile(outputPath, `[TIMEOUT tras ${AGENT_TIMEOUT_MS / 60000} min]\n\n${stdout}`, "utf-8").catch(() => {})
      process.exitCode = 124
    }
  }, AGENT_TIMEOUT_MS)

  child.on("close", async (code) => {
    clearInterval(checkpointInterval)
    clearTimeout(agentTimeout)

    await writeFile(outputPath, stdout, "utf-8")
    const finalStatus = didTimeout ? "timeout" : code === 0 ? "done" : "error"
    await writeCurrentJson(finalStatus, getLastLines())
    await writeMetadata(finalStatus, {
      endedAt: new Date().toISOString(),
      elapsedMs: Date.now() - new Date(startedAt).getTime(),
      result: didTimeout ? "timeout" : code === 0 ? "success" : "error",
      exitCode: didTimeout ? 124 : code ?? 1,
    })

    console.log(`\n[${new Date().toLocaleTimeString()}] Finished with code: ${code}`)

    process.exitCode = didTimeout ? 124 : code ?? 1
  })

  child.on("error", async (error) => {
    clearInterval(checkpointInterval)
    clearTimeout(agentTimeout)
    await writeFile(outputPath, `Error: ${error.message}\n${stderr}`, "utf-8")
    await writeCurrentJson("error", [error.message])
    await writeMetadata("error", { endedAt: new Date().toISOString(), elapsedMs: Date.now() - new Date(startedAt).getTime(), result: "spawn-error", exitCode: 1 })
    console.error(`Error: ${error.message}`)
    process.exitCode = 1
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
