import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs'
import { basename, dirname, join, normalize, relative, resolve, sep } from 'node:path'
import { fileURLToPath } from 'node:url'
import matter from 'gray-matter'

export const repoRoot = resolve(fileURLToPath(new URL('../..', import.meta.url)))
export const brainRoot = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(repoRoot, 'docs', 'project')
export const indexesRoot = join(brainRoot, 'indexes')

export const ISSUE_WORKFLOWS = ['inbox', 'backlog', 'ready', 'in_progress', 'review', 'blocked', 'done', 'wont_fix']
export const WORK_TYPES = ['feature', 'bug', 'chore', 'spike', 'doc']
export const WORK_LEVELS = ['initiative', 'slice', 'task']
export const PRIORITIES = ['p0', 'p1', 'p2', 'p3']
export const SIZES = ['xs', 's', 'm']
export const AREAS = ['frontend', 'data', 'backend', 'infra', 'docs', 'brain', 'security']
export const COMPONENTS = [
  'work',
  'projects',
  'events',
  'calendar',
  'dashboard',
  'finance',
  'data-portability',
  'auth-onboarding',
  'settings-profile',
  'admin-beta',
  'product-brain',
  'agents',
  'design-system',
  'infra-deploy',
  'email',
  'supabase',
]
export const THEMES = [
  'beta-trust',
  'core-work-ux',
  'finance-operations',
  'portability-onboarding',
  'pro-growth',
  'internal-agent-ops',
]

export function toPosix(value) {
  return value.split(sep).join('/')
}

export function ensureDir(path) {
  mkdirSync(path, { recursive: true })
}

export function listMarkdownFiles(dir = brainRoot) {
  const files = []

  function walk(current) {
    if (!existsSync(current)) return
    for (const entry of readdirSync(current, { withFileTypes: true })) {
      if (entry.name === '.DS_Store' || entry.name === '.obsidian' || entry.name === 'node_modules') continue
      const fullPath = join(current, entry.name)
      if (entry.isDirectory()) walk(fullPath)
      else if (entry.name.endsWith('.md')) files.push(fullPath)
    }
  }

  walk(dir)
  return files.sort()
}

export function readDoc(file) {
  const rel = toPosix(relative(brainRoot, file))
  const key = rel.replace(/\.md$/, '')
  const raw = readFileSync(file, 'utf8')
  const parsed = matter(raw)
  const frontmatter = parsed.data && Object.keys(parsed.data).length > 0 ? parsed.data : null

  return {
    file,
    rel,
    key,
    basename: basename(key),
    raw,
    content: raw,
    body: parsed.content,
    frontmatter,
  }
}

export function writeDoc(doc, data, body = doc.body) {
  const serialized = matter.stringify(body.trimStart(), data, {
    lineWidth: -1,
  })
  writeFileSync(doc.file, `${serialized.trimEnd()}\n`)
}

export function normalizeDate(value) {
  if (!value) return null
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return String(value).slice(0, 10)
}

export function today() {
  return new Date().toISOString().slice(0, 10)
}

export function stripCodeFences(content) {
  return content
    .replace(/```[\s\S]*?```/g, '')
    .replace(/~~~[\s\S]*?~~~/g, '')
}

export function stripWikilinks(text) {
  return text.replace(/\[\[([^\]|]+\|)?([^\]]+)\]\]/g, (_, _prefix, label) => label)
}

export function normalizeTarget(fromRel, target) {
  const withoutHash = target.split('#')[0].trim()
  if (!withoutHash || withoutHash.includes('://')) return null
  if (withoutHash.includes('...') || withoutHash.includes('XXXX') || withoutHash.includes('YYYY')) return null

  if (withoutHash.includes('/') || withoutHash.startsWith('.')) {
    const relDir = dirname(fromRel)
    return toPosix(normalize(join(relDir, withoutHash))).replace(/\.md$/, '')
  }

  return withoutHash
}

export function wikilinkTargets(content) {
  const links = []
  for (const match of stripCodeFences(content).matchAll(/\[\[([^\]]+)\]\]/g)) {
    links.push(match[1].split('|')[0].trim())
  }
  return links
}

export function addLookup(map, key, rel) {
  if (!key) return
  const normalizedKey = String(key).toLowerCase()
  if (!map.has(normalizedKey)) map.set(normalizedKey, new Set())
  map.get(normalizedKey).add(rel)
}

export function sectionContent(content, headings) {
  const wanted = Array.isArray(headings) ? headings : [headings]
  const lower = new Set(wanted.map((heading) => heading.toLowerCase()))
  const lines = content.split('\n')
  const start = lines.findIndex((line) => {
    const match = line.trim().match(/^##\s+(.+)$/)
    return match && lower.has(match[1].trim().toLowerCase())
  })
  if (start === -1) return ''
  const end = lines.findIndex((line, index) => index > start && /^##\s+/.test(line))
  return lines.slice(start + 1, end === -1 ? lines.length : end).join('\n').trim()
}

export function hasSection(content, headings) {
  return sectionContent(content, headings).trim().length > 0
}

export function docTitle(body, fallback) {
  const h1 = body.match(/^#\s+(.+)$/m)?.[1]?.trim()
  if (!h1) return fallback
  return h1.replace(/^CACH-(?:B)?\d{4}\s+[—-]\s+/, '').replace(/^.+?—\s*/, '').trim() || fallback
}

export function issueIdsIn(content) {
  return new Set([...content.matchAll(/CACH-(?:B)?\d{4}/g)].map((match) => match[0]))
}

export function bulletTargets(content, indexRel) {
  const targets = new Set()
  for (const line of content.split('\n')) {
    const bullet = line.match(/^\s*-\s+\[\[([^\]]+)\]\]/)
    if (!bullet) continue

    const normalized = normalizeTarget(indexRel, bullet[1].split('|')[0])
    if (normalized) targets.add(normalized)
  }
  return targets
}

export function linkTo(doc, fromFolder = 'indexes') {
  const target = toPosix(relative(join(brainRoot, fromFolder), join(brainRoot, doc.rel))).replace(/\.md$/, '')
  return `[[${target}|${doc.frontmatter?.id ?? doc.basename}]]`
}

export function tableRows(section) {
  return section
    .split('\n')
    .filter((line) => line.trim().startsWith('|') && !line.includes('---'))
    .slice(1)
    .map((line) => stripWikilinks(line).split('|').map((cell) => cell.trim()).filter(Boolean))
    .filter((cols) => cols.length >= 2)
}

export function readAllDocs() {
  return listMarkdownFiles(brainRoot).map(readDoc)
}

export function writeIfChanged(path, content) {
  const next = `${content.trimEnd()}\n`
  if (existsSync(path) && readFileSync(path, 'utf8') === next) return false
  ensureDir(dirname(path))
  writeFileSync(path, next)
  return true
}

export function sortById(items) {
  return [...items].sort((a, b) => String(a.frontmatter?.id ?? a.basename).localeCompare(String(b.frontmatter?.id ?? b.basename)))
}
