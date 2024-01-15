// import Sketch from "../../src/routes/sketch2/[trackUri]/Sketch.svelte"

import Dummy from "../../src/routes/sketch2/[trackUri]/Dummy.svelte"
// const sketch = p => {
//
//     p.setup = () => {
//         p.createCanvas( 400, 400 )
//     }
//
//     p.draw = () => {
//         //bg
//         p.fill( 2, 44, 122 )
//         p.rect( 0, 0, p.width, p.height )
//
//         // rotating circle
//         const r = 70
//         const da = Math.PI / 80
//         const x = r * Math.cos( p.frameCount * da )
//         const y = r * Math.sin( p.frameCount * da )
//         p.fill( 200 )
//         p.noStroke()
//         p.circle( p.width / 2 + x, p.height / 2 + y, 10, 10 )
//     }
// }

describe( 'Sketch.cy.js', () => {
    it( 'playground', () => {
        cy.mount( Dummy )
        cy.get('[data-tid="dummy"]').should('be.visible')
    } )
} )