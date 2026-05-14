import { expect, test, type Page, type APIRequestContext } from '@playwright/test'

const userId = '00000000-0000-4000-8000-000000000021'
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://mkidexrkhjhrsjnjmugw.supabase.co'
const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
const authStorageKey = `sb-${projectRef}-auth-token`

const authSession = {
  access_token: 'local-onboarding-e2e-token',
  refresh_token: 'local-onboarding-e2e-refresh',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'onboarding@example.com',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: new Date().toISOString(),
  },
}

function jsonResponse(body: unknown) {
  return {
    status: 200,
    contentType: 'application/json',
    headers: { 'cache-control': 'no-store' },
    body: JSON.stringify(body),
  }
}

async function setupSession(page: Page, profileOverrides = {}) {
  let profile = {
    id: userId,
    full_name: 'Onboarding Beta',
    profession: 'Gestora cultural',
    tax_rate: 15,
    onboarding_completed: true,
    onboarding_completed_at: new Date().toISOString(),
    usage_consent: false,
    usage_consent_at: null,
    usage_consent_version: null,
    role: 'user',
    ...profileOverrides,
  }

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

    if (table === 'profiles') {
      if (request.method() === 'PATCH') {
        profile = { ...profile, ...request.postDataJSON() }
      }
      await route.fulfill(jsonResponse(profile))
      return
    }

    await route.fulfill(jsonResponse([]))
  })
}

async function advanceUntilHeading(page: Page, heading: string) {
  for (let index = 0; index < 8; index += 1) {
    if (await page.getByRole('heading', { name: heading }).isVisible().catch(() => false)) return
    await page.getByRole('button', { name: 'Continuar' }).click()
  }
}

async function expectManifest(request: APIRequestContext) {
  const response = await request.get('/manifest.webmanifest')
  expect(response.ok()).toBe(true)
  const manifest = await response.json()
  expect(manifest.display).toBe('standalone')
  expect(manifest.scope).toBe('/')
  expect(manifest.start_url).toBe('/dashboard')
  expect(manifest.icons).toEqual(expect.arrayContaining([
    expect.objectContaining({ sizes: '192x192', type: 'image/png' }),
    expect.objectContaining({ sizes: '512x512', type: 'image/png' }),
    expect.objectContaining({ purpose: 'maskable' }),
  ]))
}

test('nuevo usuario entra al tutorial, ve instalar como app y termina en ajustes', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await setupSession(page, {
    onboarding_completed: false,
    onboarding_completed_at: null,
    usage_consent: false,
  })

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/onboarding$/)
  await expect(page.getByRole('heading', { name: 'Aprende lo esencial de Cachés' })).toBeVisible()
  await expect(page.getByText('Paso 1/7')).toBeVisible()
  const tutorialCardBox = await page.getByTestId('onboarding-tutorial-card').boundingBox()
  expect(tutorialCardBox).toBeTruthy()
  expect(tutorialCardBox!.height).toBeLessThan(760)

  await advanceUntilHeading(page, 'Usar Cachés como app')
  await expect(page.getByText('iPhone: abre app.caches.es en Safari')).toBeVisible()
  await expect(page.getByText('Android: abre app.caches.es en Chrome')).toBeVisible()

  await advanceUntilHeading(page, 'Privacidad y uso')
  await page.getByRole('button', { name: 'Guardar y ver perfil' }).click()
  await expect(page).toHaveURL(/\/settings$/)
  await expect(page.getByRole('heading', { name: 'Ajustes' })).toBeVisible()
})

test('nuevo usuario puede cerrar el tutorial y seguir en inicio', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await setupSession(page, {
    onboarding_completed: false,
    onboarding_completed_at: null,
    usage_consent: false,
  })

  await page.goto('/dashboard')
  await expect(page).toHaveURL(/\/onboarding$/)
  await page.getByRole('button', { name: 'Cerrar tutorial' }).click()
  await expect(page).toHaveURL(/\/dashboard$/)
  await expect(page.getByRole('heading', { name: 'Inicio' })).toBeVisible()
  const firstSteps = page.getByTestId('first-steps-checklist')
  await expect(firstSteps.getByRole('button', { name: 'Mostrar primeros pasos' })).toBeVisible()
  await firstSteps.getByRole('button', { name: 'Mostrar primeros pasos' }).click()
  await expect(firstSteps.getByRole('button', { name: 'Ocultar primeros pasos' })).toBeVisible()
})

test('ajustes permite volver a abrir el tutorial', async ({ page }) => {
  await setupSession(page)

  await page.goto('/settings')
  await page.getByRole('link', { name: 'Ver tutorial' }).click()
  await expect(page).toHaveURL(/\/onboarding$/)
  await advanceUntilHeading(page, 'Usar Cachés como app')
  await expect(page.getByText('iPhone: abre app.caches.es en Safari')).toBeVisible()
  await expect(page.getByText('Android: abre app.caches.es en Chrome')).toBeVisible()
  await page.getByRole('button', { name: 'Cerrar tutorial' }).click()
  await expect(page).toHaveURL(/\/settings$/)
})

test('manifest PWA declara standalone, scope e iconos requeridos', async ({ request }) => {
  await expectManifest(request)
})
