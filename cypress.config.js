const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:5173',      // Vite dev server
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    video: true,
    screenshotOnRunFailure: true,
    retries: { runMode: 2, openMode: 0 },  // retry flaky specs in CI
    viewportWidth: 1366,
    viewportHeight: 900,
  },
  env: {
    // place any app-specific secrets/flags if needed
  },
});
