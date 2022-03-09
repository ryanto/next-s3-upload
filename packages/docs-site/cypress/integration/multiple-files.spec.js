/// <reference types="cypress" />

describe("Multiple files example", () => {
  it("should be able to upload multiple files", () => {
    cy.visit("/examples/multiple-files");

    cy.get("[data-test=file-input]").attachFile([
      "woods.jpg",
      "mountains.jpg",
      "lake.jpg"
    ]);

    cy.get("[data-test=image-0]").isFixtureImage("woods.jpg");
    cy.get("[data-test=image-1]").isFixtureImage("mountains.jpg");
    cy.get("[data-test=image-2]").isFixtureImage("lake.jpg");
  });
});
