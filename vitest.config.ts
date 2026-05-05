import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.ts'],
    projects: [
      {
        extends: true,
        test: {
          name: 'utc',
          env: { TZ: 'UTC' },
        },
      },
      {
        extends: true,
        test: {
          name: 'madrid',
          env: { TZ: 'Europe/Madrid' },
        },
      },
    ],
  },
})
