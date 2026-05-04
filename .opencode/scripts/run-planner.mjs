#!/usr/bin/env node
import { spawn } from "node:child_process"
import { resolve } from "node:path"
import { fileURLToPath } from "node:url"

const repoRoot = resolve(fileURLToPath(new URL("../..", import.meta.url)))

function usage() {
  console.log(`Uso:
  node .opencode/scripts/run-planner.mjs "prompt rough de la tarea"

El planificador convierte el prompt en una issue de GitHub estructurada
y lanza automáticamente los agentes de implementación con el modelo barato.

Ejemplos:
  npm run agents:plan -- "quiero que los eventos se puedan filtrar por categoría y estado"
  npm run agents:plan -- "el calendario en móvil no muestra bien las semanas"
  npm run agents:plan -- "añadir exportación de ingresos a CSV desde el dashboard"
`)
}

async function main() {
  const args = process.argv.slice(2)

  if (args.includes("--help") || args.includes("-h")) {
    usage()
    return
  }

  const prompt = args.join(" ").trim()

  if (!prompt) {
    usage()
    process.exitCode = 1
    return
  }

  const contract = [
    "TAREA DE PLANIFICACIÓN:",
    prompt,
    "",
    "Sigue el protocolo completo del agente cultura-planner:",
    "1. Lee AGENTS.md y .memory/MEMORY.md.",
    "2. Clasifica el dominio y carga solo la memoria relevante.",
    "3. Genera la issue estructurada.",
    "4. Crea la issue en GitHub con gh.",
    "5. Lanza npm run agents:run con el objetivo y la URL.",
  ].join("\n")

  const child = spawn(
    "opencode",
    ["run", "--agent", "cultura-planner", "--title", "cultura-plan", "--dir", repoRoot, contract],
    { cwd: repoRoot, stdio: "inherit" },
  )

  child.on("close", (code) => {
    process.exitCode = code ?? 1
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
