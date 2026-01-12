import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  timeout: 30_000,
  expect: {
    timeout: 5_000,
  },
  use: {
    baseURL: "http://localhost:3000",
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run dev -- -p 3000",
    port: 3000,
    reuseExistingServer: !process.env.CI,
    env: {
      ...process.env,
      NODE_OPTIONS: "--openssl-legacy-provider",
    },
  },
});
