#!/usr/bin/env node

import {
  copyFileSync,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  rmdirSync,
  statSync,
  unlinkSync,
  writeFileSync,
} from 'fs';
import { createHash } from 'crypto';
import { dirname, join, relative, resolve } from 'path';

const PROJECT_ROOT = process.cwd();
const REPO_BRAIN_PATH = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(PROJECT_ROOT, 'docs/project');
const DEFAULT_VAULT_PATH =
  '/Users/diconde/Library/Mobile Documents/iCloud~md~obsidian/Documents/Product Brain Caches.es';
const STATE_PATH = process.env.PRODUCT_BRAIN_SYNC_STATE
  ? resolve(process.env.PRODUCT_BRAIN_SYNC_STATE)
  : join(PROJECT_ROOT, '.product-brain-sync-state.json');

const IGNORED_NAMES = new Set([
  '.DS_Store',
  '.git',
  '.obsidian',
  '.trash',
  'node_modules',
]);

const IGNORED_SUFFIXES = [
  '.icloud',
  '.lock',
  '.swp',
  '.tmp',
  '~',
];

const REQUIRED_DIRS = [
  'inbox',
  'backlog',
  'context',
  'knowledge',
  'issues',
  'decisions',
  'releases',
  'plans',
  'process',
  'indexes',
  'templates',
  'prompts',
];

function loadDotEnv() {
  const envPath = join(PROJECT_ROOT, '.env.local');
  if (!existsSync(envPath)) return {};

  const parsed = {};
  const lines = readFileSync(envPath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) continue;
    const eq = trimmed.indexOf('=');
    if (eq === -1) continue;
    const key = trimmed.slice(0, eq).trim();
    let value = trimmed.slice(eq + 1).trim();
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    parsed[key] = value;
  }
  return parsed;
}

const dotEnv = loadDotEnv();
const VAULT_PATH =
  process.env.ICLOUD_OBSIDIAN_VAULT ||
  process.env.ICL_OBSIDIAN_VAULT ||
  dotEnv.ICLOUD_OBSIDIAN_VAULT ||
  dotEnv.ICL_OBSIDIAN_VAULT ||
  DEFAULT_VAULT_PATH;

function log(message) {
  console.log(`[pb] ${message}`);
}

function fail(message) {
  console.error(`[pb] ERROR: ${message}`);
  process.exit(1);
}

function shouldIgnore(name) {
  return IGNORED_NAMES.has(name) || IGNORED_SUFFIXES.some((suffix) => name.endsWith(suffix));
}

function ensureDir(path) {
  mkdirSync(path, { recursive: true });
}

function deleteFile(fullPath) {
  if (existsSync(fullPath)) {
    unlinkSync(fullPath);
    log(`Eliminado: ${fullPath}`);
  }
}

function deleteEmptyDirs(root) {
  if (!existsSync(root)) return;

  function walk(current, deleted) {
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (!entry.isDirectory()) continue;

      const fullPath = join(current, entry.name);
      walk(fullPath, deleted);

      if (existsSync(fullPath)) {
        const remaining = readdirSync(fullPath);
        if (remaining.length === 0) {
          try {
            rmdirSync(fullPath);
            deleted.push(fullPath);
          } catch {
            // Ignore errors when dir not empty or permission issues
          }
        }
      }
    }
  }

  const deleted = [];
  for (const sub of REQUIRED_DIRS) {
    const subPath = join(root, sub);
    if (existsSync(subPath)) {
      walk(subPath, deleted);
      if (existsSync(subPath)) {
        const remaining = readdirSync(subPath);
        if (remaining.length === 0) {
          try {
            rmdirSync(subPath);
            deleted.push(subPath);
          } catch {
            // Ignore
          }
        }
      }
    }
  }

  return deleted;
}

function ensureBaseDirs() {
  ensureDir(REPO_BRAIN_PATH);
  ensureDir(VAULT_PATH);
  for (const dir of REQUIRED_DIRS) {
    ensureDir(join(REPO_BRAIN_PATH, dir));
    ensureDir(join(VAULT_PATH, dir));
  }
}

function listFiles(root) {
  if (!existsSync(root)) return new Map();

  const files = new Map();

  function walk(current) {
    const entries = readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      if (shouldIgnore(entry.name)) continue;

      const fullPath = join(current, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
        continue;
      }

      if (!entry.isFile()) continue;
      const relPath = relative(root, fullPath).split('/').join('/');
      files.set(relPath, {
        hash: hashFile(fullPath),
        path: fullPath,
      });
    }
  }

  walk(root);
  return files;
}

function hashFile(path) {
  const content = readFileSync(path);
  return createHash('sha256').update(content).digest('hex');
}

function readState() {
  if (!existsSync(STATE_PATH)) {
    return { version: 1, files: {} };
  }

  try {
    return JSON.parse(readFileSync(STATE_PATH, 'utf8'));
  } catch {
    return { version: 1, files: {} };
  }
}

function writeState(state) {
  writeFileSync(STATE_PATH, `${JSON.stringify(state, null, 2)}\n`);
}

function commonPaths(repoFiles, vaultFiles) {
  return [...repoFiles.keys()].filter((file) => vaultFiles.has(file)).sort();
}

function analyze() {
  const state = readState();
  const repoFiles = listFiles(REPO_BRAIN_PATH);
  const vaultFiles = listFiles(VAULT_PATH);
  const conflicts = [];
  const changedInRepo = [];
  const changedInVault = [];
  const repoOnly = [];
  const vaultOnly = [];
  const same = [];

  for (const file of repoFiles.keys()) {
    if (!vaultFiles.has(file)) repoOnly.push(file);
  }

  for (const file of vaultFiles.keys()) {
    if (!repoFiles.has(file)) vaultOnly.push(file);
  }

  for (const file of commonPaths(repoFiles, vaultFiles)) {
    const repoHash = repoFiles.get(file).hash;
    const vaultHash = vaultFiles.get(file).hash;
    const lastHash = state.files[file]?.hash;

    if (repoHash === vaultHash) {
      same.push(file);
      continue;
    }

    if (!lastHash) {
      conflicts.push(file);
      continue;
    }

    const repoChanged = repoHash !== lastHash;
    const vaultChanged = vaultHash !== lastHash;

    if (repoChanged && vaultChanged) {
      conflicts.push(file);
    } else if (repoChanged) {
      changedInRepo.push(file);
    } else if (vaultChanged) {
      changedInVault.push(file);
    } else {
      conflicts.push(file);
    }
  }

  return {
    changedInRepo: changedInRepo.sort(),
    changedInVault: changedInVault.sort(),
    conflicts: conflicts.sort(),
    repoFiles,
    repoOnly: repoOnly.sort(),
    same,
    state,
    vaultFiles,
    vaultOnly: vaultOnly.sort(),
  };
}

function updateStateForFiles(state, repoFiles, vaultFiles, paths) {
  for (const file of paths) {
    const repo = repoFiles.get(file);
    const vault = vaultFiles.get(file);
    const hash = repo?.hash || vault?.hash;
    if (hash) state.files[file] = { hash };
  }
  writeState(state);
}

function copyFiles(paths, fromRoot, toRoot) {
  for (const file of paths) {
    const src = join(fromRoot, file);
    const dest = join(toRoot, file);
    ensureDir(dirname(dest));
    copyFileSync(src, dest);
  }
}

function printList(label, files) {
  if (files.length === 0) return;
  log(`${label}:`);
  for (const file of files) {
    log(`  - ${file}`);
  }
}

function commandInit() {
  ensureBaseDirs();
  log(`Repo Product Brain: ${REPO_BRAIN_PATH}`);
  log(`Vault Obsidian: ${VAULT_PATH}`);
  log('Estructura base lista.');
}

function commandStatus() {
  const result = analyze();

  log(`Repo Product Brain: ${REPO_BRAIN_PATH}`);
  log(`Vault Obsidian: ${VAULT_PATH}`);
  log(`Archivos en repo: ${result.repoFiles.size}`);
  log(`Archivos en vault: ${result.vaultFiles.size}`);
  printList('Solo en repo', result.repoOnly);
  printList('Solo en vault', result.vaultOnly);
  printList('Cambiados en repo', result.changedInRepo);
  printList('Cambiados en vault', result.changedInVault);
  printList('Conflictos', result.conflicts);

  if (
    result.repoOnly.length === 0 &&
    result.vaultOnly.length === 0 &&
    result.changedInRepo.length === 0 &&
    result.changedInVault.length === 0 &&
    result.conflicts.length === 0
  ) {
    log('Repo y vault estan sincronizados.');
  }
}

function commandPull() {
  ensureBaseDirs();
  const result = analyze();
  if (result.conflicts.length > 0) {
    printList('Conflictos', result.conflicts);
    fail('Pull cancelado. Resolver conflictos manualmente.');
  }

  const filesToPull = [...new Set([...result.vaultOnly, ...result.changedInVault])].sort();
  copyFiles(filesToPull, VAULT_PATH, REPO_BRAIN_PATH);

  const refreshedRepo = listFiles(REPO_BRAIN_PATH);
  const refreshedVault = listFiles(VAULT_PATH);
  updateStateForFiles(result.state, refreshedRepo, refreshedVault, [
    ...result.same,
    ...filesToPull,
  ]);

  log(`Importados desde iCloud: ${filesToPull.length}`);
  if (result.repoOnly.length > 0 || result.changedInRepo.length > 0) {
    log('Hay cambios locales no publicados. Usa pb:push si quieres enviarlos al vault.');
  }
}

function commandPush(options = {}) {
  const shouldDelete = options.delete ?? false;
  ensureBaseDirs();
  const result = analyze();
  if (result.conflicts.length > 0) {
    printList('Conflictos', result.conflicts);
    fail('Push cancelado. Resolver conflictos manualmente.');
  }

  const filesToPush = [...new Set([...result.repoOnly, ...result.changedInRepo])].sort();
  copyFiles(filesToPush, REPO_BRAIN_PATH, VAULT_PATH);

  // Delete files that only exist in vault (when --delete flag is passed)
  if (shouldDelete && result.vaultOnly.length > 0) {
    for (const file of result.vaultOnly) {
      const fullPath = join(VAULT_PATH, file);
      deleteFile(fullPath);
    }
    // Try to clean empty dirs after deletes
    deleteEmptyDirs(VAULT_PATH);
  }

  const refreshedRepo = listFiles(REPO_BRAIN_PATH);
  const refreshedVault = listFiles(VAULT_PATH);
  updateStateForFiles(result.state, refreshedRepo, refreshedVault, [
    ...result.same,
    ...filesToPush,
  ]);

  log(`Exportados al vault: ${filesToPush.length}`);
  if (shouldDelete && result.vaultOnly.length > 0) {
    log(`Eliminados del vault: ${result.vaultOnly.length}`);
  }
  if (result.vaultOnly.length > 0 || result.changedInVault.length > 0) {
    if (shouldDelete) {
      log('Repo y vault estan sincronizados.');
    } else if (result.vaultOnly.length > 0 && !shouldDelete) {
      log('WARNING: Hay archivos en vault que no existen en repo. Usa pb:push --delete para borrarlos.')
    }
  }
}

const commands = {
  init: commandInit,
  pull: commandPull,
  push: commandPush,
  status: commandStatus,
};

const args = process.argv.slice(2);
const command = args[0];
const options = {};

for (let i = 1; i < args.length; i++) {
  const arg = args[i];
  if (arg === '--delete') {
    options.delete = true;
  } else if (arg.startsWith('--')) {
    log(`Opcion desconocida: ${arg}`);
    process.exit(1);
  }
}

if (!command || !commands[command]) {
  const script = relative(PROJECT_ROOT, resolve(process.argv[1]));
  console.log(`Usage: node ${script} <init|status|pull|push> [--delete]`);
  process.exit(1);
}

commands[command](options);
