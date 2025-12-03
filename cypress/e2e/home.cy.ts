describe('Home Page', () => {
  beforeEach(() => {
    // Force light mode to ensure deterministic tests
    cy.visit('/', {
      onBeforeLoad(win) {
        win.localStorage.setItem('theme', 'light');
      }
    });
  });

  it('should display the correct title', () => {
    cy.contains('Billable').should('be.visible');
    // Check for text that is actually in the hero section (case insensitive or exact match)
    cy.contains('Turn your ideas into').should('be.visible');
  });

  it('should allow filling the form', () => {
    cy.get('input[placeholder="Acme Corp"]').type('Test Client');
    cy.get('input[placeholder="contact@acme.com"]').type('test@example.com');
    cy.get('input[placeholder="Website Redesign"]').type('My Project');
    
    // Scope textarea
    cy.get('textarea').eq(0).type('Scope description');
    
    cy.get('input[placeholder="0.00"]').type('500');
  });

  it('should toggle theme', () => {
    cy.get('button[title="Toggle Theme"]').click();
    cy.get('body').should('have.class', 'dark-mode');
    
    cy.get('button[title="Toggle Theme"]').click();
    cy.get('body').should('not.have.class', 'dark-mode');
  });

  it('should toggle language', () => {
    cy.get('button[title="Switch Language"]').click();
    cy.contains('Características').should('be.visible'); // 'Features' in Spanish
    
    cy.get('button[title="Switch Language"]').click();
    cy.contains('Features').should('be.visible');
  });
});
