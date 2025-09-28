describe('App a11y smoke', () => {
    it('Home has no serious/critical violations', () => {
        cy.visit('/');
        cy.checkA11yApp();
    });

    it('Create Report loads buildings & checklist', () => {
        cy.visit('/create');
        cy.checkA11yApp();

        cy.contains('label', /Building/i);
        cy.get('select.form-select').select(1, { force: true });

        cy.contains('button', /Load Inclusive Checklist/i).click();
        cy.contains('.card-header', /Lobby|Work Floor|Entrance/, { timeout: 8000 });

        cy.checkA11yApp();
    });
});
