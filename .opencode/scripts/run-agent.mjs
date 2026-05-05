#!/usr/bin/env node
import { spawn } from "node:child_process"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { mkdir, writeFile } from "node:fs/promises"
import { dirname } from "node:path"

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)))

// Intervalo de checkpoint en ms (30 segundos)
const CHECKPOINT_INTERVAL = 30000

function usage() {
  console.log(`Uso:
  node .opencode/scripts/run-agent.mjs [opciones] "tarea"

Opciones:
  --agent cultura-lead         Agente primario a lanzar. Por defecto: cultura-lead
  --title titulo               Titulo de la ejecucion. Por defecto: cultura-task
  --scope "src/hooks,src/pages" Alcance permitido o esperado
  --ownership "frontend:src/pages; data:src/hooks"
  --verify "npm run lint && npm run build"
  --no-verify                  Indica que no se requiere verificacion automatica
  --help                       Muestra esta ayuda.

Ejemplo:
  npm run agents:run -- --scope "src/pages/Events,src/hooks" --verify "npm run lint && npm run build" "Implementa filtros de eventos"
`)
}

function parseArgs(argv) {
  const options = {
    agent: "cultura-lead",
    title: "cultura-task",
    scope: "Debe inferirse desde AGENTS.md y el codigo real.",
    ownership: "El lead debe definir ownership antes de delegar escritura si hay varios dominios.",
    verify: "npm run lint y npm run build si se toca codigo.",
    task: "",
  }

  const taskParts = []

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i]

    if (arg === "--help" || arg === "-h") {
      options.help = true
      continue
    }

    if (arg === "--no-verify") {
      options.verify = "No se requiere verificacion automatica; explicar el motivo si se toca codigo."
      continue
    }

    if (["--agent", "--title", "--scope", "--ownership", "--verify"].includes(arg)) {
      const key = arg.slice(2)
      const value = argv[i + 1]
      if (!value) throw new Error(`Falta valor para ${arg}`)
      options[key] = value
      i += 1
      continue
    }

    const inline = arg.match(/^--(agent|title|scope|ownership|verify)=(.*)$/)
    if (inline) {
      options[inline[1]] = inline[2]
      continue
    }

    taskParts.push(arg)
  }

  options.task = taskParts.join(" ").trim()
  return options
}

const __dirname = dirname(fileURLToPath(import.meta.url))
const RUNS_DIR = resolve(__dirname, "../.opencode/runs")

function buildContract(options) {
  return [
    "DIRECTRIZ ESTANDAR PARA CULTURAAPP",
    "",
    "OBJETIVO:",
    options.task,
    "",
    "AUTONOMIA:",
    "No preguntes salvo bloqueo real: credenciales, accion destructiva, cambio remoto, decision de producto irreversible u ownership ambiguo.",
    "",
    "CONTEXTO:",
    "Lee AGENTS.md y .opencode/AGENT_STATE.md antes de actuar. AGENTS.md es la fuente principal.",
    "",
    "ALCANCE:",
    options.scope,
    "",
    "RAMA Y PR:",
    "Trabaja en una rama de tarea creada desde main actualizado. Si la tarea debe integrarse, abre PR a main, mergea cuando las verificaciones pasen y verifica produccion si aplica. Un preview de Vercel no cuenta como produccion.",
    "",
    "OWNERSHIP:",
    options.ownership,
    "",
    "ENRUTADO:",
    "Usa cultura-lead como dispatcher minimo. Delega por dominio a @cultura-frontend, @cultura-data, @cultura-testing, @cultura-review, @cultura-security, @cultura-release o @cultura-docs.",
    "",
    "VERIFICACION:",
    options.verify,
    "",
    "SALIDA:",
    "Resume subagentes usados, archivos/cambios principales, verificacion ejecutada, PR/merge/produccion y riesgos o bloqueos restantes.",
  ].join("\n")
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help || !options.task) {
    usage()
    process.exitCode = options.help ? 0 : 1
    return
  }

  const prompt = buildContract(options)

  // Crear directorio de ejecución con timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-")
  const runDir = resolve(RUNS_DIR, timestamp)
  await mkdir(runDir, { recursive: true })
  const outputPath = resolve(runDir, "output.txt")

  console.log(`[${timestamp}] Starting: ${options.title}`)
  console.log(`[${timestamp}] Output: ${outputPath}`)

  const child = spawn(
    "opencode",
    ["run", "--agent", options.agent, "--title", options.title, "--dir", repoRoot, "--dangerously-skip-permissions", prompt],
    { cwd: repoRoot, stdio: ["ignore", "pipe", "pipe"] },
  )

  let stdout = ""
  let stderr = ""
  let checkpointCount = 0
  let lastSize = 0

  // Escribir output en tiempo real
  child.stdout.on("data", (chunk) => {
    stdout += chunk.toString()
    // Mostrar tail cada checkpoint
    if (stdout.length - lastSize > 5000) {
      lastSize = stdout.length
      checkpointCount += 1
      const lines = stdout.split("\n")
      const tail = lines.slice(-10).join("\n")
      console.log(`\n--- Checkpoint #${checkpointCount} ---`)
      console.log(tail)
      console.log(`-----------------------\n`)
    }
  })

  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString()
  })

  // Checkpoint periódico como backup
  const checkpointInterval = setInterval(() => {
    if (!child.killed) {
      checkpointCount += 1
      const lines = stdout.split("\n")
      const tail = lines.slice(-15).join("\n")
      console.log(`\n[${new Date().toLocaleTimeString()}] Checkpoint #${checkpointCount} (tail):`)
      console.log(tail)
      console.log("-----------------------\n")
    }
  }, CHECKPOINT_INTERVAL)

  child.on("close", async (code) => {
    clearInterval(checkpointInterval)

    // Escribir output final
    await writeFile(outputPath, stdout, "utf-8")

    console.log(`\n[${new Date().toLocaleTimeString()}] Finished with code: ${code}`)

    process.exitCode = code ?? 1
  })

  child.on("error", async (error) => {
    clearInterval(checkpointInterval)
    await writeFile(outputPath, `Error: ${error.message}\n${stderr}`, "utf-8")
    console.error(`Error: ${error.message}`)
    process.exitCode = 1
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
