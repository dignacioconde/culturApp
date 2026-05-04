#!/usr/bin/env node
import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { dirname, join, normalize, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'

const repoRoot = resolve(fileURLToPath(new URL('..', import.meta.url)))
const brainRoot = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(repoRoot, 'docs', 'project')

const indexChecks = [
  ['indexes/issues.index.md', 'issues'],
  ['indexes/decisions.index.md', 'decisions'],
  ['indexes/knowledge.index.md', 'knowledge'],
  ['indexes/releases.index.md', 'releases'],
]

const errors = []
const warnings = []

function toPosix(value) {
  return value.split(sep).join('/')
}

function listMarkdownFiles(dir) {
  const files = []

  function walk(current) {
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.md')) {
        files.push(fullPath)
      }
    }
  }

  walk(dir)
  return files.sort()
}

function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---/)
  if (!match) {
    return null
  }

  const result = { aliases: [] }
  const lines = match[1].split('\n')
  let activeList = null

  for (const line of lines) {
    const listItem = line.match(/^\s+-\s*(.+?)\s*$/)
    if (activeList && listItem) {
      result[activeList].push(listItem[1])
      continue
    }

    const keyValue = line.match(/^([a-zA-Z0-9_-]+):\s*(.*?)\s*$/)
    if (!keyValue) {
      activeList = null
      continue
    }

    const [, key, value] = keyValue
    if (!value) {
      if (key === 'aliases') {
        activeList = 'aliases'
      } else {
        activeList = null
      }
      continue
    }

    result[key] = value
    activeList = null
  }

  return result
}

function stripCodeFences(content) {
  return content.replace(/```[\s\S]*?```/g, '')
}

function normalizeTarget(fromRel, target) {
  const withoutHash = target.split('#')[0].trim()
  if (!withoutHash || withoutHash.includes('://')) {
    return null
  }

  if (
    withoutHash.includes('...') ||
    withoutHash.includes('XXXX') ||
    withoutHash.includes('YYYY')
  ) {
    return null
  }

  if (withoutHash.includes('/') || withoutHash.startsWith('.')) {
    const relDir = dirname(fromRel)
    return toPosix(normalize(join(relDir, withoutHash))).replace(/\.md$/, '')
  }

  return withoutHash
}

function addLookup(map, key, rel) {
  if (!key) return
  if (!map.has(key)) {
    map.set(key, [])
  }
  map.get(key).push(rel)
}

function wikilinkTargets(content) {
  const links = []
  const safeContent = stripCodeFences(content)

  for (const match of safeContent.matchAll(/\[\[([^\]]+)\]\]/g)) {
    const target = match[1].split('|')[0].trim()
    links.push(target)
  }

  return links
}

function bulletTargets(content, indexRel) {
  const targets = new Set()

  for (const line of content.split('\n')) {
    const bullet = line.match(/^\s*-\s+\[\[([^\]]+)\]\]/)
    if (!bullet) continue

    const normalized = normalizeTarget(indexRel, bullet[1].split('|')[0])
    if (normalized) {
      targets.add(normalized)
    }
  }

  return targets
}

if (!existsSync(brainRoot)) {
  errors.push(`No existe Product Brain: ${brainRoot}`)
} else {
  const files = listMarkdownFiles(brainRoot)
  const docs = new Map()
  const byBasename = new Map()
  const byId = new Map()
  const byAlias = new Map()

  for (const file of files) {
    const rel = toPosix(relative(brainRoot, file))
    const key = rel.replace(/\.md$/, '')
    const basename = key.split('/').at(-1)
    const content = readFileSync(file, 'utf8')
    const frontmatter = parseFrontmatter(content)

    docs.set(key, { rel, key, basename, content, frontmatter })
    addLookup(byBasename, basename, key)

    if (!rel.startsWith('templates/') && !frontmatter) {
      errors.push(`${rel}: falta frontmatter`)
    }

    if (frontmatter?.id) {
      addLookup(byId, frontmatter.id, key)
    }

    for (const alias of frontmatter?.aliases ?? []) {
      addLookup(byAlias, alias, key)
    }

    if (rel.startsWith('issues/') && rel !== 'issues/README.md') {
      if (frontmatter?.id !== basename) {
        errors.push(`${rel}: id '${frontmatter?.id ?? '(sin id)'}' no coincide con filename '${basename}'`)
      }

      const h1 = content.match(/^#\s+(.+)$/m)?.[1]
      if (!h1?.startsWith(`${basename} `) && h1 !== basename) {
        errors.push(`${rel}: H1 debe empezar por '${basename}'`)
      }
    }
  }

  for (const [id, locations] of byId.entries()) {
    if (locations.length > 1) {
      errors.push(`id duplicado '${id}': ${locations.join(', ')}`)
    }
  }

  for (const [alias, locations] of byAlias.entries()) {
    if (locations.length > 1) {
      warnings.push(`alias duplicado '${alias}': ${locations.join(', ')}`)
    }
  }

  for (const doc of docs.values()) {
    for (const rawTarget of wikilinkTargets(doc.content)) {
      const target = normalizeTarget(doc.rel, rawTarget)
      if (!target) continue

      const matches = target.includes('/') || target.startsWith('.')
        ? docs.has(target) ? [target] : []
        : [
            ...(byBasename.get(target) ?? []),
            ...(byId.get(target) ?? []),
            ...(byAlias.get(target) ?? []),
          ]

      if (matches.length === 0) {
        errors.push(`${doc.rel}: wikilink roto -> ${rawTarget}`)
      }
    }
  }

  for (const [indexRel, folder] of indexChecks) {
    const indexKey = indexRel.replace(/\.md$/, '')
    const indexDoc = docs.get(indexKey)
    if (!indexDoc) {
      errors.push(`${indexRel}: índice obligatorio no encontrado`)
      continue
    }

    const expected = new Set(
      [...docs.keys()].filter((key) => key.startsWith(`${folder}/`) && key !== `${folder}/README`),
    )
    const actual = bulletTargets(indexDoc.content, indexRel)

    for (const target of expected) {
      if (!actual.has(target)) {
        errors.push(`${indexRel}: falta entrada para ${target}`)
      }
    }

    for (const target of actual) {
      if (!expected.has(target)) {
        errors.push(`${indexRel}: entrada sobrante o rota ${target}`)
      }
    }
  }
}

for (const warning of warnings) {
  console.warn(`[pb:check] warning: ${warning}`)
}

if (errors.length > 0) {
  for (const error of errors) {
    console.error(`[pb:check] error: ${error}`)
  }
  console.error(`[pb:check] ${errors.length} error(es), ${warnings.length} warning(s)`)
  process.exitCode = 1
} else {
  console.log(`[pb:check] OK: Product Brain consistente (${warnings.length} warning(s))`)
}
