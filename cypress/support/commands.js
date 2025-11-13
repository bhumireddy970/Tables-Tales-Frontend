// ***********************************************
// This example commands.js shows you how to
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

// cypress/support/commands.js

// Custom command to login programmatically
Cypress.Commands.add('login', (email = 'test@example.com') => {
  cy.window().then((win) => {
    // Mock your user context here
    win.localStorage.setItem('userToken', 'mock-token');
    win.localStorage.setItem('userEmail', email);
  });
});

// Custom command to logout
Cypress.Commands.add('logout', () => {
  cy.window().then((win) => {
    win.localStorage.removeItem('userToken');
    win.localStorage.removeItem('userEmail');
  });
});


Cypress.Commands.add('fillSigninForm', (email, password, role = 'CUSTOMER') => {
  cy.get('[data-cy="email-input"]').clear().type(email);
  cy.get('[data-cy="password-input"]').clear().type(password);
  cy.get('[data-cy="role-select"]').click();
  cy.get(`[data-cy="role-${role.toLowerCase()}"]`).should('be.visible').click();
});

// Command: submit the form
Cypress.Commands.add('submitSigninForm', () => {
  // Break chain here to prevent stale element reference
  cy.get('[data-cy="signin-button"]').click();
});

// Command: intercept sign-in API
Cypress.Commands.add('mockSigninResponse', (statusCode = 200, body = { role: 'CUSTOMER' }) => {
  cy.intercept('POST', 'http://localhost:8071/customer/signin', {
    statusCode,
    body,
  }).as('signinRequest');
});

