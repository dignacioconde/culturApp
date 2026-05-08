#!/usr/bin/env node
import { createInterface } from 'node:readline'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, ensureDir, today, writeIfChanged } from './lib.mjs'

const INTENTS = {
  inbox: { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox'] },
  idea: { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox', 'idea'] },
  issue: { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox', 'issue-candidate'] },
  'decisión': { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox', 'decision-candidate'] },
  decision: { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox', 'decision-candidate'] },
  contexto: { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox', 'context-candidate'] },
  context: { folder: 'inbox', kind: 'inbox', tags: ['product-brain', 'inbox', 'context-candidate'] },
}

function slugify(input) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 64) || 'captura'
}

function readStdin() {
  return new Promise((resolveStdin, reject) => {
    const lines = []
    const rl = createInterface({ input: process.stdin, crlfDelay: Infinity })
    rl.on('line', (line) => lines.push(line))
    rl.on('close', () => resolveStdin(lines.join('\n').trim()))
    rl.on('error', reject)
  })
}

function parseArgs(args) {
  const result = { title: '', tags: [], content: '' }
  const content = []

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index]
    if (arg === '--title') {
      result.title = args[index + 1] ?? ''
      index += 1
    } else if (arg === '--tag' || arg === '--tags') {
      result.tags = (args[index + 1] ?? '').split(',').map((tag) => tag.trim()).filter(Boolean)
      index += 1
    } else if (!arg.startsWith('--')) {
      content.push(arg)
    }
  }

  result.content = content.join(' ').trim()
  return result
}

function extractIntent(content) {
  const match = content.match(/^PB\s+([\p{L}a-zA-Z]+):\s*/iu)
  if (!match) return { intent: 'inbox', content }
  const intent = match[1].toLowerCase()
  return {
    intent: INTENTS[intent] ? intent : 'inbox',
    content: content.slice(match[0].length).trim(),
  }
}

const args = parseArgs(process.argv.slice(2))
let content = args.content
if (!content && !process.stdin.isTTY) content = await readStdin()

const parsedIntent = extractIntent(content.trim())
content = parsedIntent.content

if (!content) {
  console.error('[pb:capture] ERROR: falta contenido')
  process.exit(1)
}

const intent = parsedIntent.intent
const config = INTENTS[intent]
const date = today()
const now = new Date()
const time = now.toTimeString().slice(0, 8).replaceAll(':', '')
const title = args.title || content.split('\n')[0].replace(/^#+\s*/, '').trim().slice(0, 90)
const slug = slugify(title)
const root = join(brainRoot, config.folder)
ensureDir(root)

let fileName = `${date}-${time}-${slug}.md`
let filePath = join(root, fileName)
let counter = 2
while (existsSync(filePath)) {
  fileName = `${date}-${time}-${slug}-${counter}.md`
  filePath = join(root, fileName)
  counter += 1
}
const idSuffix = counter > 2 ? `-${counter - 1}` : ''

const tags = [...new Set([...config.tags, ...args.tags])]
const safeTitle = title.replaceAll('"', "'")
const frontmatter = [
  '---',
  'schema_version: 2',
  `kind: ${config.kind}`,
  `id: PB-INBOX-${date.replaceAll('-', '')}-${time}${idSuffix}`,
  `title: ${safeTitle}`,
  'lifecycle: active',
  `created: ${date}`,
  `updated: ${date}`,
  'aliases:',
  `  - ${safeTitle}`,
  'tags:',
  ...tags.map((tag) => `  - ${tag}`),
  'generated: false',
  `capture_intent: ${intent === 'decisión' ? 'decision' : intent}`,
  '---',
  '',
].join('\n')

writeIfChanged(filePath, `${frontmatter}# ${title}\n\n${content}\n`)
console.log(`[pb:capture] Creado: ${filePath}`)
