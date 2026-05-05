#!/usr/bin/env node
/**
 * agents:status — Muestra el estado de agentes en ejecución y permite ver sus logs.
 * 
 * Uso:
 *   npm run agents:status              Muestra agentes activos y último output
 *   npm run agents:status --logs       Muestra logs recientes de la última ejecución
 *   npm run agents:status --watch   Modo watch (actualiza cada 5s)
 *   npm run agents:status --clear  Limpia ejecuciones antiguas
 */
import { readdir, stat, readFile, unlink } from "node:fs/promises"
import { dirname, join, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(__dirname, "../..")
const RUNS_DIR = resolve(repoRoot, ".opencode/runs")

function usage() {
  console.log(`Uso:
  npm run agents:status              Muestra agentes activos y último output
  npm run agents:status --logs       Muestra logs recientes de la última ejecución
  npm run agents:status --watch     Modo watch (actualiza cada 5s)
  npm run agents:status --clear    Limpia ejecuciones antiguas

Ejemplos:
  npm run agents:status
  npm run agents:status --logs
  npm run agents:status --watch
`)
}

function parseArgs(argv) {
  const options = {
    logs: false,
    watch: false,
    clear: false,
  }

  for (const arg of argv) {
    if (arg === "--help" || arg === "-h") {
      options.help = true
    } else if (arg === "--logs") {
      options.logs = true
    } else if (arg === "--watch") {
      options.watch = true
    } else if (arg === "--clear") {
      options.clear = true
    }
  }

  return options
}

async function listRuns() {
  try {
    const dirs = await readdir(RUNS_DIR)
    const runs = []

    for (const dir of dirs) {
      const dirPath = join(RUNS_DIR, dir)
      const dirStat = await stat(dirPath)

      if (dirStat.isDirectory()) {
        const files = await readdir(dirPath)
        runs.push({
          id: dir,
          created: dirStat.birthtime,
          agents: files.filter(f => f.endsWith(".md")).map(f => f.replace(".md", "")),
          hasOutput: files.some(f => f === "output.txt"),
        })
      }
    }

    // Ordenar por fecha descendente
    runs.sort((a, b) => b.created - a.created)
    return runs
  } catch {
    return []
  }
}

async function getActiveRuns() {
  const runs = await listRuns()
  const now = new Date()
  const activeRuns = []

  for (const run of runs) {
    // Una ejecución está activa si tiene menos de 30 minutos
    const age = (now - run.created) / 1000 / 60
    if (age < 30) {
      activeRuns.push(run)
    }
  }

  return activeRuns
}

async function showStatus(options) {
  const runs = await listRuns()

  if (runs.length === 0) {
    console.log("No hay ejecuciones registradas.")
    return
  }

  const activeRuns = await getActiveRuns()

  console.log("=== Estado de Agentes ===\n")
  console.log(`Total de ejecuciones: ${runs.length}`)
  console.log(`Activas (< 30 min): ${activeRuns.length}`)

  if (activeRuns.length > 0) {
    console.log("\n--- Ejecuciones Activas ---")
    for (const run of activeRuns) {
      const time = new Date(run.created).toLocaleString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      })
      console.log(`- ${run.id} (${time}) → [${run.agents.join(", ")}]`)
    }
  }

  // Mostrar última ejecución si hay y no hay activos
  if (activeRuns.length === 0 && runs.length > 0) {
    const lastRun = runs[0]
    console.log("\n--- Última Ejecución ---")
    console.log(`- ${lastRun.id} → [${lastRun.agents.join(", ")}]`)
  }

  // Si pide logs, mostrar output de la última
  if (options.logs && runs.length > 0) {
    const lastRun = runs[0]
    console.log(`\n--- Output: ${lastRun.id} ---`)

    const outputDir = join(RUNS_DIR, lastRun.id)

    for (const agent of lastRun.agents) {
      const outputPath = join(outputDir, `${agent}.md`)
      try {
        const content = await readFile(outputPath, "utf-8")
        // Mostrar primeras 30 líneas
        const lines = content.split("\n").slice(0, 30).join("\n")
        console.log(`\n## ${agent}`)
        console.log(lines)
        if (content.split("\n").length > 30) {
          console.log("\n... (truncado)")
        }
      } catch {
        // Ignorar
      }
    }
  }
}

async function clearOldRuns() {
  const runs = await listRuns()
  const now = new Date()
  let removed = 0

  for (const run of runs) {
    const age = (now - run.created) / 1000 / 60
    if (age > 24 * 60) { // Más de 24 horas
      const dirPath = join(RUNS_DIR, run.id)
      try {
        await unlink(dirPath)
        removed += 1
      } catch {
        // Ignorar errores
      }
    }
  }

  console.log(`Eliminadas ${removed} ejecuciones antiguas.`)
}

async function main() {
  const options = parseArgs(process.argv.slice(2))

  if (options.help) {
    usage()
    return
  }

  if (options.clear) {
    await clearOldRuns()
    return
  }

  if (options.watch) {
    // Modo watch: actualizar cada 5s
    console.log("Modo watch (Ctrl+C para salir)...\n")
    let watching = true

    process.on("SIGINT", () => {
      watching = false
    })

    while (watching) {
      await showStatus({ logs: false })
      await new Promise((resolve) => setTimeout(resolve, 5000))
      console.clear()
    }
  } else {
    await showStatus(options)
  }
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})