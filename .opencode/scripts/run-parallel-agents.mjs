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
const READ_ONLY_AGENT_KEYS = new Set(["testing", "ux-desktop", "ux-mobile", "review", "security"])
const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "../..")
const ANSI_PATTERN = /\u001b\[[0-9;]*m/g
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
  --write                          Permite pedir cambios. Requiere --ownership y agentes no read-only
  --ownership "frontend:src/pages; data:src/hooks"
  --out .opencode/runs             Carpeta de salida. Por defecto: .opencode/runs
  --task-type frontend|data|docs    Tipo de tarea para telemetria. Por defecto: parallel-review
  --routing-reason "bajo riesgo"    Motivo de routing de modelos para el run
  --model-lead gpt-5.5              Modelo esperado para lead/orquestador
  --model-worker gpt-5.3-codex-spark Modelo esperado para workers acotados
  --model-reviewer gpt-5.5          Modelo esperado para review/verificacion
  --dry-run                         Imprime comandos efectivos sin lanzar OpenCode ni escribir runs
  --print-command                   Alias de --dry-run
  --dangerously-skip-permissions    Opt-in explicito al bypass de permisos; solo con --write
  --help                            Muestra esta ayuda.

Ejemplos:
  npm run agents:parallel -- --dry-run "Revisa riesgos antes del deploy"
  npm run agents:parallel -- --agents frontend,data,testing "Evalua la mejora de formularios"
  npm run agents:parallel -- --write --ownership "frontend:src/pages; data:src/hooks" --agents frontend,data "Implementa con ownership separado"
`)
}

function parseArgs(argv) {
  const options = {
    agents: DEFAULT_AGENTS,
    outDir: ".opencode/runs",
    write: false,
    ownership: "",
    taskType: "parallel-review",
    routingReason: "revision paralela por dominio",
    models: { ...MODEL_DEFAULTS },
    dryRun: false,
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

    if (arg === "--dangerously-skip-permissions") {
      options.dangerouslySkipPermissions = true
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

    if (["--ownership", "--task-type", "--routing-reason", "--model-lead", "--model-worker", "--model-reviewer"].includes(arg)) {
      const value = argv[i + 1]
      if (!value) throw new Error(`Falta valor para ${arg}`)
      assignOption(options, arg.slice(2), value)
      i += 1
      continue
    }

    const inline = arg.match(/^--(ownership|task-type|routing-reason|model-lead|model-worker|model-reviewer)=(.*)$/)
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

  options[key] = value
}

function validateOptions(options) {
  const unknownAgents = options.agents.filter((agent) => !AGENTS[agent])
  if (unknownAgents.length > 0) {
    throw new Error(`Agentes desconocidos: ${unknownAgents.join(", ")}`)
  }

  const readOnlySelected = options.agents.filter((agent) => READ_ONLY_AGENT_KEYS.has(agent))

  if (options.write && !options.ownership.trim()) {
    throw new Error("--write requiere --ownership concreto, por ejemplo: --ownership \"frontend:src/pages; data:src/hooks\".")
  }

  if (options.write && readOnlySelected.length > 0) {
    throw new Error(`No se puede usar --write con agentes read-only: ${readOnlySelected.join(", ")}.`)
  }

  if (options.dangerouslySkipPermissions && !options.write) {
    throw new Error("--dangerously-skip-permissions solo puede usarse junto con --write.")
  }

  if (options.dangerouslySkipPermissions && readOnlySelected.length > 0) {
    throw new Error(`No se puede usar --dangerously-skip-permissions con agentes read-only: ${readOnlySelected.join(", ")}.`)
  }
}

function buildPrompt(agentName, task, options) {
  const mode = options.write
    ? [
        "Modo paralelo con escritura explicita.",
        `Ownership obligatorio: ${options.ownership}`,
        "Puedes proponer o realizar cambios solo dentro de tu ownership. No toques archivos de otros agentes.",
      ]
    : [
        "Modo paralelo solo lectura.",
        "No edites codigo, docs, memoria ni .opencode/AGENT_STATE.md. No ejecutes cambios destructivos, git/gh, push ni acciones remotas.",
        "Entrega hallazgos accionables y riesgos con archivos/lineas cuando sea posible.",
      ]

  return [
    ...mode,
    `Invoca y usa exclusivamente a @${agentName} para esta tarea.`,
    "Usa AGENTS.md como contrato corto y docs/agent-context-policy.md como politica canonica: indices primero, detalle bajo demanda, sin historico por defecto.",
    "Lee .opencode/AGENT_STATE.md solo si el modo y la tarea lo requieren. No lo modifiques en modo solo lectura.",
    "No cargues Product Brain completo, backlog, releases, issues cerradas ni historico por defecto; usa archivos/secciones concretas solo si la tarea lo requiere.",
    "Si hace falta orientar Product Brain, usa npm run pb:orient -- --json y abre solo issue, parent, release o source-touchpoints relevantes.",
    "Routing de modelos: GPT-5.5 debe conservar planificacion, ambiguedad, datos/RLS, seguridad, finanzas, review, verificacion final, PR/release y coordinacion multi-area. GPT-5.3-Codex-Spark solo encaja como worker rapido con ownership claro, bajo riesgo y verificacion objetiva.",
    "Escala a GPT-5.5 si un worker Spark falla verificacion, toca zona sensible, necesita mas de 1 retry o devuelve un diff demasiado amplio.",
    "Devuelve un resumen breve con hallazgos, recomendaciones y cualquier bloqueo.",
    "Incluye: Contexto leído; Product Brain leído; Product Brain actualizado; Validación PB; Feedback/Memory.",
    "",
    `Tarea: ${task}`,
  ].join("\n")
}

function buildOpenCodeArgs(options, title, prompt) {
  const args = ["run", "--agent", "cultura-lead", "--title", title, "--dir", repoRoot]

  if (options.dangerouslySkipPermissions) {
    args.push("--dangerously-skip-permissions")
  }

  args.push(prompt)
  return args
}

function printDryRun(options) {
  const commands = options.agents.map((agentKey) => {
    const agentName = AGENTS[agentKey]
    const prompt = buildPrompt(agentName, options.task, options)
    const title = `parallel-${agentKey}`
    const args = buildOpenCodeArgs(options, title, prompt)
    return {
      agentKey,
      agentName,
      mode: options.write ? "write" : "read-only",
      command: ["opencode", ...args.map((arg) => (arg === prompt ? "<prompt>" : arg))],
      promptPreview: prompt.split("\n").slice(0, 12).join("\n"),
    }
  })

  console.log(
    JSON.stringify(
      {
        mode: options.write ? "write" : "read-only",
        dangerouslySkipPermissions: options.dangerouslySkipPermissions,
        writesRunFiles: false,
        ownership: options.ownership || null,
        commands,
      },
      null,
      2,
    ),
  )
}

function runAgent(agentKey, options, runDir) {
  const agentName = AGENTS[agentKey]
  const prompt = buildPrompt(agentName, options.task, options)
  const outputPath = join(runDir, `${agentKey}.md`)
  const title = `parallel-${agentKey}`
  const child = spawn("opencode", buildOpenCodeArgs(options, title, prompt), { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] })

  let stdout = ""
  let stderr = ""

  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString()
  })

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString()
  })

  return new Promise((resolve) => {
    const agentTimeout = setTimeout(() => {
      if (!child.killed) {
        console.error(`\n[TIMEOUT] ${agentName} supero ${AGENT_TIMEOUT_MS / 60000} min. Matando proceso...`)
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

  validateOptions(options)

  if (options.dryRun) {
    printDryRun(options)
    return
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const runDir = resolve(repoRoot, options.outDir, timestamp)
  await mkdir(runDir, { recursive: true })
  const metadataPath = join(runDir, "metadata.json")
  const startedAt = new Date().toISOString()

  console.log(`Ejecutando ${options.agents.length} agentes en paralelo...`)
  console.log(`Modo: ${options.write ? "write" : "read-only"}`)
  console.log(`Dangerous permissions: ${options.dangerouslySkipPermissions ? "yes" : "no"}`)
  console.log(`Salida: ${runDir}`)
  await writeFile(
    metadataPath,
    JSON.stringify(
      {
        startedAt,
        endedAt: null,
        elapsedMs: null,
        status: "running",
        mode: options.write ? "write" : "read-only",
        dangerouslySkipPermissions: options.dangerouslySkipPermissions,
        agents: options.agents.map((agent) => AGENTS[agent]),
        taskType: options.taskType,
        routingReason: options.routingReason,
        models: options.models,
        ownership: options.ownership || null,
        result: null,
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
        mode: options.write ? "write" : "read-only",
        dangerouslySkipPermissions: options.dangerouslySkipPermissions,
        agents: options.agents.map((agent) => AGENTS[agent]),
        taskType: options.taskType,
        routingReason: options.routingReason,
        models: options.models,
        ownership: options.ownership || null,
        result: failed.length > 0 ? "error" : "success",
        exitCode: failed.length > 0 ? 1 : 0,
        failedAgents: failed.map((result) => result.agentName),
        notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
      },
      null,
      2,
    ),
    "utf-8",
  ).catch(() => {})

  process.exitCode = failed.length > 0 ? 1 : 0
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
