#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { basename, dirname, join, normalize, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'
import { schemaForPath, IssueFrontmatter } from './schema.mjs'

const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)))
const brainRoot = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(repoRoot, 'docs', 'project')

const indexChecks = [
  ['indexes/issues.index.md', 'issues'],
  ['indexes/decisions.index.md', 'decisions'],
  ['indexes/knowledge.index.md', 'knowledge'],
  ['indexes/releases.index.md', 'releases'],
]

const boardColumns = new Map([
  ['inbox', 'Inbox'],
  ['backlog', 'Backlog'],
  ['ready', 'Backlog'],
  ['blocked', 'Backlog'],
  ['in-progress', 'In progress'],
  ['review', 'Review'],
  ['done', 'Done'],
])

const forbiddenReleaseValues = new Set([
  'Unassigned',
  'Beta',
  'Internal',
  'Pro',
  'Growth',
  'Post-MVP',
  '0.1-cycle',
])

const errors = []
const warnings = []

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

function stripCodeFences(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
}

function normalizeTarget(fromRel, target) {
  const withoutHash = target.split('#')[0].trim()
  if (!withoutHash || withoutHash.includes('://')) return null
  if (withoutHash.includes('...') || withoutHash.includes('XXXX') || withoutHash.includes('YYYY')) return null

  if (withoutHash.includes('/') || withoutHash.startsWith('.')) {
    const relDir = dirname(fromRel)
    return toPosix(normalize(join(relDir, withoutHash))).replace(/\.md$/, '')
  }

  return withoutHash
}

function addLookup(map, key, rel) {
  if (!key) return
  const normalizedKey = key.toLowerCase()
  if (!map.has(normalizedKey)) map.set(normalizedKey, new Set())
  map.get(normalizedKey).add(rel)
}

function wikilinkTargets(content) {
  const links = []
  for (const match of stripCodeFences(content).matchAll(/\[\[([^\]]+)\]\]/g)) {
    links.push(match[1].split('|')[0].trim())
  }
  return links
}

function sectionContent(content, heading) {
  const lines = content.split('\n')
  const start = lines.findIndex((line) => line.trim().toLowerCase() === `## ${heading.toLowerCase()}`)
  if (start === -1) return ''
  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  return lines.slice(start + 1, end === -1 ? lines.length : end).join('\n')
}

function extractIssueIds(content) {
  return new Set([...content.matchAll(/CACH-(?:B)?\d{4}/g)].map((match) => match[0]))
}

function bulletTargets(content, indexRel) {
  const targets = new Set()
  for (const line of content.split('\n')) {
    const bullet = line.match(/^\s*-\s+\[\[([^\]]+)\]\]/)
    if (!bullet) continue

    const normalized = normalizeTarget(indexRel, bullet[1].split('|')[0])
    if (normalized) targets.add(normalized)
  }
  return targets
}

function formatZodIssues(result, rel) {
  for (const issue of result.error.issues) {
    errors.push(`${rel}: frontmatter invalido en ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
}

function parseDoc(file) {
  const rel = toPosix(relative(brainRoot, file))
  const key = rel.replace(/\.md$/, '')
  const content = readFileSync(file, 'utf8')
  const parsed = matter(content)
  const frontmatter = parsed.data && Object.keys(parsed.data).length > 0 ? parsed.data : null
  return { file, rel, key, basename: basename(key), content, body: parsed.content, frontmatter }
}

if (!existsSync(brainRoot)) {
  errors.push(`No existe Product Brain: ${brainRoot}`)
} else {
  const files = listMarkdownFiles(brainRoot)
  const docs = new Map()
  const issues = new Map()
  const releases = new Map()
  const byBasename = new Map()
  const byId = new Map()
  const byAlias = new Map()

  for (const file of files) {
    const doc = parseDoc(file)
    docs.set(doc.key, doc)
    addLookup(byBasename, doc.basename, doc.key)

    if (!doc.rel.startsWith('templates/') && !doc.frontmatter) {
      errors.push(`${doc.rel}: falta frontmatter`)
      continue
    }

    if (doc.frontmatter?.id) addLookup(byId, doc.frontmatter.id, doc.key)
    for (const alias of doc.frontmatter?.aliases ?? []) addLookup(byAlias, alias, doc.key)

    const schema = schemaForPath(doc.rel)
    if (schema) {
      const validation = schema.safeParse(doc.frontmatter ?? {})
      if (!validation.success) formatZodIssues(validation, doc.rel)
    }

    if (doc.rel.startsWith('issues/') && doc.rel !== 'issues/README.md') {
      const issueValidation = IssueFrontmatter.safeParse(doc.frontmatter ?? {})
      if (issueValidation.success) {
        issues.set(issueValidation.data.id, { ...doc, data: issueValidation.data })
      }

      if (doc.frontmatter?.id !== doc.basename) {
        errors.push(`${doc.rel}: id '${doc.frontmatter?.id ?? '(sin id)'}' no coincide con filename '${doc.basename}'`)
      }

      const h1 = doc.content.match(/^#\s+(.+)$/m)?.[1]
      if (!h1?.startsWith(`${doc.basename} `) && h1 !== doc.basename) {
        errors.push(`${doc.rel}: H1 debe empezar por '${doc.basename}'`)
      }
    }

    if (doc.rel.startsWith('releases/') && doc.rel !== 'releases/README.md' && doc.rel !== 'releases/RELEASE_TEMPLATE.md') {
      releases.set(doc.basename, doc)
    }
  }

  for (const [id, locations] of byId.entries()) {
    if (locations.size > 1) errors.push(`id duplicado '${id}': ${[...locations].join(', ')}`)
  }

  for (const [alias, locations] of byAlias.entries()) {
    if (locations.size > 1) warnings.push(`alias duplicado '${alias}': ${[...locations].join(', ')}`)
  }

  for (const doc of docs.values()) {
    for (const rawTarget of wikilinkTargets(doc.content)) {
      const target = normalizeTarget(doc.rel, rawTarget)
      if (!target) continue

      let matches = []
      if (target.includes('/') || target.startsWith('.')) {
        matches = docs.has(target) ? [target] : []
      } else {
        const normalizedTarget = target.toLowerCase()
        matches = [
          ...(byBasename.get(normalizedTarget) ?? []),
          ...(byId.get(normalizedTarget) ?? []),
          ...(byAlias.get(normalizedTarget) ?? []),
        ]
      }

      const uniqueMatches = [...new Set(matches)]
      if (uniqueMatches.length === 0) {
        errors.push(`${doc.rel}: wikilink roto -> ${rawTarget}`)
      } else if (uniqueMatches.length > 1) {
        errors.push(`${doc.rel}: wikilink ambiguo -> ${rawTarget} (${uniqueMatches.join(', ')})`)
      }
    }
  }

  const releaseScopes = new Map()
  for (const [releaseId, releaseDoc] of releases.entries()) {
    releaseScopes.set(releaseId, extractIssueIds(sectionContent(releaseDoc.content, 'Scope')))
  }

  for (const issue of issues.values()) {
    const { id, release, estimate, cycle } = issue.data
    if (typeof release === 'string' && forbiddenReleaseValues.has(release)) {
      errors.push(`${issue.rel}: release '${release}' es string libre prohibido; usar null o un release existente`)
    }

    if (release !== null) {
      if (!releases.has(release)) {
        errors.push(`${issue.rel}: release '${release}' no existe en docs/project/releases/`)
      } else if (!releaseScopes.get(release)?.has(id)) {
        errors.push(`${issue.rel}: release '${release}' no lista ${id} en ## Scope`)
      }
    }

    if (estimate === 'l' && cycle.startsWith('beta-')) {
      errors.push(`${issue.rel}: estimate l no esta permitido en cycle ${cycle}; partir antes de meter en beta`)
    }
  }

  for (const [releaseId, scopeIds] of releaseScopes.entries()) {
    for (const issueId of scopeIds) {
      const issue = issues.get(issueId)
      if (!issue) {
        errors.push(`releases/${releaseId}.md: ## Scope referencia issue inexistente ${issueId}`)
      } else if (issue.data.release !== releaseId) {
        errors.push(`releases/${releaseId}.md: ${issueId} esta en ## Scope pero su frontmatter release es ${issue.data.release ?? 'null'}`)
      }
    }
  }

  const backlog = docs.get('backlog/BACKLOG')
  if (!backlog) {
    errors.push('backlog/BACKLOG.md: tablero obligatorio no encontrado')
  } else {
    const columnIds = new Map()
    for (const column of new Set(boardColumns.values())) {
      columnIds.set(column, extractIssueIds(sectionContent(backlog.content, column)))
    }

    for (const issue of issues.values()) {
      if (issue.data.status === 'wontfix') continue
      const expectedColumn = boardColumns.get(issue.data.status)
      if (!expectedColumn) continue
      if (!columnIds.get(expectedColumn)?.has(issue.data.id)) {
        errors.push(`backlog/BACKLOG.md: falta ${issue.data.id} en columna ${expectedColumn}`)
      }
    }
  }

  for (const [indexRel, folder] of indexChecks) {
    const indexKey = indexRel.replace(/\.md$/, '')
    const indexDoc = docs.get(indexKey)
    if (!indexDoc) {
      errors.push(`${indexRel}: indice obligatorio no encontrado`)
      continue
    }

    const expected = new Set(
      [...docs.keys()].filter((key) => key.startsWith(`${folder}/`) && key !== `${folder}/README`),
    )
    const actual = bulletTargets(indexDoc.content, indexRel)

    for (const target of expected) {
      if (!actual.has(target)) errors.push(`${indexRel}: falta entrada para ${target}`)
    }

    for (const target of actual) {
      if (!expected.has(target)) errors.push(`${indexRel}: entrada sobrante o rota ${target}`)
    }
  }
}

for (const warning of warnings) console.warn(`[pb:check] warning: ${warning}`)

if (errors.length > 0) {
  for (const error of errors) console.error(`[pb:check] error: ${error}`)
  console.error(`[pb:check] ${errors.length} error(es), ${warnings.length} warning(s)`)
  process.exitCode = 1
} else {
  console.log('Area                 OK')
  console.log('frontmatter          OK')
  console.log('wikilinks            OK')
  console.log('issue-release        OK')
  console.log('backlog-status       OK')
  console.log('indexes              OK')
  console.log(`[pb:check] OK: Product Brain consistente (${warnings.length} warning(s))`)
}
