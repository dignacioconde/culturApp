#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { readAllDocs, sectionContent } from './brain/lib.mjs'

const argv = process.argv.slice(2)
const jsonOutput = argv.includes('--json')
const syncCheck = argv.includes('--sync-check')

function git(args) {
  const result = spawnSync('git', args, { encoding: 'utf8' })
  return {
    ok: result.status === 0,
    status: result.status ?? 1,
    stdout: result.stdout.trim(),
    stderr: result.stderr.trim(),
  }
}

function titleOf(doc) {
  return doc.frontmatter?.title ?? doc.basename
}

const docs = readAllDocs().filter((doc) => !doc.rel.startsWith('templates/'))
const current = docs.find((doc) => doc.frontmatter?.kind === 'release' && doc.frontmatter.release_current)
const statusDoc = docs.find((doc) => doc.rel === 'releases/CURRENT_RELEASE.md')
const blockers = []
const warnings = []

if (!current) blockers.push('No hay release activa con release_current: true')

const branch = current?.frontmatter.release_branch ?? null
const currentBranch = git(['branch', '--show-current']).stdout
const mainSha = git(['rev-parse', 'main']).stdout || null
const remoteMainSha = git(['rev-parse', 'origin/main']).stdout || null
const localRelease = branch ? git(['rev-parse', branch]) : { ok: false, stdout: null }
const remoteRelease = branch ? git(['rev-parse', `origin/${branch}`]) : { ok: false, stdout: null }
const containsMain = branch && localRelease.ok ? git(['merge-base', '--is-ancestor', 'main', branch]).ok : false
const containsRemoteMain = branch && localRelease.ok && remoteMainSha ? git(['merge-base', '--is-ancestor', 'origin/main', branch]).ok : null
const scope = current ? [...new Set(sectionContent(current.content, 'Scope').match(/CACH-(?:B)?\d{4}/g) ?? [])] : []
const unchecked = current ? current.content.split('\n').filter((line) => /^\s*-\s+\[\s\]/.test(line.trim())) : []

if (branch && !localRelease.ok) blockers.push(`La rama local ${branch} no existe`)
if (branch && !remoteRelease.ok) warnings.push(`La rama remota origin/${branch} no existe`)
if (branch && localRelease.ok && !containsMain) blockers.push(`${branch} no contiene todos los commits de main`)
if (mainSha && remoteMainSha && mainSha !== remoteMainSha) {
  const message = 'main local y origin/main no apuntan al mismo commit'
  if (syncCheck) blockers.push(message)
  else warnings.push(message)
}
if (syncCheck && branch && localRelease.ok && containsRemoteMain === false) blockers.push(`${branch} no contiene todos los commits de origin/main`)

const payload = {
  ok: blockers.length === 0,
  release: current
    ? {
        id: current.frontmatter.id,
        title: titleOf(current),
        phase: current.frontmatter.release_phase,
        branch,
        tag: current.frontmatter.release_tag,
        pr: current.frontmatter.release_pr,
        path: current.rel,
      }
    : null,
  currentBranch,
  mainSha,
  remoteMainSha,
  localReleaseSha: localRelease.stdout || null,
  remoteReleaseSha: remoteRelease.stdout || null,
  containsMain,
  containsRemoteMain,
  scope,
  uncheckedChecklistItems: unchecked,
  statusPath: statusDoc?.rel ?? null,
  blockers,
  warnings,
}

if (jsonOutput) {
  console.log(JSON.stringify(payload, null, 2))
} else {
  console.log(`# Release status`)
  console.log(`Release: ${payload.release ? `${payload.release.id} — ${payload.release.title}` : 'ninguna'}`)
  console.log(`Rama: ${branch ?? 'n/a'}`)
  console.log(`Actual: ${currentBranch || 'n/a'}`)
  console.log(`Scope: ${scope.length > 0 ? scope.join(', ') : 'sin scope'}`)
  for (const warning of warnings) console.warn(`[release:status] warning: ${warning}`)
  for (const blocker of blockers) console.error(`[release:status] blocker: ${blocker}`)
  if (payload.ok) console.log('[release:status] OK')
}

process.exitCode = syncCheck && !payload.ok ? 1 : 0
