describe('Home accessibility', () => {
  it('has no serious/critical violations', () => {
    cy.visit('/');
    cy.checkA11yAppFiltered(undefined, { skipRules: ['color-contrast'] });
  });
});
