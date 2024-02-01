const url = `/e2e/variant-basic`
const count = 3
const timeout = 7000

describe( `Sketch Player`, () => {

    describe( `Variant - Basic`, () => {

        describe( `Variant List`, () => {

            it( `list should exist`, () => {
                cy.visit( url )
                cy.tid( `sketch-variant-list` ).should( `be.visible` )
            } )

            it( `${count} variant links displayed`, () => {
                cy.visit( url )
                cy.tid( `sketch-variant-link` ).should( `be.visible` ).and( `have.length`, count )
            } )

            it( `only 1 variant is the default`, () => {
                cy.visit( url )
                cy.get( `[data-variantDefault=true]` ).should( `be.visible` ).and( `have.length`, 1 )
            } )

        } )

    } )

    describe( `Variant Click`, () => {

        it( `the test text is visible`, () => {
            cy.visit( url )
            cy.tid( `param-values`, { timeout } ).should( `be.visible` )
        } )

        it( `clicking the default link does not change the displayed param values`, () => {
            cy.visit( url )
            cy.tid( `param-values`, { timeout } )
                .then( $el => {
                    const value = $el.text()
                    return value
                } )
                .then( value => {
                    cy.get( `[data-variantDefault=true]` ).should( `be.visible` ).click()
                    cy.wait( 500 )
                    cy.tid( `param-values` ).should( `be.visible` ).and( `have.text`, value )
                } )
        } )

        it( `clicking another variant changes the displayed param values`, () => {
            cy.visit( url )
            cy.tid( `param-values`, { timeout } )
                .then( $el => {
                    return $el.text()
                } )
                .then( originalValue => {
                    cy.get( `[data-variantDefault=false]` )
                        .should( `be.visible` )
                        .and( `have.length`, count - 1 )
                        .eq( 0 )
                        .click()
                    cy.wait( 500 )
                    cy.tid( `param-values` ).should( `be.visible` ).and( `not.have.text`, originalValue)
                } )

        } )
    } )


} )