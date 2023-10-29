import { Person } from "src/app/app.models";

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
      checkProperties(card: string, person: Person): Chainable<void>;
      checkPropertiesCards(): Chainable<void>;
    }
  }
}
const WINNER = 'And the winner is';

Cypress.Commands.add('getCyData', (label) => {
  cy.get(`[data-cy="${label}"]`);
});

Cypress.Commands.add('visitPage', () => {
  const resultsNumber = 82;

  cy.intercept('https://www.swapi.tech/api/people', {
    fixture: 'data-people.json',
  }).as('getPeople');
  cy.visit('/');
  cy.contains('CP GAME').should('be.visible');
  cy.wait('@getPeople')
    .its('response.body.total_records')
    .should('eq', resultsNumber);
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
  cy.getCyData('game-counter-1').contains(counter1);
  cy.getCyData('game-counter-2').contains(counter2);
});

Cypress.Commands.add('getNoWinner', (card) => {
  cy.getCyData(card).should('not.include.text', WINNER);
});

Cypress.Commands.add('getWinner', (card) => {
  cy.getCyData(card).should('contain', WINNER);
});

Cypress.Commands.add('checkPropertiesCards', () => {
  cy.fixture('data.json').then(results => {
    cy.checkProperties('card-properties-0', results.data[0].result.properties)
    cy.checkProperties('card-properties-1', results.data[1].result.properties)
  });
});

Cypress.Commands.add('checkProperties', (card, properties) => {
  cy.getCyData(card)
    .should('contain', properties['height'])
    .and('contain', properties['mass'])
    .and('contain', properties['eye_color'])
    .and('contain', properties['gender'])
    .and('contain', properties['birth_year'])
    .and('contain', properties['skin_color'])
    .and('contain', properties['hair_color'])
    .and('contain', properties['edited'])
    .and('contain', properties['created'])
});



