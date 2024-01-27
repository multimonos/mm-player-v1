import {mount} from "cypress/svelte";
import SketchPlayer from "../../src/routes/e2e/com/sketch/SketchPlayer.svelte";

// Setup
const url = "http://localhost:7770/sketch-publish/demo/violet.bundle.js"
// const m = mount

describe( `SketchPlayer`, () => {

    // canvas mounts once for every test, so, must do this in e2e
    it( `shows error if no sketch url provided`, () => {
        cy.mount( SketchPlayer, { props:{url} } )
        cy.tid( "sketch-player" ).should( "be.visible" )
    } )

    it( `is visible`, () => {
        cy.mount( SketchPlayer, { props:{url} } )
        cy.tid( "sketch-player" ).should( "be.visible" )
    } )


} )