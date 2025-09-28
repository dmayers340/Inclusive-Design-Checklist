import 'cypress-axe';
// (Optional) Testing Library commands for better queries:
try {
  // npm i -D @testing-library/cypress
  require('@testing-library/cypress/add-commands');
} catch (_) {}

// Filtered a11y helper to skip known false positives (e.g., canvas contrast)
Cypress.Commands.add('checkA11yAppFiltered', (context, { skipRules = [], includedImpacts = ['critical','serious'] } = {}) => {
  cy.injectAxe();
  cy.checkA11y(
    context,
    {
      includedImpacts,
      rules: Object.fromEntries(skipRules.map(r => [r, { enabled: false }]))
    },
    (violations) => {
      violations.forEach(v => {
        Cypress.log({ name: 'a11y', message: `${v.id}: ${v.help}`, consoleProps: () => v });
      });
    }
  );
});
