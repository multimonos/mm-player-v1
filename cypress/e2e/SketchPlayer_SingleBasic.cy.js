const url = `/e2e/sketch-single-basic`

describe( `Sketch - Single Basic`, () => {

    describe( `Initial state`, () => {

        it( `exists`, () => {
            cy.visit( url )
            cy.tid( `sketch-player` ).should( `exist` )
        } )

        it( `starts in the state = loading`, () => {
            cy.visit( url )
            cy.stateIs(`loading`)
        } )

        it( `transitions : loading -> paused`, () => {
            cy.visit( url )
            cy.stateBecomes( [ `loading`, `paused` ] )
        } )
    } )

    describe( `Controls`, () => {

        it( `visible`, () => {
            cy.visit( url )
            cy.tid( `sketch-controls` ).should( `be.visible` )
        } )


        describe( `Buttons`, () => {

            describe( `Play`, () => {
                it( `disabled in playing state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                    cy.stateIs( `playing` )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).and( `be.disabled` )
                } )

                it( `enabled in the paused state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).and( `be.enabled` )
                } )

            } )

            describe( `Pause`, () => {
                it( `disabled in the paused state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-pause-btn` ).should( `be.visible` ).and( `be.disabled` )
                } )
                it( `enabled in the playing state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                    cy.stateIs( `playing` )
                    cy.tid( `sketch-pause-btn` ).should( `be.visible` ).and( `be.enabled` )
                } )
            } )

            describe( `Replay`, () => {
                it( `disabled in the paused state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-replay-btn` ).should( `be.visible` ).and( `be.disabled` )
                } )
                it( `disabled in the playing state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` )
                    cy.stateIs( `playing` )
                    cy.tid( `sketch-replay-btn` ).should( `be.visible` ).and( `be.disabled` )
                } )
                it( `enabled in the ended state`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                    cy.stateBecomes( [ `playing`, `ended` ] )
                    cy.tid( `sketch-replay-btn` ).should( `be.visible` ).and( `be.enabled` )
                } )
            } )
        } )
    } )
} )