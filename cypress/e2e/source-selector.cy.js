describe('SourceSelector flows', () => {
  beforeEach(() => {
    // Intercept the sample load
    cy.intercept('GET', '/inputs/inclusive_checklist.json', {
      statusCode: 200,
      body: [{ ID: 'S1', 'Checklist Item (Raw)': 'Sample', Severity: 'Low', Spaces: 'Lobby' }]
    }).as('getSample');
  });

  it('loads sample JSON and shows loaded meta', () => {
    cy.visit('/'); // wherever SourceSelector is rendered
    cy.findByLabelText(/Checklist Source/i).select('Use sample (inclusive_checklist.json)');
    cy.wait('@getSample');
    cy.contains(/Loaded:\s*Sample/i);
  });

  it('uploads a custom JSON file', () => {
    cy.visit('/');

    // Trigger upload option
    cy.findByLabelText(/Checklist Source/i).select('Upload custom (.json)');

    // The hidden input—give it a data-testid in your component for reliability (recommended):
    // <input data-testid="source-file" type="file" ... />
    cy.get('input[type="file"]').selectFile(
      {
        contents: Cypress.Buffer.from(JSON.stringify([{ ID: 'U1' }])),
        fileName: 'my-checklist.json',
        mimeType: 'application/json',
        lastModified: Date.now()
      },
      { force: true }
    );

    cy.contains(/Loaded:.*my-checklist\.json/i);
  });
});
