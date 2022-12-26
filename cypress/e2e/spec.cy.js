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

  it('should correctly display custom built in element section', () => {
    cy.visit('/');
    cy.get('#custom-built-in-element-section').within(() => {
      cy.get('h2').should(
        'contain',
        'Custom Built-in Element - expanding-list',
      );
      cy.get('[is="expanding-list"]')
        .should('exist')
        .and('be.visible')
        .within(() => {
          cy.get('span').eq('1').as('secondSpan').should('not.be.visible');
          cy.get('span:first').click();
          cy.get('@secondSpan').should('be.visible');
        });
    });
  });
});
