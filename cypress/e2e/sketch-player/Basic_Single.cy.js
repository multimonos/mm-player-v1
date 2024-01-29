const url = `/e2e/basic-single`

describe( `Sketch Basic Single`, () => {

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
            cy.tid( `sketch-controls` ).should( `exist` )
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
                it( `disabled in the state = paused`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-pause-btn` ).should( `be.visible` ).and( `be.disabled` )
                } )

                it( `enabled when state = playing`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                    cy.stateIs( `playing` )
                    cy.tid( `sketch-pause-btn` ).should( `be.visible` ).and( `be.enabled` )
                } )
            } )

            describe( `Replay`, () => {
                it( `disabled when state = paused ( first play )`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-replay-btn` ).should( `be.visible` ).and( `be.disabled` )
                } )

                it( `enabled when state = playing`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                    cy.stateIs( `playing` )
                    cy.tid( `sketch-replay-btn` ).should( `be.visible` ).and( `be.enabled` )
                } )

                it( `enabled when state = paused after playing`, () => {
                    cy.visit( url )
                    cy.stateBecomes( [ `loading`, `paused` ] )
                    cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                    cy.stateIs( `playing` )
                    cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                    cy.stateIs( `paused` )
                    cy.tid( `sketch-replay-btn` ).should( `be.visible` ).and( `be.enabled` )
                } )

                it.skip( `enabled when state = ended`, () => {
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