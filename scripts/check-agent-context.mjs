#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"

const scriptDir = dirname(fileURLToPath(import.meta.url))
const repoRoot = resolve(scriptDir, "..")

const requiredFiles = ["AGENTS.md", "docs/agent-context-policy.md"]
const optionalFiles = [
  "CLAUDE.md",
  ".opencode/README.md",
  ".opencode/AGENT_TASK_TEMPLATE.md",
  ".memory/MEMORY.md",
  ".memory/topics/README.md",
  "docs/project/prompts/README.md",
]

const wordBudgets = [
  {
    path: "AGENTS.md",
    maxWords: 1200,
    suggestion: "Keep AGENTS.md as the short entry contract and move detail behind references.",
  },
  {
    path: "CLAUDE.md",
    maxWords: 250,
    suggestion: "Keep CLAUDE.md as a short adapter that points to the canonical policy.",
  },
  {
    path: ".memory/MEMORY.md",
    maxWords: 400,
    suggestion: "Keep MEMORY.md as an index; move detail to targeted memory files.",
  },
  {
    path: ".memory/topics/README.md",
    maxWords: 400,
    suggestion: "Keep memory indexes compact and route to detailed files.",
  },
]

const broadLoadingPhrases = [
  "read all",
  "load all",
  "load full",
  "read full",
  "always read",
  "must read all",
  "full Product Brain",
  "read entire",
  "load entire",
  "leer todo",
  "cargar todo",
  "leer completo",
  "cargar completo",
  "leer siempre",
  "cargar siempre",
  "todas las issues",
  "backlog completo",
  "CURRENT_RELEASE",
  "CURRENT_PLAN",
  "BACKLOG",
]

const historyTerms = [
  "run log",
  "logs",
  "history",
  "historical",
  "archive",
  "histórico",
  "historico",
  "commit histories",
  "branch lists",
]

const results = {
  ok: 0,
  info: [],
  warnings: [],
  errors: [],
}

function repoPath(path) {
  return resolve(repoRoot, path)
}

function toRepoRelative(path) {
  return relative(repoRoot, path).replaceAll("\\", "/")
}

function fileExists(path) {
  return existsSync(repoPath(path))
}

function read(path) {
  return readFileSync(repoPath(path), "utf8")
}

function listMarkdownFiles(dirPath) {
  const absoluteDir = repoPath(dirPath)
  if (!existsSync(absoluteDir)) return []

  return readdirSync(absoluteDir)
    .map((entry) => join(absoluteDir, entry))
    .filter((absolutePath) => statSync(absolutePath).isFile())
    .filter((absolutePath) => absolutePath.endsWith(".md"))
    .map(toRepoRelative)
    .sort()
}

function unique(items) {
  return [...new Set(items)]
}

function countWords(text) {
  const withoutCodeFences = text.replace(/```[\s\S]*?```/g, " ")
  return (withoutCodeFences.match(/[A-Za-zÀ-ÿ0-9_'-]+/g) ?? []).length
}

function isHistoricalOrDoNotLoad(text) {
  return /status:\s*Historical\b/i.test(text) || /load_policy:\s*do_not_load_by_default\b/i.test(text)
}

function lineSnippet(line) {
  const compact = line.trim().replace(/\s+/g, " ")
  return compact.length > 140 ? `${compact.slice(0, 137)}...` : compact
}

function findPhraseMatches(path, text) {
  const lines = text.split("\n")
  const matches = []

  for (const phrase of broadLoadingPhrases) {
    const needle = phrase.toLowerCase()
    lines.forEach((line, index) => {
      if (line.toLowerCase().includes(needle)) {
        matches.push({
          path,
          line: index + 1,
          phrase,
          snippet: lineSnippet(line),
          historical: isHistoricalOrDoNotLoad(text),
        })
      }
    })
  }

  return matches
}

function hasHistoryTerms(text) {
  const lower = text.toLowerCase()
  return historyTerms.some((term) => lower.includes(term.toLowerCase()))
}

function hasHistoryGuardrails(text) {
  return /load policy:/i.test(text) || /not a run log/i.test(text) || /do not load/i.test(text) || /not loaded by default/i.test(text)
}

function printLine(status, message) {
  console.log(`${status.padEnd(5)} ${message}`)
}

function checkRequiredFiles() {
  for (const path of requiredFiles) {
    if (!fileExists(path)) {
      results.errors.push(`${path}: required context file is missing.`)
    }
  }
}

function checkWordBudgets(agentFiles) {
  console.log("Size budgets:")

  const checks = [
    ...wordBudgets,
    ...agentFiles.map((path) => ({
      path,
      maxWords: 700,
      suggestion: "Keep role prompts compact; link to policy and load detail on demand.",
    })),
  ]

  for (const check of checks) {
    if (!fileExists(check.path)) continue

    const words = countWords(read(check.path))
    if (words > check.maxWords) {
      results.warnings.push(`${check.path}: ${words} words exceeds target <= ${check.maxWords}. Suggestion: ${check.suggestion}`)
      printLine("WARN", `${check.path}: ${words} words exceeds target <= ${check.maxWords}. Suggestion: ${check.suggestion}`)
    } else {
      results.ok += 1
      printLine("OK", `${check.path}: ${words} words, target <= ${check.maxWords}`)
    }
  }
}

function checkBroadLoadingPhrases(scanFiles) {
  const matches = scanFiles.flatMap((path) => (fileExists(path) ? findPhraseMatches(path, read(path)) : []))

  console.log("")
  console.log("Broad-loading phrase matches:")

  if (matches.length === 0) {
    results.ok += 1
    printLine("OK", "No broad-loading phrases found.")
    return
  }

  for (const match of matches) {
    const message = `${match.path}:${match.line} "${match.phrase}" — ${match.snippet}`
    if (match.historical) {
      results.info.push(`${message} — historical/do-not-load file; review only if it is treated as current instructions.`)
      printLine("INFO", `${message} — historical/do-not-load file.`)
    } else {
      results.warnings.push(`${message} — review if this is a mandatory broad read or an acceptable prohibition/conditional reference.`)
      printLine("WARN", `${message} — review if mandatory or acceptable.`)
    }
  }
}

function checkMemoryHistory(memoryTopicFiles) {
  console.log("")
  console.log("Memory history/run-log scan:")

  let checked = 0

  for (const path of memoryTopicFiles) {
    if (!fileExists(path)) continue
    checked += 1
    const text = read(path)
    if (hasHistoryTerms(text) && !hasHistoryGuardrails(text)) {
      results.warnings.push(`${path}: contains history/run-log terms without clear load-policy/not-run-log guardrails.`)
      printLine("WARN", `${path}: history/run-log terms found. Suggestion: keep durable rules separate from execution history.`)
    }
  }

  if (checked === 0) {
    printLine("INFO", "No .memory/topics/*.md files found.")
    return
  }

  results.ok += 1
  printLine("OK", `${checked} memory topic file(s) scanned for history/run-log leakage.`)
}

function main() {
  const agentFiles = listMarkdownFiles(".opencode/agents")
  const memoryTopicFiles = listMarkdownFiles(".memory/topics")
  const promptFiles = listMarkdownFiles("docs/project/prompts")

  const scanFiles = unique([
    ...requiredFiles,
    ...optionalFiles,
    ...agentFiles,
    ...memoryTopicFiles,
    ...promptFiles,
  ])

  console.log("Agent context check")
  console.log("Policy: docs/agent-context-policy.md")
  console.log("")

  checkRequiredFiles()
  checkWordBudgets(agentFiles)
  checkBroadLoadingPhrases(scanFiles)
  checkMemoryHistory(memoryTopicFiles)

  console.log("")
  console.log("Summary:")
  console.log(`- OK: ${results.ok}`)
  console.log(`- Info: ${results.info.length}`)
  console.log(`- Warnings: ${results.warnings.length}`)
  console.log(`- Errors: ${results.errors.length}`)

  if (results.errors.length > 0) {
    console.log("")
    console.log("Errors:")
    for (const error of results.errors) printLine("ERROR", error)
    process.exitCode = 1
  }
}

main()
