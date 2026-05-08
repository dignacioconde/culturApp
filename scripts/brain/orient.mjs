#!/usr/bin/env node
import { docTitle, readAllDocs, sectionContent, stripWikilinks } from './lib.mjs'

const args = new Set(process.argv.slice(2))
const jsonOutput = args.has('--json')

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
  console.log('')
  console.log('## Issues abiertas principales')
  for (const issue of payload.open_issues.slice(0, 10)) {
    console.log(`- ${issue.id} — ${issue.title} · ${issue.workflow} · ${issue.priority}`)
  }
}
