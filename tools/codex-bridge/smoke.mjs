#!/usr/bin/env node
// Smoke test por stdio del MCP `codex`.
//   node tools/codex-bridge/smoke.mjs         → protocolo y validaciones (sin llamar a Codex)
//   node tools/codex-bridge/smoke.mjs --live  → además, una llamada real a codex_ask (consume suscripción)
import assert from 'node:assert/strict'
import { Client } from '@modelcontextprotocol/sdk/client/index.js'
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js'
import { REPO_ROOT } from '../lib/run.mjs'

const live = process.argv.includes('--live')
const client = new Client({ name: 'codex-bridge-smoke', version: '1.0.0' })
await client.connect(new StdioClientTransport({ command: 'node', args: ['tools/codex-bridge/server.mjs'], cwd: REPO_ROOT, stderr: 'inherit' }))

try {
  const { tools } = await client.listTools()
  assert.deepEqual(tools.map((tool) => tool.name).sort(), ['codex_ask', 'codex_review'])
  console.log('ok  listTools: codex_ask, codex_review')

  const noTarget = await client.callTool({ name: 'codex_review', arguments: {} })
  assert.equal(noTarget.isError, true)
  console.log('ok  codex_review sin objetivo → error')

  const flagRef = await client.callTool({ name: 'codex_review', arguments: { base: '--dangerously-bypass-approvals-and-sandbox' } })
  assert.equal(flagRef.isError, true)
  console.log('ok  codex_review con ref tipo flag → rechazada')

  const outside = await client.callTool({ name: 'codex_ask', arguments: { prompt: 'x', cwd: '../..' } })
  assert.equal(outside.isError, true)
  console.log('ok  codex_ask con cwd fuera del repo → rechazado')

  if (live) {
    const answer = await client.callTool({
      name: 'codex_ask',
      arguments: { prompt: 'Lee package.json y responde solo con el valor del campo "name", sin nada más.', timeout_s: 300 },
    })
    const text = answer.content.map((part) => part.text).join('\n')
    assert.notEqual(answer.isError, true, text)
    assert.match(text, /culturaapp/i)
    console.log(`ok  codex_ask real → ${text.trim()}`)
  }
  console.log('smoke codex-bridge: OK')
} finally {
  await client.close()
}
