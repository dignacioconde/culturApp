#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import {
  addLookup,
  brainRoot,
  bulletTargets,
  issueIdsIn,
  normalizeTarget,
  readAllDocs,
  repoRoot,
  sectionContent,
  wikilinkTargets,
} from './lib.mjs'
import { IssueFrontmatter, schemaForPath } from './schema.mjs'

const args = new Set(process.argv.slice(2))
const jsonOutput = args.has('--json')
const strict = args.has('--strict')

const indexChecks = [
  ['indexes/issues.index.md', 'issues'],
  ['indexes/decisions.index.md', 'decisions'],
  ['indexes/knowledge.index.md', 'knowledge'],
  ['indexes/releases.index.md', 'releases'],
]

const generatedIndexes = [
  'indexes/issues-open.index.md',
  'indexes/by-status.md',
  'indexes/by-area.md',
  'indexes/by-release.md',
  'indexes/by-level.md',
  'indexes/by-component.md',
  'indexes/by-theme.md',
  'indexes/initiative-children.index.md',
  'indexes/source-touchpoints.md',
]

const excludedLifecycles = new Set(['historical', 'deprecated', 'archived'])
const activeLoadPolicies = new Set(['default', 'profile_only'])

const boardColumns = new Map([
  ['inbox', 'Intake'],
  ['backlog', 'Backlog'],
  ['ready', 'Ready'],
  ['blocked', 'Backlog'],
  ['in_progress', 'In progress'],
  ['review', 'Review / Verify'],
  ['done', 'Done'],
])

const errors = []
const warnings = []
const sections = {
  area: false,
  frontmatter: false,
  wikilinks: false,
  issueRelease: false,
  hierarchy: false,
  backlog: false,
  indexes: false,
  generatedFreshness: false,
}

function runGeneratedCheck(script, label) {
  const result = spawnSync('node', [script, '--check', '--json'], { cwd: repoRoot, encoding: 'utf8' })
  if (result.status !== 0) {
    try {
      const payload = JSON.parse(result.stdout)
      const stale = payload.stale?.length ? `: ${payload.stale.join(', ')}` : ''
      addError(`${label}: artefactos generados desfasados${stale}`)
    } catch {
      addError(`${label}: check de frescura fallo\n${result.stdout}${result.stderr}`)
    }
  }
}

function addError(message) {
  errors.push(message)
}

function addWarning(message) {
  warnings.push(message)
}

function formatZodIssues(result, rel) {
  for (const issue of result.error.issues) {
    addError(`${rel}: frontmatter invalido en ${issue.path.join('.') || '(root)'}: ${issue.message}`)
  }
}

function uniqueMatches(matches) {
  return [...new Set(matches)]
}

function hasHistoricalPromptGuardrail(doc) {
  return /do not load by default|no cargar(?:lo|la|los|las)? por defecto|not current (?:agent )?instructions|no tratar(?:lo|la)? como instrucciones actuales|historical prompts are not current/i.test(doc.content)
}

if (!existsSync(brainRoot)) {
  addError(`No existe Product Brain: ${brainRoot}`)
} else {
  sections.area = true
  const docs = new Map()
  const issues = new Map()
  const releases = new Map()
  const byBasename = new Map()
  const byId = new Map()
  const byAlias = new Map()

  for (const doc of readAllDocs()) {
    docs.set(doc.key, doc)
    addLookup(byBasename, doc.basename, doc.key)

    if (!doc.rel.startsWith('templates/') && !doc.frontmatter) {
      addError(`${doc.rel}: falta frontmatter`)
      continue
    }

    if (doc.frontmatter?.type !== undefined || doc.frontmatter?.status !== undefined) {
      addError(`${doc.rel}: Product Brain v2 no permite type/status top-level; usar kind/lifecycle y campos de dominio`)
    }

    if (doc.frontmatter?.context_type !== undefined && doc.frontmatter?.kind !== 'context') {
      addError(`${doc.rel}: context_type solo esta permitido en documentos kind: context`)
    }

    if (excludedLifecycles.has(doc.frontmatter?.lifecycle)) {
      if (activeLoadPolicies.has(doc.frontmatter?.load_policy)) {
        addError(`${doc.rel}: lifecycle ${doc.frontmatter.lifecycle} no puede usar load_policy ${doc.frontmatter.load_policy}`)
      }
      if (doc.frontmatter?.index_policy === 'index') {
        addError(`${doc.rel}: lifecycle ${doc.frontmatter.lifecycle} no puede usar index_policy index`)
      }
    }

    if (doc.frontmatter?.kind === 'prompt' && doc.frontmatter?.lifecycle === 'historical') {
      if (activeLoadPolicies.has(doc.frontmatter?.load_policy)) {
        addError(`${doc.rel}: prompt historico no puede cargarse como contexto activo`)
      }
      if (doc.frontmatter?.index_policy === 'index') {
        addError(`${doc.rel}: prompt historico no puede indexarse como contenido completo`)
      }
      if (!hasHistoricalPromptGuardrail(doc)) {
        addError(`${doc.rel}: prompt historico debe declarar que no se carga por defecto ni son instrucciones actuales`)
      }
    }

    if (doc.frontmatter?.id) addLookup(byId, doc.frontmatter.id, doc.key)
    for (const alias of doc.frontmatter?.aliases ?? []) addLookup(byAlias, alias, doc.key)

    const schema = schemaForPath(doc.rel)
    if (schema) {
      const validation = schema.safeParse(doc.frontmatter ?? {})
      if (!validation.success) {
        formatZodIssues(validation, doc.rel)
      } else if (validation.data.kind === 'issue') {
        issues.set(validation.data.id, { ...doc, data: validation.data })
      } else if (validation.data.kind === 'release') {
        releases.set(validation.data.id, { ...doc, data: validation.data })
      }
    }

    if (
      doc.frontmatter?.kind === 'issue' &&
      ['done', 'wont_fix'].includes(doc.frontmatter?.issue_workflow) &&
      activeLoadPolicies.has(doc.frontmatter?.load_policy)
    ) {
      addError(`${doc.rel}: issue ${doc.frontmatter.issue_workflow} no puede usar load_policy ${doc.frontmatter.load_policy}`)
    }

    if (
      doc.frontmatter?.kind === 'issue' &&
      ['done', 'wont_fix'].includes(doc.frontmatter?.issue_workflow) &&
      doc.frontmatter?.index_policy === 'index'
    ) {
      addError(`${doc.rel}: issue ${doc.frontmatter.issue_workflow} debe usar index_metadata_only/no_index o dejar index_policy implicita`)
    }

    if (
      doc.frontmatter?.kind === 'release' &&
      ['released', 'deprecated', 'archived'].includes(doc.frontmatter?.release_phase) &&
      activeLoadPolicies.has(doc.frontmatter?.load_policy)
    ) {
      addError(`${doc.rel}: release ${doc.frontmatter.release_phase} no puede usar load_policy ${doc.frontmatter.load_policy}`)
    }

    if (
      doc.frontmatter?.kind === 'release' &&
      ['released', 'deprecated', 'archived'].includes(doc.frontmatter?.release_phase) &&
      doc.frontmatter?.index_policy === 'index'
    ) {
      addError(`${doc.rel}: release ${doc.frontmatter.release_phase} debe usar index_metadata_only/no_index o dejar index_policy implicita`)
    }

    if (doc.rel.startsWith('issues/') && doc.rel !== 'issues/README.md') {
      if (doc.frontmatter?.id !== doc.basename) {
        addError(`${doc.rel}: id '${doc.frontmatter?.id ?? '(sin id)'}' no coincide con filename '${doc.basename}'`)
      }

      const h1 = doc.content.match(/^#\s+(.+)$/m)?.[1]
      if (!h1?.startsWith(`${doc.basename} `) && h1 !== doc.basename) {
        addError(`${doc.rel}: H1 debe empezar por '${doc.basename}'`)
      }
    }
  }

  for (const [id, locations] of byId.entries()) {
    if (locations.size > 1) addError(`id duplicado '${id}': ${[...locations].join(', ')}`)
  }

  for (const [alias, locations] of byAlias.entries()) {
    if (locations.size > 1) addWarning(`alias duplicado '${alias}': ${[...locations].join(', ')}`)
  }

  sections.frontmatter = errors.length === 0

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

      const resolved = uniqueMatches(matches)
      if (resolved.length === 0) {
        addError(`${doc.rel}: wikilink roto -> ${rawTarget}`)
      } else if (resolved.length > 1) {
        addError(`${doc.rel}: wikilink ambiguo -> ${rawTarget} (${resolved.join(', ')})`)
      }
    }
  }

  sections.wikilinks = errors.length === 0

  const releaseScopes = new Map()
  for (const [releaseId, releaseDoc] of releases.entries()) {
    releaseScopes.set(releaseId, issueIdsIn(sectionContent(releaseDoc.content, 'Scope')))
  }

  for (const issue of issues.values()) {
    const { id, release, parent, related, depends_on, blocked_by, issue_workflow, work_level } = issue.data

    if (release !== null) {
      if (!releases.has(release)) {
        addError(`${issue.rel}: release '${release}' no existe en docs/project/releases/`)
      } else if (!releaseScopes.get(release)?.has(id)) {
        addError(`${issue.rel}: release '${release}' no lista ${id} en ## Scope`)
      }
    }

    if (work_level === 'initiative' && issue_workflow === 'ready') {
      addError(`${issue.rel}: una initiative no puede estar en issue_workflow ready; partir en slice`)
    }

    if (issue_workflow === 'blocked' && blocked_by.length === 0 && !sectionContent(issue.content, 'Bloqueos')) {
      addError(`${issue.rel}: issue_workflow blocked requiere blocked_by o seccion ## Bloqueos`)
    }

    const refs = [...related, ...depends_on, ...blocked_by]
    for (const ref of refs) {
      if (!issues.has(ref)) addError(`${issue.rel}: referencia issue inexistente ${ref}`)
    }

    if (parent !== null) {
      const parentIssue = issues.get(parent)
      if (!parentIssue) {
        addError(`${issue.rel}: parent inexistente ${parent}`)
      } else if (parentIssue.data.work_level !== 'initiative') {
        addError(`${issue.rel}: parent ${parent} debe ser work_level initiative`)
      }
    }
  }

  for (const [releaseId, scopeIds] of releaseScopes.entries()) {
    for (const issueId of scopeIds) {
      const issue = issues.get(issueId)
      if (!issue) {
        addError(`releases/${releaseId}.md: ## Scope referencia issue inexistente ${issueId}`)
      } else if (issue.data.release !== releaseId) {
        addError(`releases/${releaseId}.md: ${issueId} esta en ## Scope pero su frontmatter release es ${issue.data.release ?? 'null'}`)
      }
    }
  }

  sections.issueRelease = errors.length === 0

  function detectParentCycle(issueId, seen = new Set()) {
    if (seen.has(issueId)) return [...seen, issueId]
    const issue = issues.get(issueId)
    if (!issue?.data.parent) return null
    return detectParentCycle(issue.data.parent, new Set([...seen, issueId]))
  }

  for (const issueId of issues.keys()) {
    const cycle = detectParentCycle(issueId)
    if (cycle) addError(`jerarquia cyclic parent: ${cycle.join(' -> ')}`)
  }

  sections.hierarchy = errors.length === 0

  const backlog = docs.get('backlog/BACKLOG')
  if (!backlog) {
    addError('backlog/BACKLOG.md: tablero obligatorio no encontrado')
  } else {
    const columnIds = new Map()
    for (const column of new Set(boardColumns.values())) {
      columnIds.set(column, issueIdsIn(sectionContent(backlog.content, column)))
    }

    for (const issue of issues.values()) {
      if (issue.data.issue_workflow === 'wont_fix') continue
      const expectedColumn = boardColumns.get(issue.data.issue_workflow)
      if (!expectedColumn) continue
      if (!columnIds.get(expectedColumn)?.has(issue.data.id)) {
        addError(`backlog/BACKLOG.md: falta ${issue.data.id} en columna ${expectedColumn}`)
      }
    }
  }

  sections.backlog = errors.length === 0

  for (const [indexRel, folder] of indexChecks) {
    const indexKey = indexRel.replace(/\.md$/, '')
    const indexDoc = docs.get(indexKey)
    if (!indexDoc) {
      addError(`${indexRel}: indice obligatorio no encontrado`)
      continue
    }

    const expected = new Set(
      [...docs.keys()].filter((key) => key.startsWith(`${folder}/`) && key !== `${folder}/README`),
    )
    const actual = bulletTargets(indexDoc.content, indexRel)

    for (const target of expected) {
      if (!actual.has(target)) addError(`${indexRel}: falta entrada para ${target}`)
    }

    for (const target of actual) {
      if (!expected.has(target)) addError(`${indexRel}: entrada sobrante o rota ${target}`)
    }
  }

  for (const indexRel of generatedIndexes) {
    if (!docs.has(indexRel.replace(/\.md$/, ''))) addError(`${indexRel}: indice generado obligatorio no encontrado`)
  }

  sections.indexes = errors.length === 0

  if (strict) {
    const beforeGeneratedChecks = errors.length
    runGeneratedCheck('scripts/brain/index.mjs', 'pb:index --check')
    runGeneratedCheck('scripts/brain/digest.mjs', 'pb:digest --check')
    sections.generatedFreshness = errors.length === beforeGeneratedChecks
  }
}

const failed = errors.length > 0 || (strict && warnings.length > 0)

if (jsonOutput) {
  console.log(JSON.stringify({
    ok: !failed,
    strict,
    errors,
    warnings,
    sections,
  }, null, 2))
} else {
  for (const warning of warnings) console.warn(`[pb:check] warning: ${warning}`)

  if (errors.length > 0) {
    for (const error of errors) console.error(`[pb:check] error: ${error}`)
    console.error(`[pb:check] ${errors.length} error(es), ${warnings.length} warning(s)`)
  } else if (strict && warnings.length > 0) {
    console.error(`[pb:check] strict: ${warnings.length} warning(s)`)
  } else {
    console.log('Area                 OK')
    console.log('frontmatter-v2       OK')
    console.log('wikilinks            OK')
    console.log('issue-release        OK')
    console.log('hierarchy            OK')
    console.log('backlog-workflow     OK')
    console.log('indexes              OK')
    console.log(`[pb:check] OK: Product Brain v2 consistente (${warnings.length} warning(s))`)
  }
}

process.exitCode = failed ? 1 : 0
