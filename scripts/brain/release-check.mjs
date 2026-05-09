#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, readAllDocs, readDoc, sectionContent } from './lib.mjs'
import { ReleaseFrontmatter } from './schema.mjs'

const releaseId = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
const jsonOutput = process.argv.includes('--json')
const errors = []

function fail(message) {
  errors.push(message)
}

if (!releaseId) {
  fail('Uso: npm run pb:release-check -- RELEASE-X.Y.Z-beta.N')
} else {
  const file = join(brainRoot, 'releases', `${releaseId}.md`)
  if (!existsSync(file)) {
    fail(`No existe docs/project/releases/${releaseId}.md`)
  } else {
    const doc = readDoc(file)
    const parsed = ReleaseFrontmatter.safeParse(doc.frontmatter ?? {})
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fail(`frontmatter ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    } else {
      const data = parsed.data
      const scope = [...new Set(sectionContent(doc.content, 'Scope').match(/CACH-(?:B)?\d{4}/g) ?? [])]
      if (scope.length === 0) fail('## Scope debe listar issues concretas')
      if (/Pendiente\.?/i.test(sectionContent(doc.content, 'Release notes'))) fail('Release notes no pueden quedarse en Pendiente')
      if (data.release_phase === 'released') {
        if (!data.release_tag) fail('release_tag es obligatorio cuando release_phase es released')
        if (!data.release_pr) fail('release_pr es obligatorio cuando release_phase es released')
        if (/Produccion verificada si aplica|\[ \] Produccion/i.test(doc.content)) fail('Produccion debe quedar verificada o marcada no aplica')
      }
      const docs = readAllDocs()
      for (const issueId of scope) {
        const issue = docs.find((item) => item.frontmatter?.id === issueId)
        if (!issue) fail(`Scope referencia issue inexistente ${issueId}`)
        else if (issue.frontmatter.release !== data.id) fail(`${issueId} debe tener release: ${data.id}`)
      }
    }
  }
}

const ok = errors.length === 0
if (jsonOutput) console.log(JSON.stringify({ ok, release: releaseId ?? null, errors }, null, 2))
else if (ok) console.log(`[pb:release-check] OK: ${releaseId}`)
else for (const error of errors) console.error(`[pb:release-check] error: ${error}`)

process.exitCode = ok ? 0 : 1
