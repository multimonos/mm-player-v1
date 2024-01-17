// import Sketch from "../../src/routes/sketch2/[trackUri]/Sketch.svelte"

import Dummy from "../../src/routes/sketch2/Dummy.svelte"


describe( 'Dummy', () => {

    it( 'is visible', () => {
        cy.mount( Dummy )
        cy.tid( "dummy" ).should( 'be.visible' )
    } )

    it( `displays the correct text`, () => {
        const text = "foobar"
        cy.mount( Dummy, { props: { text } } )
        cy.tid( "dummy" ).should( "be.visible" ).and( "contain.text", text )
    } )

} )