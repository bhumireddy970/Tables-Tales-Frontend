/// <reference types="cypress" />

describe('Signin Page Tests', () => {
  beforeEach(() => {
    cy.fixture('signinData').as('users'); // load your test data
    cy.visit('/signin');
  });

  it('should display all input fields and sign in button', () => {
    cy.get('[data-cy="email-input"]').should('exist');
    cy.get('[data-cy="password-input"]').should('exist');
    cy.get('[data-cy="role-select"]').should('exist');
    cy.get('[data-cy="signin-button"]').should('exist');
  });

  it('should show error for invalid email', function () {
    const { invalidEmail } = this.users.invalidUsers;
    cy.fillSigninForm(invalidEmail.email, invalidEmail.password);
    cy.submitSigninForm();
    cy.contains('Please enter a valid email').should('be.visible');
  });

  it('should show error for short password', function () {
    const { shortPassword } = this.users.invalidUsers;
    cy.fillSigninForm(shortPassword.email, shortPassword.password);
    cy.submitSigninForm();
    cy.contains('Password must be at least 8 characters').should('be.visible');
  });

  it('should show error when role is missing', function () {
    const { missingRole } = this.users.invalidUsers;
    cy.get('[data-cy="email-input"]').clear().type(missingRole.email);
    cy.get('[data-cy="password-input"]').clear().type(missingRole.password);
    cy.submitSigninForm();
    cy.contains('Please select a user role').should('be.visible');
  });

  it('should successfully sign in with valid credentials', function () {
    const { validUser } = this.users;

    cy.mockSigninResponse(200, { role: validUser.role });
    cy.fillSigninForm(validUser.email, validUser.password, validUser.role);
    cy.submitSigninForm();

    // wait for backend response before asserting
    cy.wait('@signinRequest').its('response.statusCode').should('eq', 200);

    // now wait for navigation instead of continuing to use detached elements
    cy.url().should('include', '/menu');
    cy.get('body').should('contain.text', 'Menu'); // or another menu element
  });

  it('should handle invalid credentials (401)', function () {
    const { validUser } = this.users;

    cy.mockSigninResponse(401, { message: 'Invalid credentials' });
    cy.fillSigninForm(validUser.email, 'wrongpassword', validUser.role);
    cy.submitSigninForm();

    cy.wait('@signinRequest');
    cy.contains('Invalid credentials').should('be.visible');
  });

  it('should allow sign in for different roles', function () {
  this.users.differentRoles.forEach((user, index) => {
    cy.mockSigninResponse(200, { role: user.role });
    cy.visit('/signin'); // ✅ revisit before each login attempt
    cy.fillSigninForm(user.email, user.password, user.role);
    cy.submitSigninForm();
    cy.wait('@signinRequest');
    cy.url().should('include', '/menu');
  });
});

});

