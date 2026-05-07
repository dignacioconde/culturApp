import { useMemo, useState } from 'react'
import { AlertCircle, CheckCircle2, Download, FileJson, FileSpreadsheet, Upload } from 'lucide-react'
import { PageWrapper } from '../../components/layout/PageWrapper'
import { Card } from '../../components/ui/Card'
import { Button } from '../../components/ui/Button'
import { useToast, ToastContainer } from '../../components/ui/Toast'
import { useAuth } from '../../hooks/useAuth'
import { useDataPortability } from '../../hooks/useDataPortability'

const MAX_FILE_SIZE_BYTES = 1024 * 1024
const MAX_ROWS = 500
const importTemplateHeaders = [
  'entity',
  'project_key',
  'event_key',
  'concept',
  'name',
  'client',
  'category',
  'status',
  'start_date',
  'end_date',
  'start_datetime',
  'end_datetime',
  'amount',
  'tax_rate',
  'expected_date',
  'paid_date',
  'is_paid',
  'expense_date',
  'is_deductible',
  'color',
  'notes',
]

const exportActions = [
  {
    key: 'json',
    label: 'Descargar copia JSON',
    description: 'Copia completa para guardar fuera de Cachés.',
    icon: FileJson,
    source: 'backupJson',
    filename: 'caches-datos',
    extension: 'json',
    mimeType: 'application/json',
  },
  {
    key: 'csv',
    label: 'Descargar CSV',
    description: 'Copia para revisar en una hoja de cálculo. No es la plantilla de importación.',
    icon: FileSpreadsheet,
    source: 'csvFiles',
    filename: 'caches-datos',
    extension: 'csv',
    mimeType: 'text/csv;charset=utf-8',
  },
  {
    key: 'template',
    label: 'Descargar plantilla CSV',
    description: 'Archivo base para crear filas nuevas desde una importación.',
    icon: Download,
    source: 'template',
    filename: 'caches-plantilla-csv',
    extension: 'csv',
    mimeType: 'text/csv;charset=utf-8',
  },
]

function getPrivacySafeFilename(action) {
  const date = new Date().toISOString().slice(0, 10)
  return `${action.filename}-${date}.${action.extension}`
}

function buildDownloadBlob(result, action) {
  const payload = result?.blob ?? result?.content ?? result?.data ?? result
  const mimeType = result?.mimeType ?? result?.contentType ?? action.mimeType

  if (payload instanceof Blob) {
    return payload
  }

  if (payload instanceof ArrayBuffer) {
    return new Blob([payload], { type: mimeType })
  }

  if (typeof payload === 'string') {
    return new Blob([payload], { type: mimeType })
  }

  return new Blob([JSON.stringify(payload ?? {}, null, 2)], { type: mimeType })
}

function buildImportTemplateCsv() {
  const exampleRows = [
    {
      entity: 'project',
      project_key: 'proyecto-1',
      name: 'Proyecto de ejemplo',
      category: 'otros',
      status: 'draft',
      start_date: '2026-05-01',
      end_date: '2026-05-31',
      color: '#4f98a3',
      notes: 'Fila de ejemplo: puedes eliminarla antes de importar.',
    },
    {
      entity: 'event',
      project_key: 'proyecto-1',
      event_key: 'evento-1',
      name: 'Evento de ejemplo',
      category: 'otros',
      status: 'draft',
      start_datetime: '2026-05-16 20:00',
      end_datetime: '2026-05-16 21:30',
      color: '#4f98a3',
    },
    {
      entity: 'income',
      event_key: 'evento-1',
      concept: 'Cache ejemplo',
      amount: '1200,00',
      tax_rate: '15',
      expected_date: '2026-05-30',
      is_paid: 'no',
    },
    {
      entity: 'expense',
      project_key: 'proyecto-1',
      concept: 'Gasto ejemplo',
      amount: '45,50',
      category: 'otros',
      expense_date: '2026-05-12',
      is_deductible: 'si',
    },
  ]
  const lines = [
    importTemplateHeaders.join(';'),
    ...exampleRows.map((row) => importTemplateHeaders.map((header) => row[header] ?? '').join(';')),
  ]
  return `${lines.join('\r\n')}\r\n`
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  link.remove()
  window.setTimeout(() => URL.revokeObjectURL(url), 0)
}

function getNumberFromPaths(source, paths, fallback = 0) {
  for (const path of paths) {
    const value = path.reduce((current, key) => current?.[key], source)
    if (Number.isFinite(value)) return value
    if (Array.isArray(value)) return value.length
  }
  return fallback
}

function getValidationSummary(validation) {
  const visibleErrors = getRowErrors(validation)
  const visibleErrorRows = new Set(visibleErrors.map((error) => error.row)).size
  const entitySummaryRows = Object.values(validation?.summary ?? {}).reduce(
    (total, value) => total + (Number.isFinite(value) ? value : 0),
    0,
  )
  const entityValidRows = ['projects', 'events', 'incomes', 'expenses'].reduce((total, key) => {
    const rows = validation?.[key]
    return total + (Array.isArray(rows) ? rows.length : 0)
  }, 0)
  const totalRows = getNumberFromPaths(validation, [
    ['totalRows'],
    ['rowCount'],
    ['summary', 'totalRows'],
    ['summary', 'rowCount'],
    ['counts', 'totalRows'],
  ])
  const validRows = getNumberFromPaths(validation, [
    ['validRows'],
    ['validRowCount'],
    ['summary', 'validRows'],
    ['summary', 'validRowCount'],
    ['counts', 'validRows'],
  ], entityValidRows)
  const errorRows = getNumberFromPaths(validation, [
    ['errorRows'],
    ['invalidRows'],
    ['invalidRowCount'],
    ['summary', 'errorRows'],
    ['summary', 'invalidRows'],
    ['counts', 'errorRows'],
  ], visibleErrorRows)

  return {
    totalRows: totalRows || entitySummaryRows || validRows + errorRows,
    validRows,
    errorRows: errorRows || Math.max(totalRows - validRows, 0),
  }
}

function getRowErrors(validation) {
  const rawErrors = validation?.rowErrors ?? validation?.errors ?? validation?.invalidRows ?? []
  if (!Array.isArray(rawErrors)) return []

  return rawErrors.map((error, index) => {
    if (typeof error === 'string') {
      return { row: index + 1, message: error }
    }

    return {
      row: error.row ?? error.rowNumber ?? error.line ?? index + 1,
      field: error.field ?? error.column ?? '',
      message: error.message ?? error.error ?? 'Fila no válida.',
    }
  })
}

function getImportResultState(result) {
  const inserted = result?.data?.inserted ?? result?.inserted
  const failures = result?.data?.failures ?? result?.failures ?? []
  const hasFailures = Array.isArray(failures) && failures.length > 0
  const hasError = Boolean(result?.error)
  if (inserted) {
    const total = Object.values(inserted).reduce((sum, value) => sum + (Number.isFinite(value) ? value : 0), 0)
    if (hasFailures || hasError) {
      return {
        tone: 'warning',
        title: 'Importación parcial',
        message: `${total} filas creadas. ${failures.length} filas fallaron durante el guardado no atómico.`,
        failures,
      }
    }
    if (total > 0) {
      return {
        tone: 'success',
        title: 'Importación completada',
        message: `${total} filas importadas correctamente.`,
        failures: [],
      }
    }
  }

  const created = getNumberFromPaths(result, [
    ['createdRows'],
    ['created'],
    ['insertedRows'],
    ['summary', 'createdRows'],
    ['summary', 'created'],
  ])

  if (hasFailures || hasError) {
    return {
      tone: 'warning',
      title: 'Importación parcial',
      message: `${created || 0} filas creadas. ${failures.length} filas fallaron durante el guardado no atómico.`,
      failures,
    }
  }

  return {
    tone: 'success',
    title: 'Importación completada',
    message: created ? `${created} filas importadas correctamente.` : 'Importación completada.',
    failures: [],
  }
}

function EmptyHookNotice({ visible }) {
  if (!visible) return null

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
      La interfaz ya está preparada, pero la integración de portabilidad todavía no está disponible en esta sesión.
    </div>
  )
}

export default function Data() {
  const { user } = useAuth()
  const { toasts, addToast, removeToast } = useToast()
  const portability = useDataPortability(user?.id) ?? {}
  const {
    loading = false,
    exporting = false,
    importing = false,
    exportData,
    validateImportFile,
    commitImport,
  } = portability
  const [selectedFile, setSelectedFile] = useState(null)
  const [fileError, setFileError] = useState('')
  const [validation, setValidation] = useState(null)
  const [validationError, setValidationError] = useState('')
  const [validating, setValidating] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [activeExport, setActiveExport] = useState('')

  const hookReady = Boolean(exportData && validateImportFile && commitImport)
  const summary = useMemo(() => getValidationSummary(validation), [validation])
  const rowErrors = useMemo(() => getRowErrors(validation), [validation])
  const canImport = Boolean(validation?.valid === true && summary.validRows > 0 && commitImport && !importing)

  const handleExport = async (action) => {
    if (action.source === 'template') {
      const blob = buildDownloadBlob(buildImportTemplateCsv(), action)
      downloadBlob(blob, getPrivacySafeFilename(action))
      addToast('Plantilla preparada.')
      return
    }

    if (!exportData) {
      addToast('La exportación todavía no está disponible.', 'error')
      return
    }

    setActiveExport(action.key)
    try {
      const result = await exportData()
      if (result?.error) throw result.error

      if (action.source === 'csvFiles') {
        Object.entries(result?.data?.csvFiles ?? {}).forEach(([key, file]) => {
          const csvAction = { ...action, filename: `caches-datos-${key}` }
          const blob = buildDownloadBlob(file?.content ?? '', csvAction)
          downloadBlob(blob, getPrivacySafeFilename(csvAction))
        })
      } else {
        const blob = buildDownloadBlob(result?.data?.[action.source] ?? result, action)
        downloadBlob(blob, getPrivacySafeFilename(action))
      }

      addToast('Descarga preparada.')
    } catch (error) {
      console.error(error)
      addToast('No hemos podido preparar la descarga.', 'error')
    } finally {
      setActiveExport('')
    }
  }

  const handleFileChange = (event) => {
    const file = event.target.files?.[0] ?? null
    setSelectedFile(file)
    setValidation(null)
    setValidationError('')
    setImportResult(null)

    if (!file) {
      setFileError('')
      return
    }

    if (file.size > MAX_FILE_SIZE_BYTES) {
      setFileError('El archivo supera el límite de 1MB.')
      return
    }

    if (!file.name.toLowerCase().endsWith('.csv')) {
      setFileError('Sube un archivo CSV básico, no un Excel directo.')
      return
    }

    setFileError('')
  }

  const handleValidate = async () => {
    if (!selectedFile || fileError) return
    if (!validateImportFile) {
      addToast('La validación de importación todavía no está disponible.', 'error')
      return
    }

    setValidating(true)
    setValidationError('')
    setValidation(null)
    setImportResult(null)

    try {
      const result = await validateImportFile(selectedFile)
      const preview = result?.preview ?? result
      const nextSummary = getValidationSummary(preview)
      if (nextSummary.totalRows > MAX_ROWS) {
        setValidationError('El CSV supera el límite de 500 filas.')
        return
      }
      setValidation(preview)
      if (result?.error) {
        setValidationError(result.error.message ?? 'El CSV contiene errores de validación.')
      } else {
        addToast('CSV validado. Revisa el resumen antes de importar.')
      }
    } catch (error) {
      console.error(error)
      setValidationError('No hemos podido validar el CSV. Revisa el formato y vuelve a intentarlo.')
    } finally {
      setValidating(false)
    }
  }

  const handleCommitImport = async () => {
    if (!canImport) return

    try {
      const result = await commitImport(validation)
      setImportResult(getImportResultState(result))
      if (result?.error) {
        addToast(result.error.message ?? 'La importación terminó con errores.', 'error')
      } else {
        addToast('Filas válidas importadas.')
      }
    } catch (error) {
      console.error(error)
      addToast('No hemos podido importar las filas válidas.', 'error')
    }
  }

  return (
    <PageWrapper title="Tus datos">
      <div className="flex max-w-5xl flex-col gap-6">
        <div>
          <p className="max-w-3xl text-sm text-[var(--color-ink-muted)]">
            Puedes llevarte una copia privada de tus datos. Para importar, usa la plantilla CSV: la importación crea filas nuevas y no restaura una copia exportada.
          </p>
        </div>

        <EmptyHookNotice visible={!hookReady} />

        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-ink)]">Exportar</h2>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                La descarga JSON sirve como copia completa fuera de Cachés. El CSV exportado está pensado para revisar tus datos en una hoja de cálculo; no se puede subir de vuelta como restauración.
              </p>
            </div>

            <div className="grid gap-3 md:grid-cols-3">
              {exportActions.map((action) => (
                <div key={action.key} className="flex min-w-0 flex-col gap-3 rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] p-4">
                  <div className="flex items-start gap-3">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[var(--color-paper-dark)] text-[var(--color-ink-muted)]">
                      <action.icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-[var(--color-ink)]">{action.label}</p>
                      <p className="mt-1 text-xs leading-5 text-[var(--color-ink-muted)]">{action.description}</p>
                    </div>
                  </div>
                  <Button
                    variant={action.key === 'json' ? 'primary' : 'secondary'}
                    onClick={() => handleExport(action)}
                    disabled={loading || exporting || (action.source !== 'template' && !exportData)}
                    className="w-full justify-center"
                  >
                    <Download size={16} />
                    {activeExport === action.key ? 'Preparando...' : action.label}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6">
          <div className="flex flex-col gap-5">
            <div>
              <h2 className="text-base font-semibold text-[var(--color-ink)]">Importar CSV</h2>
              <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                Sube un CSV preparado con la plantilla de Cachés. No se acepta Excel directo: exporta tu hoja como CSV antes de subirla. No se guarda nada hasta validar y confirmar.
              </p>
            </div>

            <div className="grid gap-3 text-sm text-[var(--color-ink-muted)] sm:grid-cols-2">
              <div className="rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] px-4 py-3">
                Límite de archivo: <span className="font-medium text-[var(--color-ink)]">1MB</span>
              </div>
              <div className="rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] px-4 py-3">
                Límite de filas: <span className="font-medium text-[var(--color-ink)]">500 filas</span>
              </div>
            </div>

            <div className="rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] px-4 py-3 text-sm text-[var(--color-ink-muted)]">
              <p className="font-medium text-[var(--color-ink)]">Formato esperado</p>
              <p className="mt-1">
                Usa punto y coma, fechas `YYYY-MM-DD`, eventos como `YYYY-MM-DD HH:mm`, importes con coma o punto decimal y claves locales `project_key` / `event_key`. El CSV no puede traer `id`, `user_id`, `created_at`, `project_id` ni `event_id`.
              </p>
              <p className="mt-1">
                Las filas se crean desde cero: no actualizan registros existentes y no son una restauración atómica.
                Si quieres partir de tus datos exportados, revísalos en hoja de cálculo y copia solo lo necesario a la plantilla.
              </p>
            </div>

            <div className="flex flex-col gap-3">
              <label htmlFor="data-import-file" className="text-sm font-medium text-[var(--color-ink)]">Archivo CSV</label>
              <div className="flex flex-col gap-3 rounded-lg border border-dashed border-[var(--color-paper-mid)] bg-[#FDFBF6] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-center gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-[var(--color-paper-dark)] text-[var(--color-ink-muted)]">
                    <Upload size={18} />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-[var(--color-ink)]">
                      {selectedFile?.name ?? 'Selecciona un CSV'}
                    </p>
                    <p className="text-xs text-[var(--color-ink-muted)]">
                      CSV básico, máximo 1MB y 500 filas.
                    </p>
                  </div>
                </div>
                <input
                  id="data-import-file"
                  type="file"
                  accept=".csv,text/csv"
                  onChange={handleFileChange}
                  className="block w-full text-sm text-[var(--color-ink-muted)] file:mr-3 file:min-h-10 file:rounded-lg file:border-0 file:bg-[var(--color-paper-dark)] file:px-3 file:text-sm file:font-medium file:text-[var(--color-ink)] hover:file:bg-[var(--color-paper-mid)] sm:w-auto"
                />
              </div>
              {fileError && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{fileError}</p>}
            </div>

            <div className="flex flex-col gap-2 sm:flex-row">
              <Button
                onClick={handleValidate}
                disabled={!selectedFile || Boolean(fileError) || validating || !validateImportFile}
                className="justify-center"
              >
                {validating ? 'Validando...' : 'Validar CSV'}
              </Button>
              <Button
                variant="secondary"
                onClick={handleCommitImport}
                disabled={!canImport}
                className="justify-center"
              >
                {importing ? 'Importando...' : 'Importar CSV validado'}
              </Button>
            </div>

            {validationError && (
              <div className="flex gap-3 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                <p>{validationError}</p>
              </div>
            )}

            {validation && (
              <div className="rounded-lg border border-[var(--color-paper-mid)] bg-[#FDFBF6] p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-[var(--color-ink)]">Vista previa de validación</h3>
                    <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
                      Revisa los errores antes de importar. No se guardará nada hasta que el CSV completo esté validado.
                    </p>
                  </div>
                  {validation.valid === true && summary.validRows > 0 && (
                    <div className="flex items-center gap-2 rounded-lg bg-[var(--color-green-light)] px-3 py-2 text-sm font-medium text-[var(--color-green)]">
                      <CheckCircle2 size={16} />
                      Lista para importar
                    </div>
                  )}
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  <div className="rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-[var(--color-ink-muted)]">Filas leídas</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--color-ink)]">{summary.totalRows}</p>
                  </div>
                  <div className="rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-[var(--color-ink-muted)]">Filas válidas</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--color-green)]">{summary.validRows}</p>
                  </div>
                  <div className="rounded-lg bg-white px-4 py-3">
                    <p className="text-xs text-[var(--color-ink-muted)]">Filas con errores</p>
                    <p className="mt-1 text-xl font-semibold text-[var(--color-red)]">{summary.errorRows}</p>
                  </div>
                </div>

                {rowErrors.length > 0 && (
                  <div className="mt-4 overflow-x-auto">
                    <table className="w-full min-w-[520px] text-left text-sm">
                      <thead className="text-xs uppercase text-[var(--color-ink-muted)]">
                        <tr>
                          <th className="pb-2 font-medium">Fila</th>
                          <th className="pb-2 font-medium">Campo</th>
                          <th className="pb-2 font-medium">Error</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[var(--color-paper-mid)]">
                        {rowErrors.slice(0, 20).map((error) => (
                          <tr key={`${error.row}-${error.field}-${error.message}`}>
                            <td className="py-2 pr-4 text-[var(--color-ink)]">{error.row}</td>
                            <td className="py-2 pr-4 text-[var(--color-ink-muted)]">{error.field || '-'}</td>
                            <td className="py-2 text-red-700">{error.message}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {rowErrors.length > 20 && (
                      <p className="mt-3 text-xs text-[var(--color-ink-muted)]">
                        Mostrando 20 de {rowErrors.length} errores. Corrige el CSV y vuelve a validarlo.
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            {importResult && (
              <div className={`flex gap-3 rounded-lg border px-4 py-3 text-sm ${
                importResult.tone === 'warning'
                  ? 'border-amber-200 bg-amber-50 text-amber-800'
                  : 'border-green-200 bg-green-50 text-green-700'
              }`}>
                {importResult.tone === 'warning'
                  ? <AlertCircle size={18} className="mt-0.5 shrink-0" />
                  : <CheckCircle2 size={18} className="mt-0.5 shrink-0" />}
                <div>
                  <p className="font-medium">{importResult.title}</p>
                  <p className="mt-1">{importResult.message}</p>
                  {importResult.failures.length > 0 && (
                    <p className="mt-1 text-xs">
                      Revisa las filas fallidas y repite la importación solo con las filas que falten.
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </Card>
      </div>
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </PageWrapper>
  )
}
