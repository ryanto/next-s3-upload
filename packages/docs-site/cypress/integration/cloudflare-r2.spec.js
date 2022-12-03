/// <reference types="cypress" />

describe("Cloudflare R2", () => {
  it("should be able to upload a file and access it", () => {
    cy.visit("/examples/cloudflare-r2");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");
    cy.get("button")
      .contains("Start upload")
      .click();

    cy.get("[data-test=image]").isFixtureImage("woods.jpg");
  });
});
