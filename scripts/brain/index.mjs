#!/usr/bin/env node
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, join, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const brainRoot = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(repoRoot, 'docs', 'project')
const indexesRoot = join(brainRoot, 'indexes')

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

function docTitle(content, fallback) {
  return content.match(/^#\s+(.+)$/m)?.[1]?.replace(/^.+?—\s*/, '') ?? fallback
}

function readDocs(folder) {
  const root = join(brainRoot, folder)
  if (!existsSync(root)) return []
  return listMarkdownFiles(root)
    .filter((file) => basename(file) !== 'README.md')
    .map((file) => {
      const rel = toPosix(relative(brainRoot, file))
      const content = readFileSync(file, 'utf8')
      const parsed = matter(content)
      const id = parsed.data.id ?? basename(file, '.md')
      return {
        id,
        rel,
        title: parsed.data.title ?? docTitle(content, id),
        status: parsed.data.status ?? 'Unknown',
        release: parsed.data.release ?? null,
        area: parsed.data.area ?? 'unknown',
        type: parsed.data.type ?? folder,
      }
    })
}

function frontmatter(id, aliases, tags) {
  const today = new Date().toISOString().slice(0, 10)
  return [
    '---',
    `id: ${id}`,
    'type: index',
    'status: Active',
    `created: ${today}`,
    `updated: ${today}`,
    'aliases:',
    ...aliases.map((alias) => `  - ${alias}`),
    'tags:',
    ...tags.map((tag) => `  - ${tag}`),
    '---',
    '',
  ].join('\n')
}

function link(doc, fromFolder = 'indexes') {
  const target = toPosix(relative(join(brainRoot, fromFolder), join(brainRoot, doc.rel))).replace(/\.md$/, '')
  return `[[${target}|${doc.id}]]`
}

function writeIndex(fileName, id, title, aliases, tags, lines) {
  const content = `${frontmatter(id, aliases, tags)}# ${title}\n\n${lines.join('\n')}\n`
  writeFileSync(join(indexesRoot, fileName), content)
}

if (!existsSync(indexesRoot)) mkdirSync(indexesRoot, { recursive: true })

const issues = readDocs('issues')
const decisions = readDocs('decisions')
const knowledge = readDocs('knowledge')
const releases = readDocs('releases')

writeIndex(
  'issues.index.md',
  'PB-ISSUES-INDEX',
  'Issues Index',
  ['Issues Index'],
  ['product-brain', 'issues'],
  issues.map((doc) => `- ${link(doc)} — ${doc.title}`),
)

writeIndex(
  'decisions.index.md',
  'PB-DECISIONS-INDEX',
  'Decisions Index',
  ['Decisions Index'],
  ['product-brain', 'decisions'],
  decisions.map((doc) => `- ${link(doc)} — ${doc.title}`),
)

writeIndex(
  'knowledge.index.md',
  'PB-KNOWLEDGE-INDEX',
  'Knowledge Index',
  ['Knowledge Index'],
  ['product-brain', 'knowledge'],
  knowledge.map((doc) => `- ${link(doc)} — ${doc.title}`),
)

writeIndex(
  'releases.index.md',
  'PB-RELEASES-INDEX',
  'Releases Index',
  ['Releases Index'],
  ['product-brain', 'releases'],
  releases.map((doc) => `- ${link(doc)} — ${doc.title}`),
)

function groupBy(items, getKey) {
  return items.reduce((groups, item) => {
    const key = getKey(item) ?? 'none'
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key).push(item)
    return groups
  }, new Map())
}

for (const [fileName, id, title, field] of [
  ['by-status.md', 'PB-BY-STATUS', 'Issues por estado', 'status'],
  ['by-release.md', 'PB-BY-RELEASE', 'Issues por release', 'release'],
  ['by-area.md', 'PB-BY-AREA', 'Issues por area', 'area'],
]) {
  const lines = []
  for (const [key, docs] of groupBy(issues, (doc) => doc[field])) {
    lines.push(`## ${key ?? 'none'}`, '')
    lines.push(...docs.map((doc) => `- ${link(doc)} — ${doc.title}`), '')
  }
  writeIndex(fileName, id, title, [title], ['product-brain', 'index'], lines)
}

console.log('[pb:index] Indices actualizados')
