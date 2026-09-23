#!/usr/bin/env node
import {
  checkMemoryRepository,
  isCompatibilityStub,
  parseVolatileEntries,
  routeMemory,
  validateVolatileEntries,
} from "./memory-lib.mjs"

const jsonOutput = process.argv.includes("--json")
const strict = process.argv.includes("--strict")
const thresholds = {
  precision: 1,
  coverage: 1,
  maxFiles: 3,
  maxTokens: 2000,
}

const scenarios = [
  {
    id: "forms-date",
    task: "Corrige el selector de fecha del formulario de eventos",
    expected: [".memory/topics/forms.md"],
  },
  {
    id: "calendar-mobile",
    task: "Revisa el CALENDARIO móvil y el scroll de la vista semana",
    expected: [".memory/projects/calendar.md", ".memory/lessons_mobile_modals.md"],
  },
  {
    id: "dashboard-finance",
    task: "Comprueba Caja del mes y los ingresos del dashboard",
    expected: [".memory/projects/dashboard-finance.md"],
  },
  {
    id: "settings-irpf",
    task: "Ajusta el IRPF del perfil desde Ajustes",
    expected: [".memory/projects/settings.md"],
  },
  {
    id: "deploy-pwa",
    task: "Valida el deploy de la PWA y su service worker en Vercel",
    expected: [".memory/projects/routing-deploy.md"],
  },
  {
    id: "product-brain-agents",
    task: "Planifica con agentes una issue del Product Brain",
    expected: [".memory/topics/agent-workflows.md"],
  },
  {
    id: "portable-skills",
    task: "Actualiza una skill portable y su enlace de Claude Code",
    expected: [".memory/topics/portable-skills.md"],
  },
  {
    id: "email-brevo",
    task: "Diagnostica la entrega de correo transaccional en Brevo",
    expected: [".memory/projects/email-ops.md"],
  },
  {
    id: "collaboration-preference",
    task: "Revisa las preferencias de tono y respuesta breve del usuario",
    expected: [".memory/me.md"],
  },
  {
    id: "multi-area",
    task: "Revisa los cobros del dashboard y la entrega de email por SMTP",
    expected: [".memory/projects/dashboard-finance.md", ".memory/projects/email-ops.md"],
  },
  {
    id: "legacy-route-forgetting",
    task: "Comprueba branch protection y el check de CI",
    expected: [".memory/topics/agent-workflows.md"],
  },
  {
    id: "generic-fallback",
    task: "Refina una tarjeta informativa sin reglas específicas",
    expected: [".memory/core.md"],
  },
]

function sameMembers(left, right) {
  return left.length === right.length && left.every((item) => right.includes(item))
}

const scenarioResults = scenarios.map((scenario) => {
  const result = routeMemory(scenario.task)
  const truePositives = result.selectedFiles.filter((path) => scenario.expected.includes(path)).length
  const precision = result.selectedFiles.length === 0 ? 0 : truePositives / result.selectedFiles.length
  const coverage = scenario.expected.length === 0 ? 1 : truePositives / scenario.expected.length
  const exact = sameMembers(result.selectedFiles, scenario.expected)
  const withinBudget = result.selectedFiles.length <= thresholds.maxFiles
    && result.metrics.selectedBundle.estimatedTokens <= thresholds.maxTokens

  return {
    id: scenario.id,
    task: scenario.task,
    expected: scenario.expected,
    selected: result.selectedFiles,
    matchedRoutes: result.matchedRoutes.map((route) => route.area),
    precision,
    coverage,
    files: result.selectedFiles.length,
    estimatedTokens: result.metrics.selectedBundle.estimatedTokens,
    loadRatio: result.metrics.loadRatio,
    exact,
    withinBudget,
    passed: exact && withinBudget,
  }
})

const duplicateFixture = [
  "- **runtime.node:** 22. _(fuente: package.json; verificado: 2026-09-01)_",
  "- **runtime.node:** 24. _(fuente: .github/workflows/ci.yml; verificado: 2026-09-22)_",
].join("\n")
const duplicateEntries = parseVolatileEntries(duplicateFixture).entries
const duplicateValidation = validateVolatileEntries(duplicateEntries, { today: "2026-09-22" })

const replacementFixture = "- **runtime.node:** 24. _(fuente: .github/workflows/ci.yml; verificado: 2026-09-22)_"
const replacementEntries = parseVolatileEntries(replacementFixture).entries
const replacementValidation = validateVolatileEntries(replacementEntries, { today: "2026-09-22" })

const reviewFixture = "- **runtime.node:** 24. _(fuente: .github/workflows/ci.yml; verificado: 2026-01-01; revisar: 2026-02-01)_"
const reviewEntries = parseVolatileEntries(reviewFixture).entries
const reviewValidation = validateVolatileEntries(reviewEntries, { today: "2026-09-22" })

const lifecycle = [
  {
    id: "conflict-detection",
    passed: duplicateValidation.errors.some((error) => error.code === "volatile_duplicate_key"),
  },
  {
    id: "replacement-keeps-one-current-value",
    passed: replacementEntries.length === 1
      && replacementEntries[0].value.includes("24")
      && replacementValidation.errors.length === 0,
  },
  {
    id: "expired-review-is-advisory",
    passed: reviewValidation.errors.length === 0
      && reviewValidation.warnings.some((warning) => warning.code === "volatile_review_due"),
  },
  {
    id: "compatibility-marker",
    passed: isCompatibilityStub("> memory_status: compatibility_stub · load_policy: do_not_load_by_default"),
  },
]

const totalSelected = scenarioResults.reduce((total, result) => total + result.selected.length, 0)
const totalExpected = scenarioResults.reduce((total, result) => total + result.expected.length, 0)
const totalTruePositives = scenarioResults.reduce(
  (total, result) => total + result.selected.filter((path) => result.expected.includes(path)).length,
  0,
)
const repositoryCheck = checkMemoryRepository({ today: "2026-09-22" })
const summary = {
  precision: totalSelected === 0 ? 0 : totalTruePositives / totalSelected,
  coverage: totalExpected === 0 ? 1 : totalTruePositives / totalExpected,
  scenariosPassed: scenarioResults.filter((result) => result.passed).length,
  scenariosTotal: scenarioResults.length,
  lifecyclePassed: lifecycle.filter((result) => result.passed).length,
  lifecycleTotal: lifecycle.length,
  maxFiles: Math.max(...scenarioResults.map((result) => result.files)),
  maxTokens: Math.max(...scenarioResults.map((result) => result.estimatedTokens)),
  averageLoadRatio: Number((scenarioResults.reduce((total, result) => total + result.loadRatio, 0) / scenarioResults.length).toFixed(4)),
  repositoryStructureOk: repositoryCheck.ok,
}

const ok = summary.precision >= thresholds.precision
  && summary.coverage >= thresholds.coverage
  && summary.scenariosPassed === summary.scenariosTotal
  && summary.lifecyclePassed === summary.lifecycleTotal
  && summary.maxFiles <= thresholds.maxFiles
  && summary.maxTokens <= thresholds.maxTokens
  && summary.repositoryStructureOk

const output = {
  ok,
  strict,
  thresholds,
  summary,
  scenarios: scenarioResults,
  lifecycle,
  repositoryCheck: {
    ok: repositoryCheck.ok,
    errors: repositoryCheck.errors,
    warnings: repositoryCheck.warnings,
  },
}

if (jsonOutput) {
  console.log(JSON.stringify(output, null, 2))
} else {
  console.log("Memory benchmark")
  for (const result of scenarioResults) {
    console.log(`${result.passed ? "PASS" : "FAIL"} ${result.id}: P=${result.precision.toFixed(2)} C=${result.coverage.toFixed(2)} files=${result.files} tokens~${result.estimatedTokens}`)
    if (!result.passed) console.log(`     expected=${result.expected.join(", ")} selected=${result.selected.join(", ")}`)
  }
  for (const result of lifecycle) console.log(`${result.passed ? "PASS" : "FAIL"} ${result.id}`)
  console.log(`Summary: precision=${summary.precision.toFixed(2)} coverage=${summary.coverage.toFixed(2)} scenarios=${summary.scenariosPassed}/${summary.scenariosTotal}`)
  console.log(`Budget: maxFiles=${summary.maxFiles}/${thresholds.maxFiles} maxTokens~${summary.maxTokens}/${thresholds.maxTokens} averageLoad=${(summary.averageLoadRatio * 100).toFixed(1)}%`)
  console.log(`Repository structure: ${summary.repositoryStructureOk ? "OK" : "FAIL"}`)
  console.log(`Result: ${ok ? "OK" : strict ? "FAILED (strict)" : "ADVISORY FAIL"}`)
}

if (strict && !ok) process.exitCode = 1
