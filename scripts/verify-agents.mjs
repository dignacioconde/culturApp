#!/usr/bin/env node
import { readdirSync, readFileSync } from 'node:fs'
import { join } from 'node:path'
import { repoRoot } from './brain/lib.mjs'

const errors = []
const requiredContract = [
  'Contexto leído',
  'Product Brain leído',
  'Product Brain actualizado',
  'Validación PB',
  'Feedback/Memory',
]

function fail(message) {
  errors.push(message)
}

function checkNoGithubFirst(rel, content) {
  if (/GitHub-first|GitHub primero|issue en GitHub\s*->/i.test(content)) {
    fail(`${rel}: contiene lenguaje GitHub-first`)
  }
}

const agentDir = join(repoRoot, '.opencode', 'agents')
for (const file of readdirSync(agentDir).filter((name) => name.endsWith('.md')).sort()) {
  const rel = `.opencode/agents/${file}`
  const content = readFileSync(join(agentDir, file), 'utf8')
  checkNoGithubFirst(rel, content)
  if (/^\s*status:\s+in-progress|^\s*status:\s+inbox|^\s*type:\s+feature|^\s*estimate:\s+[sml]/m.test(content)) {
    fail(`${rel}: conserva ejemplos v1 de issue frontmatter`)
  }
  for (const label of requiredContract) {
    if (!content.includes(label)) fail(`${rel}: falta contrato de salida "${label}"`)
  }
}

checkNoGithubFirst('.opencode/README.md', readFileSync(join(repoRoot, '.opencode', 'README.md'), 'utf8'))

for (const file of ['run-agent.mjs', 'run-planner.mjs', 'run-parallel-agents.mjs']) {
  const rel = `.opencode/scripts/${file}`
  const content = readFileSync(join(repoRoot, '.opencode', 'scripts', file), 'utf8')
  for (const label of requiredContract) {
    if (!content.includes(label)) fail(`${rel}: falta contrato v2 "${label}"`)
  }
  if (!content.includes('pb:orient')) fail(`${rel}: debe orientar Product Brain con pb:orient bajo demanda`)
  if (!content.includes('--concise') || !content.includes('--caveman')) {
    fail(`${rel}: debe soportar modo conciso/caveman explicito`)
  }
  for (const guardrail of ['RLS', 'finanzas', 'SQL', 'migraciones', 'review']) {
    if (!content.includes(guardrail)) fail(`${rel}: modo caveman debe preservar ${guardrail}`)
  }
}

if (errors.length > 0) {
  for (const error of errors) console.error(`[verify:agents] error: ${error}`)
  process.exit(1)
}

console.log('[verify:agents] OK')
