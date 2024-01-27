const url = `/e2e/sketch-audio-single/`
const audioPlayerId = "globalAudioPlayer"
const audioDuration = 7000

describe( `Audio single sketch`, () => {
    describe( `Global audio`, () => {

        it.skip( `does not exist`, () => {//flaky, sometimes already exists during tests
            cy.visit( url )
            cy.window().should( `not.have.property`, audioPlayerId )
        } )

        it( `exists when state = "loading"`, () => {
            cy.visit( url )
            cy.stateIs( `loading` )
            cy.window().should( `have.property`, audioPlayerId )
        } )

        it.skip( `audioContext is "suspended" when state = "loading"`, () => {
            //cannot get this to pass
            cy.visit( url )
            cy.reload( true )
            cy.stateIs( `loading` )
            cy.window()
                .should( `have.property`, audioPlayerId )
                .and( `have.property`, "audioContext" )
                .its( `state` )
                .should( `equal`, `suspended` )
        } )

        it( `audioContext is "running" during first "playing" state`, () => {
            cy.visit( url )
            cy.stateBecomes( [ `loading`, `paused` ] )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.stateIs( `playing` )
            cy.window()
                .should( `have.property`, audioPlayerId )
                .and( `have.property`, "audioContext" )
                .its( `state` )
                .should( `equal`, `running` )
        } )
    } )

    describe( `Sketch Player`, () => {

        it( `is visible`, () => {
            cy.visit( url )
            cy.tid( `sketch-player` ).should( `be.visible` )
        } )

        describe( `Loading state`, () => {

            it( `enters state = "loading"`, () => {
                cy.visit( url )
                cy.stateIs( `loading` )
            } )

            it( `displays the loading spinner`, () => {
                cy.visit( url )
                cy.tid( `sketch-loading` ).should( `be.visible` )
            } )

            it( `stateBecomes to state = "paused"`, () => {
                cy.visit( url )
                cy.stateIs( `loading` )
                cy.stateIs( `paused` )
            } )
        } )

        describe( `Playing state`, () => {

            it( `is entered after clicking the play button`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            } )

            it( `pause button is visible`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` )
            } )

            it( `stateBecomes to state = "ended"`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
                cy.wait( audioDuration )
                cy.stateIs( `ended` )
            } )
        } )

        describe( `Paused state`, () => {

            it( `after click pause state = "paused"`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                cy.stateIs( `paused` )
            } )

            it( `pause button is visible after resuming playback`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                cy.wait( 500 )
                cy.stateIs( `paused` )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` )
            } )

            it( `stateBecomes to state = "playing"`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.wait( 250 )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                cy.wait( 250 )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
            } )

        } )

        describe( `Ended state`, () => {

            it( `follows the "playing" state`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
                cy.wait( audioDuration )
                cy.stateIs( `ended` )
            } )

            it( `replay button is visible`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.wait( audioDuration )
                cy.stateIs( `ended` )
                cy.tid( `sketch-replay-btn` ).should( `be.visible` )
            } )

            it( `stateBecomes to state = "playing" after clicking "replay" btn`, () => {
                cy.visit( url )
                cy.stateBecomes( [ `loading`, `paused` ] )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.wait( audioDuration )
                cy.stateIs( `ended` )
                cy.tid( `sketch-replay-btn` ).should( `be.visible` ).click()
                cy.stateIs( `playing` )
            } )

        } )

    } )


    describe( `Events`, () => {

        it( `window.sketch-play is fired after clicking the play button`, () => {
            cy.visit( url )
            cy.window().invoke( `addEventListener`, `sketch-play`, cy.stub().as( `handler` ) )
            cy.stateBecomes( [ `loading`, `paused` ] )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.get( `@handler` ).should( `have.been.calledOnce` )
        } )

        it( `window.sketch-pause is fired after clicking the pause button`, () => {
            cy.visit( url )
            cy.window().invoke( `addEventListener`, `sketch-pause`, cy.stub().as( `handler` ) )
            cy.stateBecomes( [ `loading`, `paused` ] )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
            cy.get( `@handler` ).should( `have.been.calledOnce` )
        } )

        it( `window.sketch-replay is fired after clicking the replay button`, () => {
            cy.visit( url )
            cy.window().invoke( `addEventListener`, `sketch-replay`, cy.stub().as( `handler` ) )
            cy.stateBecomes( [ `loading`, `paused` ] )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.wait( 7000 )
            cy.tid( `sketch-replay-btn` ).should( `be.visible` ).click()
            cy.get( `@handler` ).should( `have.been.calledOnce` )
        } )

    } )
} )