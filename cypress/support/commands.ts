/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

Cypress.Commands.add(
  "login",
  (email: string = "test1@test.com", password: string = "testtest") => {
    cy.visit("/sign-in");
    cy.url().should("include", "/sign-in");
    cy.get("input[name=email]", { timeout: 8000 }).should("exist").type(email);
    cy.get("input[name=password]", { timeout: 8000 })
      .should("exist")
      .type(password);
    cy.get("button[type=submit]").click();
    cy.url().should("include", "/");
  }
);

declare global {
  namespace Cypress {
    interface Chainable {
      login(email?: string, password?: string): Chainable<void>;
      completeOnboarding(): Chainable<void>;
    }
  }
}

export {};
