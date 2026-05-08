import { z } from 'zod'
import {
  AREAS,
  COMPONENTS,
  ISSUE_WORKFLOWS,
  PRIORITIES,
  SIZES,
  THEMES,
  WORK_LEVELS,
  WORK_TYPES,
} from './lib.mjs'

const dateString = z.preprocess((value) => {
  if (value instanceof Date) return value.toISOString().slice(0, 10)
  return value
}, z.string().regex(/^\d{4}-\d{2}-\d{2}$/))

export const issueRef = z.string().regex(/^CACH-(?:B)?\d{4}$/)
export const adrRef = z.string().regex(/^ADR-\d{4}$/)
export const releaseRef = z.string().regex(/^RELEASE-[0-9]+\.[0-9]+\.[0-9]+(?:-[a-z]+\.[0-9]+)?$/)
export const nullableIssueRef = z.union([issueRef, z.null()])
export const nullableRelease = z.union([releaseRef, z.null()])
export const nullableTheme = z.union([z.enum(THEMES), z.null()])

export const BaseFrontmatter = z.object({
  schema_version: z.literal(2),
  kind: z.string().min(1),
  id: z.string().min(1),
  title: z.string().min(1).max(160),
  lifecycle: z.enum(['active', 'draft', 'historical', 'deprecated', 'archived']),
  created: dateString,
  updated: dateString,
  aliases: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  generated: z.boolean(),
}).passthrough()

export const IssueFrontmatter = BaseFrontmatter.extend({
  kind: z.literal('issue'),
  id: issueRef,
  work_type: z.enum(WORK_TYPES),
  work_level: z.enum(WORK_LEVELS),
  issue_workflow: z.enum(ISSUE_WORKFLOWS),
  priority: z.enum(PRIORITIES),
  size: z.enum(SIZES),
  area: z.enum(AREAS),
  components: z.array(z.enum(COMPONENTS)).min(1),
  parent: nullableIssueRef,
  related: z.array(issueRef).default([]),
  depends_on: z.array(issueRef).default([]),
  blocked_by: z.array(issueRef).default([]),
  adr: z.array(adrRef).default([]),
  release: nullableRelease,
  theme: nullableTheme,
})

export const DecisionFrontmatter = BaseFrontmatter.extend({
  kind: z.literal('decision'),
  id: adrRef,
  decision_status: z.enum(['Proposed', 'Accepted', 'Superseded']),
})

export const ReleaseFrontmatter = BaseFrontmatter.extend({
  kind: z.literal('release'),
  id: releaseRef,
  release_phase: z.enum(['draft', 'active', 'released', 'deprecated', 'archived']),
  release_current: z.boolean(),
  release_branch: z.union([z.string().min(1), z.null()]),
  release_tag: z.union([z.string().min(1), z.null()]),
  release_pr: z.union([z.string().min(1), z.null()]).default(null),
})

export const ReleaseStatusFrontmatter = BaseFrontmatter.extend({
  kind: z.literal('release_status'),
  id: z.literal('PB-CURRENT-RELEASE'),
  release_current: z.boolean(),
})

export const FeedbackFrontmatter = BaseFrontmatter.extend({
  kind: z.literal('feedback'),
  feedback_source: z.enum(['widget', 'email', 'telegram', 'other']).optional(),
  feedback_severity: z.enum(['low', 'medium', 'high']).optional(),
  area: z.string().optional(),
  linked_issue: nullableIssueRef.optional(),
})

export const CaptureFrontmatter = BaseFrontmatter.extend({
  kind: z.enum(['inbox', 'knowledge', 'context']),
  capture_intent: z.enum(['inbox', 'idea', 'issue', 'decision', 'context']).optional(),
})

export const GenericFrontmatter = BaseFrontmatter

export function schemaForPath(relPath) {
  if (relPath.startsWith('templates/')) return null
  if (relPath.startsWith('issues/') && relPath !== 'issues/README.md') return IssueFrontmatter
  if (relPath.startsWith('decisions/') && relPath !== 'decisions/README.md') return DecisionFrontmatter
  if (relPath === 'releases/CURRENT_RELEASE.md') return ReleaseStatusFrontmatter
  if (
    relPath.startsWith('releases/') &&
    relPath !== 'releases/README.md' &&
    relPath !== 'releases/RELEASE_TEMPLATE.md'
  ) return ReleaseFrontmatter
  if (relPath.startsWith('feedback/') && relPath !== 'feedback/.gitkeep') return FeedbackFrontmatter
  if (relPath.startsWith('inbox/') && relPath !== 'inbox/README.md') return CaptureFrontmatter
  return GenericFrontmatter
}
