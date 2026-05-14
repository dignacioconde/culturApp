#!/usr/bin/env node
import { readAllDocs } from './brain/lib.mjs'
import { LATEST_VERSION, VERSION_HISTORY } from '../src/lib/versionHistory.js'

const VERSION_HISTORY_START_BETA = 22
const errors = []

function betaNumberFromVersion(version) {
  return Number(String(version).match(/^v?0\.1\.0-beta\.(\d+)$/)?.[1] ?? 0)
}

function releasedBetas() {
  return readAllDocs()
    .filter((doc) => doc.rel.startsWith('releases/RELEASE-0.1.0-beta.'))
    .map((doc) => {
      const tag = doc.frontmatter?.release_tag
      return {
        id: doc.frontmatter?.id,
        phase: doc.frontmatter?.release_phase,
        tag,
        version: tag?.replace(/^v/, ''),
        betaNumber: betaNumberFromVersion(tag),
      }
    })
    .filter((release) => release.phase === 'released' && release.tag?.startsWith('v0.1.0-beta.'))
    .sort((a, b) => a.betaNumber - b.betaNumber)
}

const versions = VERSION_HISTORY.map((entry) => entry.version)
const sortedVersions = [...versions].sort((a, b) => betaNumberFromVersion(b) - betaNumberFromVersion(a))

if (new Set(versions).size !== versions.length) {
  errors.push('VERSION_HISTORY contiene versiones duplicadas')
}

if (versions.join('\n') !== sortedVersions.join('\n')) {
  errors.push('VERSION_HISTORY debe estar ordenado de beta mas reciente a beta mas antigua')
}

if (LATEST_VERSION !== VERSION_HISTORY[0]) {
  errors.push('LATEST_VERSION debe apuntar a VERSION_HISTORY[0]')
}

const released = releasedBetas()
const visibleVersions = new Set(versions)
const missingVersions = released
  .filter((release) => release.betaNumber >= VERSION_HISTORY_START_BETA)
  .filter((release) => !visibleVersions.has(release.version))
  .map((release) => release.tag)

if (missingVersions.length > 0) {
  errors.push(`/novedades no incluye releases publicadas: ${missingVersions.join(', ')}`)
}

const latestReleased = released.at(-1)
if (latestReleased && LATEST_VERSION?.version !== latestReleased.version) {
  errors.push(`La ultima novedad visible debe ser ${latestReleased.tag}, pero es ${LATEST_VERSION?.version ?? 'null'}`)
}

if (errors.length > 0) {
  for (const error of errors) console.error(`[verify:version-history] error: ${error}`)
  process.exit(1)
}

console.log('[verify:version-history] OK')
