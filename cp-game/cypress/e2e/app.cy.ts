const testData = require('../fixtures/data.json');
const npDataHeight = require('../fixtures/data-no-height.json');

describe('CP game', () => {
  const name1 = 'Luke Skywalker';
  const name2 = 'C-3PO';
  const name3 = 'R2-D2';
  const name4 = 'Beru Whitesun lars';
  const urlPerson = 'https://www.swapi.tech/api/people/*'

  describe('everything working ok', () => {
    beforeEach(() => {
      const responses = testData.data.concat([]);

      cy.intercept(urlPerson, (req) =>
        req.reply(responses.shift()),
      ).as('getPerson');
      cy.visitPage();

      cy.wait(['@getPerson', '@getPerson']);
      cy.getCyData('cards').should('be.visible');
      cy.checkPropertiesCards()
    });

    it('page were loaded with cards', () => {
      cy.getWinner('card-0').and('contain', name1);
      cy.getNoWinner('card-1').and('contain', name2);
      cy.propertyIsGreater('height-property-0', 'height-property-1');
      cy.counters(1, 0);
    });

    it('try again', () => {
      cy.tryAgain();
      cy.getWinner('card-1').and('contain', name4);
      cy.getNoWinner('card-0').and('contain', name3);
      cy.counters(1, 1);
      cy.propertyIsGreater('height-property-1', 'height-property-0');
    });

    it('change attribute and try again', () => {
      cy.get('mat-select').click().get('mat-option').contains('mass').click();
      cy.tryAgain();
      cy.getWinner('card-1').and('contain', name4);
      cy.getNoWinner('card-0').and('contain', name3);
      cy.propertyIsGreater('height-property-1', 'height-property-0');
      cy.counters(1, 1);
    });
  });

  describe('height is unknown', () => {
    beforeEach(() => {
      const responses = npDataHeight.data.concat([]);

      cy.intercept(urlPerson, (req) =>
        req.reply(responses.shift()),
      ).as('getPerson');
      cy.visitPage();

      cy.wait(['@getPerson', '@getPerson']);
      cy.getCyData('cards').should('be.visible');
    });

    it('one height property is unknown', () => {
      const warningMsg =
        'The winner is undecided - some attributes are unknown.';

      cy.get('[data-cy="game"]').contains(warningMsg);
      cy.getNoWinner('card-0').and('contain', name1);
      cy.getNoWinner('card-1').and('contain', name2);
      cy.getCyData('height-property-0')
        .invoke('text')
        .should('match', /^[0-9]*$/);
      cy.getCyData('height-property-1')
        .invoke('text')
        .should('contain', 'unknown');
      cy.counters(0, 0);
    });
  });

  describe('there are some problems', () => {
    beforeEach(() => {
      cy.intercept(urlPerson, {
        statusCode: 404,
      }).as('getPerson');
      cy.visitPage();
    });

    it('there is an error 404', () => {
      cy.wait(['@getPerson', '@getPerson']).then((res) => {
        expect(res[0]['response'].statusCode).to.equal(404);
        expect(res[1]['response'].statusCode).to.equal(404);
      });
      cy.get('[data-cy="game-loader"]').should('not.exist');
      cy.get('[data-cy="error-message"]').should('be.visible');
      cy.getCyData('card-0').should('not.exist');
      cy.getCyData('card-1').should('not.exist');
      cy.counters(0, 0);
    });
  });
});
