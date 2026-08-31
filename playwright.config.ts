import { defineConfig, devices } from "@playwright/test";
import type { NextcovConfig } from "nextcov";

// Extend Playwright config type to include nextcov
type PlaywrightConfigWithNextcov = Parameters<typeof defineConfig>[0] & {
  nextcov?: NextcovConfig;
};

/**

* Read environment variables from file.

* https://github.com/motdotla/dotenv

*/

// import dotenv from 'dotenv';

// import path from 'path';

// dotenv.config({ path: path.resolve(__dirname, '.env') });

/**

* See https://playwright.dev/docs/test-configuration.

*/

// Nextcov configuration - exported separately since defineConfig strips unknown properties
export const nextcov: NextcovConfig = {
  cdpPort: 9230,
  buildDir: "dist", // Production build output directory
  outputDir: "./coverage/integration",
  sourceRoot: "./src",
  include: ["src/app/**/*.{ts,tsx}", "src/api/**/*.{ts,tsx}"],
  exclude: ["src/**/__tests__/**", "src/**/*.test.{ts,tsx}", "src/types/**"],
  reporters: ["html", "lcov", "json", "text-summary"],
  log: false,
  timing: true,
};

const config: PlaywrightConfigWithNextcov = {
  testDir: "./e2e",

  /* Run tests in files in parallel */

  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code. */

  forbidOnly: !!process.env.CI,

  /* Retry on CI only */

  retries: process.env.CI ? 2 : 0,

  /* Each Playwright worker gets its own isolated mock-server bucket
     (msw-terrarium), so CI can now run real parallel workers instead of
     being forced serial. */

  workers: process.env.CI ? 4 : undefined,

  globalSetup: "./e2e/global-setup.ts",
  globalTeardown: "./e2e/global-teardown.ts",

  outputDir: "./playwright-results",
  reporter: [["list"], ["html", { outputFolder: "./playwright-report" }]],

  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */

  use: {
    /* Base URL to use in actions like `await page.goto('/')`. */

    baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */

    trace: "on-first-retry",
  },

  /* Configure projects for major browsers */

  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
  ],

  webServer: [
    {
      command: 'npm run mock',
      port: 3001,
      name: 'mock server',
      reuseExistingServer: true,
    },
    {
      command: 'npm run dev',
      url: 'http://localhost:3000',
      name: 'dev server',
      timeout: 120 * 1000,
      reuseExistingServer: true,
    }
  ],

  nextcov,
};

export default defineConfig(config);
