#!/usr/bin/env node
import { spawnSync } from 'node:child_process'
import { repoRoot } from './brain/lib.mjs'

const result = spawnSync('pnpm', ['dlx', 'supabase', 'db', 'push', '--linked', '--dry-run'], {
  cwd: repoRoot,
  encoding: 'utf8',
})

const output = [result.stdout, result.stderr].filter(Boolean).join('\n').trim()
if (output) console.log(output)

if (result.error) {
  console.error(`[verify:supabase:migrations] ERROR: no se pudo ejecutar pnpm dlx supabase: ${result.error.message}`)
  process.exit(1)
}

if (result.status !== 0) {
  console.error('[verify:supabase:migrations] ERROR: no se pudo comprobar el estado remoto de migraciones.')
  console.error('[verify:supabase:migrations] Revisa login/link de Supabase y repite antes de cerrar una release con migraciones.')
  process.exit(result.status ?? 1)
}

if (/Remote database is up to date/i.test(output)) {
  console.log('[verify:supabase:migrations] OK: Supabase remoto esta al dia.')
  process.exit(0)
}

if (/Would push these migrations/i.test(output)) {
  console.error('[verify:supabase:migrations] ERROR: hay migraciones locales pendientes en Supabase remoto.')
  process.exit(1)
}

console.error('[verify:supabase:migrations] ERROR: salida inesperada de Supabase CLI; revisala antes de cerrar.')
process.exit(1)
