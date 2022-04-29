/// <reference types="cypress" />

describe("Custom key paths based on requests", () => {
  it("should upload to S3 using a custom key path based on the request", () => {
    cy.visit("/examples/custom-key-based-on-request");

    cy.get("[data-test=header-name-input]").type("header");
    cy.get("[data-test=body-name-input]").type("body");
    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
    cy.get("[data-test=url]")
      .contains("/header/body/woods.jpg")
      .should("exist");
  });
});
