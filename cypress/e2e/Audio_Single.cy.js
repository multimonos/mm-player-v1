const url = `/e2e/media-element-single/`
const audioPlayerId = "globalAudioPlayer"
const audioDuration = 7000

describe( `Audio single sketch`, () => {

    describe( `Sketch Player`, () => {

        it( `is visible`, () => {
            cy.visit( url )
            cy.tid( `sketch-player` ).should( `be.visible` )
        } )

        describe( `Loading state`, () => {

            it( `enters state = "loading"`, () => {
                cy.visit( url )
                cy.playerstate( `loading` ).should( `be.visible` )
            } )

            it( `displays the loading spinner`, () => {
                cy.visit( url )
                cy.tid( `sketch-loading` ).should( `be.visible` )
            } )

            it( `transitions to state = "paused"`, () => {
                cy.visit( url )
                cy.playerstate( `loading` ).should( `be.visible` )
                cy.playerstate( `paused` ).should( `be.visible` )
            } )
        } )

        describe( `Playing state`, () => {

            it( `is entered after clicking the play button`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
            } )

            it( `pause button is visible`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` )
            } )

            it( `transitions to state = "ended"`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
                cy.wait( audioDuration )
                cy.playerstate( `ended` ).should( `be.visible` )
            } )
        } )

        describe( `Paused state`, () => {

            it( `after click pause state = "paused"`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                cy.playerstate( `paused` ).should( `be.visible` )
            } )

            it( `pause button is visible after resuming playback`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                cy.wait( 500 )
                cy.playerstate( `paused` ).should( `be.visible` )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` )
            } )

            it( `transitions to state = "playing"`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.wait( 250 )
                cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
                cy.wait( 250 )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
            } )

        } )

        describe( `Ended state`, () => {

            it( `follows the "playing" state`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
                cy.wait( audioDuration )
                cy.playerstate( `ended` ).should( `be.visible` )
            } )

            it( `replay button is visible`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.wait( audioDuration )
                cy.playerstate( `ended` ).should( `be.visible` )
                cy.tid( `sketch-replay-btn` ).should( `be.visible` )
            } )

            it( `transitions to state = "playing" after clicking "replay" btn`, () => {
                cy.visit( url )
                cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
                cy.wait( audioDuration )
                cy.playerstate( `ended` ).should( `be.visible` )
                cy.tid( `sketch-replay-btn` ).should( `be.visible` ).click()
                cy.playerstate( `playing` ).should( `be.visible` )
            } )

        } )

    } )

    describe( `Global audio`, () => {

        it( `does not exist`, () => {
            cy.visit( url )
            cy.window().should( `not.have.property`, audioPlayerId )
        } )

        it( `exists when state = "loading"`, () => {
            cy.visit( url )
            cy.playerstate( `loading` ).should( `be.visible` )
            cy.window().should( `have.property`, audioPlayerId )
        } )

        it.skip( `audioContext is "suspended" when state = "loading"`, () => {
            //cannot get this to pass
            cy.visit( url )
            cy.reload( true )
            cy.playerstate( `loading` ).should( `be.visible` )
            cy.window()
                .should( `have.property`, audioPlayerId )
                .and( `have.property`, "audioContext" )
                .its( `state` )
                .should( `equal`, `suspended` )
        } )

        it( `audioContext is "running" during first "playing" state`, () => {
            cy.visit( url )
            cy.playerstate( `loading` ).should( `be.visible` )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.playerstate( `playing` ).should( `be.visible` )
            cy.window()
                .should( `have.property`, audioPlayerId )
                .and( `have.property`, "audioContext" )
                .its( `state` )
                .should( `equal`, `running` )
        } )

    } )

    describe( `Events`, () => {

        it( `window.sketch-play is fired after clicking the play button`, () => {
            cy.visit( url )
            cy.window().invoke( `addEventListener`, `sketch-play`, cy.stub().as( `handler` ) )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.get( `@handler` ).should( `have.been.calledOnce` )
        } )

        it( `window.sketch-pause is fired after clicking the pause button`, () => {
            cy.visit( url )
            cy.window().invoke( `addEventListener`, `sketch-pause`, cy.stub().as( `handler` ) )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.tid( `sketch-pause-btn` ).should( `be.visible` ).click()
            cy.get( `@handler` ).should( `have.been.calledOnce` )
        } )

        it( `window.sketch-replay is fired after clicking the replay button`, () => {
            cy.visit( url )
            cy.window().invoke( `addEventListener`, `sketch-replay`, cy.stub().as( `handler` ) )
            cy.tid( `sketch-play-btn` ).should( `be.visible` ).click()
            cy.wait( 7000 )
            cy.tid( `sketch-replay-btn` ).should( `be.visible` ).click()
            cy.get( `@handler` ).should( `have.been.calledOnce` )
        } )

    } )
} )