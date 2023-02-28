import { expect, test } from "@playwright/test"
import { AlbumPage, Audio, History, NowPlaying, Player, Queue } from "../selectors.js"
import { audioAlbumUrl } from "../config.js"


test.describe( `track play fully @playback`, () => {

    test( `play -> completed`, async ( { page } ) => {
        await page.goto( audioAlbumUrl )
        await page.locator( AlbumPage.playTrackButton ).first().click()

        // page
        await expect( page ).toHaveURL( '/player' )

        // is playing ?
        await expect( page.locator( Audio.state ) ).toHaveValue( 'running' )
        await expect( page.locator( Player.state ) ).toHaveValue( 'playing' )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '1' )
        await expect( page.locator( History.count ) ).toHaveValue( '0' )

        // is completed ?
        await expect( page.locator( Audio.state ) ).toHaveValue( 'suspended' )
        await expect( page.locator( Player.state ) ).toHaveValue( 'paused', { timeout: 30000 } )
        await expect( page.locator( NowPlaying.count ) ).toHaveValue( '1' )
        await expect( page.locator( Queue.count ) ).toHaveValue( '0' )
        await expect( page.locator( History.count ) ).toHaveValue( '1' )

        // await page.pause()
    } )
} )
