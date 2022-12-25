// / <reference types="cypress" />

describe('page', () => {
  it('should display h1', () => {
    cy.visit('/');
    cy.get('h1').should('have.text', 'Web Components Deep Dive');
  });

  it('should correctly display autonomous custom element section', () => {
    cy.visit('/');
    cy.get('#autonomous-custom-element-section').within(() => {
      cy.get('h2').should('contain', 'Autonomous Custom Element - popup-info');
      cy.get('popup-info').then(($popups) => {
        for (let $popup of $popups) {
          cy.get($popup)
            .should('exist')
            .and('be.visible')
            .trigger('mouseover')
            .shadow()
            .within(() => {
              cy.get('.info')
                .should('exist')
                .and('be.visible')
                .and('have.text', $popup.getAttribute('data-text'));
            });

          cy.get($popup)
            .trigger('mouseout')
            .shadow()
            .within(() => {
              cy.get('.info').should('not.be.visible');
            });
        }
      });
    });
  });
});
