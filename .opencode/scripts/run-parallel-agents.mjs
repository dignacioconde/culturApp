#!/usr/bin/env node
import { mkdir, writeFile } from "node:fs/promises"
import { spawn } from "node:child_process"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const AGENTS = {
  frontend: "cultura-frontend",
  "ux-desktop": "cultura-ux-desktop",
  "ux-mobile": "cultura-ux-mobile",
  data: "cultura-data",
  testing: "cultura-testing",
  review: "cultura-review",
  security: "cultura-security",
  release: "cultura-release",
  docs: "cultura-docs",
}

const DEFAULT_AGENTS = ["data", "testing", "review", "security"]
const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "../..")
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g
// Timeout máximo por agente en paralelo: 30 min por defecto, configurable via AGENT_TIMEOUT_MS
const AGENT_TIMEOUT_MS = parseInt(process.env.AGENT_TIMEOUT_MS ?? "1800000", 10)
const MODEL_DEFAULTS = {
  lead: process.env.AGENT_MODEL_LEAD ?? "frontmatter/default",
  worker: process.env.AGENT_MODEL_WORKER ?? "frontmatter/default",
  reviewer: process.env.AGENT_MODEL_REVIEWER ?? "frontmatter/default",
}

function usage() {
  console.log(`Uso:
  node .opencode/scripts/run-parallel-agents.mjs [opciones] "tarea"

Opciones:
  --agents data,testing,review     Agentes a ejecutar. Por defecto: ${DEFAULT_AGENTS.join(",")}
  --write                          Permite pedir cambios. Sin esto, todos reciben instruccion de solo lectura.
  --out .opencode/runs             Carpeta de salida. Por defecto: .opencode/runs
  --task-type frontend|data|docs    Tipo de tarea para telemetria. Por defecto: parallel-review
  --routing-reason "bajo riesgo"    Motivo de routing de modelos para el run
  --model-lead gpt-5.5              Modelo esperado para lead/orquestador
  --model-worker gpt-5.3-codex-spark Modelo esperado para workers acotados
  --model-reviewer gpt-5.5          Modelo esperado para review/verificacion
  --help                           Muestra esta ayuda.

Ejemplos:
  npm run agents:parallel -- "Revisa riesgos antes del deploy"
  npm run agents:parallel -- --agents frontend,data,testing "Evalua la mejora de formularios"
  npm run agents:parallel -- --agents ux-mobile,ux-desktop,frontend "Evalua la UX responsive de dashboard"
  npm run agents:parallel -- --write --agents frontend,data "Implementa la tarea con ownership separado"
`)
}

function parseArgs(argv) {
  const options = {
    agents: DEFAULT_AGENTS,
    outDir: ".opencode/runs",
    write: false,
    taskType: "parallel-review",
    routingReason: "revision paralela por dominio",
    models: { ...MODEL_DEFAULTS },
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

    if (arg === "--agents") {
      const value = argv[i + 1]
      if (!value) throw new Error("Falta valor para --agents")
      options.agents = value.split(",").map((item) => item.trim()).filter(Boolean)
      i += 1
      continue
    }

    if (arg.startsWith("--agents=")) {
      options.agents = arg.slice("--agents=".length).split(",").map((item) => item.trim()).filter(Boolean)
      continue
    }

    if (arg === "--out") {
      const value = argv[i + 1]
      if (!value) throw new Error("Falta valor para --out")
      options.outDir = value
      i += 1
      continue
    }

    if (arg.startsWith("--out=")) {
      options.outDir = arg.slice("--out=".length)
      continue
    }

    if (["--task-type", "--routing-reason", "--model-lead", "--model-worker", "--model-reviewer"].includes(arg)) {
      const value = argv[i + 1]
      if (!value) throw new Error(`Falta valor para ${arg}`)
      assignOption(options, arg.slice(2), value)
      i += 1
      continue
    }

    const inline = arg.match(/^--(task-type|routing-reason|model-lead|model-worker|model-reviewer)=(.*)$/)
    if (inline) {
      assignOption(options, inline[1], inline[2])
      continue
    }

    taskParts.push(arg)
  }

  options.task = taskParts.join(" ").trim()
  return options
}

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
}

function buildPrompt(agentName, task, canWrite) {
  const mode = canWrite
    ? "Puedes proponer o realizar cambios solo si tu ownership esta claro en la tarea. No toques archivos de otros agentes."
    : "Modo paralelo sin tocar codigo: no edites codigo ni docs, no ejecutes cambios destructivos y entrega hallazgos accionables. La unica escritura permitida es actualizar .opencode/AGENT_STATE.md con senales de coordinacion."

  return [
    `${mode}`,
    `Invoca y usa exclusivamente a @${agentName} para esta tarea.`,
    "Usa AGENTS.md como contrato corto y docs/agent-context-policy.md como politica canonica: indices primero, detalle bajo demanda, sin historico por defecto.",
    "Lee .opencode/AGENT_STATE.md como estado vivo. Si detectas una senal relevante para otros agentes, relee ese archivo y actualiza solo tu bloque y la seccion Eventos.",
    "No cargues Product Brain completo, backlog, releases, issues cerradas ni historico por defecto; usa archivos/secciones concretas solo si la tarea lo requiere.",
    "Routing de modelos: GPT-5.5 debe conservar planificacion, ambiguedad, datos/RLS, seguridad, finanzas, review, verificacion final, PR/release y coordinacion multi-area. GPT-5.3-Codex-Spark solo encaja como worker rapido con ownership claro, bajo riesgo y verificacion objetiva.",
    "Escala a GPT-5.5 si un worker Spark falla verificacion, toca zona sensible, necesita mas de 1 retry o devuelve un diff demasiado amplio.",
    "Devuelve un resumen breve con hallazgos, recomendaciones y cualquier bloqueo.",
    "",
    `Tarea: ${task}`,
  ].join("\n")
}

function runAgent(agentKey, options, runDir) {
  const agentName = AGENTS[agentKey]
  const prompt = buildPrompt(agentName, options.task, options.write)
  const outputPath = join(runDir, `${agentKey}.md`)
  const title = `parallel-${agentKey}`

  const child = spawn(
    "opencode",
    ["run", "--agent", "cultura-lead", "--title", title, "--dir", repoRoot, "--dangerously-skip-permissions", prompt],
    { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
  )

  let stdout = ""
  let stderr = ""

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString()
  })

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString()
  })

  return new Promise((resolve) => {
    // Timeout: mata el agente si supera el límite
    const agentTimeout = setTimeout(() => {
      if (!child.killed) {
        console.error(`\n[TIMEOUT] ${agentName} superó ${AGENT_TIMEOUT_MS / 60000} min. Matando proceso...`)
        child.kill("SIGTERM")
      }
    }, AGENT_TIMEOUT_MS)

    child.on("error", async (error) => {
      clearTimeout(agentTimeout)
      const content = [
        `# ${agentName}`,
        "",
        "Exit code: spawn-error",
        "",
        "## Salida",
        "",
        "_Sin salida por stdout._",
        "",
        "## Errores",
        "",
        error.message,
        "",
      ].join("\n")

      await writeFile(outputPath, content)
      resolve({ agentKey, agentName, code: 1, outputPath })
    })

    child.on("close", async (code) => {
      clearTimeout(agentTimeout)
      const timedOut = code === null || (child.killed && code !== 0)
      const content = [
        `# ${agentName}`,
        "",
        timedOut ? `Exit code: TIMEOUT (${AGENT_TIMEOUT_MS / 60000} min)` : `Exit code: ${code}`,
        "",
        "## Salida",
        "",
        stdout.replace(ANSI_PATTERN, "").trim() || "_Sin salida por stdout._",
        "",
        "## Errores",
        "",
        stderr.replace(ANSI_PATTERN, "").trim() || "_Sin salida por stderr._",
        "",
      ].join("\n")

      await writeFile(outputPath, content)
      resolve({ agentKey, agentName, code: timedOut ? 124 : code, outputPath })
    })
  })
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    usage()
    return
  }

  if (!options.task) {
    usage()
    process.exitCode = 1
    return
  }

  const unknownAgents = options.agents.filter((agent) => !AGENTS[agent])
  if (unknownAgents.length > 0) {
    throw new Error(`Agentes desconocidos: ${unknownAgents.join(", ")}`)
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const runDir = resolve(repoRoot, options.outDir, timestamp)
  await mkdir(runDir, { recursive: true })
  const metadataPath = join(runDir, "metadata.json")
  const startedAt = new Date().toISOString()

  console.log(`Ejecutando ${options.agents.length} agentes en paralelo...`)
  console.log(`Salida: ${runDir}`)
  await writeFile(
    metadataPath,
    JSON.stringify(
      {
        startedAt,
        endedAt: null,
        elapsedMs: null,
        status: "running",
        title: "parallel-agents",
        mode: options.write ? "write" : "read-only",
        taskType: options.taskType,
        routingReason: options.routingReason,
        agents: options.agents,
        models: options.models,
        result: null,
        costEstimate: "not-recorded",
        retries: "not-recorded",
        escalations: "not-recorded",
        notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
      },
      null,
      2,
    ),
    "utf-8",
  )

  const results = await Promise.all(options.agents.map((agent) => runAgent(agent, options, runDir)))
  const failed = results.filter((result) => result.code !== 0)

  for (const result of results) {
    const status = result.code === 0 ? "OK" : `FALLO ${result.code}`
    console.log(`${status} ${result.agentName} -> ${result.outputPath}`)
  }

  await writeFile(
    metadataPath,
    JSON.stringify(
      {
        startedAt,
        endedAt: new Date().toISOString(),
        elapsedMs: Date.now() - new Date(startedAt).getTime(),
        status: failed.length > 0 ? "error" : "done",
        title: "parallel-agents",
        mode: options.write ? "write" : "read-only",
        taskType: options.taskType,
        routingReason: options.routingReason,
        agents: options.agents,
        models: options.models,
        result: failed.length > 0 ? "partial-or-failed" : "success",
        results,
        costEstimate: "not-recorded",
        retries: "not-recorded",
        escalations: "not-recorded",
        notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
      },
      null,
      2,
    ),
    "utf-8",
  )

  process.exitCode = failed.length > 0 ? 1 : 0
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
