import { existsSync, readdirSync, readFileSync, statSync } from "node:fs"
import { dirname, join, relative, resolve, sep } from "node:path"
import { fileURLToPath } from "node:url"
import { measurePrompt, sumPromptMetrics } from "./context-metrics.mjs"

const scriptDir = dirname(fileURLToPath(import.meta.url))

export const repoRoot = resolve(scriptDir, "..")
export const memoryRoot = join(repoRoot, ".memory")
export const memoryIndexPath = join(memoryRoot, "MEMORY.md")
export const DEFAULT_MEMORY_BUDGET = Object.freeze({ maxFiles: 3, maxTokens: 2000 })

function posixPath(path) {
  return path.split(sep).join("/")
}

export function toRepoRelative(path) {
  return posixPath(relative(repoRoot, path))
}

export function normalizeText(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
}

export function containsSignal(normalizedText, signal) {
  const normalizedSignal = normalizeText(signal)
  if (!normalizedSignal) return false
  return ` ${normalizedText} `.includes(` ${normalizedSignal} `)
}

export function listMemoryMarkdownFiles() {
  if (!existsSync(memoryRoot)) return []

  const files = []
  const visit = (dir) => {
    for (const entry of readdirSync(dir).sort()) {
      const path = join(dir, entry)
      const stat = statSync(path)
      if (stat.isDirectory()) visit(path)
      else if (stat.isFile() && path.endsWith(".md")) files.push(path)
    }
  }

  visit(memoryRoot)
  return files
}

export function extractMarkdownLinks(text) {
  const links = []
  const pattern = /(?<!!)\[[^\]]*\]\(([^)]+)\)/g
  let match
  while ((match = pattern.exec(text)) !== null) {
    let target = match[1].trim()
    if (target.startsWith("<") && target.endsWith(">")) target = target.slice(1, -1)
    target = target.replace(/\s+["'][^"']*["']$/, "")
    links.push(target)
  }
  return links
}

function resolveLocalLink(sourcePath, rawTarget) {
  if (/^[a-z][a-z0-9+.-]*:/i.test(rawTarget) || rawTarget.startsWith("#")) return null
  const target = decodeURIComponent(rawTarget.split("#")[0].split("?")[0])
  if (!target) return null
  return resolve(dirname(sourcePath), target)
}

function parseTableCells(line) {
  const trimmed = line.trim()
  if (!trimmed.startsWith("|") || !trimmed.endsWith("|")) return null
  return trimmed.slice(1, -1).split("|").map((cell) => cell.trim())
}

export function parseMemoryIndex(text = readFileSync(memoryIndexPath, "utf8")) {
  const lines = text.split("\n")
  const expectedHeader = ["area", "senales", "destinos", "politica"]
  const headerIndex = lines.findIndex((line) => {
    const cells = parseTableCells(line)
    return cells?.length === 4 && cells.every((cell, index) => normalizeText(cell) === expectedHeader[index])
  })

  if (headerIndex === -1) {
    throw new Error("MEMORY.md must contain the routing table: Área | Señales | Destinos | Política.")
  }

  const separatorCells = parseTableCells(lines[headerIndex + 1] ?? "")
  if (separatorCells?.length !== 4 || separatorCells.some((cell) => !/^:?-{3,}:?$/.test(cell))) {
    throw new Error(`MEMORY.md:${headerIndex + 2} must be a four-column Markdown table separator.`)
  }

  const routes = []
  for (let index = headerIndex + 2; index < lines.length; index += 1) {
    const cells = parseTableCells(lines[index])
    if (!cells) break
    if (cells.length !== 4) throw new Error(`MEMORY.md:${index + 1} has an invalid routing row.`)

    const [area, signalCell, destinationCell, policyCell] = cells
    const signals = signalCell === "—"
      ? []
      : signalCell.split(";").map((signal) => signal.trim()).filter(Boolean)
    const destinations = extractMarkdownLinks(destinationCell).map((target) => {
      const absolutePath = resolveLocalLink(memoryIndexPath, target)
      if (!absolutePath) throw new Error(`MEMORY.md:${index + 1} has a non-local route destination: ${target}`)
      return toRepoRelative(absolutePath)
    })

    routes.push({
      area,
      signals,
      destinations,
      policy: normalizeText(policyCell),
      line: index + 1,
      order: routes.length,
    })
  }

  if (routes.length === 0) throw new Error("MEMORY.md routing table has no routes.")
  return routes
}

function fileMetric(path) {
  const text = readFileSync(resolve(repoRoot, path), "utf8")
  return measurePrompt(path, text, { path })
}

export function routeMemory(task, options = {}) {
  const budget = { ...DEFAULT_MEMORY_BUDGET, ...options }
  const indexText = readFileSync(memoryIndexPath, "utf8")
  const routes = parseMemoryIndex(indexText)
  const normalizedTask = normalizeText(task)
  const matchedRoutes = routes
    .filter((route) => route.policy === "condicional")
    .map((route) => {
      const matchedSignals = route.signals.filter((signal) => containsSignal(normalizedTask, signal))
      return { ...route, matchedSignals, score: matchedSignals.length }
    })
    .filter((route) => route.score > 0)
    .sort((left, right) => right.score - left.score || left.order - right.order)

  const candidateRoutes = matchedRoutes.length > 0
    ? matchedRoutes
    : routes.filter((route) => route.policy === "fallback").slice(0, 1).map((route) => ({
        ...route,
        matchedSignals: [],
        score: 0,
      }))

  const indexMetric = measurePrompt(".memory/MEMORY.md", indexText, { path: ".memory/MEMORY.md" })
  const selectedFiles = []
  const selectedMetrics = []
  const skippedFiles = []

  for (const route of candidateRoutes) {
    for (const path of route.destinations) {
      if (selectedFiles.includes(path)) continue
      const metric = fileMetric(path)
      if (selectedFiles.length >= budget.maxFiles) {
        skippedFiles.push({ path, reason: "file_limit", estimatedTokens: metric.estimatedTokens })
        continue
      }

      const nextTokens = indexMetric.estimatedTokens
        + selectedMetrics.reduce((total, item) => total + item.estimatedTokens, 0)
        + metric.estimatedTokens
      if (selectedFiles.length > 0 && nextTokens > budget.maxTokens) {
        skippedFiles.push({ path, reason: "token_budget", estimatedTokens: metric.estimatedTokens })
        continue
      }

      selectedFiles.push(path)
      selectedMetrics.push(metric)
    }
  }

  const selectedBundle = sumPromptMetrics("Selected memory bundle", [indexMetric, ...selectedMetrics])
  const allActiveFiles = [...new Set(routes.flatMap((route) => route.destinations))]
  const allActiveMetrics = allActiveFiles.map(fileMetric)
  const allActiveBundle = sumPromptMetrics("All active memory", [indexMetric, ...allActiveMetrics])
  const loadRatio = allActiveBundle.estimatedTokens === 0
    ? 0
    : selectedBundle.estimatedTokens / allActiveBundle.estimatedTokens

  return {
    task,
    normalizedTask,
    fallback: matchedRoutes.length === 0,
    matchedRoutes: matchedRoutes.map(({ area, matchedSignals, score, destinations }) => ({
      area,
      matchedSignals,
      score,
      destinations,
    })),
    selectedFiles,
    skippedFiles,
    budget,
    withinBudget: selectedFiles.length <= budget.maxFiles && selectedBundle.estimatedTokens <= budget.maxTokens,
    metrics: {
      index: indexMetric,
      selectedFiles: selectedMetrics,
      selectedBundle,
      allActiveBundle,
      loadRatio: Number(loadRatio.toFixed(4)),
      savingsPercent: Number(((1 - loadRatio) * 100).toFixed(1)),
    },
  }
}

export function isCompatibilityStub(text) {
  return /memory_status:\s*compatibility_stub/i.test(text)
    && /load_policy:\s*do_not_load_by_default/i.test(text)
}

function validIsoDate(value) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const parsed = new Date(`${value}T00:00:00Z`)
  return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value
}

export function parseVolatileEntries(text, path = "fixture.md") {
  const entries = []
  const malformed = []
  const prefix = /^-\s+\*\*([a-z0-9][a-z0-9._-]*):\*\*/
  const full = /^-\s+\*\*([a-z0-9][a-z0-9._-]*):\*\*\s+(.+?)\s+_\(fuente:\s*([^;]+);\s*verificado:\s*(\d{4}-\d{2}-\d{2})(?:;\s*revisar:\s*(\d{4}-\d{2}-\d{2}))?\)_\s*$/

  text.split("\n").forEach((line, index) => {
    const prefixMatch = line.match(prefix)
    if (!prefixMatch) return
    const fullMatch = line.match(full)
    if (!fullMatch) {
      malformed.push({ path, line: index + 1, key: prefixMatch[1] })
      return
    }
    entries.push({
      path,
      line: index + 1,
      key: fullMatch[1],
      value: fullMatch[2].trim(),
      source: fullMatch[3].trim(),
      verifiedOn: fullMatch[4],
      reviewOn: fullMatch[5] ?? null,
    })
  })

  return { entries, malformed }
}

export function validateVolatileEntries(entries, options = {}) {
  const today = options.today ?? new Date().toISOString().slice(0, 10)
  const errors = []
  const warnings = []
  const seen = new Map()

  for (const entry of entries) {
    if (!entry.source) errors.push({ code: "volatile_source", path: entry.path, line: entry.line, message: `${entry.key} has no source.` })
    else if (!/^https?:\/\//i.test(entry.source)) {
      const sourcePath = resolve(repoRoot, entry.source.split("#")[0])
      if (!sourcePath.startsWith(`${repoRoot}${sep}`) || !existsSync(sourcePath)) {
        errors.push({ code: "volatile_source_missing", path: entry.path, line: entry.line, message: `${entry.key} source does not exist in the repository: ${entry.source}.` })
      }
    }
    if (!validIsoDate(entry.verifiedOn)) errors.push({ code: "volatile_verified_date", path: entry.path, line: entry.line, message: `${entry.key} has invalid verified date ${entry.verifiedOn}.` })
    if (entry.reviewOn && !validIsoDate(entry.reviewOn)) errors.push({ code: "volatile_review_date", path: entry.path, line: entry.line, message: `${entry.key} has invalid review date ${entry.reviewOn}.` })
    if (entry.reviewOn && validIsoDate(entry.reviewOn) && entry.reviewOn < entry.verifiedOn) {
      errors.push({ code: "volatile_date_order", path: entry.path, line: entry.line, message: `${entry.key} review date precedes its verified date.` })
    }
    if (entry.reviewOn && validIsoDate(entry.reviewOn) && entry.reviewOn < today) {
      warnings.push({ code: "volatile_review_due", path: entry.path, line: entry.line, message: `${entry.key} was due for review on ${entry.reviewOn}.` })
    }
    if (seen.has(entry.key)) {
      const previous = seen.get(entry.key)
      errors.push({
        code: "volatile_duplicate_key",
        path: entry.path,
        line: entry.line,
        message: `${entry.key} duplicates ${previous.path}:${previous.line}; replace the previous value instead of appending.`,
      })
    } else {
      seen.set(entry.key, entry)
    }
  }

  return { errors, warnings }
}

function finding(code, path, message, line = null) {
  return { code, path, ...(line ? { line } : {}), message }
}

export function checkMemoryRepository(options = {}) {
  const errors = []
  const warnings = []
  const files = listMemoryMarkdownFiles()
  let routes = []

  try {
    routes = parseMemoryIndex()
  } catch (error) {
    errors.push(finding("routing_table", ".memory/MEMORY.md", error.message))
  }

  const fileTexts = new Map()
  for (const absolutePath of files) {
    const path = toRepoRelative(absolutePath)
    const text = readFileSync(absolutePath, "utf8")
    fileTexts.set(path, text)
    if (!text.trim()) errors.push(finding("empty_file", path, "Memory Markdown file is empty."))

    for (const target of extractMarkdownLinks(text)) {
      const resolvedTarget = resolveLocalLink(absolutePath, target)
      if (!resolvedTarget) continue
      if (!resolvedTarget.startsWith(`${repoRoot}${sep}`) && resolvedTarget !== repoRoot) {
        errors.push(finding("link_outside_repo", path, `Local link points outside the repository: ${target}`))
      } else if (!existsSync(resolvedTarget)) {
        errors.push(finding("broken_link", path, `Local link does not exist: ${target}`))
      }
    }
  }

  const areaOwners = new Map()
  const signalOwners = new Map()
  const routeSignatures = new Map()
  const fallbackRoutes = routes.filter((route) => route.policy === "fallback")

  for (const route of routes) {
    const areaKey = normalizeText(route.area)
    if (!areaKey) errors.push(finding("route_area", ".memory/MEMORY.md", `Route at line ${route.line} has no area.`, route.line))
    else if (areaOwners.has(areaKey)) errors.push(finding("route_duplicate_area", ".memory/MEMORY.md", `${route.area} duplicates the route at line ${areaOwners.get(areaKey)}.`, route.line))
    else areaOwners.set(areaKey, route.line)

    if (!["condicional", "fallback"].includes(route.policy)) {
      errors.push(finding("route_policy", ".memory/MEMORY.md", `${route.area} uses unsupported policy ${route.policy}.`, route.line))
    }
    if (route.policy === "condicional" && route.signals.length === 0) {
      errors.push(finding("route_signals", ".memory/MEMORY.md", `${route.area} has no signals.`, route.line))
    }
    if (route.policy === "fallback" && route.signals.length > 0) {
      errors.push(finding("fallback_signals", ".memory/MEMORY.md", `${route.area} fallback must not have signals.`, route.line))
    }
    if (route.destinations.length === 0) {
      errors.push(finding("route_destination", ".memory/MEMORY.md", `${route.area} has no Markdown destination link.`, route.line))
    }

    for (const signal of route.signals) {
      const signalKey = normalizeText(signal)
      if (signalOwners.has(signalKey)) {
        const previous = signalOwners.get(signalKey)
        errors.push(finding("route_duplicate_signal", ".memory/MEMORY.md", `${route.area} repeats signal "${signal}" from ${previous.area}.`, route.line))
      } else {
        signalOwners.set(signalKey, route)
      }
    }

    const signature = `${route.policy}:${[...route.destinations].sort().join(",")}`
    if (routeSignatures.has(signature)) {
      errors.push(finding("route_duplicate", ".memory/MEMORY.md", `${route.area} duplicates destinations and policy from ${routeSignatures.get(signature)}.`, route.line))
    } else {
      routeSignatures.set(signature, route.area)
    }

    for (const destination of route.destinations) {
      if (!destination.startsWith(".memory/") || !destination.endsWith(".md")) {
        errors.push(finding("route_scope", ".memory/MEMORY.md", `${route.area} destination must be Markdown inside .memory/: ${destination}`, route.line))
        continue
      }
      const destinationText = fileTexts.get(destination)
      if (destinationText === undefined) {
        errors.push(finding("route_missing", ".memory/MEMORY.md", `${route.area} destination does not exist: ${destination}`, route.line))
      } else if (isCompatibilityStub(destinationText)) {
        errors.push(finding("route_compatibility_stub", ".memory/MEMORY.md", `${route.area} routes to compatibility stub ${destination}.`, route.line))
      }
    }
  }

  if (routes.length > 0 && fallbackRoutes.length !== 1) {
    errors.push(finding("fallback_count", ".memory/MEMORY.md", `Expected exactly one fallback route; found ${fallbackRoutes.length}.`))
  }

  const indexedPaths = new Set([".memory/MEMORY.md", ...routes.flatMap((route) => route.destinations)])
  if (fileTexts.has(".memory/MEMORY.md")) {
    for (const target of extractMarkdownLinks(fileTexts.get(".memory/MEMORY.md"))) {
      const absoluteTarget = resolveLocalLink(memoryIndexPath, target)
      if (absoluteTarget?.startsWith(`${memoryRoot}${sep}`)) indexedPaths.add(toRepoRelative(absoluteTarget))
    }
  }

  const activeFiles = []
  const compatibilityFiles = []
  const volatileEntries = []
  for (const [path, text] of fileTexts) {
    if (isCompatibilityStub(text)) {
      compatibilityFiles.push(path)
      continue
    }
    activeFiles.push(path)
    if (!indexedPaths.has(path)) errors.push(finding("orphan_file", path, "Active memory file is not indexed by MEMORY.md."))
    if (/\bsuperseded\b/i.test(text)) errors.push(finding("superseded_fact", path, "Remove replaced facts from active memory; git is the history."))

    const parsed = parseVolatileEntries(text, path)
    volatileEntries.push(...parsed.entries)
    for (const malformed of parsed.malformed) {
      errors.push(finding("volatile_format", path, `${malformed.key} does not follow the volatile fact format.`, malformed.line))
    }
  }

  const volatileValidation = validateVolatileEntries(volatileEntries, options)
  errors.push(...volatileValidation.errors)
  warnings.push(...volatileValidation.warnings)

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    totals: {
      files: files.length,
      activeFiles: activeFiles.length,
      compatibilityStubs: compatibilityFiles.length,
      routes: routes.length,
      volatileFacts: volatileEntries.length,
    },
  }
}
