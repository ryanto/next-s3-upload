/// <reference types="cypress" />

describe("Digital ocean spaces", () => {
  it("should be able to upload a file and access it", () => {
    cy.visit("/examples/digital-ocean-spaces");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");
    cy.get("button")
      .contains("Start upload")
      .click();

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
  });
});
