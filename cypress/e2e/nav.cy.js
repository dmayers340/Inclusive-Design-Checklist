describe('NavBar navigation', () => {
  it('navigates between pages via navbar links', () => {
    cy.visit('/');
    cy.checkA11yAppFiltered(undefined, { skipRules: ['color-contrast'] });

    cy.findByRole('link', { name: /Create New Report/i }).click();
    cy.url().should('include', '/create');

    cy.findByRole('link', { name: /Dashboard/i }).click();
    cy.url().should('include', '/dashboard');

    cy.findByRole('link', { name: /View Reports/i }).click();
    cy.url().should('include', '/reports');

    cy.findByRole('link', { name: /Home/i }).click();
    cy.url().should('match', /\/$/);
  });
});
