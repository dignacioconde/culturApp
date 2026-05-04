#!/usr/bin/env node

import { readFileSync, writeFileSync, existsSync, readdirSync, statSync, mkdirSync, cpSync, rmSync } from 'fs';
import { join, relative, basename } from 'path';
import { execSync } from 'child_process';

const VAULT_PATH = process.env.ICl_OBSIDIAN_VAULT || '/Users/diconde/Library/Mobile Documents/iCloud~md~obsidian/Documents/CulturaApp';
const PROJECT_PATH = process.cwd();
const PRODUCT_BRAIN_PATH = join(PROJECT_PATH, 'docs/project');
const IGNORE_PATTERNS = ['.obsidian', '.DS_Store', '.git', 'node_modules'];
const TMP_EXTENSIONS = ['.tmp', '.swp', '.lock'];

function log(msg) {
  console.log(`[pb] ${msg}`);
}

function error(msg) {
  console.error(`[pb] ERROR: ${msg}`);
}

function pathMatchesIgnore(filePath) {
  const name = basename(filePath);
  return IGNORE_PATTERNS.includes(name) || TMP_EXTENSIONS.some(ext => name.endsWith(ext));
}

function getModifiedFiles(dir, gitRoot = false) {
  const files = [];
  function walk(d) {
    const entries = readdirSync(d, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = join(d, entry.name);
      const relPath = relative(gitRoot ? PROJECT_PATH : PRODUCT_BRAIN_PATH, fullPath);
      if (pathMatchesIgnore(entry.name)) continue;
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile()) {
        files.push(relPath);
      }
    }
  }
  walk(dir);
  return files;
}

function getFilesInSync() {
  try {
    const local = execSync('git ls-files docs/project', { encoding: 'utf-8' }).trim().split('\n').filter(Boolean);
    return new Set(local);
  } catch {
    return new Set();
  }
}

async function cmdInit() {
  log('Inicializando Product Brain...');
  if (!existsSync(VAULT_PATH)) {
    error(`Vault de Obsidian no encontrado en: ${VAULT_PATH}`);
    error('Configurá ICL_OBSIDIAN_VAULT en .env.local o variable de entorno');
    process.exit(1);
  }
  log(`Vault encontrado en: ${VAULT_PATH}`);
  log('Product Brain listo. Ejecutá pb:pull para importar del vault o pb:status para ver el estado.');
}

async function cmdStatus() {
  log('Obteniendo estado del Product Brain...');
  const filesModified = getModifiedFiles(PRODUCT_BRAIN_PATH);
  const filesInGit = getFilesInSync();
  
  if (filesModified.length === 0) {
    log('No hay archivos locally modificados.');
  } else {
    log(`${filesModified.length} archivo(s) local(es) modificado(s):`);
    for (const f of filesModified) log(`  - ${f}`);
  }
  
  if (existsSync(VAULT_PATH)) {
    const vaultFiles = getModifiedFiles(VAULT_PATH).length;
    log(`Vault de Obsidian: ${vaultFiles} archivo(s) disponible(s)`);
  } else {
    log('Vault de Obsidian no configurado (usá ICL_OBSIDIAN_VAULT)');
  }
}

async function cmdPull() {
  log(`Importando del vault: ${VAULT_PATH}`);
  if (!existsSync(VAULT_PATH)) {
    error('Vault no encontrado. Configurá ICL_OBSIDIAN_VAULT');
    process.exit(1);
  }
  
  const vaultFiles = getModifiedFiles(VAULT_PATH);
  let imported = 0;
  let skipped = 0;
  
  for (const file of vaultFiles) {
    const src = join(VAULT_PATH, file);
    const dest = join(PRODUCT_BRAIN_PATH, file);
    const dir = join(PRODUCT_BRAIN_PATH, file.replace(/[/][^/]+$/, ''));
    
    if (existsSync(src) && statSync(src).isFile()) {
      try {
        mkdirSync(dir, { recursive: true });
        cpSync(src, dest);
        imported++;
      } catch (e) {
        error(`Error copiando ${file}: ${e.message}`);
      }
    } else {
      skipped++;
    }
  }
  
  log(`Importados: ${imported}, omitidos: ${skipped}`);
  log('Listo. Verificá los cambios con pb:status.');
}

async function cmdPush() {
  log(`Exportando al vault: ${VAULT_PATH}`);
  
  const localFiles = getModifiedFiles(PRODUCT_BRAIN_PATH);
  let exported = 0;
  let conflicts = 0;
  
  for (const file of localFiles) {
    const src = join(PRODUCT_BRAIN_PATH, file);
    const dest = join(VAULT_PATH, file);
    const destDir = join(VAULT_PATH, file.replace(/[/][^/]+$/, ''));
    
    if (existsSync(src) && statSync(src).isFile()) {
      if (existsSync(dest)) {
        const srcStat = statSync(src).mtimeMs;
        const destStat = statSync(dest).mtimeMs;
        if (destStat > srcStat) {
          log(`CONFlicto detectado: ${file} (más nuevo en vault)`);
          conflicts++;
          continue;
        }
      }
      try {
        mkdirSync(destDir, { recursive: true });
        cpSync(src, dest);
        exported++;
      } catch (e) {
        error(`Error copiando ${file}: ${e.message}`);
      }
    }
  }
  
  if (conflicts > 0) {
    error(`${conflicts} archivo(s) en conflicto. Resolver manualmente antes de push.`);
    process.exit(1);
  }
  
  log(`Exportados: ${exported}`);
  log('Listo.');
}

const CMD = process.argv[2];
const CMDS = { init: cmdInit, status: cmdStatus, pull: cmdPull, push: cmdPush };

if (!CMD || !CMDS[CMD]) {
  console.log(`Usage: npm run pb:<init|status|pull|push>
  
  init     - Inicializar Product Brain (primera vez)
  status  - Ver estado actual
  pull    - Importar del vault de iCloud
  push    - Exportar al vault de iCloud
  `);
  process.exit(1);
}

CMDS[CMD]();