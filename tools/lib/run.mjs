// Utilidades compartidas por los servidores MCP de tools/ (codex-bridge, cheap-worker).
import { spawn } from 'node:child_process'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

export const REPO_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..')

const MAX_OUTPUT_CHARS = 200_000

// Resuelve `cwd` relativo a la raíz del repo y rechaza rutas fuera de ella
// (incluye los worktrees de .worktrees/, que viven dentro).
export function resolveRepoPath(cwd) {
  const resolved = path.resolve(REPO_ROOT, cwd ?? '.')
  const rel = path.relative(REPO_ROOT, resolved)
  if (rel.startsWith('..') || path.isAbsolute(rel)) {
    throw new Error(`Ruta fuera del repo: ${cwd}`)
  }
  return resolved
}

export function tail(text, maxChars = MAX_OUTPUT_CHARS) {
  if (!text || text.length <= maxChars) return text ?? ''
  return `[… ${text.length - maxChars} caracteres recortados …]\n${text.slice(-maxChars)}`
}

// Ejecuta un comando sin shell. Al vencer `timeoutMs` mata el grupo de procesos
// completo (SIGTERM y, 5 s después, SIGKILL) para no dejar hijos huérfanos.
export function runCommand(cmd, args, { cwd = REPO_ROOT, env = process.env, input, timeoutMs } = {}) {
  return new Promise((resolve) => {
    const started = Date.now()
    const child = spawn(cmd, args, { cwd, env, detached: true, stdio: ['pipe', 'pipe', 'pipe'] })
    let stdout = ''
    let stderr = ''
    let timedOut = false
    let killTimer

    const killGroup = (signal) => {
      try {
        process.kill(-child.pid, signal)
      } catch {
        // El proceso ya terminó.
      }
    }

    const timer = timeoutMs
      ? setTimeout(() => {
          timedOut = true
          killGroup('SIGTERM')
          killTimer = setTimeout(() => killGroup('SIGKILL'), 5_000)
        }, timeoutMs)
      : null

    child.stdout.on('data', (chunk) => { stdout += chunk })
    child.stderr.on('data', (chunk) => { stderr += chunk })
    child.on('error', (error) => {
      clearTimeout(timer)
      clearTimeout(killTimer)
      resolve({ code: null, stdout, stderr: `${stderr}${error.message}`, timedOut, durationMs: Date.now() - started })
    })
    child.on('close', (code) => {
      clearTimeout(timer)
      clearTimeout(killTimer)
      resolve({ code, stdout: tail(stdout), stderr: tail(stderr), timedOut, durationMs: Date.now() - started })
    })

    child.stdin.on('error', () => {})
    child.stdin.end(input ?? '')
  })
}
