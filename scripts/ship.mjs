#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, readDoc, repoRoot } from './brain/lib.mjs'

const argv = process.argv.slice(2)
const execute = argv.includes('--execute')
const allowNoRelease = argv.includes('--allow-no-release')
const issue = valueFor('--issue')
const base = valueFor('--base') ?? 'origin/main'
const title = valueFor('--title') ?? (issue ? `chore(${issue}): prepare changes` : 'chore: prepare changes')
const currentBranch = runCaptured('git', ['branch', '--show-current']).stdout.trim()

function valueFor(name) {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = argv.indexOf(name)
  return index >= 0 ? argv[index + 1] : null
}

function run(command, args, options = {}) {
  const result = spawnSync(command, args, { cwd: repoRoot, encoding: 'utf8', stdio: options.capture ? 'pipe' : 'inherit' })
  return result
}

function runCaptured(command, args) {
  return spawnSync(command, args, { cwd: repoRoot, encoding: 'utf8' })
}

function block(message, status = 1) {
  console.error(`[ship] Bloqueado: ${message}`)
  process.exit(status)
}

function runRequired(command, args, options = {}) {
  const result = run(command, args, options)
  if ((result.status ?? 1) !== 0) {
    block(`${command} ${args.join(' ')} fallo`, result.status ?? 1)
  }
  return result
}

function requireCleanWorktree() {
  const status = runCaptured('git', ['status', '--porcelain'])
  if ((status.status ?? 1) !== 0) block('no se pudo leer git status', status.status ?? 1)
  if (status.stdout.trim()) block('hay cambios sin commitear; ship --execute solo empuja commits ya cerrados')
}

function releasePolicy() {
  if (!issue) return { ok: true }

  const issuePath = join(brainRoot, 'issues', `${issue}.md`)
  if (!existsSync(issuePath)) {
    return { ok: false, message: `no existe docs/project/issues/${issue}.md` }
  }

  const doc = readDoc(issuePath)
  const data = doc.frontmatter ?? {}
  const hasRelease = Boolean(data.release)
  const isFeature = data.work_type === 'feature'

  if (isFeature && !hasRelease && !allowNoRelease) {
    return {
      ok: false,
      message: `${issue} es una feature con release: null; asignala a una release o relanza con --allow-no-release si este PR ligero fuera de release es intencional`,
    }
  }

  return {
    ok: true,
    warning: isFeature && !hasRelease && allowNoRelease
      ? `${issue} es feature sin release; se permite porque pasaste --allow-no-release`
      : null,
  }
}

console.log(`[ship] Base: ${base}`)
console.log(`[ship] Issue: ${issue ?? 'no aplica'}`)
console.log(`[ship] Rama actual: ${currentBranch || 'desconocida'}`)
console.log(`[ship] Titulo PR sugerido: ${title}`)

const policy = releasePolicy()
if (policy.warning) console.warn(`[ship] Aviso: ${policy.warning}`)

if (!execute) {
  console.log('[ship] Dry-run: no se hacen push, PR, merge ni deploy.')
  if (!policy.ok) console.log(`[ship] --execute quedaria bloqueado: ${policy.message}`)
  console.log(`[ship] Ejecutaria: npm run verify:pr -- --base ${base}${issue ? ` --issue ${issue}` : ''}`)
  console.log(`[ship] Generaria PR body: npm run pr:body -- ${issue ? `--issue ${issue} ` : ''}--base ${base}`)
  console.log('[ship] Para abrir PR, relanza con --execute tras revisar el diff.')
  process.exit(0)
}

if (!currentBranch) block('no hay rama actual detectable')
if (['main', 'master'].includes(currentBranch)) block('no abras PR directamente desde main/master')
if (!policy.ok) block(policy.message)
requireCleanWorktree()

runRequired('npm', ['run', 'verify:pr', '--', '--base', base, ...(issue ? ['--issue', issue] : [])])
runRequired('git', ['push', '-u', 'origin', 'HEAD'])
const body = runRequired('npm', ['run', 'pr:body', '--', ...(issue ? ['--issue', issue] : []), '--base', base], { capture: true }).stdout.trim()
if (!body) block('pr:body genero una descripcion vacia')
runRequired('gh', ['pr', 'create', '--base', base.replace(/^origin\//, ''), '--head', currentBranch, '--title', title, '--body', body])
