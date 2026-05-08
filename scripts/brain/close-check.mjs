#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, readDoc, sectionContent } from './lib.mjs'
import { IssueFrontmatter } from './schema.mjs'

const issueId = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
const jsonOutput = process.argv.includes('--json')
const errors = []

function fail(message) {
  errors.push(message)
}

function meaningful(text) {
  return Boolean(text && !/pendiente|por cerrar|tbd|todo/i.test(text))
}

if (!issueId) {
  fail('Uso: npm run pb:close-check -- CACH-XXXX')
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
      if (data.issue_workflow !== 'done') fail(`issue_workflow debe ser done; actual: ${data.issue_workflow}`)

      const criteria = sectionContent(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria'])
      const unchecked = criteria.split('\n').filter((line) => /^\s*-\s+\[\s\]/.test(line))
      if (unchecked.length > 0 && !/movid[oa]|wont.?fix|fuera de alcance|no aplica/i.test(criteria)) {
        fail(`quedan criterios sin cerrar (${unchecked.length})`)
      }

      const result = sectionContent(doc.content, ['Resultado', 'Resultado final'])
      if (!meaningful(result)) fail('Resultado debe existir y no puede ser placeholder')

      const validation = sectionContent(doc.content, ['Validación ejecutada', 'Validacion ejecutada', 'Validacion', 'Validación'])
      if (!meaningful(validation)) fail('Validacion ejecutada debe documentar evidencia real')

      const development = sectionContent(doc.content, 'Desarrollo')
      const commits = sectionContent(doc.content, ['Commits relacionados', 'Commits', 'Trazabilidad'])
      const pullMerge = sectionContent(doc.content, ['Pull/Merge relacionado', 'Pull request', 'PR'])
      const trace = `${development}\n${result}\n${validation}\n${commits}\n${pullMerge}`
      if (!/(https:\/\/github\.com\/[^\s)]+\/pull\/\d+|PR\s*#?\d+|\bpull request\b|commit\s+[a-f0-9]{7,}|`[a-f0-9]{7,}`|\bmerge\b|Rama:\s*`?[\w./-]+`?|\brelease\/[^\s`]+|\bmain\b|\btag\b)/i.test(trace)) {
        fail('Falta trazabilidad de PR, commit, merge, branch o tag')
      }

      const memory = sectionContent(doc.content, 'Memoria')
      if (!meaningful(memory) && !/Memoria\s*:\s*(actualizada|no aplica)/i.test(doc.content)) fail('Memoria debe indicar actualizacion o no aplica')
    }
  }
}

const ok = errors.length === 0
if (jsonOutput) {
  console.log(JSON.stringify({ ok, issue: issueId ?? null, errors }, null, 2))
} else if (ok) {
  console.log(`[pb:close-check] OK: ${issueId} es cerrable`)
} else {
  for (const error of errors) console.error(`[pb:close-check] error: ${error}`)
}
process.exitCode = ok ? 0 : 1
