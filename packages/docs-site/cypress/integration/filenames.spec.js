/// <reference types="cypress" />

describe("File names and keys", () => {
  it("should be able to upload a file with spaces", () => {
    cy.visit("/examples/filenames-and-keys");

    cy.get("[data-test=file-input]").attachFile("lake with spaces.jpg");

    cy.get("[data-test=image]").isFixtureImage("lake with spaces.jpg");

    cy.get("[data-test=key]")
      .contains("lake-with-spaces.jpg")
      .should("exist");
  });

  it("should be able to upload a file with pipes", () => {
    cy.visit("/examples/filenames-and-keys");

    cy.get("[data-test=file-input]").attachFile("lake|with|pipes.jpg");

    cy.get("[data-test=image]").isFixtureImage("lake|with|pipes.jpg");

    cy.get("[data-test=key]")
      .contains("lake-with-pipes.jpg")
      .should("exist");
  });

  it("should be able to upload a file with non latin characters", () => {
    cy.visit("/examples/filenames-and-keys");

    cy.get("[data-test=file-input]").attachFile("lake-with-non-látīn.jpg");

    cy.get("[data-test=image]").isFixtureImage("lake-with-non-látīn.jpg");

    cy.get("[data-test=key]")
      .contains("lake-with-non-l-t-n.jpg")
      .should("exist");
  });
});
