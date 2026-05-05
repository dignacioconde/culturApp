import { z } from 'zod'

const dateString = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/))
const issueRef = z.string().regex(/^CACH-(B)?\d{4}$/)
const adrRef = z.string().regex(/^ADR-\d{4}$/)
const nullableRelease = z.union([z.string().min(1), z.null()]).default(null)

const baseFrontmatter = z.object({
  id: z.string().min(1),
  status: z.string().min(1),
  created: dateString.optional(),
  updated: dateString.optional(),
  created_at: dateString.optional(),
  updated_at: dateString.optional(),
  aliases: z.array(z.string()).optional(),
  tags: z.array(z.string()).optional(),
}).passthrough()

export const IssueFrontmatter = baseFrontmatter.extend({
  id: issueRef,
  title: z.string().min(1).max(120),
  type: z.enum(['bug', 'feature', 'chore', 'spike', 'doc']),
  status: z.enum(['inbox', 'backlog', 'ready', 'in-progress', 'review', 'done', 'blocked', 'wontfix']),
  cycle: z.enum(['beta-1', 'beta-2', 'rc', 'ga', 'unassigned']),
  release: nullableRelease,
  priority: z.enum(['p0', 'p1', 'p2', 'p3']),
  estimate: z.enum(['xs', 's', 'm', 'l']),
  area: z.enum(['frontend', 'backend', 'db', 'docs', 'infra', 'brain']),
  created_at: dateString,
  updated_at: dateString,
  closes: z.array(issueRef).optional(),
  related: z.array(issueRef).optional(),
  adr: z.array(adrRef).optional(),
})

export const AdrFrontmatter = baseFrontmatter.extend({
  id: adrRef,
  type: z.literal('decision'),
  status: z.enum(['Proposed', 'Accepted', 'Superseded']),
})

export const ReleaseFrontmatter = baseFrontmatter.extend({
  id: z.string().regex(/^(RELEASE-[0-9]+\.[0-9]+\.[0-9]+(-[a-z]+\.[0-9]+)?|PB-CURRENT-RELEASE|RELEASE-TEMPLATE)$/),
  type: z.enum(['release', 'release-status']),
})

export const FeedbackFrontmatter = baseFrontmatter.extend({
  id: z.string().min(1),
  type: z.literal('feedback'),
  source: z.enum(['widget', 'email', 'telegram', 'other']).optional(),
  severity: z.enum(['low', 'medium', 'high']).optional(),
  area: z.string().optional(),
  linked_issue: issueRef.nullable().optional(),
})

export const GenericFrontmatter = baseFrontmatter

export function schemaForPath(relPath) {
  if (relPath.startsWith('templates/')) return null
  if (relPath.startsWith('issues/') && relPath !== 'issues/README.md') return IssueFrontmatter
  if (relPath.startsWith('decisions/') && relPath !== 'decisions/README.md') return AdrFrontmatter
  if (
    relPath.startsWith('releases/') &&
    relPath !== 'releases/README.md' &&
    relPath !== 'releases/RELEASE_TEMPLATE.md'
  ) return ReleaseFrontmatter
  if (relPath === 'releases/RELEASE_TEMPLATE.md') return null
  if (relPath.startsWith('feedback/') && relPath !== 'feedback/.gitkeep') return FeedbackFrontmatter
  return GenericFrontmatter
}
