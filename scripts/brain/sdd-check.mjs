#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, hasSection, readAllDocs, readDoc, sectionContent } from './lib.mjs'
import { IssueFrontmatter } from './schema.mjs'

const args = process.argv.slice(2)
const issueId = args.find((arg) => !arg.startsWith('--'))
const jsonOutput = args.includes('--json')
const errors = []
const warnings = []
const executableWorkflows = new Set(['ready', 'in_progress', 'review'])
const structuralPlaceholderPattern = /\b(tbd|pendiente|por definir|placeholder)\b|\.{3}|<[^>]+>|Que debe quedar|Que esta incluido|Que comandos o checks|Criterio observable y verificable|Solo si aplica: obligatorio|Checks esperados/i
const genericCriterionPattern = /^(funciona correctamente|se mejora|mejora general|implementar|hacer|actualizar|validar)$/i
const riskyAreas = new Set(['data', 'infra', 'security'])
const technicalPlanComponents = new Set(['finance', 'supabase', 'auth-onboarding'])
const advancedSddComponents = new Set(['finance', 'supabase', 'auth-onboarding', 'calendar'])
const rollbackComponents = new Set(['finance', 'supabase', 'auth-onboarding'])

function fail(message) {
  errors.push(message)
}

function warn(message) {
  warnings.push(message)
}

function meaningful(text) {
  return Boolean(text && !structuralPlaceholderPattern.test(text))
}

function checklistItems(text) {
  return text
    .split('\n')
    .filter((line) => /^\s*-\s+\[[ xX]\]/.test(line))
    .map((line) => line.replace(/^\s*-\s+\[[ xX]\]\s*/, '').trim())
}

function acceptanceId(item) {
  return item.match(/\bAC\d+\b/i)?.[0]?.toUpperCase() ?? null
}

function requiresTechnicalPlan(data) {
  return (
    data.size === 'm' ||
    riskyAreas.has(data.area) ||
    data.components.some((component) => technicalPlanComponents.has(component)) ||
    data.components.length > 1
  )
}

function requiresAdvancedSdd(data) {
  return (
    data.size === 'm' ||
    riskyAreas.has(data.area) ||
    data.components.some((component) => advancedSddComponents.has(component)) ||
    data.components.length > 1
  )
}

function requiresRollbackPlan(data) {
  return (
    riskyAreas.has(data.area) ||
    data.components.some((component) => rollbackComponents.has(component))
  )
}

function explicitScope(scope) {
  return /\bIncluido\b/i.test(scope) && /Fuera de alcance/i.test(scope)
}

function validationMentionsAllCriteria(validation, ids) {
  const normalized = validation.toUpperCase()
  return ids.every((id) => normalized.includes(id))
}

function validationMapsAllCriteria(validation, ids) {
  const lines = validation
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)

  return ids.every((id) => lines.some((line) => new RegExp(`\\b${id}\\b`, 'i').test(line)))
}

function hasScenarioShape(scenarios) {
  return scenarios
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .some((line) => (
      /\b(cuando|when|given|dado)\b/i.test(line) &&
      /\b(entonces|then)\b/i.test(line)
    ))
}

function validateIssueLinks(data) {
  if (!data.parent) return
  const docs = readAllDocs()
  const parent = docs.find((item) => item.frontmatter?.id === data.parent)
  if (!parent) fail(`parent inexistente: ${data.parent}`)
  else if (parent.frontmatter.work_level !== 'initiative') fail(`parent ${data.parent} debe ser initiative`)
}

if (!issueId) {
  fail('Uso: npm run pb:sdd-check -- CACH-XXXX')
} else {
  const path = join(brainRoot, 'issues', `${issueId}.md`)
  if (!existsSync(path)) {
    fail(`No existe docs/project/issues/${issueId}.md`)
  } else {
    const doc = readDoc(path)
    const parsed = IssueFrontmatter.safeParse(doc.frontmatter ?? {})
    if (!parsed.success) {
      for (const issue of parsed.error.issues) fail(`frontmatter ${issue.path.join('.') || '(root)'}: ${issue.message}`)
    } else {
      const data = parsed.data
      if (!executableWorkflows.has(data.issue_workflow)) {
        warn(`issue_workflow ${data.issue_workflow} no requiere SDD ejecutable`)
      } else {
        if (data.work_level === 'initiative') fail('work_level initiative no es ejecutable; crea una slice hija')
        if (!hasSection(doc.content, ['Objetivo', 'Summary', 'Problem'])) fail('Falta seccion de objetivo/problema')
        if (!hasSection(doc.content, ['Alcance', 'Scope', 'Proposed Solution'])) fail('Falta seccion de alcance')
        if (!hasSection(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria'])) fail('Falta criterios de aceptacion')

        const scope = sectionContent(doc.content, ['Alcance', 'Scope', 'Proposed Solution'])
        if (!meaningful(scope) || !explicitScope(scope)) {
          fail('Alcance debe separar explicitamente Incluido y Fuera de alcance')
        }

        const criteria = sectionContent(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria'])
        const items = checklistItems(criteria)
        if (items.length === 0) fail('Los criterios deben ser checklist')

        const ids = []
        for (const item of items) {
          const id = acceptanceId(item)
          if (!id) fail(`Criterio sin identificador ACn: ${item || '(vacio)'}`)
          else ids.push(id)
          if (!meaningful(item) || genericCriterionPattern.test(item)) {
            fail(`Criterio de aceptacion demasiado generico o placeholder: ${item || '(vacio)'}`)
          }
        }

        const duplicateIds = ids.filter((id, index) => ids.indexOf(id) !== index)
        for (const id of [...new Set(duplicateIds)]) fail(`Identificador de criterio duplicado: ${id}`)

        const validation = sectionContent(doc.content, ['Validacion', 'Validación'])
        if (!meaningful(validation) || /pendiente hasta cerrar/i.test(validation)) {
          fail('Validacion debe indicar checks esperados antes de ejecutar')
        } else if (ids.length > 0 && !validationMentionsAllCriteria(validation, ids)) {
          fail(`Validacion debe mencionar cada criterio: ${ids.join(', ')}`)
        }

        if (requiresTechnicalPlan(data)) {
          const plan = sectionContent(doc.content, ['Plan tecnico', 'Plan técnico', 'Technical Plan', 'Implementation Plan'])
          if (!meaningful(plan)) fail('Plan tecnico requerido para size m, area/componente de riesgo o trabajo multi-componente')
        }

        if (requiresAdvancedSdd(data)) {
          const scenarios = sectionContent(doc.content, ['Escenarios SDD', 'Escenarios', 'Scenarios'])
          if (!meaningful(scenarios) || !hasScenarioShape(scenarios)) {
            fail('SDD Nivel 2 requiere Escenarios SDD con al menos un Cuando/Entonces o Given/When/Then')
          }

          const contract = sectionContent(doc.content, ['Contrato tecnico', 'Contrato técnico', 'Contrato', 'Technical Contract'])
          if (!meaningful(contract)) {
            fail('SDD Nivel 2 requiere Contrato tecnico con contratos, modulos, datos, scripts o estados afectados')
          }

          if (ids.length > 0 && !validationMapsAllCriteria(validation, ids)) {
            fail(`SDD Nivel 2 requiere matriz ACn -> validacion para: ${ids.join(', ')}`)
          }
        }

        if (requiresRollbackPlan(data)) {
          const rollback = sectionContent(doc.content, ['Riesgos y rollback', 'Riesgos', 'Rollback'])
          if (!meaningful(rollback)) {
            fail('SDD Nivel 2 requiere Riesgos y rollback para datos, seguridad, infra, finanzas, Supabase o auth')
          }
        }

        validateIssueLinks(data)
      }
    }
  }
}

const ok = errors.length === 0
if (jsonOutput) {
  console.log(JSON.stringify({ ok, issue: issueId ?? null, errors, warnings }, null, 2))
} else if (ok) {
  const suffix = warnings.length ? ` (${warnings.join('; ')})` : ''
  console.log(`[pb:sdd-check] OK: ${issueId}${suffix}`)
} else {
  for (const warning of warnings) console.warn(`[pb:sdd-check] warning: ${warning}`)
  for (const error of errors) console.error(`[pb:sdd-check] error: ${error}`)
}

process.exitCode = ok ? 0 : 1
