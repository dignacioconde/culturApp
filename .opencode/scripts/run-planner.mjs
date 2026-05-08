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
  node .opencode/scripts/run-planner.mjs "prompt rough de la tarea"

El planificador convierte el prompt en una issue de GitHub estructurada,
prepara una rama desde main y lanza automáticamente los agentes de implementación
con routing de modelos segun riesgo y complejidad.

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
    "1. Lee AGENTS.md, docs/agent-context-policy.md y .memory/MEMORY.md como indice.",
    "2. Clasifica el dominio y carga solo memoria o detalle relevante. No cargues backlog, release, historico ni Product Brain completo por defecto; DIGEST solo si la tarea requiere contexto de producto o planificacion.",
    "3. Genera la issue estructurada.",
    "4. Crea la issue en GitHub con gh.",
    "5. Prepara una rama de tarea desde main actualizado; si el worktree esta sucio, reporta bloqueo.",
    "6. Lanza npm run agents:run con el objetivo, la URL, PR a main, merge y verificacion de produccion si aplica.",
    "",
    "ROUTING DE MODELOS:",
    "GPT-5.5 conserva planificacion, ambiguedad, arquitectura, datos/RLS, seguridad, finanzas, review, verificacion final y PR/release.",
    "GPT-5.3-Codex-Spark puede usarse solo como worker rapido para tareas locales, acotadas, con ownership claro y verificacion objetiva.",
    "Escala a GPT-5.5 si Spark falla verificacion, toca zona sensible, necesita mas de 1 retry o devuelve un diff demasiado amplio.",
  ].join("\n")

  const startedAt = new Date().toISOString()
  const timestamp = startedAt.replace(/[:.]/g, "-")
  const runDir = resolve(RUNS_DIR, timestamp)
  const metadataPath = resolve(runDir, "metadata.json")
  await mkdir(runDir, { recursive: true })
  await writeFile(
    metadataPath,
    JSON.stringify(
      {
        startedAt,
        endedAt: null,
        elapsedMs: null,
        status: "running",
        title: "cultura-plan",
        agent: "cultura-planner",
        taskType: "planning",
        routingReason: "issue planning and model-routing decision",
        models: MODEL_DEFAULTS,
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

  const child = spawn(
    "opencode",
    ["run", "--agent", "cultura-planner", "--title", "cultura-plan", "--dir", repoRoot, "--dangerously-skip-permissions", contract],
    { cwd: repoRoot, stdio: "inherit" },
  )

  child.on("close", async (code) => {
    await writeFile(
      metadataPath,
      JSON.stringify(
        {
          startedAt,
          endedAt: new Date().toISOString(),
          elapsedMs: Date.now() - new Date(startedAt).getTime(),
          status: code === 0 ? "done" : "error",
          title: "cultura-plan",
          agent: "cultura-planner",
          taskType: "planning",
          routingReason: "issue planning and model-routing decision",
          models: MODEL_DEFAULTS,
          result: code === 0 ? "success" : "error",
          exitCode: code ?? 1,
          costEstimate: "not-recorded",
          retries: "not-recorded",
          escalations: "not-recorded",
          notes: "Operational telemetry for model-routing pilot. Do not persist run history in .memory/.",
        },
        null,
        2,
      ),
      "utf-8",
    ).catch(() => {})
    process.exitCode = code ?? 1
  })
}

main().catch((error) => {
  console.error(error.message)
  process.exitCode = 1
})
