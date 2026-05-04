#!/usr/bin/env node

/**
 * Product Brain Capture
 * 
 * Comando: pb:capture
 * Procesa prefijos PB inbox:, PB idea:, PB issue:, PB decisión:, PB contexto:
 * Clasifica y guarda en docs/project/
 * Opcional: sincroniza con Obsidian
 * 
 * Uso:
 *   node scripts/product-brain-capture.mjs "PB idea: Mi idea"
 *   echo "PB idea: Mi idea" | node scripts/product-brain-capture.mjs
 *   npm run pb:capture -- "PB issue: Algo roto"
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { createHash } from 'crypto';
import { dirname, join, relative, resolve } from 'path';
import { createInterface } from 'readline';

const PROJECT_ROOT = process.cwd();
const REPO_BRAIN_PATH = process.env.PRODUCT_BRAIN_REPO_PATH
  ? resolve(process.env.PRODUCT_BRAIN_REPO_PATH)
  : join(PROJECT_ROOT, 'docs/project');

const IGNORED_NAMES = new Set([
  '.DS_Store',
  '.git',
  '.obsidian',
  '.trash',
  'node_modules',
]);

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
const DEFAULT_VAULT_PATH =
  process.env.ICLOUD_OBSIDIAN_VAULT ||
  process.env.ICL_OBSIDIAN_VAULT ||
  dotEnv.ICLOUD_OBSIDIAN_VAULT ||
  dotEnv.ICL_OBSIDIAN_VAULT ||
  '/Users/diconde/Library/Mobile Documents/iCloud~md~obsidian/Documents/Product Brain Caches.es';
const VAULT_PATH = process.env.PRODUCT_BRAIN_REPO_PATH
  ? process.env.PRODUCT_BRAIN_REPO_PATH
  : DEFAULT_VAULT_PATH;

const PREFIX_MAP = {
  'PB inbox:': { folder: 'inbox', type: 'inbox', tags: ['product-brain', 'inbox'] },
  'PB idea:': { folder: 'knowledge', type: 'zk', tags: ['product-brain', 'knowledge', 'idea'] },
  'PB issue:': { folder: 'issues', type: 'issue', tags: ['product-brain', 'issue'] },
  'PB decisión:': { folder: 'decisions', type: 'adr', tags: ['product-brain', 'decision'] },
  'PB contexto:': { folder: 'context', type: 'context', tags: ['product-brain', 'context'] },
};

const ID_PATTERN = {
  inbox: 'PB-INBOX',
  zk: 'PB-ZK',
  issue: 'CACH-',
  adr: 'PB-ADR',
  context: 'PB-CTX',
};

function log(message) {
  console.log(`[pb:capture] ${message}`);
}

function fail(message) {
  console.error(`[pb:capture] ERROR: ${message}`);
  process.exit(1);
}

function readFromStdin() {
  return new Promise((resolve, reject) => {
    const chunks = [];
    const rl = createInterface({
      input: process.stdin,
      crlfDelay: Infinity,
    });
    rl.on('line', (line) => chunks.push(line));
    rl.on('close', () => resolve(chunks.join('\n').trim()));
    rl.on('error', reject);
  });
}

function getPrefix(text) {
  for (const prefix of Object.keys(PREFIX_MAP)) {
    if (text.trim().startsWith(prefix)) {
      return prefix;
    }
  }
  return null;
}

function parseContent(text, prefix) {
  const content = text.trim().slice(prefix.length).trim();
  return content;
}

function generateId(type, folderPath) {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hour = String(now.getHours()).padStart(2, '0');
  const minute = String(now.getMinutes()).padStart(2, '0');

  if (type === 'issue') {
    const files = readdirSync(folderPath).filter(f => f.endsWith('.md'));
    const issues = files
      .map(f => {
        const match = f.match(/^CACH-(\d+)\.md$/);
        return match ? parseInt(match[1], 10) : 0;
      })
      .filter(n => n > 0);
    const next = issues.length > 0 ? Math.max(...issues) + 1 : 1;
    return `CACH-${next.toString().padStart(3, '0')}`;
  }

  return `${ID_PATTERN[type]}-${year}${month}${day}-${hour}${minute}`;
}

function extractTitle(content, maxLen = 60) {
  const lines = content.split('\n');
  const firstLine = lines[0].replace(/^[#\-*\s]+/, '').trim();
  if (firstLine.length <= maxLen) return firstLine;
  return firstLine.slice(0, maxLen - 3) + '...';
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function buildFrontmatter(id, type, tags, title) {
  const now = new Date().toISOString().split('T')[0];
  const frontmatter = [
    '---',
    `id: ${id}`,
    `type: ${type}`,
    'status: Active',
    `created: ${now}`,
    `updated: ${now}`,
    'aliases:',
    `  - ${title}`,
    'tags:',
    ...tags.map(t => `  - ${t}`),
    '---',
    '',
  ].join('\n');
  return frontmatter;
}

function ensureDir(path) {
  if (!existsSync(path)) {
    mkdirSync(path, { recursive: true });
  }
}

function listFiles(root, extension = '.md') {
  const files = [];
  if (!existsSync(root)) return files;

  function walk(dir) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      if (IGNORED_NAMES.has(entry.name)) continue;
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        walk(fullPath);
      } else if (entry.isFile() && entry.name.endsWith(extension)) {
        files.push(fullPath);
      }
    }
  }
  walk(root);
  return files;
}

function checkDuplicate(title, folderPath) {
  const files = listFiles(folderPath);
  const slug = generateSlug(title);
  
  for (const file of files) {
    const fileContent = readFileSync(file, 'utf8');
    if (fileContent.includes(slug) || fileContent.includes(title.slice(0, 40))) {
      return file;
    }
  }
  return null;
}

function copyToVault(sourcePath, targetFolder) {
  const vaultFolder = join(VAULT_PATH, targetFolder);
  ensureDir(vaultFolder);
  const targetPath = join(vaultFolder, relative(join(REPO_BRAIN_PATH, targetFolder), sourcePath));
  const targetDir = dirname(targetPath);
  ensureDir(targetDir);
  writeFileSync(targetPath, readFileSync(sourcePath));
  return targetPath;
}

function commandCapture(input, options = {}) {
  const { sync = false, dryRun = false } = options;

  const prefix = getPrefix(input);
  if (!prefix) {
    fail('Prefijo no reconocido. Usar: PB inbox:, PB idea:, PB issue:, PB decisión:, PB contexto:');
  }

  const config = PREFIX_MAP[prefix];
  const content = parseContent(input, prefix);

  const folderPath = join(REPO_BRAIN_PATH, config.folder);
  ensureDir(folderPath);

  const title = extractTitle(content);
  const duplicate = checkDuplicate(title, folderPath);
  if (duplicate && !options.force) {
    log(`Duplicado detectado: ${duplicate}`);
    log('Usar --force para sobrescribir.');
    return;
  }

  const id = generateId(config.type, folderPath);
  const slug = generateSlug(title);
  
  const frontmatter = buildFrontmatter(id, config.type, config.tags, title);
  const fileContent = `${frontmatter}\n# ${title}\n\n${content}\n`;

  const fileName = `${id}.md`;
  const filePath = join(folderPath, fileName);

  if (dryRun) {
    log('DRY RUN - Archivo que se crearia:');
    console.log(filePath);
    console.log('---');
    console.log(fileContent);
    return;
  }

  writeFileSync(filePath, fileContent);
  log(`Creado: ${filePath}`);

  if (sync && VAULT_PATH && VAULT_PATH !== REPO_BRAIN_PATH) {
    try {
      const vaultPath = copyToVault(filePath, config.folder);
      log(`Sincronizado: ${vaultPath}`);
    } catch (err) {
      log(`Sync ignorado: ${err.message}`);
    }
  }

  log('Listo.');
}

function showHelp() {
  console.log(`
Product Brain Capture

Uso:
  npm run pb:capture -- "PB prefix: contenido"
  echo "PB prefix: contenido" | npm run pb:capture

Prefijos reconocidos:
  PB inbox:    -> docs/project/inbox/
  PB idea:     -> docs/project/knowledge/
  PB issue:    -> docs/project/issues/
  PB decisión: -> docs/project/decisions/
  PB contexto: -> docs/project/context/

Opciones:
  --sync     Sincroniza con Obsidian tras capturar
  --force    Fuerza captura aunque haya duplicado
  --dry-run  Muestra lo que se crearia sin escribir
  --help     Muestra esta ayuda

Ejemplos:
  npm run pb:capture -- "PB idea: Nueva fitur para calendar"
  npm run pb:capture -- "PB issue: Bug en login" --sync
  npm run pb:capture -- "PB decisión: Usar SQLite" --dry-run
`);
}

const args = process.argv.slice(2);
const options = {
  sync: args.includes('--sync'),
  force: args.includes('--force'),
  dryRun: args.includes('--dry-run'),
  help: args.includes('--help'),
};

const cleanArgs = args.filter(a => !a.startsWith('--'));

if (options.help) {
  showHelp();
  process.exit(0);
}

async function main() {
  let input = cleanArgs.join(' ');

  if (!input) {
    // Try to read from stdin only if stdin is not a TTY (i.e., piped data)
    if (!process.stdin.isTTY) {
      input = await readFromStdin();
    }
  }

  if (!input) {
    fail('Falta contenido. Usar --help para ayuda o passar un argumento, o usar: echo "PB ..." | npm run pb:capture');
  }

  commandCapture(input, options);
}

main().catch(err => fail(err.message));