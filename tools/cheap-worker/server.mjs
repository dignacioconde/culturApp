#!/usr/bin/env node
// MCP `cheap-worker`: delega tareas de docs/tasks/ en modelos baratos (opencode run)
// dentro de worktrees aislados. Nunca hace merge. Ver docs/orchestration.md.
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { delegateTask, listModels, usageReport } from './worker.mjs'

const asText = (value) => ({ content: [{ type: 'text', text: JSON.stringify(value, null, 2) }] })
const asError = (error) => ({ isError: true, content: [{ type: 'text', text: error.message }] })

const server = new McpServer({ name: 'cheap-worker', version: '1.0.0' })

server.registerTool(
  'list_models',
  {
    title: 'Listar modelos obreros',
    description: 'Modelos de config/models.yaml: alias, id de OpenCode, posición en la cadena de fallback, disponibilidad (clave en .env / Ollama), coste aproximado y usos recomendados.',
    inputSchema: {},
  },
  async () => asText(await listModels()),
)

server.registerTool(
  'delegate_task',
  {
    title: 'Delegar tarea a un obrero',
    description: 'Ejecuta una tarea docs/tasks/T-xxx-*.md con un modelo barato en el worktree .worktrees/T-xxx-<alias> (rama worker/T-xxx-<alias>). Ejecuta el comando de verificación de la tarea, reintenta con el error y hace fallback por la cadena. Si pasa, commitea en la rama worker; nunca hace merge. Devuelve rama, diff, intentos, modelo usado y coste.',
    inputSchema: {
      task_file: z.string().describe('Ruta relativa a la raíz del repo, p. ej. "docs/tasks/T-004-tests-formatters.md".'),
      model: z.string().optional().describe('Alias de list_models para el primer intento. Por defecto, recommended_model de la tarea o el inicio de la cadena.'),
      no_fallback: z.boolean().optional().describe('Si es true, usa solo `model`, sin cadena de fallback.'),
      max_retries: z.number().int().min(0).max(5).optional().describe('Reintentos extra por modelo cuando falla la verificación.'),
      timeout_s: z.number().int().positive().max(3600).optional().describe('Timeout por intento del obrero, en segundos.'),
      budget_s: z.number().int().positive().max(3500).optional().describe('Tiempo total máximo de la delegación, en segundos.'),
      base: z.string().regex(/^[^-\s][^\s]*$/).optional().describe('Ref de la que parte el worktree (por defecto, HEAD).'),
    },
  },
  async ({ task_file, model, no_fallback, max_retries, timeout_s, budget_s, base }) => {
    try {
      return asText(await delegateTask({ taskFile: task_file, model, noFallback: no_fallback, maxRetries: max_retries, timeoutS: timeout_s, budgetS: budget_s, base }))
    } catch (error) {
      return asError(error)
    }
  },
)

server.registerTool(
  'usage_report',
  {
    title: 'Informe de consumo',
    description: 'Resumen de logs/worker.jsonl por modelo: intentos, éxitos, fallos, tokens (entrada, salida, razonamiento, caché) y coste real en USD registrado por OpenCode.',
    inputSchema: {
      days: z.number().positive().optional().describe('Solo los últimos N días. Por defecto, todo el histórico.'),
    },
  },
  async ({ days }) => asText(await usageReport({ days })),
)

await server.connect(new StdioServerTransport())
