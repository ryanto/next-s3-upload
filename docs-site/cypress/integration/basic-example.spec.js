/// <reference types="cypress" />

describe("Basic example", () => {
  it("should be able to upload a file", () => {
    cy.visit("/examples/basic");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("button")
      .contains("Start upload")
      .click();

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
  });
});
