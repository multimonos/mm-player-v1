const url = `/e2e/sketch-player-error/`

describe( `Sketch Player - Error / Missing URL`, () => {

    it( `exists`, () => {
        cy.visit(url)
        cy.tid(`sketch-player`).should(`exist`)
    } )

    it( `has state = error`, () => {
        cy.visit(url)
        cy.stateIs(`error`).should(`exist`)
    } )

    it( `displays error message if sketch url is missing`, () => {
        cy.visit(url)
        cy.stateIs(`error`)
        cy.tid(`sketch-player-error`).should(`be.visible`)
    } )

    it( `sketch controls exist`, () => {
        cy.visit(url)
        cy.tid(`sketch-controls`).should(`exist`)
    } )
    
} )