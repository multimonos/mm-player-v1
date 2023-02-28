import { expect, test } from "@playwright/test"
import { AlbumPage, Audio, History, NowPlaying, Queue, Player, Transport } from "../selectors.js"
import { audioAlbumUrl, delay } from "../config.js"


test.describe( `single track resumed @playback`, () => {

    test( `play -> pause -> play`, async ( { page } ) => {
        await page.goto( audioAlbumUrl )
        await page.locator( AlbumPage.playTrackButton ).first().click()

        // do play
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // do pause
        await delay( 1000 )
        await expect( page.locator( Transport.pause ) ).toBeEnabled()
        await page.locator( Transport.pause ).click()

        // is paused ?
        await expect( page.locator( Player.state ) ).toHaveValue( 'paused' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // play a bit
        await delay( 1000 )

        // do replay
        await expect( page.locator( Transport.play ) ).toBeEnabled()
        await page.locator( Transport.play ).click()

        // is playing ?
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // is completed ?
        await expect( page.locator( Player.state ) ).toHaveValue( 'paused', { timeout: 30000 } )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )

        // await page.pause()
    } )

} )
