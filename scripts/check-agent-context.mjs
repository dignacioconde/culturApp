#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve } from "node:path"
import { fileURLToPath } from "node:url"
import { countWords, measurePrompt, sumPromptMetrics } from "./context-metrics.mjs"

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

  const files = []
  const visit = (dir) => {
    for (const entry of readdirSync(dir)) {
      const absolutePath = join(dir, entry)
      const stat = statSync(absolutePath)
      if (stat.isDirectory()) {
        visit(absolutePath)
      } else if (stat.isFile() && absolutePath.endsWith(".md")) {
        files.push(absolutePath)
      }
    }
  }

  visit(absoluteDir)
  return files.map(toRepoRelative).sort()
}

function listSkillFiles() {
  return listMarkdownFiles(".agents/skills").filter((path) => path.endsWith("/SKILL.md"))
}

function unique(items) {
  return [...new Set(items)]
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
        const contextText = lines.slice(Math.max(0, index - 2), index + 3).join(" ")
        matches.push({
          path,
          line: index + 1,
          lineText: line,
          contextText,
          phrase,
          snippet: lineSnippet(line),
          historical: isHistoricalOrDoNotLoad(text),
        })
      }
    })
  }

  return matches
}

function isAcceptableBroadLoadingLine(line) {
  return /no\s+(cargues|leas)|do not\s+(load|read|use)|sin\s+(historico|histórico|cargar|leer)|solo si|only if|salvo que|\bsi\b|\bif\b|when to use|use when|task mentions|before first|common mistakes|mistakes to avoid|avoid|evitar|critical:|medium:|not loaded by default|no se cargan por defecto|not its purpose|not backlog|never load all|docs\/project\/(releases|plans|backlog)\//i.test(line)
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

function checkSkillBudgets(skillFiles) {
  console.log("")
  console.log("Skill budgets:")

  for (const path of skillFiles) {
    if (!fileExists(path)) continue
    const words = countWords(read(path))
    if (words > 1200) {
      results.warnings.push(`${path}: ${words} words exceeds target <= 1200. Suggestion: keep skills compact and link to canonical contracts.`)
      printLine("WARN", `${path}: ${words} words exceeds target <= 1200.`)
    } else {
      results.ok += 1
      printLine("OK", `${path}: ${words} words, target <= 1200`)
    }
  }
}

function printTokenMetric(status, metric, target, note = "") {
  const targetText = target ? `, target <= ${target}` : ""
  const noteText = note ? ` ${note}` : ""
  printLine(status, `${metric.label}: ~${metric.estimatedTokens} tokens, ${metric.words} words${targetText}.${noteText}`)
}

function maxByTokenEstimate(items) {
  return items.reduce((largest, item) => (item.estimatedTokens > largest.estimatedTokens ? item : largest), items[0])
}

function checkTokenCostMetrics(agentFiles, skillFiles) {
  console.log("")
  console.log("Token cost metrics (estimate):")

  const entryFiles = ["AGENTS.md", "docs/agent-context-policy.md", ".memory/MEMORY.md"].filter(fileExists)
  const entryMetrics = entryFiles.map((path) => measurePrompt(path, read(path)))
  const entryBundle = sumPromptMetrics("Entry bundle (AGENTS + policy + memory index)", entryMetrics)
  const entryTarget = 5000

  if (entryBundle.estimatedTokens > entryTarget) {
    results.warnings.push(`${entryBundle.label}: ~${entryBundle.estimatedTokens} prompt tokens exceeds target <= ${entryTarget}.`)
    printTokenMetric("WARN", entryBundle, entryTarget, "Shrink entry context or move detail behind indexes.")
  } else {
    results.ok += 1
    printTokenMetric("OK", entryBundle, entryTarget)
  }

  const agentMetrics = agentFiles.filter(fileExists).map((path) => measurePrompt(path, read(path)))
  if (agentMetrics.length > 0) {
    const largestAgent = maxByTokenEstimate(agentMetrics)
    const roleTarget = 1400
    if (largestAgent.estimatedTokens > roleTarget) {
      results.warnings.push(`${largestAgent.label}: ~${largestAgent.estimatedTokens} prompt tokens exceeds role prompt target <= ${roleTarget}.`)
      printTokenMetric("WARN", largestAgent, roleTarget, "Compact role-specific rules.")
    } else {
      results.ok += 1
      printTokenMetric("OK", largestAgent, roleTarget, "Largest role prompt.")
    }

    const allRoles = sumPromptMetrics("All role prompts (anti-pattern if loaded together)", agentMetrics)
    results.info.push(`${allRoles.label}: ~${allRoles.estimatedTokens} prompt tokens. Load only the relevant role.`)
    printTokenMetric("INFO", allRoles, null, "Use as a smell, not a default read.")
  }

  const skillMetrics = skillFiles.filter(fileExists).map((path) => measurePrompt(path, read(path)))
  if (skillMetrics.length > 0) {
    const largestSkill = maxByTokenEstimate(skillMetrics)
    const skillTarget = 2400
    if (largestSkill.estimatedTokens > skillTarget) {
      results.warnings.push(`${largestSkill.label}: ~${largestSkill.estimatedTokens} prompt tokens exceeds skill target <= ${skillTarget}.`)
      printTokenMetric("WARN", largestSkill, skillTarget, "Split or link out reference detail.")
    } else {
      results.ok += 1
      printTokenMetric("OK", largestSkill, skillTarget, "Largest skill.")
    }
  }

  console.log("INFO  Token estimate basis: chars / 4. Provider-side completion tokens and USD are not available here.")
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
    if (match.historical || isAcceptableBroadLoadingLine(match.contextText)) {
      results.info.push(`${message} — historical/do-not-load file; review only if it is treated as current instructions.`)
      printLine("INFO", `${message} — prohibitive/conditional or historical/do-not-load file.`)
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
  const skillFiles = listSkillFiles()
  const memoryTopicFiles = listMarkdownFiles(".memory/topics")
  const promptFiles = listMarkdownFiles("docs/project/prompts")

  const scanFiles = unique([
    ...requiredFiles,
    ...optionalFiles,
    ...agentFiles,
    ...skillFiles,
    ...memoryTopicFiles,
    ...promptFiles,
  ])

  console.log("Agent context check")
  console.log("Policy: docs/agent-context-policy.md")
  console.log("")

  checkRequiredFiles()
  checkWordBudgets(agentFiles)
  checkSkillBudgets(skillFiles)
  checkTokenCostMetrics(agentFiles, skillFiles)
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
