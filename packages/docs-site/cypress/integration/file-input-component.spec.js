/// <reference types="cypress" />

describe("FileInput example", () => {
  it("should be able to upload a file using the FileInput component", () => {
    cy.visit("/examples/file-input-component");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
  });
});
