#!/usr/bin/env node
const argv = process.argv.slice(2)
const baseUrl = (valueFor('--url') ?? process.env.CULTURAAPP_PROD_URL ?? 'https://app.caches.es').replace(/\/$/, '')
const paths = ['/', '/login', '/dashboard', '/work', '/calendar/events']
const results = []

function valueFor(name) {
  const inline = argv.find((arg) => arg.startsWith(`${name}=`))
  if (inline) return inline.slice(name.length + 1)
  const index = argv.indexOf(name)
  return index >= 0 ? argv[index + 1] : null
}

for (const path of paths) {
  const url = `${baseUrl}${path}`
  try {
    const response = await fetch(url, { redirect: 'follow' })
    const text = await response.text()
    const ok = response.status >= 200 && response.status < 400 && !/404: NOT_FOUND|Vercel Authentication/i.test(text)
    results.push({ path, status: response.status, ok })
  } catch (error) {
    results.push({ path, status: null, ok: false, error: error.message })
  }
}

const authAvailable = Boolean(process.env.SMOKE_EMAIL && process.env.SMOKE_PASSWORD)
const ok = results.every((result) => result.ok)
for (const result of results) {
  const status = result.ok ? 'OK' : 'FAIL'
  console.log(`[smoke:postdeploy] ${status} ${result.path} ${result.status ?? result.error}`)
}
console.log(`[smoke:postdeploy] auth/CRUD smoke: ${authAvailable ? 'configurado pero no automatizado en este script' : 'skip sin SMOKE_EMAIL/SMOKE_PASSWORD'}`)
process.exitCode = ok ? 0 : 1
