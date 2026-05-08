#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, hasSection, readAllDocs, readDoc, sectionContent } from './lib.mjs'
import { IssueFrontmatter } from './schema.mjs'

const issueId = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
const jsonOutput = process.argv.includes('--json')
const errors = []

function fail(message) {
  errors.push(message)
}

if (!issueId) {
  fail('Uso: npm run pb:ready-check -- CACH-XXXX')
} else {
  const path = join(brainRoot, 'issues', `${issueId}.md`)
  if (!existsSync(path)) {
    fail(`No existe docs/project/issues/${issueId}.md`)
  } else {
    const doc = readDoc(path)
    const parsed = IssueFrontmatter.safeParse(doc.frontmatter ?? {})
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fail(`frontmatter ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    } else {
      const data = parsed.data
      if (data.issue_workflow !== 'ready') fail(`issue_workflow debe ser ready; actual: ${data.issue_workflow}`)
      if (data.work_level === 'initiative') fail('work_level initiative no es ejecutable; crea una slice hija')
      if (!hasSection(doc.content, ['Objetivo', 'Summary', 'Problem'])) fail('Falta seccion de objetivo/problema')
      if (!hasSection(doc.content, ['Alcance', 'Scope', 'Proposed Solution'])) fail('Falta seccion de alcance')
      if (!hasSection(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria'])) fail('Falta criterios de aceptacion')
      if (!/^\s*-\s+\[[ xX]\]/m.test(sectionContent(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria']))) fail('Los criterios deben ser checklist')
      const validation = sectionContent(doc.content, ['Validacion', 'Validación'])
      if (!validation || /pendiente hasta cerrar/i.test(validation)) fail('Validacion debe indicar checks esperados antes de ejecutar')
      if (data.components.length === 0) fail('components no puede estar vacio')
      if (data.parent) {
        const docs = readAllDocs()
        const parent = docs.find((item) => item.frontmatter?.id === data.parent)
        if (!parent) fail(`parent inexistente: ${data.parent}`)
        else if (parent.frontmatter.work_level !== 'initiative') fail(`parent ${data.parent} debe ser initiative`)
      }
    }
  }
}

const ok = errors.length === 0
if (jsonOutput) {
  console.log(JSON.stringify({ ok, issue: issueId ?? null, errors }, null, 2))
} else if (ok) {
  console.log(`[pb:ready-check] OK: ${issueId} esta lista para ejecucion`)
} else {
  for (const error of errors) console.error(`[pb:ready-check] error: ${error}`)
}
process.exitCode = ok ? 0 : 1
