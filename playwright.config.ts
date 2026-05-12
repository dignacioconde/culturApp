import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  reporter: process.env.CI ? [['html', { open: 'never' }], ['github']] : 'list',
  webServer: {
    command: 'npm run dev -- --host 127.0.0.1',
    url: 'http://127.0.0.1:5173',
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: {
      VITE_SUPABASE_URL: process.env.VITE_SUPABASE_URL ?? 'https://mkidexrkhjhrsjnjmugw.supabase.co',
      VITE_SUPABASE_ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY ?? 'local-e2e-anon-key',
    },
  },
  use: {
    baseURL: process.env.PLAYWRIGHT_BASE_URL ?? 'http://127.0.0.1:5173',
  },
})
