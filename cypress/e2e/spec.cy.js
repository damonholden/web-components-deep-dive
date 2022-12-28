// / <reference types="cypress" />

const url = 'using-custom-elements.html';

describe('page', () => {
  it('should correctly display autonomous custom element section', () => {
    cy.visit(url);
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
    cy.visit(url);
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

  it('should correctly display custom the lifecycle callback demo', () => {
    cy.visit(url);
    cy.get('#lifecycle-callback-demo-section').within(() => {
      const boxProps = {
        width: null,
        height: null,
        color: null,
      };
      cy.get('h2').should('contain', 'Lifecycle Callbacks Demo');
      cy.get('div.container').as('container').should('exist').and('be.empty');
      cy.get('span.message').as('message').should('exist').should('be.empty');
      cy.get('button.add').click();
      cy.get('@container')
        .should('not.be.empty')
        .within(() => {
          cy.get('custom-square')
            .should('exist')
            .and('be.visible')
            .then(($square) => {
              boxProps.width = $square[0].getAttribute('l');
              boxProps.height = $square[0].getAttribute('l');
              boxProps.color = $square[0].getAttribute('c');
            });
        });
      cy.get('@message')
        .should('not.be.empty')
        .and('have.text', 'custom square element added to page');
      cy.get('button.update').click();
      cy.get('@container')
        .should('not.be.empty')
        .within(() => {
          cy.get('custom-square')
            .should('exist')
            .and('be.visible')
            .then(($square) => {
              console.log($square);
              expect($square[0].getAttribute('l')).not.to.equal(boxProps.width);
              expect($square[0].getAttribute('l')).not.to.equal(
                boxProps.height,
              );
              expect($square[0].getAttribute('c')).not.to.equal(boxProps.color);
            });
        });
      cy.get('@message').should(
        'have.text',
        'custom square element attributes changed',
      );
      cy.get('button.remove').click();
      cy.get('@container').should('be.empty');
      cy.get('@message').should(
        'have.text',
        'custom square element removed from page',
      );
    });
  });
});
