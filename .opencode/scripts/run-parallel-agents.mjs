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

function usage() {
  console.log(`Uso:
  node .opencode/scripts/run-parallel-agents.mjs [opciones] "tarea"

Opciones:
  --agents data,testing,review     Agentes a ejecutar. Por defecto: ${DEFAULT_AGENTS.join(",")}
  --write                          Permite pedir cambios. Sin esto, todos reciben instruccion de solo lectura.
  --out .opencode/runs             Carpeta de salida. Por defecto: .opencode/runs
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

    taskParts.push(arg)
  }

  options.task = taskParts.join(" ").trim()
  return options
}

function buildPrompt(agentName, task, canWrite) {
  const mode = canWrite
    ? "Puedes proponer o realizar cambios solo si tu ownership esta claro en la tarea. No toques archivos de otros agentes."
    : "Modo paralelo sin tocar codigo: no edites codigo ni docs, no ejecutes cambios destructivos y entrega hallazgos accionables. La unica escritura permitida es actualizar .opencode/AGENT_STATE.md con senales de coordinacion."

  return [
    `${mode}`,
    `Invoca y usa exclusivamente a @${agentName} para esta tarea.`,
    "Lee AGENTS.md antes de razonar sobre el proyecto.",
    "Lee .opencode/AGENT_STATE.md al empezar. Si detectas una senal relevante para otros agentes, relee ese archivo y actualiza solo tu bloque y la seccion Eventos.",
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
    ["run", "--agent", "cultura-lead", "--title", title, "--dir", repoRoot, prompt],
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
    child.on("error", async (error) => {
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
      const content = [
        `# ${agentName}`,
        "",
        `Exit code: ${code}`,
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
      resolve({ agentKey, agentName, code, outputPath })
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

  console.log(`Ejecutando ${options.agents.length} agentes en paralelo...`)
  console.log(`Salida: ${runDir}`)

  const results = await Promise.all(options.agents.map((agent) => runAgent(agent, options, runDir)))
  const failed = results.filter((result) => result.code !== 0)

  for (const result of results) {
    const status = result.code === 0 ? "OK" : `FALLO ${result.code}`
    console.log(`${status} ${result.agentName} -> ${result.outputPath}`)
  }

  process.exitCode = failed.length > 0 ? 1 : 0
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
