describe( `Site`, () => {
    it( `is running`, () => {
        cy.visit("/e2e/")
        cy.get(".e2e").should("be.visible")
    } )
} )