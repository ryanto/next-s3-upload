/// <reference types="cypress" />

describe("Access by temporary/signed url", () => {
  it("should be able to upload a file and access it", () => {
    cy.visit("/examples/access-by-temporary-url");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=signed-image]").isFixtureImage("woods.jpg");
  });
});
