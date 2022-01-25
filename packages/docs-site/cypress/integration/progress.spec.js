/// <reference types="cypress" />

describe("Tracking progress", () => {
  it("should show a files progress as it uploads.", () => {
    cy.visit("/examples/progress");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=progress]").should("be.visible");

    cy.get("[data-test=progress]")
      .contains("100%")
      .should("exist");

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
  });
});
