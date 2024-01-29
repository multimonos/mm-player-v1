const url = `/e2e/error-url-missing/`
const timeout = 10000

describe( `Sketch Player Error - Interface Methods Missing`, () => {

    it( `error is visible`, () => {
        cy.visit( url )
        cy.tid( `sketch-player-error`, { timeout } ).should( `be.visible` )
    } )

    it( `has state = error`, () => {
        cy.visit( url )
        cy.stateIs( `error` ).should( `exist` )
    } )

    it( `error message is correct`, () => {
        cy.visit( url )
        cy.tid( `sketch-player-error-message`, { timeout } )
            .should( `be.visible` )
            .and( `includes`, /not implement.+interface methods/i )
    } )

} )