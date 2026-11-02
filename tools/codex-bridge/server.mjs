#!/usr/bin/env node
// MCP `codex`: expone Codex CLI (suscripción ChatGPT, login de la CLI) como
// herramientas de solo lectura. Ver ADR-001 y ADR-003 en docs/decisions.md.
import { mkdtemp, readFile, rm } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js'
import { z } from 'zod'
import { resolveRepoPath, runCommand, tail } from '../lib/run.mjs'

const CODEX_BIN = process.env.CODEX_BIN || 'codex'
const DEFAULT_TIMEOUT_S = 600
const MAX_TIMEOUT_S = 3600

// Fuerza el uso del login de la CLI (suscripción) en lugar de una API key heredada.
function codexEnv() {
  const env = { ...process.env, NO_COLOR: '1' }
  delete env.OPENAI_API_KEY
  delete env.CODEX_API_KEY
  return env
}

const timeoutMs = (timeoutS) => Math.min(timeoutS ?? DEFAULT_TIMEOUT_S, MAX_TIMEOUT_S) * 1000

function toolResult(result, text) {
  if (result.timedOut) {
    return { isError: true, content: [{ type: 'text', text: `Codex superó el timeout (${Math.round(result.durationMs / 1000)} s).\n\n${tail(result.stderr, 4000)}` }] }
  }
  if (result.code !== 0) {
    return { isError: true, content: [{ type: 'text', text: `Codex terminó con código ${result.code}.\n\n${tail(result.stderr || result.stdout, 8000)}` }] }
  }
  return { content: [{ type: 'text', text: text || '(Codex no devolvió texto)' }] }
}

async function codexExec({ prompt, cwd, model, timeoutS }) {
  const dir = await mkdtemp(path.join(tmpdir(), 'codex-bridge-'))
  const lastMessageFile = path.join(dir, 'last-message.txt')
  try {
    const args = ['exec', '--sandbox', 'read-only', '--ephemeral', '--color', 'never', '-C', cwd, '-o', lastMessageFile]
    if (model) args.push('-m', model)
    args.push('-')
    const result = await runCommand(CODEX_BIN, args, { cwd, env: codexEnv(), input: prompt, timeoutMs: timeoutMs(timeoutS) })
    const lastMessage = await readFile(lastMessageFile, 'utf8').catch(() => '')
    return toolResult(result, lastMessage.trim() || result.stdout.trim())
  } finally {
    await rm(dir, { recursive: true, force: true })
  }
}

const server = new McpServer({ name: 'codex', version: '1.0.0' })

// Evita que una ref empiece por "-" y se interprete como flag de codex/git.
const gitRef = z.string().regex(/^[^-\s][^\s]*$/, 'Ref de git no válida')

const common = {
  cwd: z.string().optional().describe('Directorio de trabajo relativo a la raíz del repo (p. ej. ".worktrees/T-004-deepseek"). Por defecto, la raíz.'),
  timeout_s: z.number().int().positive().max(MAX_TIMEOUT_S).optional().describe(`Timeout en segundos (por defecto ${DEFAULT_TIMEOUT_S}, máximo ${MAX_TIMEOUT_S}).`),
}

server.registerTool(
  'codex_ask',
  {
    title: 'Preguntar a Codex',
    description: 'Pregunta libre a Codex (segundo cerebro) con acceso de solo lectura al repo: revisión de planes, segundas opiniones sobre bugs, análisis. Nunca edita ficheros.',
    inputSchema: {
      prompt: z.string().min(1).describe('Instrucciones completas; incluye rutas de ficheros relevantes.'),
      model: z.string().optional().describe('Modelo de Codex; por defecto, el configurado en ~/.codex/config.toml.'),
      ...common,
    },
  },
  async ({ prompt, model, cwd, timeout_s }) => codexExec({ prompt, cwd: resolveRepoPath(cwd), model, timeoutS: timeout_s }),
)

server.registerTool(
  'codex_review',
  {
    title: 'Revisión de código con Codex',
    description: 'Revisión de código de solo lectura con Codex. Indica exactamente un objetivo: base (rama), commit (SHA) o uncommitted. Sin prompt usa `codex review` nativo; con prompt usa `codex exec` en solo lectura con esas instrucciones sobre el mismo diff.',
    inputSchema: {
      base: gitRef.optional().describe('Rama base: revisa los cambios de HEAD respecto a ella.'),
      commit: gitRef.optional().describe('SHA de un commit concreto.'),
      uncommitted: z.boolean().optional().describe('Revisa cambios staged, unstaged y untracked.'),
      prompt: z.string().optional().describe('Criterios de revisión adicionales (p. ej. "contra docs/tasks/T-004-*.md").'),
      ...common,
    },
  },
  async ({ base, commit, uncommitted, prompt, cwd, timeout_s }) => {
    const targets = [base && 'base', commit && 'commit', uncommitted && 'uncommitted'].filter(Boolean)
    if (targets.length !== 1) {
      return { isError: true, content: [{ type: 'text', text: 'Indica exactamente uno de: base, commit o uncommitted.' }] }
    }
    const dir = resolveRepoPath(cwd)

    if (prompt) {
      const diffCommand = base ? `git diff ${base}...HEAD` : commit ? `git show ${commit}` : 'git status --short y git diff HEAD (incluye ficheros sin seguimiento)'
      const reviewPrompt = [
        `Haz una revisión de código de los cambios que muestra: ${diffCommand}.`,
        'Prioriza bugs, regresiones, riesgos de seguridad/RLS/finanzas y cambios fuera de alcance. Cita fichero:línea. No edites ficheros.',
        '',
        'Criterios adicionales:',
        prompt,
      ].join('\n')
      return codexExec({ prompt: reviewPrompt, cwd: dir, timeoutS: timeout_s })
    }

    const args = ['review', '-c', 'sandbox_mode="read-only"']
    if (base) args.push('--base', base)
    if (commit) args.push('--commit', commit)
    if (uncommitted) args.push('--uncommitted')
    const result = await runCommand(CODEX_BIN, args, { cwd: dir, env: codexEnv(), timeoutMs: timeoutMs(timeout_s) })
    return toolResult(result, result.stdout.trim())
  },
)

await server.connect(new StdioServerTransport())
