#!/usr/bin/env node
import { spawnSync } from 'node:child_process'

const hasSupabase = spawnSync('supabase', ['--version'], { encoding: 'utf8' })

if (hasSupabase.error?.code === 'ENOENT') {
  console.log('[test:db] skip: Supabase CLI no esta instalado en este entorno.')
  console.log('[test:db] pendiente: ejecutar supabase test db cuando haya CLI y migraciones versionadas completas.')
  process.exit(0)
}

const result = spawnSync('supabase', ['test', 'db'], { stdio: 'inherit' })
process.exit(result.status ?? 1)
