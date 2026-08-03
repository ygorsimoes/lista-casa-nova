import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: Boolean(process.env.CI),
  retries: process.env.CI ? 1 : 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: 'http://127.0.0.1:4173/lista-casa-nova/',
    locale: 'pt-BR',
    contextOptions: { reducedMotion: 'reduce' },
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  projects: [
    {
      name: 'mobile-chromium',
      grepInvert: /@desktop/,
      use: { ...devices['Pixel 7'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'mobile-webkit',
      grepInvert: /@desktop/,
      use: { ...devices['iPhone 13'], viewport: { width: 360, height: 800 } },
    },
    {
      name: 'desktop-chromium',
      grep: /@desktop/,
      use: {
        ...devices['Desktop Chrome'],
        viewport: { width: 1280, height: 900 },
      },
    },
  ],
  webServer: {
    command: 'npm run preview -- --host 127.0.0.1 --port 4173',
    url: 'http://127.0.0.1:4173/lista-casa-nova/',
    reuseExistingServer: !process.env.CI,
  },
})
