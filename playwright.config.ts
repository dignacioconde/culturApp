import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://localhost:5173',
  },
})
