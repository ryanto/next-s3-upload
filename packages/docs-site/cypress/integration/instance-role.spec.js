/// <reference types="cypress" />

describe("Instance Role", () => {
  if (Cypress.env("INSTANCE_ROLE_TEST")) {
    it("should be able to upload a file and access it", () => {
      cy.visit("/examples/instance-role");

      cy.get("[data-test=file-input]").attachFile("woods.jpg");
      cy.get("button")
        .contains("Start upload")
        .click();

      cy.get("[data-test=image]").isFixtureImage("woods.jpg");
    });
  }
});
