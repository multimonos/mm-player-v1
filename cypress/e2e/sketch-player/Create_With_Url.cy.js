
const url = `/e2e/create-with-url`
const timeout = 10000

describe( `Sketch Player`, () => {

    describe( `Create with a url`, () => {

        it( `sketch player exists`, () => {
            cy.visit( url )
            cy.tid( `sketch-player`,{timeout} ).should( `exist` )
        } )

        it( `starts in the state = loading`, () => {
            cy.visit( url )
            cy.stateIs(`loading`)
        } )

        it( `transitions state = loading -> paused`, () => {
            cy.visit( url )
            cy.stateBecomes( [ `loading`, `paused` ] )
        } )

        it( `displays a sketch`, () => {
            cy.visit(url)
            cy.tid(`sketch`,{timeout}).should(`be.visible`)
        } )

        it( `displays a p5js canvas`, () => {
            cy.visit(url)
            cy.tid(`sketch`,{timeout}).get(`canvas`).should(`be.visible`).and(`have.class`,`p5Canvas`)
        } )
    } )
} )