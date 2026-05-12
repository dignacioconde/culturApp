import { expect, test, type Page } from '@playwright/test'

const userId = '00000000-0000-4000-8000-000000000018'
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://mkidexrkhjhrsjnjmugw.supabase.co'
const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
const authStorageKey = `sb-${projectRef}-auth-token`
const currentYear = new Date().getFullYear()
const currentMonth = String(new Date().getMonth() + 1).padStart(2, '0')
const projectId = 'project-beta-18'
const eventId = 'event-beta-18'

const authSession = {
  access_token: 'local-beta18-e2e-token',
  refresh_token: 'local-beta18-e2e-refresh',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'beta18@example.com',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: new Date().toISOString(),
  },
}

const profile = {
  id: userId,
  full_name: 'Beta 18',
  profession: 'Gestora cultural',
  tax_rate: 15,
  onboarding_completed: true,
  usage_consent: true,
  role: 'user',
}

const project = {
  id: projectId,
  user_id: userId,
  name: 'Gira Norte',
  client: 'Auditorio Central',
  category: 'musica',
  status: 'confirmed',
  start_date: `${currentYear}-${currentMonth}-01`,
  end_date: `${currentYear}-${currentMonth}-28`,
  color: '#4f98a3',
  notes: 'Necesidades tecnicas confirmadas.',
}

const event = {
  id: eventId,
  user_id: userId,
  project_id: projectId,
  name: 'Ensayo general',
  client: 'Auditorio Central',
  category: 'musica',
  status: 'confirmed',
  start_datetime: `${currentYear}-${currentMonth}-15T10:00:00+01:00`,
  end_datetime: `${currentYear}-${currentMonth}-15T12:00:00+01:00`,
  color: '#C94035',
  notes: 'Llegar 30 minutos antes.',
}

const incomes = [
  {
    id: 'income-beta-18',
    user_id: userId,
    project_id: null,
    event_id: eventId,
    concept: 'Cache ensayo',
    amount: 240,
    tax_rate: 15,
    expected_date: `${currentYear}-${currentMonth}-15`,
    paid_date: `${currentYear}-${currentMonth}-16`,
    is_paid: true,
  },
]

const expenses = [
  {
    id: 'expense-beta-18',
    user_id: userId,
    project_id: projectId,
    event_id: null,
    concept: 'Transporte',
    amount: 25,
    category: 'transporte',
    expense_date: `${currentYear}-${currentMonth}-14`,
    is_deductible: true,
  },
]

const viewports = [
  { label: '320', width: 320, height: 740 },
  { label: '390', width: 390, height: 844 },
  { label: '768', width: 768, height: 1024 },
  { label: 'desktop', width: 1366, height: 900 },
]

function jsonResponse(body: unknown) {
  return {
    status: 200,
    contentType: 'application/json',
    headers: { 'cache-control': 'no-store' },
    body: JSON.stringify(body),
  }
}

async function setupBeta18(page: Page) {
  let projects = [{ ...project }]
  let events = [{ ...event }]

  await page.addInitScript(({ key, value }) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, { key: authStorageKey, value: authSession })

  await page.route('**/auth/v1/**', async (route) => {
    await route.fulfill(jsonResponse(authSession))
  })

  await page.route('**/rest/v1/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    const table = url.pathname.split('/').pop()
    const method = request.method()

    if (table === 'profiles') {
      await route.fulfill(jsonResponse(profile))
      return
    }

    if (table === 'projects') {
      if (method === 'PATCH') {
        const patch = request.postDataJSON()
        projects = projects.map((item, index) => (index === 0 ? { ...item, ...patch } : item))
        await route.fulfill(jsonResponse(projects[0]))
        return
      }
      await route.fulfill(jsonResponse(projects))
      return
    }

    if (table === 'events') {
      if (method === 'PATCH') {
        const patch = request.postDataJSON()
        events = events.map((item, index) => (index === 0 ? { ...item, ...patch } : item))
        await route.fulfill(jsonResponse(events[0]))
        return
      }
      await route.fulfill(jsonResponse(events))
      return
    }

    if (table === 'incomes') {
      await route.fulfill(jsonResponse(incomes))
      return
    }

    if (table === 'expenses') {
      await route.fulfill(jsonResponse(expenses))
      return
    }

    await route.fulfill(jsonResponse([]))
  })
}

async function expectCalendarChrome(page: Page) {
  await expect(page.locator('.rbc-toolbar')).toBeVisible()
  await expect(page.locator('.rbc-header').first()).toBeVisible()
  await expect(page.locator('.rbc-day-bg, .rbc-date-cell').first()).toBeVisible()
  await expect(page.locator('.rbc-event').first()).toBeVisible()
}

async function expectQuickIncomeDialog(page: Page, isMobile: boolean) {
  await page.getByRole('button', { name: isMobile ? 'Cobro' : 'Ingreso' }).first().click()
  const dialog = page.getByRole('dialog', { name: 'Cobro rápido' })
  await expect(dialog).toBeVisible()
  await dialog.getByLabel('Concepto').fill('Cache personalizado')
  await dialog.getByLabel(/Importe/).fill('123,45')
  await expect(dialog.getByLabel('Marcar como cobrado')).toBeChecked()
  await dialog.getByRole('button', { name: 'Cerrar' }).click()
}

function contextNotesCard(page: Page) {
  return page
    .getByRole('heading', { name: 'Notas' })
    .locator('xpath=ancestor::div[contains(@class, "rounded-lg") and contains(@class, "border")][1]')
}

async function editAndClearContextNote(page: Page, nextNote: string) {
  const card = contextNotesCard(page)
  await card.getByRole('button', { name: 'Editar' }).click()
  await card.getByLabel('Nota').fill(nextNote)
  const patchResponsePromise = page.waitForResponse((response) =>
    response.url().includes('/rest/v1/') && response.request().method() === 'PATCH'
  )
  await card.getByRole('button', { name: 'Guardar nota' }).click()
  const patchResponse = await patchResponsePromise
  expect((await patchResponse.json()).notes).toBe(nextNote)
  await expect(card.getByText(nextNote)).toBeVisible()
  await page.reload()
  const reloadedCard = contextNotesCard(page)
  await expect(reloadedCard.getByText(nextNote)).toBeVisible()
  await reloadedCard.getByRole('button', { name: 'Editar' }).click()
  await reloadedCard.getByRole('button', { name: 'Limpiar nota' }).click()
  await expect(reloadedCard.getByText(/no hay notas/)).toBeVisible()
}

for (const viewport of viewports) {
  test(`beta 18 smoke visual en ${viewport.label}`, async ({ page }) => {
    const isMobile = viewport.width < 640
    await page.setViewportSize({ width: viewport.width, height: viewport.height })
    await setupBeta18(page)

    await page.goto('/dashboard')
    await expect(page.getByRole('heading', { name: 'Dashboard' })).toBeVisible()

    await page.goto(`/projects/${projectId}`)
    await expect(page.getByRole('heading', { name: 'Gira Norte' }).first()).toBeVisible()
    await expect(page.getByText('Apuntes privados para preparar y recordar detalles.')).toBeVisible()
    await expect(page.getByText('Necesidades tecnicas confirmadas.')).toBeVisible()
    await expectQuickIncomeDialog(page, isMobile)

    await page.goto(`/events/${eventId}`)
    await expect(page.getByRole('heading', { name: 'Ensayo general' }).first()).toBeVisible()
    await expect(page.getByText('Apuntes privados para preparar y recordar detalles.')).toBeVisible()
    await expect(page.getByText('Llegar 30 minutos antes.')).toBeVisible()
    await expectQuickIncomeDialog(page, isMobile)

    await page.goto('/calendar')
    await expect(page).toHaveURL(/\/calendar\/events$/)
    await expect(page.getByRole('heading', { name: 'Calendario de eventos' })).toBeVisible()
    await expect(page.getByText('1 eventos')).toBeVisible()
    await expect(page.getByRole('button', { name: 'Nuevo evento' })).toBeVisible()
    await expectCalendarChrome(page)
    await page.getByText('Ensayo general').first().click()
    await expect(page.getByRole('heading', { name: 'Ensayo general' })).toBeVisible()

    await page.goto('/calendar/events')
    await expect(page.getByRole('heading', { name: 'Calendario de eventos' })).toBeVisible()
    await expect(page.getByText('1 eventos')).toBeVisible()
    await expectCalendarChrome(page)

    await page.goto('/calendar/projects')
    await expect(page.getByRole('heading', { name: 'Calendario de proyectos' })).toBeVisible()
    await expect(page.getByText('Resumen')).toBeVisible()
    await expect(page.getByRole('button', { name: /Gira Norte/ }).first()).toBeVisible()
  })
}

test('beta 18 permite editar y limpiar notas contextuales', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await setupBeta18(page)

  await page.goto(`/projects/${projectId}`)
  await editAndClearContextNote(page, 'Nota actualizada de proyecto')

  await page.goto(`/events/${eventId}`)
  await editAndClearContextNote(page, 'Nota actualizada de evento')
})
