#!/usr/bin/env node
import { existsSync, lstatSync, readdirSync, readFileSync, realpathSync } from 'node:fs'
import { join, relative, resolve } from 'node:path'
import { repoRoot } from './brain/lib.mjs'

const errors = []
const agentsSkills = join(repoRoot, '.agents', 'skills')
const claudeSkills = join(repoRoot, '.claude', 'skills')

function fail(message) {
  errors.push(message)
}

for (const name of readdirSync(agentsSkills).sort()) {
  const skillPath = join(agentsSkills, name, 'SKILL.md')
  if (!existsSync(skillPath)) continue
  const content = readFileSync(skillPath, 'utf8')
  if (!/^---\n[\s\S]*?^name:\s*.+$/m.test(content)) fail(`${skillPath}: falta name en frontmatter`)
  if (!/^description:\s*.+$/m.test(content)) fail(`${skillPath}: falta description en frontmatter`)
  if (/(?<!product-)brain-orient/i.test(content)) fail(`${skillPath}: referencia legacy brain-orient`)

  const claudePath = join(claudeSkills, name)
  if (!existsSync(claudePath)) {
    fail(`falta symlink Claude para ${name}`)
    continue
  }
  if (!lstatSync(claudePath).isSymbolicLink()) fail(`${relative(repoRoot, claudePath)} debe ser symlink`)
}

const compactPath = join(claudeSkills, 'compact-memory')
if (!existsSync(compactPath) || !lstatSync(compactPath).isSymbolicLink()) {
  fail('.claude/skills/compact-memory debe ser symlink de directorio')
}

const wrongCompact = join(claudeSkills, 'compact-memory.md')
if (existsSync(wrongCompact)) fail('.claude/skills/compact-memory.md no debe existir como skill')

const productBrainOrient = join(claudeSkills, 'product-brain-orient')
if (!existsSync(productBrainOrient) || !lstatSync(productBrainOrient).isSymbolicLink()) {
  fail('.claude/skills/product-brain-orient debe apuntar a .agents/skills/product-brain-orient')
} else {
  const target = realpathSync(productBrainOrient)
  const expected = resolve(agentsSkills, 'product-brain-orient')
  if (target !== expected) fail(`product-brain-orient apunta a ${target}, esperado ${expected}`)
}

if (existsSync(join(claudeSkills, 'brain-orient'))) {
  fail('.claude/skills/brain-orient legacy debe eliminarse o sustituirse por product-brain-orient')
}

const skillTemplate = join(repoRoot, '.agents', 'templates', 'portable-skill', 'SKILL.md')
if (existsSync(skillTemplate)) {
  const content = readFileSync(skillTemplate, 'utf8')
  if (/(?<!product-)brain-orient/i.test(content)) fail(`${skillTemplate}: referencia legacy brain-orient`)
  if (!content.includes('Product Brain v2 Contract')) fail(`${skillTemplate}: falta Product Brain v2 Contract`)
}

if (errors.length > 0) {
  for (const error of errors) console.error(`[verify:skills] error: ${error}`)
  process.exit(1)
}

console.log('[verify:skills] OK')
