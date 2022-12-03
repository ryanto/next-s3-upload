/// <reference types="cypress" />

describe("Next/image example", () => {
  it("should work with next/image", () => {
    cy.visit("/examples/next-image");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");
    cy.get("button")
      .contains("Start upload")
      .click();

    cy.get("[data-test=image]").imageHasLoaded();

    cy.fixtureImageData("woods.jpg").then(({ height, width }) => {
      cy.get("[data-test=height]")
        .contains(height)
        .should("exist");

      cy.get("[data-test=width]")
        .contains(width)
        .should("exist");
    });
  });
});
