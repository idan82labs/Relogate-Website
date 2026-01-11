import { defineConfig, devices } from "@playwright/test";

/**
 * Playwright configuration for visual verification screenshots.
 * Used by AI agents to capture implementation screenshots for comparison with Figma designs.
 */
export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  workers: 1,
  reporter: "list",

  use: {
    baseURL: "http://localhost:3000",
    trace: "off",
    screenshot: "only-on-failure",
  },

  projects: [
    {
      name: "mobile",
      use: {
        ...devices["iPhone 14"],
        viewport: { width: 375, height: 812 },
      },
    },
    {
      name: "desktop",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 1440, height: 900 },
      },
    },
  ],

  webServer: {
    command: "npm run dev",
    url: "http://localhost:3000",
    reuseExistingServer: true,
    timeout: 120000,
  },
});
