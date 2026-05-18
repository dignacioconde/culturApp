#!/usr/bin/env node
import { readAllDocs, normalizeTarget, sectionContent, stripWikilinks, wikilinkTargets } from './lib.mjs'

const args = process.argv.slice(2)

const profiles = {
  planning: {
    kinds: new Set(['digest', 'index', 'issue', 'plan', 'decision', 'process', 'context', 'knowledge']),
    boosts: { digest: 18, index: 14, issue: 10, plan: 10, decision: 8, process: 7, context: 6, knowledge: 4 },
  },
  implementation: {
    kinds: new Set(['issue', 'decision', 'process', 'context', 'knowledge', 'index']),
    boosts: { issue: 18, decision: 12, process: 10, knowledge: 8, context: 6, index: 4 },
  },
  review: {
    kinds: new Set(['issue', 'decision', 'process', 'context', 'knowledge', 'index']),
    boosts: { issue: 16, process: 12, decision: 10, knowledge: 6, context: 6, index: 4 },
  },
  docs: {
    kinds: new Set(['process', 'decision', 'knowledge', 'context', 'index', 'digest', 'prompt']),
    boosts: { process: 16, decision: 12, knowledge: 10, context: 8, index: 6, digest: 4, prompt: 3 },
  },
  release: {
    kinds: new Set(['release_status', 'release', 'issue', 'process', 'decision', 'index', 'digest']),
    boosts: { release_status: 20, release: 18, issue: 10, process: 8, decision: 6, index: 5, digest: 5 },
  },
}

const stopTokens = new Set([
  'active',
  'actual',
  'brain',
  'cach',
  'como',
  'con',
  'del',
  'docs',
  'issue',
  'issues',
  'las',
  'los',
  'para',
  'por',
  'product',
  'product-brain',
  'project',
  'que',
  'sin',
  'una',
])

function valueFor(name, fallback = null) {
  const inline = args.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = args.indexOf(name)
  return index >= 0 ? args[index + 1] : fallback
}

function normalizeText(value) {
  return String(value ?? '')
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
}

function tokensFor(value) {
  return [...new Set(normalizeText(value).match(/[a-z0-9][a-z0-9_-]{2,}/g) ?? [])]
    .filter((token) => !stopTokens.has(token))
}

function docKey(doc) {
  return doc.rel.replace(/\.md$/, '')
}

function titleOf(doc) {
  return doc.frontmatter?.title ?? doc.basename
}

function metadataText(doc) {
  const data = doc.frontmatter ?? {}
  return [
    doc.rel,
    doc.key,
    data.id,
    data.title,
    data.kind,
    data.lifecycle,
    data.issue_workflow,
    data.work_type,
    data.work_level,
    data.area,
    data.theme,
    ...(data.aliases ?? []),
    ...(data.tags ?? []),
    ...(data.components ?? []),
  ].filter(Boolean).join(' ')
}

function searchableText(doc) {
  if (doc.frontmatter?.index_policy === 'index_metadata_only') return metadataText(doc)
  return `${metadataText(doc)}\n${stripWikilinks(doc.body)}`
}

function issueQueryText(issueDoc) {
  if (!issueDoc) return ''
  return [
    metadataText(issueDoc),
    sectionContent(issueDoc.content, ['Objetivo', 'Summary', 'Problem']),
    sectionContent(issueDoc.content, ['Alcance', 'Scope', 'Proposed Solution']),
    sectionContent(issueDoc.content, ['Plan tecnico', 'Plan técnico', 'Technical Plan', 'Implementation Plan']),
  ].join('\n')
}

function addIssueRefs(issueDoc, docsById, docsByKey, references) {
  if (!issueDoc) return
  const data = issueDoc.frontmatter ?? {}
  references.set(docKey(issueDoc), 'issue solicitada')

  for (const id of [data.parent, data.release, ...(data.adr ?? []), ...(data.related ?? []), ...(data.depends_on ?? []), ...(data.blocked_by ?? [])]) {
    if (!id) continue
    const doc = docsById.get(id)
    if (doc) references.set(docKey(doc), `referencia directa desde ${data.id}`)
  }

  for (const rawTarget of wikilinkTargets(issueDoc.content)) {
    const normalized = normalizeTarget(issueDoc.rel, rawTarget)
    const doc = normalized ? docsByKey.get(normalized) : null
    if (doc) references.set(docKey(doc), `wikilink desde ${data.id}`)
  }
}

function isExcludedByPolicy(doc, profile, references) {
  const data = doc.frontmatter
  if (!data) return { excluded: true, reason: 'sin frontmatter' }
  if (doc.rel.startsWith('templates/')) return { excluded: true, reason: 'template' }
  if (data.index_policy === 'no_index') return { excluded: true, reason: 'index_policy no_index' }

  const referenced = references.has(docKey(doc))
  if (['historical', 'deprecated', 'archived'].includes(data.lifecycle) && !referenced) {
    return { excluded: true, reason: `lifecycle ${data.lifecycle}` }
  }
  if (data.load_policy === 'do_not_load_by_default' && !referenced) {
    return { excluded: true, reason: 'load_policy do_not_load_by_default' }
  }
  if (data.load_policy === 'on_reference' && !referenced) {
    return { excluded: true, reason: 'load_policy on_reference' }
  }
  if (data.load_policy === 'profile_only' && !profile.kinds.has(data.kind) && !referenced) {
    return { excluded: true, reason: 'fuera del perfil' }
  }
  if (data.kind === 'issue' && ['done', 'wont_fix'].includes(data.issue_workflow) && !referenced) {
    return { excluded: true, reason: `issue ${data.issue_workflow}` }
  }
  if (data.kind === 'release' && ['released', 'deprecated', 'archived'].includes(data.release_phase) && !referenced) {
    return { excluded: true, reason: `release ${data.release_phase}` }
  }
  if (data.kind === 'prompt' && data.lifecycle === 'historical' && !referenced) {
    return { excluded: true, reason: 'prompt historico' }
  }
  if (!profile.kinds.has(data.kind) && !referenced) {
    return { excluded: true, reason: 'kind fuera del perfil' }
  }

  return { excluded: false, reason: null }
}

function scoreDoc(doc, profileName, profile, queryTokens, normalizedQuery, references, requestedIssueId) {
  const data = doc.frontmatter ?? {}
  let score = 0
  const reasons = []
  const key = docKey(doc)
  const referenceReason = references.get(key)

  if (referenceReason) {
    const boost = data.id === requestedIssueId ? 120 : 70
    score += boost
    reasons.push(referenceReason)
  }

  const profileBoost = profile.boosts[data.kind] ?? 0
  if (profileBoost > 0) {
    score += profileBoost
    reasons.push(`perfil ${profileName}`)
  }

  const title = normalizeText(titleOf(doc))
  const id = normalizeText(data.id)
  const metadata = normalizeText(metadataText(doc))
  const body = normalizeText(searchableText(doc))
  let bodyMatches = 0

  for (const token of queryTokens) {
    if (id === token || id.includes(token)) {
      score += 18
      reasons.push(`id contiene ${token}`)
    }
    if (title.includes(token)) {
      score += 10
      reasons.push(`titulo contiene ${token}`)
    }
    if (metadata.includes(token)) {
      score += 5
      reasons.push(`metadata contiene ${token}`)
    }
    if (body.includes(token)) bodyMatches += 1
  }

  if (bodyMatches > 0) {
    score += Math.min(24, bodyMatches * 4)
    reasons.push(`contenido coincide (${bodyMatches})`)
  }

  if (normalizedQuery && body.includes(normalizedQuery)) {
    score += 14
    reasons.push('frase de busqueda')
  }

  if (data.generated) score -= 2
  if (data.index_policy === 'index_metadata_only') reasons.push('solo metadata')

  return { score, reasons: [...new Set(reasons)].slice(0, 5) }
}

const profileName = valueFor('--profile', 'planning')
const profile = profiles[profileName]
const query = valueFor('--query', '')
const issueId = valueFor('--issue')
const limit = Number(valueFor('--limit', '10'))
const jsonOutput = args.includes('--json')

if (!profile) {
  const message = `Perfil desconocido '${profileName}'. Usa: ${Object.keys(profiles).join(', ')}`
  if (jsonOutput) console.log(JSON.stringify({ ok: false, error: message }, null, 2))
  else console.error(`[pb:retrieve] error: ${message}`)
  process.exit(1)
}

const docs = readAllDocs()
const docsById = new Map(docs.filter((doc) => doc.frontmatter?.id).map((doc) => [doc.frontmatter.id, doc]))
const docsByKey = new Map(docs.map((doc) => [docKey(doc), doc]))
const requestedIssue = issueId ? docsById.get(issueId) : null
const references = new Map()
addIssueRefs(requestedIssue, docsById, docsByKey, references)

if (issueId && !requestedIssue) {
  const message = `No existe issue ${issueId}`
  if (jsonOutput) console.log(JSON.stringify({ ok: false, error: message }, null, 2))
  else console.error(`[pb:retrieve] error: ${message}`)
  process.exit(1)
}

const effectiveQuery = [query, issueQueryText(requestedIssue)].filter(Boolean).join('\n')
const queryTokens = tokensFor(effectiveQuery)
const normalizedQuery = normalizeText(query).trim()
const results = []
const excluded = []

for (const doc of docs) {
  const policy = isExcludedByPolicy(doc, profile, references)
  if (policy.excluded) {
    excluded.push({ rel: doc.rel, reason: policy.reason })
    continue
  }

  const { score, reasons } = scoreDoc(doc, profileName, profile, queryTokens, normalizedQuery, references, issueId)
  if (score <= 0) continue

  results.push({
    rel: doc.rel,
    id: doc.frontmatter.id,
    title: titleOf(doc),
    kind: doc.frontmatter.kind,
    score,
    reason: reasons.join('; '),
  })
}

results.sort((a, b) => b.score - a.score || a.rel.localeCompare(b.rel))
const topResults = results.slice(0, Number.isFinite(limit) && limit > 0 ? limit : 10)

if (jsonOutput) {
  console.log(JSON.stringify({
    ok: true,
    profile: profileName,
    query: query || null,
    issue: issueId ?? null,
    count: topResults.length,
    excluded_count: excluded.length,
    results: topResults,
  }, null, 2))
} else {
  console.log(`[pb:retrieve] profile=${profileName} issue=${issueId ?? '-'} query=${query || '-'}`)
  for (const item of topResults) {
    console.log(`${String(item.score).padStart(3)}  ${item.rel}  ${item.reason}`)
  }
}
