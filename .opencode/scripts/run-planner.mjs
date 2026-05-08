#!/usr/bin/env node
import { spawn } from "node:child_process"
import { mkdir, writeFile } from "node:fs/promises"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)))
const RUNS_DIR = resolve(repoRoot, ".opencode/runs")
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

    if (arg === "--dangerously-skip-permissions") {
      options.dangerouslySkipPermissions = true
      continue
    }

    promptParts.push(arg)
  }

  options.prompt = promptParts.join(" ").trim()
  return options
}

function validateOptions(options) {
  if (options.dangerouslySkipPermissions && options.mode !== "execute") {
    throw new Error("--dangerously-skip-permissions solo puede usarse con --execute.")
  }
}

function buildDraftContract(prompt) {
  return [
    "TAREA DE PLANIFICACION DRAFT READ-ONLY:",
    prompt,
    "",
    "MODO:",
    "Solo lectura. No edites archivos, no crees issues, no crees ramas, no ejecutes git/gh, no hagas push y no lances npm run agents:run.",
    "",
    "OBJETIVO:",
    "Transforma el prompt en una propuesta lista para Product Brain: issue Markdown sugerida, alcance, ownership, criterios de aceptacion, validacion y riesgos.",
    "",
    "REGLAS:",
    "1. Lee AGENTS.md, docs/agent-context-policy.md y .memory/MEMORY.md como indice.",
    "2. Carga solo memoria o detalle relevante. No cargues backlog, releases completas, historico ni Product Brain completo por defecto.",
    "3. Si recomiendas crear una issue, entrega el frontmatter y el cuerpo como propuesta, no lo escribas.",
    "4. GitHub es soporte operativo, no fuente primaria de backlog. Product Brain primero.",
    "5. Si la tarea requiere ejecucion mutante, indica que debe relanzarse con npm run agents:plan:execute.",
    "",
    "SALIDA:",
    "Devuelve una propuesta concisa y verificable. No arranques agentes de implementacion.",
  ].join("\n")
}

function buildExecuteContract(prompt) {
  return [
    "TAREA DE PLANIFICACION EXECUTE:",
    prompt,
    "",
    "MODO:",
    "Ejecucion mutante explicita. Puedes preparar trazabilidad local, rama y agentes solo si el worktree y el scope lo permiten.",
    "",
    "Sigue el protocolo del agente cultura-planner-execute:",
    "1. Lee AGENTS.md, docs/agent-context-policy.md y .memory/MEMORY.md como indice.",
    "2. Clasifica el dominio y carga solo memoria o detalle relevante. No cargues backlog, release, historico ni Product Brain completo por defecto; DIGEST solo si la tarea requiere contexto de producto o planificacion.",
    "3. Product Brain primero: crea o actualiza issue Markdown en docs/project/issues/ salvo que ya exista una issue relacionada.",
    "4. Crea GitHub Issue solo si el usuario lo pidio explicitamente o si la ejecucion inmediata con PR lo requiere.",
    "5. Prepara una rama de tarea desde main actualizado; si el worktree esta sucio, reporta bloqueo.",
    "6. Lanza npm run agents:run con --write y --ownership concreto solo si el scope de escritura esta claro.",
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
  console.log(
    JSON.stringify(
      {
        mode: options.mode,
        agent: command.agent,
        title: command.title,
        dangerouslySkipPermissions: options.dangerouslySkipPermissions,
        writesRunFiles: false,
        command: ["opencode", ...command.args.map((arg) => (arg === contract ? "<prompt>" : arg))],
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

  const contract = options.mode === "execute" ? buildExecuteContract(options.prompt) : buildDraftContract(options.prompt)
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
  await writeMetadata(metadataPath, {
    startedAt,
    endedAt: null,
    elapsedMs: null,
    status: "running",
    mode: options.mode,
    dangerouslySkipPermissions: options.dangerouslySkipPermissions,
    title: command.title,
    agent: command.agent,
    taskType: options.mode === "execute" ? "planning-execute" : "planning-draft",
    routingReason: options.mode === "execute" ? "explicit mutating planning flow" : "read-only issue draft",
    models: MODEL_DEFAULTS,
    result: null,
    costEstimate: "not-recorded",
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
      title: command.title,
      agent: command.agent,
      taskType: options.mode === "execute" ? "planning-execute" : "planning-draft",
      routingReason: options.mode === "execute" ? "explicit mutating planning flow" : "read-only issue draft",
      models: MODEL_DEFAULTS,
      result: code === 0 ? "success" : "error",
      exitCode: code ?? 1,
      costEstimate: "not-recorded",
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
