#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const brainRoot = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(repoRoot, 'docs', 'project')

function toPosix(value) {
  return value.split(sep).join('/')
}

function listMarkdownFiles(dir) {
  const files = []
  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.DS_Store' || entry.name === '.obsidian') continue
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) walk(fullPath)
      else if (entry.name.endsWith('.md')) files.push(fullPath)
    }
  }
  walk(dir)
  return files.sort()
}

function readFile(path) {
  return existsSync(path) ? readFileSync(path, 'utf8') : ''
}

function parseMatter(path) {
  const raw = readFile(path)
  if (!raw) return null
  const parsed = matter(raw)
  return { data: parsed.data, body: parsed.content, raw }
}

function normalizeDate(value) {
  if (!value) return ''
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

function h1Title(body, fallback) {
  return body.match(/^#\s+(.+)$/m)?.[1]?.trim() ?? fallback
}

function sectionContent(content, heading) {
  const lines = content.split('\n')
  const start = lines.findIndex((l) => l.trim().toLowerCase() === `## ${heading.toLowerCase()}`)
  if (start === -1) return ''
  const end = lines.findIndex((l, i) => i > start && /^##\s+/.test(l))
  return lines.slice(start + 1, end === -1 ? lines.length : end).join('\n').trim()
}

function stripWikilinks(text) {
  return text.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, (_, _prefix, label) => label)
}

function tableRows(section) {
  return section
    .split('\n')
    .filter((l) => l.trim().startsWith('|') && !l.includes('---'))
    .slice(1)
    .map((l) => stripWikilinks(l).split('|').map((c) => c.trim()).filter(Boolean))
    .filter((cols) => cols.length >= 2)
}

function priorityOrder(p) {
  return { p0: 0, p1: 1, p2: 2, p3: 3 }[p] ?? 9
}

function statusOrder(s) {
  return { 'in-progress': 0, review: 1, inbox: 2, ready: 3, backlog: 4, blocked: 5 }[s] ?? 9
}

// ── Read CURRENT_RELEASE ────────────────────────────────────────────────────

const releasePath = join(brainRoot, 'releases', 'CURRENT_RELEASE.md')
const releaseDoc = parseMatter(releasePath)
const releaseActiva = releaseDoc
  ? stripWikilinks(sectionContent(releaseDoc.body, 'Release activa'))
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean)[0]
      ?.replace(/^no active release\.?/i, 'ninguna — PRs directas a `main`') ?? 'desconocida'
  : 'desconocida'
const ultimoCorte = releaseDoc ? stripWikilinks(sectionContent(releaseDoc.body, 'Ultimo corte')).trim() : ''

// ── Read CURRENT_PLAN ───────────────────────────────────────────────────────

const planPath = join(brainRoot, 'plans', 'CURRENT_PLAN.md')
const planDoc = parseMatter(planPath)
const focoActual = planDoc ? stripWikilinks(sectionContent(planDoc.body, 'Foco actual')).trim() : ''
const proximoCheckpoint = planDoc
  ? stripWikilinks(sectionContent(planDoc.body, 'Proximo checkpoint') || sectionContent(planDoc.body, 'Próximo checkpoint')).trim()
  : ''
const prioridades = planDoc
  ? sectionContent(planDoc.body, 'Prioridades')
      .split('\n')
      .filter((l) => /^\d+\./.test(l.trim()))
      .map((l) => stripWikilinks(l.trim()))
  : []

// ── Read BACKLOG sections ───────────────────────────────────────────────────

const backlogPath = join(brainRoot, 'backlog', 'BACKLOG.md')
const backlogDoc = parseMatter(backlogPath)

function boardSection(heading) {
  if (!backlogDoc) return []
  const raw = sectionContent(backlogDoc.body, heading)
  if (!raw || /^sin issues/i.test(raw.trim())) return []
  return tableRows(raw).map((cols) => ({
    id: stripWikilinks(cols[0]),
    title: stripWikilinks(cols[1] ?? ''),
    type: cols[2] ?? '',
    priority: cols[3] ?? '',
    note: stripWikilinks(cols[4] ?? ''),
  }))
}

const inboxItems = boardSection('Inbox')
const inProgressItems = boardSection('In progress')
const reviewItems = boardSection('Review')
const backlogItems = boardSection('Backlog')

// ── Read all open issues ────────────────────────────────────────────────────

const issuesDir = join(brainRoot, 'issues')
const allIssues = []

if (existsSync(issuesDir)) {
  for (const file of listMarkdownFiles(issuesDir)) {
    if (basename(file) === 'README.md') continue
    const doc = parseMatter(file)
    if (!doc) continue
    const { id, title, status, type, priority } = doc.data
    if (!id || status === 'done' || status === 'wontfix') continue
    allIssues.push({ id, title: title ?? basename(file, '.md'), status, type, priority })
  }
  allIssues.sort((a, b) => {
    const sd = statusOrder(a.status) - statusOrder(b.status)
    if (sd !== 0) return sd
    return priorityOrder(a.priority) - priorityOrder(b.priority)
  })
}

// ── Read ADRs (last 5 by created date) ─────────────────────────────────────

const decisionsDir = join(brainRoot, 'decisions')
const recentADRs = []

if (existsSync(decisionsDir)) {
  for (const file of listMarkdownFiles(decisionsDir)) {
    if (basename(file) === 'README.md') continue
    const doc = parseMatter(file)
    if (!doc) continue
    const { id, title, status, created, created_at } = doc.data
    if (!id) continue
    const date = normalizeDate(created ?? created_at)
    recentADRs.push({ id, title: title ?? h1Title(doc.body, basename(file, '.md')), status, date })
  }
  recentADRs.sort((a, b) => String(b.date ?? '').localeCompare(String(a.date ?? '')))
  recentADRs.splice(5)
}

// ── Read Knowledge ──────────────────────────────────────────────────────────

const knowledgeDir = join(brainRoot, 'knowledge')
const knowledgeItems = []

if (existsSync(knowledgeDir)) {
  for (const file of listMarkdownFiles(knowledgeDir)) {
    if (basename(file) === 'README.md') continue
    const doc = parseMatter(file)
    if (!doc) continue
    const { id, title } = doc.data
    if (!id) continue
    knowledgeItems.push({ id, title: title ?? h1Title(doc.body, basename(file, '.md')) })
  }
}

// ── Build DIGEST ────────────────────────────────────────────────────────────

const now = new Date()
const today = now.toISOString().slice(0, 10)
const generated = now.toISOString().replace('T', ' ').slice(0, 16) + ' UTC'

function boardTable(items) {
  if (items.length === 0) return '_Sin issues._\n'
  const rows = items.map((i) => `| ${i.id} | ${i.title} | ${i.type} | ${i.priority} |`)
  return ['| ID | Título | Tipo | P |', '|---|---|---|---|', ...rows].join('\n') + '\n'
}

function issuesTable(items) {
  if (items.length === 0) return '_Sin issues abiertas._\n'
  const rows = items.map((i) => `| ${i.id} | ${i.title} | ${i.status} | ${i.type} | ${i.priority} |`)
  return ['| ID | Título | Estado | Tipo | P |', '|---|---|---|---|---|', ...rows].join('\n') + '\n'
}

function adrTable(items) {
  if (items.length === 0) return '_Sin decisiones registradas._\n'
  const rows = items.map((i) => `| ${i.id} | ${i.title} | ${i.date} | ${i.status} |`)
  return ['| ID | Título | Fecha | Estado |', '|---|---|---|---|', ...rows].join('\n') + '\n'
}

function knowledgeTable(items) {
  if (items.length === 0) return '_Sin entradas de conocimiento._\n'
  const rows = items.map((i) => `| ${i.id} | ${i.title} |`)
  return ['| ID | Título |', '|---|---|', ...rows].join('\n') + '\n'
}

const digest = `---
id: PB-DIGEST
type: digest
status: Active
created: ${today}
updated: ${today}
aliases:
  - Digest
  - Brain Digest
tags:
  - product-brain
  - digest
---

# Product Brain Digest

*Generado: ${generated}*

---

## Estado operacional

- **Release activa:** ${releaseActiva}
- **Último corte:** ${ultimoCorte}
- **Foco:** ${focoActual}

## Prioridades del plan

${prioridades.map((p) => p).join('\n')}

## Tablero

### Inbox

${boardTable(inboxItems)}
### In progress

${boardTable(inProgressItems)}
### Review

${boardTable(reviewItems)}
### Backlog (p1)

${boardTable(backlogItems.filter((i) => i.priority === 'p1'))}
## Issues abiertas

${issuesTable(allIssues)}
## ADRs (últimas ${recentADRs.length})

${adrTable(recentADRs)}
## Knowledge

${knowledgeTable(knowledgeItems)}
## Próxima acción

${proximoCheckpoint}
`

const outputPath = join(brainRoot, 'DIGEST.md')
writeFileSync(outputPath, digest.trimEnd() + '\n')
console.log(`[pb:digest] DIGEST.md generado en ${toPosix(relative(repoRoot, outputPath))}`)
