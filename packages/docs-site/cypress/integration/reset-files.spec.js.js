/// <reference types="cypress" />

describe("Reset files", () => {
  it("should be able to reset the files array", () => {
    cy.visit("/examples/reset-files");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=files-0]").should("exist");

    cy.get("[data-test=files-0] [data-test=progress]")
      .contains("100%")
      .should("exist");

    cy.get("[data-test=reset-files]").click();

    cy.get("[data-test=files-0]").should("not.exist");
  });
});
