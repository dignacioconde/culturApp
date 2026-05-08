#!/usr/bin/env node
import { writeFileSync } from 'node:fs'
import { basename } from 'node:path'
import {
  AREAS,
  COMPONENTS,
  THEMES,
  docTitle,
  normalizeDate,
  readAllDocs,
  sectionContent,
  today,
  writeDoc,
} from './lib.mjs'

const args = process.argv.slice(2)
const shouldWrite = args.includes('--write')
const reclassify = args.includes('--reclassify')
const manifestArgIndex = args.indexOf('--manifest')
const manifestPath = manifestArgIndex >= 0 ? args[manifestArgIndex + 1] : null
const migrationDate = today()

const initiativeIds = new Set([
  'CACH-B0001',
  'CACH-B0002',
  'CACH-B0004',
  'CACH-B0007',
  'CACH-B0008',
  'CACH-B0009',
  'CACH-B0010',
  'CACH-B0011',
  'CACH-B0012',
  'CACH-B0013',
])

const explicitParents = new Map([
  ['CACH-0042', 'CACH-B0002'],
  ['CACH-0046', 'CACH-B0010'],
  ['CACH-0047', 'CACH-B0010'],
  ['CACH-0048', 'CACH-B0010'],
])

function mapLifecycle(status, kind, issueWorkflow) {
  if (kind === 'issue' && ['done', 'wont_fix'].includes(issueWorkflow)) return 'historical'
  const normalized = String(status ?? '').toLowerCase()
  if (['draft', 'proposed'].includes(normalized)) return 'draft'
  if (['deprecated', 'superseded'].includes(normalized)) return 'deprecated'
  if (['archived'].includes(normalized)) return 'archived'
  if (['released', 'done', 'historical'].includes(normalized)) return 'historical'
  return 'active'
}

function mapKind(data, rel) {
  if (rel === 'releases/RELEASE_TEMPLATE.md') return 'template'
  if (rel === 'DIGEST.md') return 'digest'
  if (rel === 'releases/CURRENT_RELEASE.md') return 'release_status'
  if (data.kind) return data.kind
  if (rel.startsWith('issues/') && rel !== 'issues/README.md') return 'issue'
  if (rel.startsWith('decisions/') && rel !== 'decisions/README.md') return 'decision'
  if (rel.startsWith('releases/') && rel !== 'releases/README.md') return 'release'
  if (rel.startsWith('inbox/') && rel !== 'inbox/README.md') return 'inbox'
  if (rel.startsWith('knowledge/') && rel !== 'knowledge/README.md') return 'knowledge'
  if (rel.startsWith('context/') && rel !== 'context/README.md') return 'context'
  if (rel.startsWith('backlog/')) return 'backlog'
  if (rel.startsWith('plans/')) return 'plan'
  if (rel.startsWith('process/')) return 'process'
  if (rel.startsWith('indexes/')) return 'index'
  if (rel.startsWith('prompts/')) return 'prompt'
  if (rel.startsWith('explorations/')) return 'exploration'
  if (data.type === 'decision') return 'decision'
  return data.type ?? 'note'
}

function mapWorkflow(status) {
  const normalized = String(status ?? 'backlog').toLowerCase()
  if (normalized === 'in-progress') return 'in_progress'
  if (normalized === 'wontfix') return 'wont_fix'
  return normalized
}

function mapArea(area, title, tags = []) {
  const usefulTags = tags.filter((tag) => !['product-brain', 'issue'].includes(tag))
  const haystack = `${area ?? ''} ${title ?? ''} ${usefulTags.join(' ')}`.toLowerCase()
  if (area === 'db') return 'data'
  if (AREAS.includes(area)) return area
  if (haystack.includes('security') || haystack.includes('rls') || haystack.includes('privacy')) return 'security'
  if (haystack.includes('supabase') || haystack.includes('finance') || haystack.includes('financ')) return 'data'
  if (haystack.includes('docs') || haystack.includes('document')) return 'docs'
  if (haystack.includes('agent') || haystack.includes('brain') || haystack.includes('opencode')) return 'brain'
  return 'frontend'
}

function inferComponents(area, title, tags = []) {
  const usefulTags = tags.filter((tag) => !['product-brain', 'issue'].includes(tag))
  const haystack = `${area ?? ''} ${title ?? ''} ${usefulTags.join(' ')}`.toLowerCase()
  const components = new Set()
  const add = (component) => {
    if (COMPONENTS.includes(component)) components.add(component)
  }

  if (haystack.includes('trabajo') || haystack.includes('work')) add('work')
  if (haystack.includes('proyecto') || haystack.includes('project')) add('projects')
  if (haystack.includes('evento') || haystack.includes('event')) add('events')
  if (haystack.includes('calendar') || haystack.includes('calendario') || haystack.includes('agenda')) add('calendar')
  if (haystack.includes('dashboard')) add('dashboard')
  if (haystack.includes('finance') || haystack.includes('financ') || haystack.includes('cobro') || haystack.includes('gasto') || haystack.includes('factur')) add('finance')
  if (haystack.includes('import') || haystack.includes('export') || haystack.includes('portabilidad')) add('data-portability')
  if (haystack.includes('auth') || haystack.includes('onboarding') || haystack.includes('beta')) add('auth-onboarding')
  if (haystack.includes('profile') || haystack.includes('perfil') || haystack.includes('settings') || haystack.includes('ajustes')) add('settings-profile')
  if (haystack.includes('admin') || haystack.includes('invit')) add('admin-beta')
  if (haystack.includes('brain') || haystack.includes('product brain') || haystack.includes('backlog')) add('product-brain')
  if (haystack.includes('agent') || haystack.includes('opencode') || haystack.includes('skill')) add('agents')
  if (haystack.includes('design') || haystack.includes('dise') || haystack.includes('ux') || haystack.includes('ui')) add('design-system')
  if (haystack.includes('deploy') || haystack.includes('infra') || haystack.includes('dns')) add('infra-deploy')
  if (haystack.includes('email') || haystack.includes('brevo') || haystack.includes('smtp')) add('email')
  if (haystack.includes('supabase') || haystack.includes('rls')) add('supabase')

  if (components.size === 0) {
    if (area === 'brain' || area === 'docs') add('product-brain')
    else if (area === 'infra') add('infra-deploy')
    else if (area === 'data' || area === 'backend') add('supabase')
    else add('work')
  }

  return [...components]
}

function inferTheme(components, title) {
  const haystack = `${title} ${components.join(' ')}`.toLowerCase()
  if (components.some((component) => ['email', 'auth-onboarding', 'admin-beta', 'supabase'].includes(component))) return 'beta-trust'
  if (components.some((component) => ['product-brain', 'agents', 'infra-deploy'].includes(component))) return 'internal-agent-ops'
  if (components.some((component) => ['finance'].includes(component))) return 'finance-operations'
  if (components.some((component) => ['data-portability'].includes(component))) return 'portability-onboarding'
  if (haystack.includes('growth') || haystack.includes('referido') || haystack.includes('pro')) return 'pro-growth'
  if (components.some((component) => ['work', 'projects', 'events', 'calendar', 'dashboard', 'design-system'].includes(component))) return 'core-work-ux'
  return null
}

function mapWorkLevel(data, title) {
  if (data.work_level) return data.work_level
  if (initiativeIds.has(data.id)) return 'initiative'
  if (data.type === 'chore' || data.type === 'doc' || data.type === 'spike') return 'task'
  const haystack = `${title} ${data.estimate ?? ''}`.toLowerCase()
  if (haystack.includes('sistema') || haystack.includes('modelo') || haystack.includes('tooling')) return 'initiative'
  return 'slice'
}

function mapReleasePhase(status) {
  const normalized = String(status ?? '').toLowerCase()
  if (normalized === 'active') return 'active'
  if (normalized === 'released') return 'released'
  if (normalized === 'deprecated') return 'deprecated'
  if (normalized === 'archived') return 'archived'
  return 'draft'
}

function baseData(doc, kind, title, issueWorkflow = null) {
  const current = doc.frontmatter ?? {}
  return {
    schema_version: 2,
    kind,
    id: current.id ?? doc.basename,
    title,
    lifecycle: mapLifecycle(current.lifecycle ?? current.status, kind, issueWorkflow),
    created: normalizeDate(current.created ?? current.created_at) ?? migrationDate,
    updated: migrationDate,
    aliases: current.aliases ?? [current.id ?? doc.basename],
    tags: current.tags ?? ['product-brain', kind],
    generated: Boolean(current.generated ?? (doc.rel === 'DIGEST.md' || doc.rel.startsWith('indexes/') || doc.rel === 'backlog/BACKLOG.md')),
  }
}

function appendIssueLedger(body, workflow) {
  const ledgerHeadings = new Set([
    'desarrollo',
    'notas de progreso',
    'cambios de alcance y decisiones',
    'bloqueos',
    'validación ejecutada',
    'validacion ejecutada',
    'memoria',
  ])
  const lines = body.split('\n')
  const normalizedLines = []
  const seen = new Set()

  for (let index = 0; index < lines.length;) {
    const heading = lines[index].match(/^##\s+(.+?)\s*$/)
    if (!heading) {
      normalizedLines.push(lines[index])
      index += 1
      continue
    }

    const normalizedHeading = heading[1].trim().toLowerCase()
    let next = index + 1
    while (next < lines.length && !/^##\s+/.test(lines[next])) next += 1

    if (ledgerHeadings.has(normalizedHeading)) {
      const canonical = normalizedHeading === 'validacion ejecutada' ? 'validación ejecutada' : normalizedHeading
      if (seen.has(canonical)) {
        index = next
        continue
      }
      seen.add(canonical)
    }

    normalizedLines.push(...lines.slice(index, next))
    index = next
  }

  body = normalizedLines.join('\n').trimEnd() + '\n'
  if (['done', 'wont_fix'].includes(workflow)) return body
  const additions = []
  const hasHeading = (heading) => new RegExp(`^##\\s+${heading}\\s*$`, 'mi').test(body)
  if (!hasHeading('Desarrollo')) {
    additions.push('## Desarrollo', '', '- Rama:', '- PR:', '- Estado actual:', '')
  }
  if (!hasHeading('Notas de progreso')) additions.push('## Notas de progreso', '', '')
  if (!hasHeading('Cambios de alcance y decisiones')) additions.push('## Cambios de alcance y decisiones', '', '')
  if (!hasHeading('Bloqueos')) additions.push('## Bloqueos', '', '')
  if (!hasHeading('Validación ejecutada') && !hasHeading('Validacion ejecutada')) additions.push('## Validación ejecutada', '', 'Pendiente hasta ejecutar la issue.', '')
  if (!hasHeading('Memoria')) additions.push('## Memoria', '', 'No aplica por ahora.', '')
  if (additions.length === 0) return body
  return `${body.trimEnd()}\n\n${additions.join('\n')}`.trimEnd() + '\n'
}

function migrateIssue(doc, title) {
  const current = doc.frontmatter
  const workflow = current.issue_workflow ?? mapWorkflow(current.status)
  const area = mapArea(current.area, title, current.tags ?? [])
  const components = reclassify ? inferComponents(area, title, current.tags ?? []) : current.components ?? inferComponents(area, title, current.tags ?? [])
  const parent = current.parent ?? explicitParents.get(current.id) ?? (
    current.related?.find((ref) => initiativeIds.has(ref)) ?? null
  )
  const related = (current.related ?? []).filter((ref) => ref !== parent)
  const workLevel = mapWorkLevel(current, title)

  return {
    data: {
      ...baseData(doc, 'issue', title, workflow),
      work_type: current.work_type ?? current.type,
      work_level: workLevel,
      issue_workflow: workflow,
      priority: current.priority ?? 'p2',
      size: current.size ?? (current.estimate === 'l' ? 'm' : current.estimate ?? 's'),
      area,
      components,
      parent,
      related,
      depends_on: current.depends_on ?? [],
      blocked_by: current.blocked_by ?? [],
      adr: current.adr ?? [],
      release: current.release ?? null,
      theme: reclassify || current.theme === undefined ? inferTheme(components, title) : current.theme,
      ...(current.due_at ? { due_at: normalizeDate(current.due_at) } : {}),
      ...(current.github ? { github: current.github } : {}),
    },
    body: appendIssueLedger(doc.body, workflow),
  }
}

function migrateDecision(doc, title) {
  const current = doc.frontmatter
  return {
    data: {
      ...baseData(doc, 'decision', title),
      decision_status: current.decision_status ?? current.status ?? 'Accepted',
    },
    body: doc.body,
  }
}

function migrateRelease(doc, title) {
  const current = doc.frontmatter
  return {
    data: {
      ...baseData(doc, 'release', title),
      lifecycle: mapReleasePhase(current.status) === 'released' ? 'historical' : mapLifecycle(current.status, 'release'),
      release_phase: current.release_phase ?? mapReleasePhase(current.status),
      release_current: Boolean(current.release_current ?? String(current.status).toLowerCase() === 'active'),
      release_branch: current.release_branch ?? null,
      release_tag: current.release_tag ?? null,
      release_pr: current.release_pr ?? current.github_release ?? null,
    },
    body: doc.body,
  }
}

function migrateGeneric(doc, kind, title) {
  const current = doc.frontmatter
  const data = baseData(doc, kind, title)

  if (kind === 'release_status') data.release_current = true
  if (kind === 'feedback') {
    data.feedback_source = current.source ?? current.feedback_source
    data.feedback_severity = current.severity ?? current.feedback_severity
    data.area = current.area
    data.linked_issue = current.linked_issue ?? null
  }
  if (kind === 'inbox') data.capture_intent = current.capture_intent ?? 'inbox'

  return { data, body: doc.body }
}

function cleanUndefined(value) {
  if (Array.isArray(value)) return value.map(cleanUndefined)
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined)
        .map(([key, item]) => [key, cleanUndefined(item)]),
    )
  }
  return value
}

function normalizeForCompare(value) {
  if (value instanceof Date) return normalizeDate(value)
  if (Array.isArray(value)) return value.map(normalizeForCompare)
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, item]) => [key, normalizeForCompare(item)]))
  }
  return value
}

const changes = []

for (const doc of readAllDocs()) {
  if (doc.rel.startsWith('templates/')) continue
  if (!doc.frontmatter) continue

  const kind = mapKind(doc.frontmatter, doc.rel)
  const title = doc.frontmatter.title ?? docTitle(doc.body, doc.frontmatter.id ?? basename(doc.rel, '.md'))
  let migrated

  if (kind === 'issue') migrated = migrateIssue(doc, title)
  else if (kind === 'decision') migrated = migrateDecision(doc, title)
  else if (kind === 'release') migrated = migrateRelease(doc, title)
  else migrated = migrateGeneric(doc, kind, title)

  const data = cleanUndefined(migrated.data)
  const before = JSON.stringify(normalizeForCompare(doc.frontmatter))
  const after = JSON.stringify(normalizeForCompare(data))
  const bodyChanged = migrated.body !== doc.body

  if (before !== after || bodyChanged) {
    changes.push({
      rel: doc.rel,
      id: data.id,
      kind,
      beforeKeys: Object.keys(doc.frontmatter),
      afterKeys: Object.keys(data),
      bodyChanged,
    })
    if (shouldWrite) writeDoc(doc, data, migrated.body)
  }
}

const manifest = {
  schema_version: 2,
  mode: shouldWrite ? 'write' : 'dry-run',
  changed: changes.length,
  changes,
}

if (manifestPath) writeFileSync(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`)

console.log(JSON.stringify(manifest, null, 2))
if (!shouldWrite) console.error('[pb:migrate-v2] Dry-run. Reejecuta con --write para aplicar.')
