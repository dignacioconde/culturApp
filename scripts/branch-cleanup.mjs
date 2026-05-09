#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readAllDocs } from './brain/lib.mjs'

const argv = process.argv.slice(2)
const deleteLocal = argv.includes('--delete-local')
const currentBranch = git(['branch', '--show-current']).stdout
const activeRelease = readAllDocs().find((doc) => doc.frontmatter?.kind === 'release' && doc.frontmatter.release_current)?.frontmatter.release_branch

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' })
  return { ok: result.status === 0, stdout: result.stdout.trim(), stderr: result.stderr.trim(), status: result.status ?? 1 }
}

const merged = git(['branch', '--merged', 'main']).stdout
  .split('\n')
  .map((line) => line.replace(/^\*/, '').trim())
  .filter(Boolean)
  .filter((branch) => !['main', 'master'].includes(branch))
  .filter((branch) => branch !== currentBranch)
  .filter((branch) => !branch.startsWith('release/'))
  .filter((branch) => branch !== activeRelease)

if (merged.length === 0) {
  console.log('[branch:cleanup] No hay ramas locales mergeadas candidatas.')
  process.exit(0)
}

for (const branch of merged) {
  if (deleteLocal) {
    const result = git(['branch', '-d', branch])
    console.log(`[branch:cleanup] ${result.ok ? 'deleted' : 'skip'} ${branch}`)
  } else {
    console.log(`[branch:cleanup] dry-run local branch: ${branch}`)
  }
}

if (!deleteLocal) console.log('[branch:cleanup] Usa --delete-local para borrar estas ramas locales.')
