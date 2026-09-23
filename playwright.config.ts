import { defineConfig, devices } from '@playwright/test';

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // reporter: 'html',
  reporter : [['list'],['html', { open: 'always' }]],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    /* Collect traces, screenshots, and videos when tests fail to make debugging easier */
    trace: 'retain-on-failure',         // Retains trace files only for failures
    screenshot: 'only-on-failure',     // Automatically takes a screenshot on failure
    video: 'retain-on-failure',        // Automatically records video on failure
    
    // Note: Headless mode can be modified here globally or left to default (true)
    headless: true, 
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { 
        ...devices['Desktop Chrome'],
        /* Apply your custom common Chromium optimization flags here */
        launchOptions: {
          args: [
            '--disable-smooth-scrolling',
            '--log-level=3',
            // Note: Playwright natively launches sandbox-free, isolated, audio-muted profiles already!
          ]
        }
      },
    },

    {
      name: 'firefox',
      use: { 
        ...devices['Desktop Firefox'],
        /* Apply your custom Firefox preference tuning options here */
        launchOptions: {
          firefoxUserPrefs: {
            'browser.cache.disk.enable': false,
            'browser.cache.memory.enable': false,
            'browser.cache.offline.enable': false,
            'network.http.use-cache': false,
            'dom.ipc.processCount': 1
          }
        }
      },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],
});