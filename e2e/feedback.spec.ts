import { expect, test } from '@playwright/test'

const userId = '00000000-0000-4000-8000-000000000053'
const supabaseUrl = process.env.VITE_SUPABASE_URL ?? 'https://mkidexrkhjhrsjnjmugw.supabase.co'
const projectRef = new URL(supabaseUrl).hostname.split('.')[0]
const authStorageKey = `sb-${projectRef}-auth-token`

const authSession = {
  access_token: 'local-feedback-e2e-token',
  refresh_token: 'local-feedback-e2e-refresh',
  expires_at: Math.floor(Date.now() / 1000) + 3600,
  expires_in: 3600,
  token_type: 'bearer',
  user: {
    id: userId,
    aud: 'authenticated',
    role: 'authenticated',
    email: 'beta@example.com',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: new Date().toISOString(),
  },
}

test('mantiene el foco al escribir en el feedback', async ({ page }) => {
  await page.addInitScript(({ key, value }) => {
    window.localStorage.setItem(key, JSON.stringify(value))
  }, { key: authStorageKey, value: authSession })

  await page.route('**/rest/v1/profiles**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        id: userId,
        full_name: 'Beta Feedback',
        profession: 'Gestora cultural',
        tax_rate: 15,
        onboarding_completed: true,
        usage_consent: true,
        role: 'user',
      }),
    })
  })

  await page.route('**/rest/v1/{projects,events,incomes,expenses}**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: '[]' })
  })
  await page.route('**/auth/v1/**', async (route) => {
    await route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(authSession) })
  })

  await page.goto('/dashboard')
  await page.getByLabel('Enviar feedback').click()

  const dialog = page.getByRole('dialog', { name: 'Cuéntanos qué mejorar' })
  const textarea = dialog.getByLabel('Tu comentario *')
  await textarea.click()
  await page.keyboard.press('a')
  await page.keyboard.press('b')
  await page.keyboard.press('c')

  await expect(dialog).toBeVisible()
  await expect(textarea).toBeFocused()
  await expect(textarea).toHaveValue('abc')
})
