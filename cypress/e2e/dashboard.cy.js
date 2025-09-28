const LS_KEY = 'inclusive-reports';

describe('Dashboard metrics & charts', () => {
  beforeEach(() => {
    const report = {
      id: 'REP-1',
      buildingId: 'BLD-001',
      buildingName: 'HQ',
      createdAt: '2025-01-01T00:00:00.000Z',
      status: 'Draft',
      itemCount: 2,
      statuses: { A: 'Bronze', B: 'Not met' },
      items: [
        { ID: 'A', Severity: 'High', Spaces: 'Lobby', Bronze: 'b', Silver: 's', Gold: 'g' },
        { ID: 'B', Severity: 'Low',  Spaces: 'Work Floor', Bronze: 'b', Silver: 's', Gold: 'g' }
      ]
    };

    cy.visit('/dashboard', {
      onBeforeLoad(win) {
        win.localStorage.setItem(LS_KEY, JSON.stringify([report]));
      }
    });
  });

  it('renders metrics and charts; toggles data table; a11y passes', () => {
    // Metrics present
    cy.contains(/Weighted Coverage/i);
    cy.contains(/Critical Items Met/i);
    cy.contains(/Tier/i);

    // Toggle the first data table (Severity Coverage)
    cy.contains('button', /Show data table/i).first().click();
    // Assert one known cell exists (won’t know exact values without mirroring; presence is fine)
    cy.get('table').first().within(() => {
      cy.contains('th', 'Severity');
      cy.contains('td', 'High');
    });

    cy.checkA11yAppFiltered(undefined, { skipRules: ['color-contrast'] });
  });
});
