import { expect, test } from "@playwright/test"
import { AlbumPage, Audio, History, NowPlaying, Queue, Player, Transport } from "../selectors.js"
import { audioAlbumUrl, delay } from "../config.js"


test.describe( `track play -> pause @playback`, () => {

    test( `play -> pause`, async ( { page } ) => {
        await page.goto( audioAlbumUrl )
        await page.locator( AlbumPage.playTrackButton ).first().click()

        // first play
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // pause
        await delay( 500 )
        await expect( page.locator( Transport.pause ) ).toBeEnabled()
        await page.locator( Transport.pause ).click()

        // paused
        await expect( page.locator( Player.state ) ).toHaveValue( 'paused' )
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )
        // await page.pause()
    } )

} )
