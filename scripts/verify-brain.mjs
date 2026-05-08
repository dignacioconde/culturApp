#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, readAllDocs, repoRoot } from './brain/lib.mjs'

const errors = []

function run(command, args) {
  const result = spawnSync(command, args, { cwd: repoRoot, encoding: 'utf8' })
  if (result.status !== 0) {
    errors.push(`${command} ${args.join(' ')} fallo:\n${result.stdout}${result.stderr}`)
  }
}

run('node', ['scripts/brain/check.mjs', '--strict', '--json'])

const orient = spawnSync('node', ['scripts/brain/orient.mjs', '--json'], { cwd: repoRoot, encoding: 'utf8' })
if (orient.status !== 0) {
  errors.push(`pb:orient fallo:\n${orient.stdout}${orient.stderr}`)
} else {
  try {
    const parsed = JSON.parse(orient.stdout)
    if (parsed.schema_version !== 2) errors.push('pb:orient no devuelve schema_version 2')
    if (!Array.isArray(parsed.open_issues)) errors.push('pb:orient no devuelve open_issues')
  } catch (error) {
    errors.push(`pb:orient no devuelve JSON valido: ${error.message}`)
  }
}

for (const doc of readAllDocs()) {
  if (doc.rel.startsWith('templates/')) continue
  if (doc.frontmatter?.type !== undefined || doc.frontmatter?.status !== undefined) {
    errors.push(`${doc.rel}: conserva type/status top-level`)
  }
}

function sourceFiles(dir) {
  if (!existsSync(dir)) return []
  return readdirSync(dir).flatMap((entry) => {
    const path = join(dir, entry)
    if (statSync(path).isDirectory()) return sourceFiles(path)
    return path
  })
}

const srcRefs = []
const srcPattern = /Product Brain|docs\/project|CACH-|pb:/
for (const file of sourceFiles(join(repoRoot, 'src'))) {
  const lines = readFileSync(file, 'utf8').split('\n')
  lines.forEach((line, index) => {
    if (srcPattern.test(line)) srcRefs.push(`${file.replace(`${repoRoot}/`, '')}:${index + 1}:${line}`)
  })
}
if (srcRefs.length > 0) errors.push(`src contiene referencias operativas a Product Brain:\n${srcRefs.join('\n')}`)

for (const rel of [
  'indexes/issues-open.index.md',
  'indexes/by-status.md',
  'indexes/by-area.md',
  'indexes/by-release.md',
  'indexes/by-level.md',
  'indexes/by-component.md',
  'indexes/by-theme.md',
  'indexes/initiative-children.index.md',
  'indexes/source-touchpoints.md',
]) {
  if (!existsSync(join(brainRoot, rel))) errors.push(`falta ${rel}`)
}

const digest = readFileSync(join(brainRoot, 'DIGEST.md'), 'utf8')
if (/Generado:\s*\d{4}-\d{2}-\d{2} \d{2}:\d{2}/.test(digest)) {
  errors.push('DIGEST.md conserva timestamp volatil')
}

if (errors.length > 0) {
  for (const error of errors) console.error(`[verify:brain] error: ${error}`)
  process.exit(1)
}

console.log('[verify:brain] OK')
