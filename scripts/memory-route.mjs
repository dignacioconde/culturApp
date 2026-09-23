#!/usr/bin/env node
import { routeMemory } from "./memory-lib.mjs"

const args = process.argv.slice(2)
const jsonOutput = args.includes("--json")
const task = args.filter((arg) => !arg.startsWith("--")).join(" ").trim()

if (!task) {
  const message = "Usage: pnpm memory:route -- \"task description\" [--json]"
  if (jsonOutput) console.log(JSON.stringify({ ok: false, error: message }, null, 2))
  else console.error(message)
  process.exit(1)
}

try {
  const result = routeMemory(task)
  if (jsonOutput) {
    console.log(JSON.stringify({ ok: true, ...result }, null, 2))
  } else {
    console.log("Memory route")
    console.log(`Task: ${result.task}`)
    console.log(`Mode: ${result.fallback ? "fallback" : "matched"}`)
    if (!result.fallback) {
      const matches = result.matchedRoutes
        .map((route) => `${route.area} [${route.matchedSignals.join(", ")}]`)
        .join("; ")
      console.log(`Matches: ${matches}`)
    }
    console.log(`Files: ${result.selectedFiles.join(", ")}`)
    console.log(`Cost: ~${result.metrics.selectedBundle.estimatedTokens} tokens (${result.metrics.savingsPercent}% below active load-all)`)
    console.log(`Budget: ${result.withinBudget ? "OK" : "EXCEEDED"} (<= ${result.budget.maxFiles} files, <= ${result.budget.maxTokens} tokens)`)
    if (result.skippedFiles.length > 0) {
      console.log(`Skipped: ${result.skippedFiles.map((item) => `${item.path} (${item.reason})`).join(", ")}`)
    }
  }
} catch (error) {
  if (jsonOutput) console.log(JSON.stringify({ ok: false, error: error.message }, null, 2))
  else console.error(`[memory:route] ERROR: ${error.message}`)
  process.exitCode = 1
}
