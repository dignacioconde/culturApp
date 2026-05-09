#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, readDoc, sectionContent } from './brain/lib.mjs'

const argv = process.argv.slice(2)
const issue = valueFor('--issue')
const base = valueFor('--base') ?? 'main'
const memory = valueFor('--memory') ?? 'no-aplica'
const deploy = valueFor('--deploy') ?? 'no aplica'

function valueFor(name) {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = argv.indexOf(name)
  return index >= 0 ? argv[index + 1] : null
}

function titleOf(doc) {
  return doc.frontmatter?.title ?? doc.basename
}

let issueDoc = null
if (issue) {
  const path = join(brainRoot, 'issues', `${issue}.md`)
  if (!existsSync(path)) {
    console.error(`[pr:body] No existe docs/project/issues/${issue}.md`)
    process.exit(1)
  }
  issueDoc = readDoc(path)
}

const validation = issueDoc ? sectionContent(issueDoc.content, ['Validacion', 'Validación', 'Validación ejecutada', 'Validacion ejecutada']) : ''
const result = issueDoc ? sectionContent(issueDoc.content, ['Resultado', 'Resultado final']) : ''

console.log(`## Summary

${issueDoc ? `${issueDoc.frontmatter.id} — ${titleOf(issueDoc)}` : 'Describe el cambio principal.'}

${result && !/pendiente/i.test(result) ? result : '- Pendiente de completar por el implementador.'}

## Product Brain

- Issue: ${issueDoc ? `\`${issueDoc.frontmatter.id}\`` : 'no aplica'}
- Parent: ${issueDoc?.frontmatter.parent ? `\`${issueDoc.frontmatter.parent}\`` : 'no aplica'}
- Release: ${issueDoc?.frontmatter.release ? `\`${issueDoc.frontmatter.release}\`` : 'no aplica'}
- Base: \`${base}\`

## Validation

${validation && !/pendiente/i.test(validation) ? validation : '- [ ] `npm run verify:pr -- --base ' + base + '`'}

## Deploy

- Preview/produccion: ${deploy}
- Produccion requiere merge a \`main\` y smoke posterior si el cambio debe verse publicado.

## Memory

Memoria: ${memory === 'actualizada' ? 'actualizada' : 'no aplica'}
`)
