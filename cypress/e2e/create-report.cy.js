describe('Create New Report flow', () => {
  beforeEach(() => {
    // Stub buildings and checklist APIs
    cy.intercept('GET', '/inputs/buildings.json', {
      statusCode: 200,
      body: [{ id: 'BLD-001', name: 'HQ' }]
    }).as('getBuildings');

    cy.intercept('GET', '/inputs/inclusive_checklist.json', {
      statusCode: 200,
      body: [
        {
          ID: 'X',
          'Checklist Item (Raw)': 'Doors clear width',
          Severity: 'High',
          Spaces: 'Lobby',
          Bronze: '≥34"',
          Silver: '≥36"',
          Gold: '≥36" powered'
        }
      ]
    }).as('getChecklist');
  });

  it('selects building, loads checklist, sets radio, saves, a11y passes', () => {
    cy.visit('/create');
    cy.wait('@getBuildings');

    cy.contains('label', /Building/i);
    cy.get('select.form-select').select('BLD-001');

    cy.contains('button', /Load Inclusive Checklist/i).click();
    cy.wait('@getChecklist');
    cy.contains('.card-header', /Lobby/);

    // Set status to Gold
    cy.contains('label', /^Gold$/).click();
    cy.contains('label', /^Gold$/).prev('input[type="radio"]').should('be.checked');

    // Save report
    cy.window().then((win) => cy.stub(win, 'alert').as('alert'));
    cy.contains('button', /Save Report/i).click();
    cy.get('@alert').should('have.been.called');

    // a11y
    cy.checkA11yAppFiltered(undefined, { skipRules: ['color-contrast'] });
  });
});
