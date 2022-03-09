/// <reference types="cypress" />

describe("Custom key paths", () => {
  it("should upload to S3 using a custom key path", () => {
    cy.visit("/examples/custom-key");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
    cy.get("[data-test=url]")
      .contains("another-path/WOODS.JPG")
      .should("exist");
  });
});
