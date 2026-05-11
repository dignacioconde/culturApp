#!/usr/bin/env node
import { existsSync, readFileSync } from 'node:fs'
import { join, relative } from 'node:path'
import matter from 'gray-matter'
import {
  brainRoot,
  docTitle,
  linkTo,
  normalizeDate,
  readAllDocs,
  sectionContent,
  stripWikilinks,
  today,
  writeIfChanged,
} from './lib.mjs'

const args = new Set(process.argv.slice(2))
const checkMode = args.has('--check')
const jsonOutput = args.has('--json')

function priorityOrder(value) {
  return { p0: 0, p1: 1, p2: 2, p3: 3 }[value] ?? 99
}

function workflowOrder(value) {
  return { in_progress: 0, review: 1, inbox: 2, ready: 3, backlog: 4, blocked: 5 }[value] ?? 99
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

function titleOf(doc) {
  return doc.frontmatter?.title ?? docTitle(doc.body, doc.basename)
}

function table(rows, headers) {
  if (rows.length === 0) return '_Sin entradas._\n'
  return [
    `| ${headers.join(' | ')} |`,
    `|${headers.map(() => '---').join('|')}|`,
    ...rows,
  ].join('\n') + '\n'
}

const docs = readAllDocs().filter((doc) => !doc.rel.startsWith('templates/'))
const issues = docs.filter((doc) => doc.frontmatter?.kind === 'issue')
const openIssues = sortedIssues(issues.filter((doc) => !['done', 'wont_fix'].includes(doc.frontmatter.issue_workflow)))
const decisions = docs
  .filter((doc) => doc.frontmatter?.kind === 'decision')
  .sort((a, b) => String(b.frontmatter.updated).localeCompare(String(a.frontmatter.updated)))
  .slice(0, 5)
const knowledge = docs.filter((doc) => doc.rel.startsWith('knowledge/') && doc.rel !== 'knowledge/README.md')
const releaseStatus = docs.find((doc) => doc.rel === 'releases/CURRENT_RELEASE.md')
const currentRelease = docs.find((doc) => doc.frontmatter?.kind === 'release' && doc.frontmatter.release_current)
const currentPlan = docs.find((doc) => doc.rel === 'plans/CURRENT_PLAN.md')
const backlog = docs.find((doc) => doc.rel === 'backlog/BACKLOG.md')
const outputPath = join(brainRoot, 'DIGEST.md')

const releaseActiva = currentRelease
  ? `${currentRelease.frontmatter.id} — ${titleOf(currentRelease)}`
  : stripWikilinks(sectionContent(releaseStatus?.content ?? '', 'Release activa')) || 'ninguna'
const cortesRecientes = stripWikilinks(sectionContent(releaseStatus?.content ?? '', ['Últimos cortes', 'Ultimo corte', 'Último corte'])).trim()
const cortesLabel = cortesRecientes.split('\n').filter((line) => line.trim()).length > 1
  ? 'Últimos cortes'
  : 'Último corte'
const focoActual = stripWikilinks(sectionContent(currentPlan?.content ?? '', 'Foco actual')).trim()
const proximoCheckpoint = stripWikilinks(sectionContent(currentPlan?.content ?? '', ['Próximo checkpoint', 'Proximo checkpoint'])).trim()
const prioridades = sectionContent(currentPlan?.content ?? '', 'Prioridades')
  .split('\n')
  .filter((line) => /^\d+\./.test(line.trim()))
  .map((line) => stripWikilinks(line.trim()))

function boardIds(heading) {
  return [...new Set(sectionContent(backlog?.content ?? '', heading).match(/CACH-(?:B)?\d{4}/g) ?? [])]
}

function issueById(id) {
  return issues.find((doc) => doc.frontmatter.id === id)
}

function boardTable(heading) {
  const items = boardIds(heading).map(issueById).filter(Boolean)
  const rows = items.map((doc) => {
    const data = doc.frontmatter
    return `| ${data.id} | ${titleOf(doc)} | ${data.work_type} | ${data.work_level} | ${data.priority} |`
  })
  return table(rows, ['ID', 'Título', 'Tipo', 'Nivel', 'P'])
}

const body = `# Product Brain Digest

Resumen determinista generado desde Product Brain v2.

---

## Estado operacional

- **Release activa:** ${releaseActiva}
- **${cortesLabel}:** ${cortesRecientes || 'Sin corte documentado.'}
- **Foco:** ${focoActual || 'Sin foco documentado.'}

## Prioridades del plan

${prioridades.length > 0 ? prioridades.join('\n') : '_Sin prioridades documentadas._'}

## Tablero

### Intake

${boardTable('Intake')}
### Ready

${boardTable('Ready')}
### In progress

${boardTable('In progress')}
### Review / Verify

${boardTable('Review / Verify')}
### Backlog (p1)

${table(
  openIssues
    .filter((doc) => doc.frontmatter.issue_workflow === 'backlog' && doc.frontmatter.priority === 'p1')
    .map((doc) => `| ${doc.frontmatter.id} | ${titleOf(doc)} | ${doc.frontmatter.work_type} | ${doc.frontmatter.work_level} | ${doc.frontmatter.priority} |`),
  ['ID', 'Título', 'Tipo', 'Nivel', 'P'],
)}
## Issues abiertas

${table(
  openIssues.map((doc) => {
    const data = doc.frontmatter
    return `| ${data.id} | ${titleOf(doc)} | ${data.issue_workflow} | ${data.work_type} | ${data.work_level} | ${data.priority} |`
  }),
  ['ID', 'Título', 'Workflow', 'Tipo', 'Nivel', 'P'],
)}
## ADRs recientes

${table(
  decisions.map((doc) => `| ${doc.frontmatter.id} | ${titleOf(doc)} | ${doc.frontmatter.updated} | ${doc.frontmatter.decision_status} |`),
  ['ID', 'Título', 'Updated', 'Estado'],
)}
## Knowledge

${table(
  knowledge.map((doc) => `| ${doc.frontmatter.id} | ${titleOf(doc)} |`),
  ['ID', 'Título'],
)}
## Próxima acción

${proximoCheckpoint || 'Sin checkpoint documentado.'}`

function digestUpdatedDate() {
  if (!existsSync(outputPath)) return today()
  const parsed = matter(readFileSync(outputPath, 'utf8'))
  const bodyChanged = parsed.content.trim() !== body.trim()
  if (bodyChanged) return today()
  return normalizeDate(parsed.data?.updated) ?? normalizeDate(parsed.data?.created) ?? today()
}

const digest = `---
schema_version: 2
kind: digest
id: PB-DIGEST
title: Product Brain Digest
lifecycle: active
created: 2026-05-05
updated: ${digestUpdatedDate()}
aliases:
  - Digest
  - Brain Digest
tags:
  - product-brain
  - digest
generated: true
---

${body}
`

const next = `${digest.trimEnd()}\n`
const stale = !existsSync(outputPath) || readFileSync(outputPath, 'utf8') !== next
const changed = checkMode ? stale : writeIfChanged(outputPath, digest)

if (jsonOutput) {
  console.log(JSON.stringify({
    ok: !stale,
    check: checkMode,
    changed,
    stale: stale ? [relative(brainRoot, outputPath).split('/').join('/')] : [],
  }, null, 2))
} else if (checkMode) {
  if (!stale) {
    console.log('[pb:digest] OK: DIGEST.md esta fresco')
  } else {
    console.error('[pb:digest] stale: DIGEST.md')
    console.error('[pb:digest] DIGEST.md no esta fresco; ejecuta npm run pb:digest')
  }
} else {
  console.log(`[pb:digest] DIGEST.md ${changed ? 'generado' : 'sin cambios'} en docs/project/DIGEST.md`)
}

process.exitCode = checkMode && stale ? 1 : 0
