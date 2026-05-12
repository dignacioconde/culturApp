#!/usr/bin/env node
import { existsSync } from 'node:fs'
import { join } from 'node:path'
import { brainRoot, hasSection, readAllDocs, readDoc, sectionContent } from './lib.mjs'
import { IssueFrontmatter } from './schema.mjs'

const issueId = process.argv.slice(2).find((arg) => !arg.startsWith('--'))
const jsonOutput = process.argv.includes('--json')
const errors = []
const structuralPlaceholderPattern = /\b(tbd|todo|pendiente|por definir|placeholder)\b|\.{3}|<[^>]+>|Que debe quedar|Que esta incluido|Que comandos o checks|Criterio observable y verificable|Solo si aplica: obligatorio|Checks esperados/i
const genericCriterionPattern = /^(funciona correctamente|se mejora|mejora general|implementar|hacer|actualizar|validar)$/i
const riskyAreas = new Set(['data', 'infra', 'security'])
const technicalPlanComponents = new Set(['finance', 'supabase', 'auth-onboarding'])
const specificValidationComponents = new Set(['finance', 'supabase', 'calendar', 'design-system'])
const genericValidationCommands = ['npm run lint', 'npm run build', 'npm run pb:check', 'npm run pb:guard', 'git diff --check']

function fail(message) {
  errors.push(message)
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

function requiresTechnicalPlan(data) {
  return (
    data.size === 'm' ||
    riskyAreas.has(data.area) ||
    data.components.some((component) => technicalPlanComponents.has(component)) ||
    data.components.length > 1
  )
}

function requiresSpecificValidation(data) {
  return (
    ['data', 'infra', 'security'].includes(data.area) ||
    data.components.some((component) => specificValidationComponents.has(component))
  )
}

function hasSpecificValidation(data, validation) {
  const lines = validation
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .filter((line) => {
      const normalized = line.replace(/^-\s*/, '').replace(/`/g, '').replace(/[.;]$/, '').trim()
      return !genericValidationCommands.some((command) => normalized === command || normalized.startsWith(`${command} `))
    })

  if (data.components.some((component) => ['calendar', 'design-system'].includes(component))) {
    return lines.some((line) => /browser|manual|responsive|visual|playwright|viewport|smoke|captura|navegador/i.test(line))
  }

  return lines.some((line) => !structuralPlaceholderPattern.test(line))
}

if (!issueId) {
  fail('Uso: npm run pb:ready-check -- CACH-XXXX')
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
      if (data.issue_workflow !== 'ready') fail(`issue_workflow debe ser ready; actual: ${data.issue_workflow}`)
      if (data.work_level === 'initiative') fail('work_level initiative no es ejecutable; crea una slice hija')
      if (!hasSection(doc.content, ['Objetivo', 'Summary', 'Problem'])) fail('Falta seccion de objetivo/problema')
      if (!hasSection(doc.content, ['Alcance', 'Scope', 'Proposed Solution'])) fail('Falta seccion de alcance')
      if (!hasSection(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria'])) fail('Falta criterios de aceptacion')
      const criteria = sectionContent(doc.content, ['Criterios de aceptacion', 'Criterios de aceptación', 'Acceptance Criteria'])
      const items = checklistItems(criteria)
      if (items.length === 0) fail('Los criterios deben ser checklist')
      for (const item of items) {
        if (!meaningful(item) || genericCriterionPattern.test(item)) fail(`Criterio de aceptacion demasiado generico o placeholder: ${item || '(vacio)'}`)
      }
      const validation = sectionContent(doc.content, ['Validacion', 'Validación'])
      if (!meaningful(validation) || /pendiente hasta cerrar/i.test(validation)) fail('Validacion debe indicar checks esperados antes de ejecutar')
      if (requiresTechnicalPlan(data)) {
        const plan = sectionContent(doc.content, ['Plan tecnico', 'Plan técnico', 'Technical Plan', 'Implementation Plan'])
        if (!meaningful(plan)) fail('Plan tecnico requerido para size m, area/componente de riesgo o trabajo multi-componente')
      }
      if (requiresSpecificValidation(data) && !hasSpecificValidation(data, validation)) {
        fail('Validacion debe incluir checks especificos del dominio, no solo lint/build/pb:check')
      }
      if (data.components.length === 0) fail('components no puede estar vacio')
      if (data.parent) {
        const docs = readAllDocs()
        const parent = docs.find((item) => item.frontmatter?.id === data.parent)
        if (!parent) fail(`parent inexistente: ${data.parent}`)
        else if (parent.frontmatter.work_level !== 'initiative') fail(`parent ${data.parent} debe ser initiative`)
      }
    }
  }
}

const ok = errors.length === 0
if (jsonOutput) {
  console.log(JSON.stringify({ ok, issue: issueId ?? null, errors }, null, 2))
} else if (ok) {
  console.log(`[pb:ready-check] OK: ${issueId} esta lista para ejecucion`)
} else {
  for (const error of errors) console.error(`[pb:ready-check] error: ${error}`)
}
process.exitCode = ok ? 0 : 1
