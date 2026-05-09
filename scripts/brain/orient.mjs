#!/usr/bin/env node
import { docTitle, readAllDocs, sectionContent, stripWikilinks, tableRows } from './lib.mjs'

const argv = process.argv.slice(2)
const args = new Set(argv)
const jsonOutput = args.has('--json')
const issueId = valueFor('--issue')
const component = valueFor('--component')
const files = valuesFor('--files').flatMap((value) => value.split(',')).map((value) => value.trim()).filter(Boolean)

function valueFor(name) {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = argv.indexOf(name)
  return index >= 0 ? argv[index + 1] : null
}

function valuesFor(name) {
  const values = []
  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index]
    if (arg === name && argv[index + 1]) values.push(argv[index + 1])
    else if (arg.startsWith(`${name}=`)) values.push(arg.slice(name.length + 1))
  }
  return values
}

function titleOf(doc) {
  return doc.frontmatter?.title ?? docTitle(doc.body, doc.basename)
}

function priorityOrder(value) {
  return { p0: 0, p1: 1, p2: 2, p3: 3 }[value] ?? 99
}

function workflowOrder(value) {
  return { in_progress: 0, review: 1, inbox: 2, ready: 3, backlog: 4, blocked: 5 }[value] ?? 99
}

const docs = readAllDocs().filter((doc) => !doc.rel.startsWith('templates/'))
const issues = docs
  .filter((doc) => doc.frontmatter?.kind === 'issue')
  .filter((doc) => !['done', 'wont_fix'].includes(doc.frontmatter.issue_workflow))
  .sort((a, b) => {
    const workflowDelta = workflowOrder(a.frontmatter.issue_workflow) - workflowOrder(b.frontmatter.issue_workflow)
    if (workflowDelta !== 0) return workflowDelta
    const priorityDelta = priorityOrder(a.frontmatter.priority) - priorityOrder(b.frontmatter.priority)
    if (priorityDelta !== 0) return priorityDelta
    return a.frontmatter.id.localeCompare(b.frontmatter.id)
  })

const currentRelease = docs.find((doc) => doc.frontmatter?.kind === 'release' && doc.frontmatter.release_current)
const currentPlan = docs.find((doc) => doc.rel === 'plans/CURRENT_PLAN.md')
const releaseStatus = docs.find((doc) => doc.rel === 'releases/CURRENT_RELEASE.md')
const touchpoints = docs.find((doc) => doc.rel === 'indexes/source-touchpoints.md')
const requestedIssue = issueId ? docs.find((doc) => doc.frontmatter?.id === issueId) : null
const requestedParent = requestedIssue?.frontmatter?.parent
  ? docs.find((doc) => doc.frontmatter?.id === requestedIssue.frontmatter.parent)
  : null
const requestedRelease = requestedIssue?.frontmatter?.release
  ? docs.find((doc) => doc.frontmatter?.id === requestedIssue.frontmatter.release)
  : null

function pathMatches(globs, file) {
  return globs.some((glob) => {
    const normalized = glob.trim()
    if (!normalized) return false
    if (normalized.endsWith('/**')) return file.startsWith(normalized.slice(0, -3))
    if (normalized.includes('*')) return file.includes(normalized.replaceAll('*', ''))
    return file === normalized || file.startsWith(`${normalized}/`) || normalized.includes(file)
  })
}

function matchingTouchpoints() {
  if (!touchpoints) return []
  const rows = tableRows(sectionContent(touchpoints.content, ''))
  const manualRows = touchpoints.content
    .split('\n')
    .filter((line) => line.startsWith('|') && !line.includes('---') && !line.includes('Globs |'))
    .map((line) => line.split('|').map((cell) => stripWikilinks(cell.trim())).filter(Boolean))
  return (rows.length > 0 ? rows : manualRows)
    .filter((row) => row.length >= 5)
    .filter((row) => {
      const [globs, area, components] = row
      const componentMatch = component ? components.split(',').map((item) => item.trim()).includes(component) : false
      const fileMatch = files.length > 0
        ? files.some((file) => pathMatches(globs.split(',').map((item) => item.trim()), file))
        : false
      return componentMatch || fileMatch
    })
    .map(([globs, area, components, context, checks]) => ({ globs, area, components, context, checks }))
}

const payload = {
  schema_version: 2,
  product_brain: 'docs/project',
  current_release: currentRelease
    ? {
        id: currentRelease.frontmatter.id,
        title: titleOf(currentRelease),
        phase: currentRelease.frontmatter.release_phase,
        branch: currentRelease.frontmatter.release_branch,
        path: currentRelease.rel,
      }
    : null,
  release_note: stripWikilinks(sectionContent(releaseStatus?.content ?? '', ['Release activa'])).trim() || null,
  current_focus: stripWikilinks(sectionContent(currentPlan?.content ?? '', 'Foco actual')).trim() || null,
  open_issues: issues.slice(0, 20).map((doc) => ({
    id: doc.frontmatter.id,
    title: titleOf(doc),
    workflow: doc.frontmatter.issue_workflow,
    level: doc.frontmatter.work_level,
    type: doc.frontmatter.work_type,
    priority: doc.frontmatter.priority,
    area: doc.frontmatter.area,
    components: doc.frontmatter.components,
    parent: doc.frontmatter.parent,
    release: doc.frontmatter.release,
    path: doc.rel,
  })),
  indexes: {
    open: 'docs/project/indexes/issues-open.index.md',
    by_status: 'docs/project/indexes/by-status.md',
    by_component: 'docs/project/indexes/by-component.md',
    by_level: 'docs/project/indexes/by-level.md',
    touchpoints: touchpoints ? 'docs/project/indexes/source-touchpoints.md' : null,
  },
  requested: {
    issue: requestedIssue
      ? {
          id: requestedIssue.frontmatter.id,
          title: titleOf(requestedIssue),
          workflow: requestedIssue.frontmatter.issue_workflow,
          level: requestedIssue.frontmatter.work_level,
          type: requestedIssue.frontmatter.work_type,
          priority: requestedIssue.frontmatter.priority,
          area: requestedIssue.frontmatter.area,
          components: requestedIssue.frontmatter.components,
          parent: requestedIssue.frontmatter.parent,
          release: requestedIssue.frontmatter.release,
          adr: requestedIssue.frontmatter.adr,
          path: requestedIssue.rel,
        }
      : issueId
        ? { id: issueId, error: 'not_found' }
        : null,
    parent: requestedParent
      ? {
          id: requestedParent.frontmatter.id,
          title: titleOf(requestedParent),
          path: requestedParent.rel,
        }
      : null,
    release: requestedRelease
      ? {
          id: requestedRelease.frontmatter.id,
          title: titleOf(requestedRelease),
          phase: requestedRelease.frontmatter.release_phase,
          branch: requestedRelease.frontmatter.release_branch,
          path: requestedRelease.rel,
        }
      : null,
    files,
    component,
    touchpoints: matchingTouchpoints(),
  },
  read_policy: [
    'Lee indices primero.',
    'Carga solo la issue CACH relacionada, parent si existe y source-touchpoints relevante.',
    'No leas Product Brain completo, backlog historico ni releases cerradas por defecto.',
  ],
}

if (jsonOutput) {
  console.log(JSON.stringify(payload, null, 2))
} else {
  console.log('# Product Brain Orient')
  console.log('')
  console.log(`Release: ${payload.current_release ? `${payload.current_release.id} (${payload.current_release.phase})` : 'ninguna'}`)
  console.log(`Foco: ${payload.current_focus ?? 'sin foco documentado'}`)
  if (payload.requested.issue) {
    console.log(`Issue solicitada: ${payload.requested.issue.id} — ${payload.requested.issue.title ?? payload.requested.issue.error}`)
  }
  console.log('')
  console.log('## Issues abiertas principales')
  for (const issue of payload.open_issues.slice(0, 10)) {
    console.log(`- ${issue.id} — ${issue.title} · ${issue.workflow} · ${issue.priority}`)
  }
}
