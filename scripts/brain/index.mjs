#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import {
  AREAS,
  COMPONENTS,
  THEMES,
  brainRoot,
  docTitle,
  ensureDir,
  indexesRoot,
  linkTo,
  normalizeDate,
  readAllDocs,
  sectionContent,
  sortById,
  stripWikilinks,
  today,
  writeIfChanged,
} from './lib.mjs'

const args = new Set(process.argv.slice(2))
const checkMode = args.has('--check')
const jsonOutput = args.has('--json')
const stale = []

const defaultIndexCreated = '2026-05-10'
const defaultBacklogCreated = '2026-05-05'

function verifyOrWrite(file, content) {
  const next = `${content.trimEnd()}\n`
  if (checkMode) {
    if (!existsSync(file) || readFileSync(file, 'utf8') !== next) {
      stale.push(relative(brainRoot, file).split('/').join('/'))
      return true
    }
    return false
  }
  return writeIfChanged(file, content)
}

function readExistingGenerated(file) {
  if (!existsSync(file)) return null
  const raw = readFileSync(file, 'utf8')
  const parsed = matter(raw)
  return {
    body: parsed.content.trim(),
    created: normalizeDate(parsed.data?.created),
    updated: normalizeDate(parsed.data?.updated),
  }
}

function generatedDates(file, body, defaultCreated) {
  const existing = readExistingGenerated(file)
  const created = existing?.created ?? defaultCreated
  const bodyChanged = existing?.body !== body.trim()
  const updated = bodyChanged ? today() : (existing?.updated ?? created)
  return { created, updated }
}

function frontmatter(id, title, aliases, tags, created, updated) {
  return [
    '---',
    'schema_version: 2',
    'kind: index',
    `id: ${id}`,
    `title: ${title}`,
    'lifecycle: active',
    `created: ${created}`,
    `updated: ${updated}`,
    'aliases:',
    ...aliases.map((alias) => `  - ${alias}`),
    'tags:',
    ...tags.map((tag) => `  - ${tag}`),
    'generated: true',
    '---',
    '',
  ].join('\n')
}

function writeIndex(fileName, id, title, aliases, tags, lines) {
  const file = join(indexesRoot, fileName)
  const body = `# ${title}\n\n${lines.join('\n')}`.trimEnd()
  const { created, updated } = generatedDates(file, body, defaultIndexCreated)
  const content = `${frontmatter(id, title, aliases, tags, created, updated)}${body}`.trimEnd()
  return verifyOrWrite(file, content)
}

function groupBy(items, getKeys) {
  const groups = new Map()
  for (const item of items) {
    const rawKeys = getKeys(item)
    const keys = Array.isArray(rawKeys) ? rawKeys : [rawKeys]
    for (const key of keys.length > 0 ? keys : ['none']) {
      const normalized = key ?? 'none'
      if (!groups.has(normalized)) groups.set(normalized, [])
      groups.get(normalized).push(item)
    }
  }
  return new Map([...groups.entries()].sort(([a], [b]) => String(a).localeCompare(String(b))))
}

function titleOf(doc) {
  return doc.frontmatter?.title ?? docTitle(doc.body, doc.basename)
}

function issueLine(doc, fromFolder = 'indexes') {
  const data = doc.frontmatter
  return `- ${linkTo(doc, fromFolder)} — ${titleOf(doc)} · ${data.issue_workflow} · ${data.priority} · ${data.work_level}`
}

function genericLine(doc, fromFolder = 'indexes') {
  return `- ${linkTo(doc, fromFolder)} — ${titleOf(doc)}`
}

function workflowOrder(value) {
  return {
    inbox: 0,
    backlog: 1,
    ready: 2,
    in_progress: 3,
    review: 4,
    blocked: 5,
    done: 6,
    wont_fix: 7,
  }[value] ?? 99
}

function priorityOrder(value) {
  return { p0: 0, p1: 1, p2: 2, p3: 3 }[value] ?? 99
}

function sortedIssues(items) {
  return [...items].sort((a, b) => {
    const workflowDelta = workflowOrder(a.frontmatter.issue_workflow) - workflowOrder(b.frontmatter.issue_workflow)
    if (workflowDelta !== 0) return workflowDelta
    const priorityDelta = priorityOrder(a.frontmatter.priority) - priorityOrder(b.frontmatter.priority)
    if (priorityDelta !== 0) return priorityDelta
    return a.frontmatter.id.localeCompare(b.frontmatter.id)
  })
}

function readDocsByKind(kind) {
  return docs.filter((doc) => doc.frontmatter?.kind === kind)
}

function boardTable(items, columns = ['ID', 'Titulo', 'Tipo', 'Nivel', 'P', 'Componentes']) {
  if (items.length === 0) return ['_Sin issues._']
  const rows = items.map((doc) => {
    const data = doc.frontmatter
    return `| ${linkTo(doc, 'backlog')} | ${titleOf(doc)} | ${data.work_type} | ${data.work_level} | ${data.priority} | ${data.components.join(', ')} |`
  })
  return [`| ${columns.join(' | ')} |`, `|${columns.map(() => '---').join('|')}|`, ...rows]
}

function resultFrom(doc) {
  const result = sectionContent(doc.content, ['Resultado', 'Resultado final'])
  if (!result) return 'Sin resultado documentado.'
  return stripWikilinks(result).split('\n').map((line) => line.trim()).filter(Boolean)[0] ?? 'Resultado documentado.'
}

function writeBacklog(issues) {
  const byWorkflow = groupBy(issues, (doc) => doc.frontmatter.issue_workflow)
  const body = [
    '# Backlog operativo',
    '',
    'Tablero ligero generado desde las issues Markdown. Las columnas visibles son `issue_workflow`; el detalle vive en cada issue.',
    '',
    '## Fuentes',
    '',
    '- Issues canonicas: [[../indexes/issues.index|Issues Index]]',
    '- Issues abiertas: [[../indexes/issues-open.index|Issues Open Index]]',
    '- Release activa: [[../releases/CURRENT_RELEASE|Current Release]]',
    '- Plan actual: [[../plans/CURRENT_PLAN|Current Plan]]',
    '- Ideas sin refinar: [[IDEAS]]',
    '- Triage: [[TRIAGE]]',
    '',
    '## Estados',
    '',
    '| Columna | Frontmatter v2 |',
    '|---|---|',
    '| Intake | `issue_workflow: inbox` |',
    '| Backlog | `issue_workflow: backlog` o `blocked` |',
    '| Ready | `issue_workflow: ready` |',
    '| In progress | `issue_workflow: in_progress` |',
    '| Review / Verify | `issue_workflow: review` |',
    '| Done | `issue_workflow: done` |',
    '',
    '`wont_fix` no tiene columna propia: se deja como nota en la issue y se excluye del tablero.',
    '',
    '## Intake',
    '',
    ...boardTable(sortedIssues(byWorkflow.get('inbox') ?? [])),
    '',
    '## Backlog',
    '',
    ...boardTable(sortedIssues([...(byWorkflow.get('backlog') ?? []), ...(byWorkflow.get('blocked') ?? [])])),
    '',
    '## Ready',
    '',
    ...boardTable(sortedIssues(byWorkflow.get('ready') ?? [])),
    '',
    '## In progress',
    '',
    ...boardTable(sortedIssues(byWorkflow.get('in_progress') ?? [])),
    '',
    '## Review / Verify',
    '',
    ...boardTable(sortedIssues(byWorkflow.get('review') ?? [])),
    '',
    '## Done',
    '',
    '| ID | Titulo | Release | Resultado |',
    '|---|---|---|---|',
    ...sortedIssues(byWorkflow.get('done') ?? []).map((doc) => {
      const release = doc.frontmatter.release
      return `| ${linkTo(doc, 'backlog')} | ${titleOf(doc)} | ${release ?? 'null'} | ${resultFrom(doc)} |`
    }),
    '',
    '## Regla de mantenimiento',
    '',
    'No edites este tablero a mano salvo emergencia: ejecuta `npm run pb:index`. Si el tablero y las issues divergen, `npm run pb:check` falla.',
  ].join('\n')
  const file = join(brainRoot, 'backlog', 'BACKLOG.md')
  const { updated } = generatedDates(file, body, defaultBacklogCreated)
  const content = [
    '---',
    'schema_version: 2',
    'kind: backlog',
    'id: PB-BACKLOG',
    'title: Backlog operativo',
    'lifecycle: active',
    `created: ${defaultBacklogCreated}`,
    `updated: ${updated}`,
    'aliases:',
    '  - Backlog operativo',
    '  - Backlog',
    'tags:',
    '  - product-brain',
    '  - backlog',
    '  - workflow',
    'generated: true',
    '---',
    '',
    body,
  ].join('\n')

  return verifyOrWrite(file, content)
}

function writeSourceTouchpoints() {
  const rows = [
    ['src/pages/Work.jsx, src/pages/ProjectDetail.jsx, src/pages/EventDetail.jsx', 'frontend', 'work, projects, events', '[[../context/ui-direction-v3-20260504]], [[../decisions/ADR-0001-project-event-finance-model]]', 'lint, build, responsive smoke'],
    ['src/pages/Dashboard.jsx, src/hooks/useFinancialSummary.js', 'frontend/data', 'dashboard, finance', '[[../decisions/ADR-0006-gross-cache-per-hour]], [[../context/data-finance-model-20260504]]', 'lint, build, finance regression'],
    ['src/pages/Calendar*.jsx, src/components/*Calendar*', 'frontend', 'calendar, events, projects', '[[../knowledge/PB-ZK-20260504-rbc-height]], [[../context/ux-mobile-guardrails-20260504]]', 'desktop/mobile visual check'],
    ['src/hooks/**, supabase/migrations/**', 'data/security', 'supabase, finance, auth-onboarding', '[[../process/supabase-db-access]], [[../decisions/ADR-0004-profile-data-source-and-hooks]]', 'lint, build, test:db when relevant'],
    ['.opencode/**, .agents/skills/**, docs/agent-context-policy.md', 'brain', 'agents, product-brain', '[[../process/WORKFLOW]], [[../indexes/issues-open.index]]', 'verify:agents, verify:skills, context:check'],
    ['docs/project/**, scripts/brain/**', 'brain', 'product-brain, agents', '[[../process/frontmatter-schema]], [[../decisions/ADR-0010-frontmatter-schema]]', 'pb:guard, verify:brain, git diff --check'],
  ]

  return writeIndex(
    'source-touchpoints.md',
    'PB-SOURCE-TOUCHPOINTS',
    'Source Touchpoints',
    ['Source Touchpoints'],
    ['product-brain', 'index', 'source-map'],
    [
      'Mapa operativo para orientar agentes sin leer el Brain completo.',
      '',
      '| Globs | Area | Componentes | Contexto relevante | Checks |',
      '|---|---|---|---|---|',
      ...rows.map((row) => `| ${row.join(' | ')} |`),
    ],
  )
}

ensureDir(indexesRoot)

const docs = readAllDocs().filter((doc) => !doc.rel.startsWith('templates/'))
const issues = readDocsByKind('issue')
const decisions = readDocsByKind('decision')
const knowledge = docs.filter((doc) => doc.rel.startsWith('knowledge/') && doc.rel !== 'knowledge/README.md')
const releases = docs.filter((doc) => doc.rel.startsWith('releases/') && doc.rel !== 'releases/README.md')

let changed = 0

changed += Number(writeIndex(
  'issues.index.md',
  'PB-ISSUES-INDEX',
  'Issues Index',
  ['Issues Index'],
  ['product-brain', 'issues'],
  sortById(issues).map((doc) => genericLine(doc)),
))

changed += Number(writeIndex(
  'issues-open.index.md',
  'PB-ISSUES-OPEN',
  'Issues Open Index',
  ['Issues Open Index'],
  ['product-brain', 'issues', 'open'],
  sortedIssues(issues.filter((doc) => !['done', 'wont_fix'].includes(doc.frontmatter.issue_workflow))).map((doc) => issueLine(doc)),
))

changed += Number(writeIndex(
  'decisions.index.md',
  'PB-DECISIONS-INDEX',
  'Decisions Index',
  ['Decisions Index'],
  ['product-brain', 'decisions'],
  sortById(decisions).map((doc) => genericLine(doc)),
))

changed += Number(writeIndex(
  'knowledge.index.md',
  'PB-KNOWLEDGE-INDEX',
  'Knowledge Index',
  ['Knowledge Index'],
  ['product-brain', 'knowledge'],
  sortById(knowledge).map((doc) => genericLine(doc)),
))

changed += Number(writeIndex(
  'releases.index.md',
  'PB-RELEASES-INDEX',
  'Releases Index',
  ['Releases Index'],
  ['product-brain', 'releases'],
  sortById(releases).map((doc) => genericLine(doc)),
))

for (const [fileName, id, title, keys, values] of [
  ['by-status.md', 'PB-BY-STATUS', 'Issues por workflow', ['issue_workflow'], null],
  ['by-area.md', 'PB-BY-AREA', 'Issues por area', ['area'], AREAS],
  ['by-release.md', 'PB-BY-RELEASE', 'Issues por release', ['release'], null],
  ['by-level.md', 'PB-BY-LEVEL', 'Issues por nivel', ['work_level'], null],
  ['by-component.md', 'PB-BY-COMPONENT', 'Issues por componente', ['components'], COMPONENTS],
  ['by-theme.md', 'PB-BY-THEME', 'Issues por tema', ['theme'], [...THEMES, 'none']],
]) {
  const field = keys[0]
  const groups = groupBy(issues, (doc) => doc.frontmatter[field] ?? 'none')
  const orderedKeys = values ?? [...groups.keys()]
  const lines = []
  for (const key of orderedKeys) {
    const items = sortedIssues(groups.get(key) ?? [])
    lines.push(`## ${key}`, '')
    lines.push(...(items.length > 0 ? items.map((doc) => issueLine(doc)) : ['_Sin issues._']), '')
  }
  changed += Number(writeIndex(fileName, id, title, [title], ['product-brain', 'index'], lines))
}

const initiatives = issues.filter((doc) => doc.frontmatter.work_level === 'initiative')
const initiativeLines = []
for (const initiative of sortById(initiatives)) {
  const children = sortedIssues(issues.filter((doc) => doc.frontmatter.parent === initiative.frontmatter.id))
  initiativeLines.push(`## ${initiative.frontmatter.id} — ${titleOf(initiative)}`, '')
  initiativeLines.push(...(children.length > 0 ? children.map((doc) => issueLine(doc)) : ['_Sin children._']), '')
}
changed += Number(writeIndex(
  'initiative-children.index.md',
  'PB-INITIATIVE-CHILDREN',
  'Initiative Children Index',
  ['Initiative Children Index'],
  ['product-brain', 'issues', 'initiatives'],
  initiativeLines,
))

changed += Number(writeSourceTouchpoints())
changed += Number(writeBacklog(issues))

if (jsonOutput) {
  console.log(JSON.stringify({
    ok: stale.length === 0,
    check: checkMode,
    changed,
    stale,
  }, null, 2))
} else if (checkMode) {
  if (stale.length === 0) {
    console.log('[pb:index] OK: indices y backlog generados estan frescos')
  } else {
    for (const file of stale) console.error(`[pb:index] stale: ${file}`)
    console.error(`[pb:index] ${stale.length} archivo(s) generado(s) no estan frescos; ejecuta npm run pb:index`)
  }
} else {
  console.log(`[pb:index] Indices v2 actualizados (${changed} archivo(s) cambiados)`)
}

process.exitCode = checkMode && stale.length > 0 ? 1 : 0
