// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

import "cypress-file-upload";
import "cypress-wait-until";

Cypress.Commands.add(
  "isFixtureImage",
  {
    prevSubject: true
  },
  (subject, fixtureImage) => {
    cy.wrap(subject)
      .should(([img]) => {
        expect(img.complete).to.be.true;
      })
      .then(([img]) => {
        cy.fixture(fixtureImage).then(content => {
          let fixtureImage = new Image();
          fixtureImage.src = `data:image/jpeg;base64,${content}`;
          return new Promise(resolve => {
            fixtureImage.onload = () => {
              expect(img.naturalWidth).to.equal(fixtureImage.naturalWidth);
              expect(img.naturalHeight).to.equal(fixtureImage.naturalHeight);
              resolve();
            };
          });
        });
      });
  }
);
