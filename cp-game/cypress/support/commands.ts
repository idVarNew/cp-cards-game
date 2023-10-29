export { };

declare global {
  namespace Cypress {
    interface Chainable {
      propertyIsGreater(element1: string, element2: string): Chainable<void>;
      getCyData(label: string): Chainable<void>;
      tryAgain(): Chainable<void>;
      visitPage(): Chainable<void>;
      counters(counter1: number, counter2: number): Chainable<void>;
      getNoWinner(card: string): Chainable<void>;
      getWinner(card: string): Chainable<void>;
    }
  }
}
const WINNER = 'And the winner is';

Cypress.Commands.add('getCyData', (label) => {
  cy.get(`[data-cy="${label}"]`);
});

Cypress.Commands.add('visitPage', () => {
  const resultsNumber = 82;

  cy.intercept('https://www.swapi.tech/api/people', { fixture: 'data-people.json' }).as('getPeople');
  cy.visit('/');
  cy.contains('CP GAME').should('be.visible');
  cy.wait('@getPeople')
    .its('response.body.total_records')
    .should('eq', resultsNumber)

});

Cypress.Commands.add('propertyIsGreater', (element1, element2) => {
  cy.getCyData(element1)
    .invoke('text')
    .then((text1) => {
      cy.getCyData(element2)
        .invoke('text')
        .then((text2) => {
          expect(Number(text1)).greaterThan(Number(text2));
        });
    });
});

Cypress.Commands.add('tryAgain', () => {
  cy.getCyData('try-again').click();
  cy.get('@getPerson');
  cy.wait(['@getPerson', '@getPerson']);
  cy.getCyData('cards').should('be.visible');
});

Cypress.Commands.add('counters', (counter1, counter2) => {
  cy.getCyData('counter-user-1').contains(counter1);
  cy.getCyData('counter-user-2').contains(counter2);
});

Cypress.Commands.add('getNoWinner', (card) => {
  cy.getCyData(card).should('not.include.text', WINNER)
});

Cypress.Commands.add('getWinner', (card) => {
  cy.getCyData(card).should('contain', WINNER)
});
