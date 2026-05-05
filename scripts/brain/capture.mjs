#!/usr/bin/env node
import { existsSync, mkdirSync, writeFileSync } from 'node:fs'
import { join, resolve } from 'node:path'
import { createInterface } from 'node:readline'

const repoRoot = resolve(new URL('../..', import.meta.url).pathname)
const brainRoot = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(repoRoot, 'docs', 'project')
const inboxRoot = join(brainRoot, 'inbox')

function ensureDir(path) {
  if (!existsSync(path)) mkdirSync(path, { recursive: true })
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

const args = parseArgs(process.argv.slice(2))
let content = args.content
if (!content && !process.stdin.isTTY) content = await readStdin()
content = content.replace(/^PB\s+\w+:\s*/i, '').trim()

if (!content) {
  console.error('[pb:capture] ERROR: falta contenido')
  process.exit(1)
}

ensureDir(inboxRoot)

const now = new Date()
const date = now.toISOString().slice(0, 10)
const time = now.toTimeString().slice(0, 8).replaceAll(':', '')
const title = args.title || content.split('\n')[0].replace(/^#+\s*/, '').trim().slice(0, 90)
const slug = slugify(title)
let fileName = `${date}-${time}-${slug}.md`
let filePath = join(inboxRoot, fileName)
let counter = 2
while (existsSync(filePath)) {
  fileName = `${date}-${time}-${slug}-${counter}.md`
  filePath = join(inboxRoot, fileName)
  counter += 1
}

const tags = ['product-brain', 'inbox', ...args.tags]
const frontmatter = [
  '---',
  `id: PB-INBOX-${date.replaceAll('-', '')}-${time}`,
  'type: inbox',
  'status: Active',
  `created: ${date}`,
  `updated: ${date}`,
  'aliases:',
  `  - ${title.replaceAll('"', "'")}`,
  'tags:',
  ...tags.map((tag) => `  - ${tag}`),
  '---',
  '',
].join('\n')

writeFileSync(filePath, `${frontmatter}# ${title}\n\n${content}\n`)
console.log(`[pb:capture] Creado: ${filePath}`)
