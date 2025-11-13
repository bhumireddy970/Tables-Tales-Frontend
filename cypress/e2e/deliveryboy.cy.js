// delivery-boy-orders.cy.js

describe('Delivery Boy Orders Page', () => {
  beforeEach(() => {
    // Set delivery boy credentials directly in localStorage
    cy.window().then((win) => {
      win.localStorage.setItem('email', 'deliveryboy3@gmail.com');
      win.localStorage.setItem('role', 'DELIVERYBOY');
    });

    // Mock API responses for the deliveries page
    cy.intercept('GET', 'http://localhost:8071/item/menu-items', {
      statusCode: 200,
      body: [
        { _id: 'item1', name: 'Burger' },
        { _id: 'item2', name: 'Pizza' },
        { _id: 'item3', name: 'Pasta' }
      ]
    }).as('getMenuItems');

    cy.intercept('GET', 'http://localhost:8071/orders/deliveryboy/showpendingorders', {
      statusCode: 200,
      body: {
        order: [
          {
            _id: 'order123',
            customerName: 'John Doe',
            items: [{ menuId: 'item1', quantity: 2 }],
            totalAmount: 500,
            status: 'pending'
          },
          {
            _id: 'order124',
            customerName: 'Jane Smith',
            items: [{ menuId: 'item2', quantity: 1 }, { menuId: 'item3', quantity: 3 }],
            totalAmount: 800,
            status: 'ordered'
          }
        ]
      }
    }).as('getPendingOrders');

    // Navigate directly to deliveries page
    cy.visit('/delivery-boy-orders');
  });

  describe('Page Access and Verification', () => {
    it('should allow access for DELIVERYBOY role', () => {
      cy.url().should('include', '/delivery-boy-orders');
      cy.get('[data-testid="delivery-boy-orders-page"]').should('be.visible');
      cy.get('[data-testid="page-title"]').should('contain', 'Pending Orders for Delivery');
    });

    it('should verify localStorage has correct credentials', () => {
      cy.window().then((win) => {
        expect(win.localStorage.getItem('role')).to.equal('DELIVERYBOY');
        expect(win.localStorage.getItem('email')).to.equal('deliveryboy3@gmail.com');
      });
    });

    it('should redirect non-delivery users to access denied page', () => {
      // Test CUSTOMER role redirect
      cy.window().then((win) => {
        win.localStorage.setItem('role', 'CUSTOMER');
      });
      cy.visit('/delivery-boy-orders');
      cy.url().should('include', '/needaccess');
    });
  });

  describe('Page Content', () => {
    it('should display loading spinner initially', () => {
      cy.get('[data-testid="loading-spinner"]').should('be.visible');
    });

    it('should display orders table after loading', () => {
      cy.wait(['@getMenuItems', '@getPendingOrders']);
      
      cy.get('[data-testid="orders-table"]').should('be.visible');
      cy.get('[data-testid="order-row-0"]').should('be.visible');
      cy.get('[data-testid="order-row-1"]').should('be.visible');
    });

    it('should display all order information correctly', () => {
      cy.wait(['@getMenuItems', '@getPendingOrders']);

      // Check first order
      cy.get('[data-testid="order-row-0"]').within(() => {
        cy.get('[data-testid="customer-name"]').should('contain', 'John Doe');
        cy.get('[data-testid="order-items"]').should('contain', 'Burger (x2)');
        cy.get('[data-testid="total-amount"]').should('contain', '₹500');
        cy.get('[data-testid="status-text"]').should('contain', 'Pending');
      });

      // Check second order
      cy.get('[data-testid="order-row-1"]').within(() => {
        cy.get('[data-testid="customer-name"]').should('contain', 'Jane Smith');
        cy.get('[data-testid="order-items"]').should('contain', 'Pizza (x1)');
        cy.get('[data-testid="order-items"]').should('contain', 'Pasta (x3)');
        cy.get('[data-testid="total-amount"]').should('contain', '₹800');
        cy.get('[data-testid="status-text"]').should('contain', 'Ordered');
      });
    });

    it('should display no orders message when empty', () => {
      // Mock empty orders response
      cy.intercept('GET', 'http://localhost:8071/orders/deliveryboy/showpendingorders', {
        statusCode: 200,
        body: { order: [] }
      }).as('getEmptyOrders');

      cy.visit('/delivery-boy-orders');
      cy.wait('@getEmptyOrders');

      cy.get('[data-testid="no-orders-message"]')
        .should('be.visible')
        .and('contain', 'No pending orders to deliver.');
    });
  });

  describe('Order Status Management', () => {
    beforeEach(() => {
      cy.wait(['@getMenuItems', '@getPendingOrders']);
    });

    it('should have status dropdown for each order', () => {
      cy.get('[data-testid="status-select"]').should('have.length', 2);
    });

    it('should update order status to delivered successfully', () => {
      cy.intercept('POST', 'http://localhost:8071/orders/changestatus/order123', {
        statusCode: 200,
        body: { message: 'Order status updated successfully!' }
      }).as('updateStatus');

      cy.get('[data-testid="status-select-0"]').click();
      cy.get('[data-testid="status-option-delivered"]').click();

      cy.wait('@updateStatus');
      cy.get('[data-testid="snackbar-alert"]')
        .should('be.visible')
        .and('contain', 'Order status updated successfully!');
    });

    it('should update order status to canceled successfully', () => {
      cy.intercept('POST', 'http://localhost:8071/orders/changestatus/order124', {
        statusCode: 200,
        body: { message: 'Order canceled successfully' }
      }).as('cancelOrder');

      cy.get('[data-testid="status-select-1"]').click();
      cy.get('[data-testid="status-option-canceled"]').click();

      cy.wait('@cancelOrder');
      cy.get('[data-testid="snackbar-alert"]')
        .should('be.visible')
        .and('contain', 'Order canceled successfully');
    });

    it('should show error when status update fails', () => {
      cy.intercept('POST', 'http://localhost:8071/orders/changestatus/order123', {
        statusCode: 500,
        body: { error: 'Server error' }
      }).as('updateStatusFailed');

      cy.get('[data-testid="status-select-0"]').click();
      cy.get('[data-testid="status-option-delivered"]').click();

      cy.wait('@updateStatusFailed');
      cy.get('[data-testid="snackbar-alert"]')
        .should('be.visible')
        .and('contain', 'Error updating order status.')
        .and('have.attr', 'data-severity', 'error');
    });
  });

  describe('Table Structure', () => {
    it('should display correct table headers', () => {
      cy.wait(['@getMenuItems', '@getPendingOrders']);

      const headers = ['Order ID', 'Customer Name', 'Items', 'Total Amount', 'Status', 'Update Status'];
      headers.forEach(header => {
        cy.contains('th', header).should('be.visible');
      });
    });

    it('should display menu item names correctly', () => {
      cy.wait(['@getMenuItems', '@getPendingOrders']);
      
      cy.get('[data-testid="order-items"]').first().should('contain', 'Burger');
      cy.get('[data-testid="order-items"]').last().should('contain', 'Pizza');
    });
  });
});
