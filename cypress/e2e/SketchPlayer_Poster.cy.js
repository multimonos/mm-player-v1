const url = `/e2e/sketch-player-error/`

describe( `Sketch Player - Poster`, () => {

    it( `visible whilte loaing`, () => {
        cy.visit(url)
        cy.tid(`sketch-player`).should(`exist`)
    } )


} )