/// <reference types="cypress" />

describe("Basic example", () => {
  it("should be able to upload a file", () => {
    cy.visit("/examples/basic");

    cy.get("[data-test=file-input]").attachFile("woods.jpg");

    cy.get("[data-test=image]")
      .should("be.visible")
      .waitUntil(([img]) => img.complete && img)
      .then(([img]) => {
        expect(img.complete).to.be.true;
        expect(img.naturalWidth).to.be.greaterThan(0);
      });
  });
});
