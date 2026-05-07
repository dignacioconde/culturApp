import { useCallback, useState } from 'react'
import { supabase } from '../supabaseClient'
import {
  buildBackupJson,
  buildCsvFiles,
  buildExportSummary,
  hasImportErrors,
  validateCsvImport,
} from '../lib/portability/index.ts'

function portabilityError(message) {
  return { message }
}

function emptyInserted() {
  return { projects: 0, events: 0, incomes: 0, expenses: 0 }
}

export async function exportPortableData(client, userId) {
  if (!userId) return { data: null, error: portabilityError('Necesitas una sesión activa para exportar datos.') }

  try {
    const [projectsResult, eventsResult, incomesResult, expensesResult] = await Promise.all([
      client.from('projects').select('*').eq('user_id', userId).order('start_date', { ascending: true }),
      client.from('events').select('*').eq('user_id', userId).order('start_datetime', { ascending: true }),
      client.from('incomes').select('*').eq('user_id', userId).order('expected_date', { ascending: true }),
      client.from('expenses').select('*').eq('user_id', userId).order('expense_date', { ascending: true }),
    ])

    const firstError = [projectsResult, eventsResult, incomesResult, expensesResult].find((result) => result.error)?.error
    if (firstError) return { data: null, error: firstError }

    const entities = {
      projects: projectsResult.data ?? [],
      events: eventsResult.data ?? [],
      incomes: incomesResult.data ?? [],
      expenses: expensesResult.data ?? [],
    }

    return {
      data: {
        backupJson: buildBackupJson(entities),
        csvFiles: buildCsvFiles(entities),
        summary: buildExportSummary(entities),
      },
      error: null,
    }
  } catch (error) {
    return { data: null, error }
  }
}

export async function commitPortableImport(client, userId, preview) {
  if (!userId) return { data: null, error: portabilityError('Necesitas una sesión activa para importar datos.') }
  if (hasImportErrors(preview)) {
    return { data: { inserted: emptyInserted(), failures: [] }, error: portabilityError('Corrige los errores del CSV antes de importar.') }
  }

  const inserted = emptyInserted()
  const failures = []
  const projectIds = new Map()
  const eventIds = new Map()

  try {
    for (const project of preview.projects) {
      const { data, error } = await client
        .from('projects')
        .insert({ ...project.payload, user_id: userId })
        .select('id')
        .single()

      if (error) {
        failures.push({ row: project.row, entity: 'project', error })
      } else {
        inserted.projects += 1
        projectIds.set(project.key, data.id)
      }
    }

    for (const event of preview.events) {
      const projectId = event.project_key ? projectIds.get(event.project_key) : null
      if (event.project_key && !projectId) {
        failures.push({ row: event.row, entity: 'event', error: portabilityError('No se ha podido resolver el proyecto importado.') })
        continue
      }

      const { data, error } = await client
        .from('events')
        .insert({ ...event.payload, project_id: projectId, user_id: userId })
        .select('id')
        .single()

      if (error) {
        failures.push({ row: event.row, entity: 'event', error })
      } else {
        inserted.events += 1
        eventIds.set(event.key, data.id)
      }
    }

    for (const income of preview.incomes) {
      const projectId = income.link.type === 'project' ? projectIds.get(income.link.key) : null
      const eventId = income.link.type === 'event' ? eventIds.get(income.link.key) : null
      if ((income.link.type === 'project' && !projectId) || (income.link.type === 'event' && !eventId)) {
        failures.push({ row: income.row, entity: 'income', error: portabilityError('No se ha podido resolver el vínculo importado.') })
        continue
      }

      const { error } = await client
        .from('incomes')
        .insert({ ...income.payload, project_id: projectId, event_id: eventId, user_id: userId })

      if (error) failures.push({ row: income.row, entity: 'income', error })
      else inserted.incomes += 1
    }

    for (const expense of preview.expenses) {
      const projectId = expense.link.type === 'project' ? projectIds.get(expense.link.key) : null
      const eventId = expense.link.type === 'event' ? eventIds.get(expense.link.key) : null
      if ((expense.link.type === 'project' && !projectId) || (expense.link.type === 'event' && !eventId)) {
        failures.push({ row: expense.row, entity: 'expense', error: portabilityError('No se ha podido resolver el vínculo importado.') })
        continue
      }

      const { error } = await client
        .from('expenses')
        .insert({ ...expense.payload, project_id: projectId, event_id: eventId, user_id: userId })

      if (error) failures.push({ row: expense.row, entity: 'expense', error })
      else inserted.expenses += 1
    }

    return {
      data: { inserted, failures },
      error: failures.length > 0 ? portabilityError('La importación terminó con errores en algunas filas.') : null,
    }
  } catch (error) {
    return { data: { inserted, failures }, error }
  }
}

export function useDataPortability(userId) {
  const [exporting, setExporting] = useState(false)
  const [importing, setImporting] = useState(false)
  const loading = exporting || importing

  const exportData = useCallback(async () => {
    setExporting(true)
    try {
      return await exportPortableData(supabase, userId)
    } finally {
      setExporting(false)
    }
  }, [userId])

  const validateImportFile = useCallback(async (file) => {
    if (!file) return { preview: null, error: portabilityError('Selecciona un archivo CSV.') }
    if (file.size > 1024 * 1024) {
      return { preview: null, error: portabilityError('El archivo supera el límite de 1 MB.') }
    }

    try {
      const text = await file.text()
      return validateCsvImport(text, { fileSize: file.size })
    } catch (error) {
      return { preview: null, error }
    }
  }, [])

  const commitImport = useCallback(async (preview) => {
    setImporting(true)
    try {
      return await commitPortableImport(supabase, userId, preview)
    } finally {
      setImporting(false)
    }
  }, [userId])

  return { loading, exporting, importing, exportData, validateImportFile, commitImport }
}
