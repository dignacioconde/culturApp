#!/usr/bin/env node
import { checkMemoryRepository } from "./memory-lib.mjs"

const jsonOutput = process.argv.includes("--json")
const result = checkMemoryRepository()

if (jsonOutput) {
  console.log(JSON.stringify(result, null, 2))
} else {
  console.log("Memory check")
  for (const error of result.errors) {
    const location = error.line ? `${error.path}:${error.line}` : error.path
    console.error(`ERROR ${error.code} ${location} — ${error.message}`)
  }
  for (const warning of result.warnings) {
    const location = warning.line ? `${warning.path}:${warning.line}` : warning.path
    console.warn(`WARN  ${warning.code} ${location} — ${warning.message}`)
  }
  console.log(`Files: ${result.totals.files} (${result.totals.activeFiles} active, ${result.totals.compatibilityStubs} compatibility stubs)`)
  console.log(`Routes: ${result.totals.routes} · Volatile facts: ${result.totals.volatileFacts}`)
  console.log(`Summary: ${result.errors.length} errors · ${result.warnings.length} warnings`)
}

process.exitCode = result.ok ? 0 : 1
