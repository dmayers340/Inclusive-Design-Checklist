const LS_KEY = 'inclusive-reports';

describe('View Reports list', () => {
  beforeEach(() => {
    const reports = [
      { id: 'R1', buildingId: 'BLD-001', buildingName: 'NYC', createdAt: '2025-01-01T00:00:00.000Z', itemCount: 5, status: 'Draft', items: [], statuses: {} },
      { id: 'R2', buildingId: 'BLD-002', buildingName: 'LDN', createdAt: '2025-02-01T00:00:00.000Z', itemCount: 8, status: 'Draft', items: [], statuses: {} }
    ];

    cy.visit('/reports', {
      onBeforeLoad(win) {
        win.localStorage.setItem(LS_KEY, JSON.stringify(reports));
      }
    });
  });

  it('renders saved reports and passes a11y', () => {
    cy.contains('NYC');
    cy.contains('LDN');
    cy.get('table').should('exist');

    cy.checkA11yAppFiltered(undefined, { skipRules: ['color-contrast'] });
  });
});
